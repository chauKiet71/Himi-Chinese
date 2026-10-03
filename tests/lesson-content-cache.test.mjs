import assert from "node:assert/strict";
import test from "node:test";
import { createLessonContentCache } from "../lib/lesson-content-cache.ts";
import { isLessonResourceUrl, learningContentScope } from "../lib/lesson-resource.ts";

const resource = { url: "/api/lessons/hsk/hsk-1/lesson-1", version: "v1", scope: "alice:session-1" };
const lesson = { id: "lesson-1", title: "Xin chào", vocabulary: [{ hanzi: "你好" }], grammar: [], dialogues: [], pronunciationTopics: [], exercises: [], writingCharacters: [], modes: [] };
const envelope = (target = resource, data = lesson) => ({ version: target.version, scope: target.scope, data });
function diskStore() {
  const entries = new Map();
  return {
    entries,
    async get(key) { return structuredClone(entries.get(key)); },
    async put(entry) { entries.set(entry.key, structuredClone(entry)); },
    async touch() {},
    async remove(key) { entries.delete(key); },
    async removeOtherScopes(scope) { for (const [key, entry] of entries) if (entry.scope !== scope) entries.delete(key); },
    async clear() { entries.clear(); },
  };
}
const tick = () => new Promise((resolve) => setImmediate(resolve));

test("prepare checks metadata, downloads once and waits for persistence before navigation can begin", async () => {
  const store = diskStore();
  let releaseWrite;
  const written = new Promise((resolve) => { releaseWrite = resolve; });
  const put = store.put;
  store.put = async (entry) => { await written; await put(entry); };
  const calls = [];
  const cache = createLessonContentCache({ scope: resource.scope, store, fetcher: async (url) => {
    calls.push(url);
    return Response.json(url.includes("?metadata=1") ? resource : envelope());
  } });
  let ready = false;
  const operation = cache.prepare(resource.url).then(() => { ready = true; });
  await tick();
  assert.equal(ready, false);
  releaseWrite();
  await operation;
  assert.equal(store.entries.size, 1);
  await cache.prepare(resource.url);
  assert.deepEqual(calls, [resource.url + "?metadata=1", resource.url, resource.url + "?metadata=1"]);
});

test("no prefetch; reload and alternate lesson modes reuse persisted content without another download", async () => {
  const store = diskStore();
  let calls = 0;
  const options = { scope: resource.scope, store, fetcher: async () => { calls++; return Response.json(envelope()); } };
  const cache = createLessonContentCache(options);
  assert.equal(calls, 0);
  assert.deepEqual(await cache.get(resource), lesson);
  await cache.flush();
  assert.deepEqual(await createLessonContentCache(options).get(resource), lesson);
  assert.equal(calls, 1);
});

test("only a changed lesson version downloads again, including changed access-filtered content", async () => {
  const store = diskStore();
  let current = resource, calls = 0;
  const options = { scope: resource.scope, store, fetcher: async () => { calls++; return Response.json(envelope(current)); } };
  const cache = createLessonContentCache(options);
  await cache.get(resource);
  current = { ...resource, version: "v2-redacted" };
  await cache.get(current);
  await cache.flush();
  await createLessonContentCache(options).get(current);
  assert.equal(calls, 2);
  assert.equal(store.entries.size, 1);
});

test("simultaneous callers share a download, and cancellation does not break the other caller", async () => {
  let finish, calls = 0;
  const cache = createLessonContentCache({ scope: resource.scope, store: diskStore(), fetcher: async () => {
    calls++;
    return new Promise((resolve) => { finish = resolve; });
  } });
  const controller = new AbortController();
  const first = cache.get(resource, controller.signal);
  const second = cache.get(resource);
  const cancelled = assert.rejects(first, { name: "AbortError" });
  controller.abort();
  await tick();
  finish(Response.json(envelope()));
  await cancelled;
  assert.deepEqual(await second, lesson);
  assert.equal(calls, 1);
});

