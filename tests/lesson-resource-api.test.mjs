import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createServer } from "vite";
import { hskLessonResourceUrl, industryLessonResourceUrl, learningContentScope } from "../lib/lesson-resource.ts";

test("lesson pages send descriptors; APIs recheck account, item access and the exact content version", async (t) => {
  const state = { user: { id: "cache-test", role: "learner", sessionCreatedAt: new Date(0) }, policies: [], industry: null };
  globalThis.__lessonResourceTest = state;
  const modules = {
    "auth-session": "export async function getCurrentUser() { return globalThis.__lessonResourceTest.user; }",
    "content-access-repository": "export async function getContentAccessPolicies() { return globalThis.__lessonResourceTest.policies; }",
    "lesson-access": "export async function hasActiveVipAccess() { return false; }",
    "lesson-repository": "export async function getLessonPageData() { return globalThis.__lessonResourceTest.industry; }",
  };
  const server = await createServer({
    configFile: false, appType: "custom", root: process.cwd(),
    cacheDir: path.join(os.tmpdir(), "himi-vite-tests", "lesson-resource-api"),
    server: { middlewareMode: true, hmr: false },
    resolve: { alias: [{ find: "server-only", replacement: path.resolve("tests/fixtures/server-only.ts") }, { find: "@", replacement: process.cwd() }] },
    plugins: [{ name: "lesson-test-services", enforce: "pre",
      resolveId(source) {
        const name = source.split("/").at(-1).replace(/\.ts$/, "");
        if (modules[name]) return `\0lesson-test:${name}`;
      },
      load(id) { if (id.startsWith("\0lesson-test:")) return modules[id.slice("\0lesson-test:".length)]; },
    }],
  });
  t.after(async () => { await server.close(); delete globalThis.__lessonResourceTest; });
  const [{ getHskLessonPageData }, { createLessonResource }, api] = await Promise.all([
    server.ssrLoadModule("/lib/hsk-access-repository.ts"),
    server.ssrLoadModule("/lib/lesson-resource-server.ts"),
    server.ssrLoadModule("/app/api/lessons/hsk/[level]/[lesson]/route.ts"),
  ]);
  const params = { level: "hsk-1", lesson: "hsk1-bai-01-chao-anh" };
  const data = await getHskLessonPageData({ level: params.level, lessonId: params.lesson, userId: state.user.id });
  assert.equal(data.access.allowed, true);
  const scope = learningContentScope(state.user);
  const resource = await createLessonResource(hskLessonResourceUrl(params.level, params.lesson), data.lesson, scope);
  const request = (target = resource) => new Request(`https://local.test${target.url}`, { headers: { "X-Himi-Lesson-Scope": target.scope, "X-Himi-Lesson-Version": target.version } });
  const call = (target = resource) => api.GET(request(target), { params: Promise.resolve(params) });
  const metadata = await api.GET(new Request(`https://local.test${resource.url}?metadata=1`, {
    headers: { "X-Himi-Lesson-Scope": scope },
  }), { params: Promise.resolve(params) });
  assert.equal(metadata.status, 200);
  assert.deepEqual(await metadata.json(), resource);
  const response = await call();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.deepEqual((await response.json()).data, data.lesson);
  assert.equal((await call({ ...resource, version: "stale" })).status, 409);

  for (const [suffix, mode] of [["", "workspace"], ["/play", "play"], ["/quiz", "quiz"], ["/flashcard", "flashcard"]]) {
    const page = await server.ssrLoadModule(`/app/hsk/[level]/[lesson]${suffix}/page.tsx`);
    const element = await page.default({ params: Promise.resolve(params) });
    assert.equal(element.props.mode, mode);
    assert.deepEqual(element.props.resource, resource);
    assert.equal(element.props.lesson, undefined);
    assert.doesNotMatch(JSON.stringify(element.props), /vocabulary|examplePinyin|writingCharacters/);
  }

  state.policies = [{ targetType: "hsk_vocabulary", targetKey: `${params.level}:${params.lesson}:${data.lesson.vocabulary[0].id}`, tier: "vip" }];
  const redacted = await getHskLessonPageData({ level: params.level, lessonId: params.lesson, userId: state.user.id });
  const redactedResource = await createLessonResource(resource.url, redacted.lesson, scope);
  assert.notEqual(redactedResource.version, resource.version);
  assert.equal((await call()).status, 409);
  const redactedBody = await (await call(redactedResource)).json();
  assert.equal(redactedBody.data.vocabulary[0].hanzi, "");
  assert.equal(redactedBody.data.vocabulary[0].locked, true);

  state.policies = [{ targetType: "hsk_lesson", targetKey: `${params.level}:${params.lesson}`, tier: "vip" }];
  assert.equal((await call()).status, 403);
  state.user = null;
  assert.equal((await call()).status, 401);
  state.policies = [{ targetType: "hsk_lesson", targetKey: `${params.level}:${params.lesson}`, tier: "guest" }];
  const guestData = await getHskLessonPageData({ level: params.level, lessonId: params.lesson, userId: null });
  const guestResource = await createLessonResource(resource.url, guestData.lesson, "guest");
  assert.equal((await call(guestResource)).status, 200);

  const industryApi = await server.ssrLoadModule("/app/api/lessons/industry/[course]/[lesson]/route.ts");
  state.industry = { lesson: { slug: "bai-1", title: "Văn phòng", vocabulary: [], dialogue: [], notes: [] }, access: { allowed: true, source: "guest" }, invalidLesson: false, progress: { completionPercent: 40 } };
  const industryResource = await createLessonResource(industryLessonResourceUrl("van-phong", "bai-1"), state.industry.lesson, "guest");
  const industryResponse = await industryApi.GET(request(industryResource), { params: Promise.resolve({ course: "van-phong", lesson: "bai-1" }) });
  assert.equal(industryResponse.status, 200);
  assert.equal((await industryResponse.json()).data.progress, undefined);
  state.industry.access = { allowed: false, source: "vip_required" };
  assert.equal((await industryApi.GET(request(industryResource), { params: Promise.resolve({ course: "van-phong", lesson: "bai-1" }) })).status, 401);
});
