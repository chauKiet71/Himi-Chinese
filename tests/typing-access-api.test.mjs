import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createServer } from "vite";
import { renderToStaticMarkup } from "react-dom/server";
import { PGlite } from "@electric-sql/pglite";

const root = process.cwd();
const read = (file) => readFile(path.join(root, file), "utf8");

test("typing API rechecks login, VIP and item rules; admin covers all 146 lessons", async (t) => {
  const state = { user: null, vip: false, policies: [], policyCalls: [], failure: false };
  globalThis.__typingAccessTest = state;
  const previousDatabase = process.env.DATABASE_URL;
  process.env.DATABASE_URL = "postgres://typing-test.invalid/test";
  const modules = {
    "auth-session": "export async function getCurrentUser() { return globalThis.__typingAccessTest.user; }",
    "admin-auth": "export async function requireAdminUser() { const user = globalThis.__typingAccessTest.user; if (!user || user.role !== 'admin') throw new Error('admin_required'); return { ...user, displayName: 'Admin' }; }",
    "content-access-repository": "export async function getContentAccessPolicies(targets, database, options) { const state = globalThis.__typingAccessTest; state.policyCalls.push({targets, options}); if (state.failure) throw new Error('policy_db_unavailable'); return state.policies.filter(p => targets.some(t => t.type === p.targetType && t.key === p.targetKey)); } export async function setContentAccessPolicy(input) { const state = globalThis.__typingAccessTest; state.policies = state.policies.filter(p => p.targetType !== input.targetType || p.targetKey !== input.targetKey); state.policies.push(input); }",
    "lesson-access": "export async function hasActiveVipAccess() { return globalThis.__typingAccessTest.vip; }",
  };
  const server = await createServer({
    configFile: false, appType: "custom", root,
    cacheDir: path.join(os.tmpdir(), "himi-vite-tests", "typing-access-api"),
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, hmr: false, watch: null },
    resolve: { alias: [{ find: "server-only", replacement: path.join(root, "tests/fixtures/server-only.ts") }, { find: "@", replacement: root }] },
    plugins: [{ name: "typing-test-services", enforce: "pre",
      transform(code, id) {
        if (id.replaceAll("\\", "/").endsWith("/app/admin/actions.ts")) {
          return code.replace('"next/cache.js"', '"virtual:typing-action-cache"').replace('"next/navigation"', '"virtual:typing-action-navigation"');
        }
      },
      resolveId(source, importer) {
        if (source === "virtual:typing-action-cache") return "\0typing-test:action-cache";
        if (source === "virtual:typing-action-navigation") return "\0typing-test:action-navigation";
        if (importer?.endsWith("/app/admin/actions.ts") && source === "next/navigation") return "\0typing-test:action-navigation";
        if (importer?.endsWith("/app/admin/actions.ts") && source === "next/cache.js") return "\0typing-test:action-cache";
        if (source === "../../actions" && importer?.includes("/access/typing/")) return "\0typing-test:actions";
        const name = source.split("/").at(-1).replace(/\.ts$/, "");
        if (modules[name]) return `\0typing-test:${name}`;
      },
      load(id) {
        if (id === "\0typing-test:action-navigation") return "export function redirect(url) { throw new Error('redirect:' + url); } export function notFound() { throw new Error('not_found'); }";
        if (id === "\0typing-test:action-cache") return "export function revalidatePath() {} export function revalidateTag() {} export function updateTag() {} export function unstable_cache(fn) { return fn; }";
        if (id === "\0typing-test:actions") return "export async function updateContentAccessPolicyAction() {}";
        if (id.startsWith("\0typing-test:")) return modules[id.slice("\0typing-test:".length)];
      },
    }],
  });
  t.after(async () => {
    await server.close(); delete globalThis.__typingAccessTest;
    if (previousDatabase === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousDatabase;
  });
  const [api, admin, repository] = await Promise.all([
    server.ssrLoadModule("/app/api/typing/[level]/[lesson]/route.ts"),
    server.ssrLoadModule("/lib/admin-typing-access-view.ts"),
    server.ssrLoadModule("/lib/typing-content-repository.ts"),
  ]);
  const params = { level: "hsk-1", lesson: "hsk1-l1" };
  const call = (value = params) => api.GET(new Request(`https://local.test/api/typing/${value.level}/${value.lesson}`), { params: Promise.resolve(value) });
  const source = await repository.loadTypingLessonContent(params.level, params.lesson);
  const initial = await call();
  assert.equal(initial.status, 401);
  assert.deepEqual(await initial.json(), { error: "login_required" });
  state.user = { id: "learner-1", role: "learner" };
  const free = await call();
  assert.equal(free.status, 200);
  assert.deepEqual(await free.json(), source);
  assert.equal(free.headers.get("cache-control"), "private, no-store");
  assert.equal(free.headers.get("vary"), "Cookie");
  assert.equal(state.policyCalls.at(-1).options.failClosed, true);

  const rootView = await admin.buildAdminTypingAccessView();
  assert.equal(rootView.targets.length, 6);
  assert.equal(rootView.questions.length, 0);
  let lessonCount = 0;
  for (const level of rootView.levels) {
    const levelView = await admin.buildAdminTypingAccessView(level.id);
    assert.equal(levelView.targets.length, level.lessonCount + 1);
    assert.equal(levelView.questions.length, 0);
    const invalid = await admin.buildAdminTypingAccessView(level.id, "unknown");
    assert.equal(invalid.lessonEntries.length, level.lessonCount);
    for (const lesson of level.lessons) {
      const view = await admin.buildAdminTypingAccessView(level.id, lesson.id);
      const payload = await repository.loadTypingLessonContent(level.id, lesson.id);
      assert.deepEqual(view.questions.map(({ item }) => item), [...payload.words, ...payload.sentences]);
      assert.equal(view.questions.length, lesson.wordCount + lesson.sentenceCount);
      assert.equal(view.targets.length, view.questions.length + 2);
      for (const { item, target } of view.questions) {
        assert.equal(target.key, `${level.id}:${lesson.id}:${item.stage}:${item.id}`);
      }
      // Legacy public paths must contain neither practice items nor answers.
      assert.deepEqual(JSON.parse(await read(`public/content/typing/${level.id}/${lesson.id}.json`)), { error: "use_typing_api" });
      lessonCount++;
    }
  }
  assert.equal(lessonCount, 146);
  const lessonView = await admin.buildAdminTypingAccessView(params.level, params.lesson);
  for (const target of [lessonView.levelTarget, lessonView.lessonTarget]) {
    state.policies = [{ targetType: target.type, targetKey: target.key, tier: "vip" }];
    const denied = await call();
    assert.equal(denied.status, 403);
    assert.deepEqual(await denied.json(), { error: "vip_required" });
    state.vip = true;
    assert.deepEqual(await (await call()).json(), source);
    state.vip = false;
    assert.equal((await call()).status, 403, "a revoked/expired VIP cannot reuse access");
  }
  const question = lessonView.questions[0];
  state.policies = [{ targetType: question.target.type, targetKey: question.target.key, tier: "vip" }];
  const partial = await (await call()).json();
  assert.equal(partial.words[0].locked, true);
  assert.equal(partial.words[0].pinyin, "");
  assert.deepEqual(partial.words[1], source.words[1]);
  state.policies = [];
  assert.deepEqual(await (await call()).json(), source, "unlock takes effect on the next request");
  state.user = null;
  state.policies = [{ targetType: "typing_lesson", targetKey: "hsk-1:hsk1-l1", tier: "guest" }];
  assert.deepEqual(await (await call()).json(), source, "guest lesson rules must work through the API");
  state.policies.push({ targetType: question.target.type, targetKey: question.target.key, tier: "free" });
  const guestPartial = await (await call()).json();
  assert.equal(guestPartial.words[0].locked, true);
  assert.equal(guestPartial.words[0].requiredTier, "free");
  state.user = { id: "learner-1", role: "learner" };
  state.policies = [];
  assert.equal((await call({ level: "hsk-1", lesson: "../../secret" })).status, 404);
  assert.equal((await call({ level: "hsk-2", lesson: "hsk1-l1" })).status, 404);
  state.failure = true;
  await assert.rejects(call(), /policy_db_unavailable/);
  state.failure = false;

  const adminPage = await server.ssrLoadModule("/app/admin/access/typing/page.tsx");
  await assert.rejects(adminPage.default({ searchParams: Promise.resolve(params) }), /admin_required/);
  state.user = { id: "admin-1", role: "admin" };
  state.policies = [{ targetType: "typing_lesson", targetKey: "hsk-1:hsk1-l1", tier: "vip" }];
  const markup = renderToStaticMarkup(await adminPage.default({ searchParams: Promise.resolve(params) }));
  assert.match(markup, /Khóa VIP Luyện gõ/);
  assert.match(markup, /name="targetType"[^>]*value="typing_question"/);
  assert.match(markup, /name="returnTo"[^>]*value="\/admin\/access\/typing\?level=hsk-1&amp;lesson=hsk1-l1"/);
  assert.match(markup, /value="vip" selected=""/);
  assert.match(markup, /Đáp án pinyin/);
  const actions = await server.ssrLoadModule("/app/admin/actions.ts");
  const form = new FormData();
  form.set("targetType", question.target.type);
  form.set("targetKey", question.target.key);
  form.set("tier", "vip");
  form.set("returnTo", "/admin/access/typing?level=hsk-1&lesson=hsk1-l1");
  state.policies = [];
  await assert.rejects(actions.updateContentAccessPolicyAction(form), /redirect:\/admin\/access\/typing\?level=hsk-1&lesson=hsk1-l1&success=content_access_updated/);
  const hskForm = new FormData();
  hskForm.set("targetType", "hsk_lesson");
  hskForm.set("targetKey", "hsk-1:hsk1-bai-01-chao-anh");
  hskForm.set("tier", "vip");
  hskForm.set("returnTo", "/admin/access/hsk?level=hsk-1&lesson=hsk1-bai-01-chao-anh");
  await assert.rejects(actions.updateContentAccessPolicyAction(hskForm), /redirect:\/admin\/access\/hsk\?level=hsk-1&lesson=hsk1-bai-01-chao-anh&success=content_access_updated/);
  state.user = { id: "learner-1", role: "learner" };
  assert.equal((await (await call()).json()).words[0].locked, true, "saved admin rules must reach the learner API");
  await assert.rejects(actions.updateContentAccessPolicyAction(form), /admin_required/);
});

test("typing migration extends the policy enum and persists each independent target", async (t) => {
  const db = new PGlite();
  t.after(() => db.close());
  await db.exec("CREATE TYPE content_access_target_type AS ENUM ('hsk_level', 'hsk_lesson', 'hsk_question');");
  const migration = await read("drizzle/0029_typing_content_access.sql");
  await db.exec(migration);
  await db.exec("CREATE TABLE policies (type content_access_target_type, key text, tier text);");
  for (const type of ["typing_level", "typing_lesson", "typing_question"]) {
    await db.query("INSERT INTO policies VALUES ($1, $2, 'vip')", [type, `${type}:test`]);
  }
  assert.equal((await db.query("SELECT * FROM policies")).rows.length, 3);
});