test("storage denial, corruption and quota failures do not stop learning", async () => {
  const store = diskStore();
  const key = `${resource.scope}|${resource.url}`;
  store.entries.set(key, { ...envelope(resource, {}), key });
  let calls = 0;
  const options = { scope: resource.scope, store, fetcher: async () => { calls++; return Response.json(envelope()); } };
  assert.deepEqual(await createLessonContentCache(options).get(resource), lesson);
  const unavailable = { ...store, async get() { throw new Error("SecurityError"); }, async put() { throw new Error("QuotaExceededError"); } };
  const cache = createLessonContentCache({ ...options, store: unavailable });
  await cache.get(resource);
  await cache.flush();
  await cache.get(resource);
  assert.equal(calls, 2);
});

test("first-load network error can retry; an authorized cached version works without a download", async () => {
  const store = diskStore();
  let offline = true;
  const options = { scope: resource.scope, store, fetcher: async () => {
    if (offline) throw new TypeError("offline");
    return Response.json(envelope());
  } };
  const cache = createLessonContentCache(options);
  await assert.rejects(cache.get(resource), /kết nối mạng/);
  offline = false;
  await cache.get(resource);
  await cache.flush();
  offline = true;
  assert.deepEqual(await createLessonContentCache(options).get(resource), lesson);
});

test("expired sessions/denied access evict old content; changed versions never fall back to old VIP content", async () => {
  for (const status of [401, 403, 404, 409, 503]) {
    const store = diskStore();
    const key = `${resource.scope}|${resource.url}`;
    store.entries.set(key, { ...envelope(), key });
    const cache = createLessonContentCache({ scope: resource.scope, store, fetcher: async () => Response.json({ error: "denied" }, { status }) });
    await assert.rejects(cache.get({ ...resource, version: "new" }), (error) => error.status === status);
    assert.equal(store.entries.size, 0);
  }
});

test("cache scope, malformed server data and unexpected versions cannot be reused", async () => {
  const store = diskStore();
  let calls = 0;
  const cache = createLessonContentCache({ scope: resource.scope, store, fetcher: async () => {
    calls++;
    return Response.json(envelope({ ...resource, version: "unexpected" }));
  } });
  await assert.rejects(cache.get({ ...resource, scope: "bob" }), (error) => error.status === 401);
  assert.equal(calls, 0);
  await assert.rejects(cache.get(resource), (error) => error.status === 409);
  assert.equal(store.entries.size, 0);
  assert.notEqual(learningContentScope({ id: "alice", role: "learner", sessionCreatedAt: new Date(0) }), learningContentScope({ id: "alice", role: "learner", sessionCreatedAt: new Date(1) }));
});

test("a slow old response cannot replace the newer version on disk", async () => {
  let finish;
  const store = diskStore();
  const newer = { ...resource, version: "v2" };
  const cache = createLessonContentCache({ scope: resource.scope, store, fetcher: async (_url, options) => {
    if (options.headers["X-Himi-Lesson-Version"] === resource.version) return new Promise((resolve) => { finish = resolve; });
    return Response.json(envelope(newer));
  } });
  const old = cache.get(resource);
  await tick();
  await cache.get(newer);
  finish(Response.json(envelope()));
  await old;
  await cache.flush();
  assert.equal([...store.entries.values()][0].version, "v2");
});

test("scope cleanup and disposal prevent old pending work from restoring another user's data", async () => {
  let finish;
  const store = diskStore();
  const cache = createLessonContentCache({ scope: resource.scope, store, fetcher: async () => new Promise((resolve) => { finish = resolve; }) });
  const pending = cache.get(resource);
  await tick();
  cache.dispose();
  const cancelled = assert.rejects(pending, { name: "AbortError" });
  finish(Response.json(envelope()));
  await cancelled;
  await cache.flush();
  assert.equal(store.entries.size, 0);
  await store.put({ ...envelope(), key: "old" });
  await createLessonContentCache({ scope: "bob", store }).removeOtherScopes();
  assert.equal(store.entries.size, 0);
});

test("lesson storage only accepts per-lesson same-origin endpoints", () => {
  assert.equal(isLessonResourceUrl(resource.url), true);
  assert.equal(isLessonResourceUrl("/api/lessons/industry/van-phong/bai-1"), true);
  for (const url of ["/api/auth/login", "https://evil.test" + resource.url, resource.url + "?all=true", "/api/lessons/hsk/../all", "/api/progress/practice"]) {
    assert.equal(isLessonResourceUrl(url), false);
  }
});
