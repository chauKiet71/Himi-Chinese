import assert from "node:assert/strict";
import test from "node:test";
import { createBrowserApiCache, learningCachePolicy } from "../lib/browser-api-cache.ts";

const url = "/api/games/vocabulary?level=hsk-1";
const json = (value, status = 200) => Response.json(value, { status });
function storage() {
  const databases = new Map();
  return {
    async keys() { return [...databases.keys()]; },
    async delete(name) { return databases.delete(name); },
    async open(name) {
      if (!databases.has(name)) databases.set(name, new Map());
      const entries = databases.get(name);
      return {
        async match(key) { return entries.get(key)?.clone(); },
        async put(key, value) { entries.set(key, value.clone()); },
        async delete(key) { return entries.delete(key); },
      };
    },
  };
}

test("reload uses persistent data and slice shares the vocabulary request", async () => {
  const disk = storage();
  let calls = 0;
  const options = { scope: "alice:session1", storage: () => disk, fetcher: async () => { calls++; return json({ words: ["你好"] }); } };
  await createBrowserApiCache(options).get(url);
  const reloaded = createBrowserApiCache(options);
  assert.deepEqual(await (await reloaded.get("/api/games/slice?level=hsk-1")).json(), { words: ["你好"] });
  assert.equal(calls, 1);
});

test("expired gated data reauthorizes and 403 evicts instead of serving stale content", async () => {
  let time = 1_000, calls = 0;
  const disk = storage();
  const options = { scope: "alice", storage: () => disk, now: () => time, fetcher: async () => ++calls === 1 ? json({ words: ["VIP"] }) : json({ error: "VIP_REQUIRED" }, 403) };
  const cache = createBrowserApiCache(options);
  await cache.get(url);
  time += 300_000;
  assert.equal((await cache.get(url)).status, 403);
  assert.equal((await createBrowserApiCache(options).get(url)).status, 403);
  assert.equal(calls, 3);
});

test("cache never crosses account or login-session boundaries", async () => {
  const disk = storage();
  let calls = 0;
  const options = { storage: () => disk, fetcher: async () => json({ request: ++calls }) };
  await createBrowserApiCache({ ...options, scope: "alice:1" }).get(url);
  assert.equal((await (await createBrowserApiCache({ ...options, scope: "bob:1" }).get(url)).json()).request, 2);
  assert.equal((await (await createBrowserApiCache({ ...options, scope: "alice:2" }).get(url)).json()).request, 3);
  const guest = createBrowserApiCache({ ...options, scope: "guest" });
  await guest.removeOtherScopes();
  assert.deepEqual(await disk.keys(), []);
});

test("concurrent callers share a request and one caller aborting leaves the others usable", async () => {
  let finish, calls = 0;
  const cache = createBrowserApiCache({ scope: "guest", storage: () => undefined, fetcher: async () => {
    calls++;
    return new Promise((resolve) => { finish = resolve; });
  } });
  const controller = new AbortController();
  const first = cache.get(url, { signal: controller.signal });
  const second = cache.get(url);
  const aborted = assert.rejects(first, { name: "AbortError" });
  controller.abort();
  await new Promise((resolve) => setImmediate(resolve));
  finish(json({ words: [] }));
  await aborted;
  assert.deepEqual(await (await second).json(), { words: [] });
  assert.equal(calls, 1);
});

test("private mode/storage quota failure still permits network and memory caching", async () => {
  let calls = 0;
  const cache = createBrowserApiCache({ scope: "guest", storage: () => { throw new Error("SecurityError"); }, fetcher: async () => { calls++; return json({ words: [] }); } });
  assert.equal((await cache.get(url)).status, 200);
  assert.equal((await cache.get(url)).status, 200);
  assert.equal(calls, 1);
});

test("malformed persisted JSON and failed network responses are never reused", async () => {
  const disk = storage();
  const saved = await disk.open("himi-learning-api-v1:guest");
  await saved.put(url, new Response("broken", { headers: { "x-himi-saved-at": String(Date.now()) } }));
  let calls = 0;
  const cache = createBrowserApiCache({ scope: "guest", storage: () => disk, fetcher: async () => { calls++; return json({ error: "offline" }, 503); } });
  assert.equal((await cache.get(url)).status, 503);
  assert.equal((await cache.get(url)).status, 503);
  assert.equal(calls, 2);
});

test("progress expires after 30 seconds and a successful mutation invalidates disk and memory", async () => {
  const disk = storage();
  let time = 1_000, calls = 0;
  const options = { scope: "alice", storage: () => disk, now: () => time, fetcher: async () => json({ count: ++calls }) };
  const cache = createBrowserApiCache(options);
  const progress = "/api/progress/practice";
  await cache.get(progress);
  time += 30_000;
  assert.equal((await (await cache.get(progress)).json()).count, 2);
  await cache.invalidate(progress);
  assert.equal((await (await createBrowserApiCache(options).get(progress)).json()).count, 3);
});

test("an old pending read cannot repopulate cache after mutation invalidation", async () => {
  let finish, calls = 0;
  const disk = storage();
  const cache = createBrowserApiCache({ scope: "alice", storage: () => disk, fetcher: async () => {
    calls++;
    if (calls === 1) return new Promise((resolve) => { finish = resolve; });
    return json({ count: 2 });
  } });
  const progress = "/api/progress/practice";
  const old = cache.get(progress);
  await new Promise((resolve) => setImmediate(resolve));
  await cache.invalidate(progress);
  await cache.get(progress);
  finish(json({ count: 1 }));
  await old;
  assert.equal((await (await cache.get(progress)).json()).count, 2);
});

test("quota errors and oversized payloads do not break foreground reads", async () => {
  let calls = 0;
  const cache = createBrowserApiCache({ scope: "guest", storage: () => ({
    async open() { return { async match() {}, async put() { throw new Error("QuotaExceededError"); } }; },
  }), fetcher: async () => { calls++; return json({ words: [] }); } });
  assert.equal((await cache.get(url)).status, 200);
  assert.equal((await cache.get(url)).status, 200);
  assert.equal(calls, 1);

  const oversized = createBrowserApiCache({ scope: "guest", storage: () => undefined, fetcher: async () => {
    calls++; return json({ value: "a".repeat(2 * 1024 * 1024) });
  } });
  assert.equal((await oversized.get(url)).status, 200);
  assert.equal((await oversized.get(url)).status, 200);
  assert.equal(calls, 3);
});

test("cache allowlist excludes sensitive APIs, arbitrary query strings and external origins", () => {
  for (const path of ["/api/auth/login", "/api/payments/sepay/orders/1", "/api/support/conversations", "https://evil.test" + url, url + "&extra=1", "/api/games/vocabulary?level=hsk-7"]) {
    assert.equal(learningCachePolicy(path), null);
  }
});
