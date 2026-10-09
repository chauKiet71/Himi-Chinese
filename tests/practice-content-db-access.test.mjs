import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import test from "node:test";
import { createServer } from "vite";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { CONTENT_ACCESS_TARGET_TYPES } from "../lib/content-access-types.ts";
import { protectWritingTopic, writingTargets, listeningTargets } from "../lib/practice-content-access.ts";

test("legacy public JSON endpoints contain no lesson bodies", () => {
  const root = process.cwd();
  const catalog = JSON.parse(readFileSync(path.join(root, "content/listening-catalog/index.json"), "utf8"));
  assert.deepEqual(JSON.parse(readFileSync(path.join(root, "public/listening-catalog/index.json"), "utf8")), {});
  for (const track of catalog.tracks) for (const group of track.groups) for (const topic of group.topics) for (const lesson of topic.lessons) {
    assert.deepEqual(JSON.parse(readFileSync(path.join(root, "public/listening-catalog/lessons", `${lesson.id}.json`), "utf8")), {});
  }
});

test("writing rules are independent of HSK and redact locked character bodies", () => {
  const topic = { levelId: "hsk-1", slug: "lesson", characters: [{ id: "char", hanzi: "你好", pinyin: "nǐ hǎo", meaning: "xin chào" }] };
  const policies = [{ targetType: "hsk_level", targetKey: "hsk-1", tier: "vip" }];
  assert.equal(protectWritingTopic(topic, policies, true, false).access.allowed, true);
  policies.push({ targetType: "writing_character", targetKey: "hsk-1:lesson:char", tier: "vip" });
  const result = protectWritingTopic(topic, policies, true, false);
  assert.deepEqual(result.topic.characters[0], { id: "char", hanzi: "", pinyin: "", meaning: "", locked: true, accessTier: "vip" });
  assert.equal(protectWritingTopic(topic, policies, true, true).topic.characters[0].hanzi, "你好");
  policies.push({ targetType: "writing_level", targetKey: "hsk-1", tier: "vip" });
  assert.equal(protectWritingTopic(topic, policies, true, false).topic, null);
  assert.equal(writingTargets("hsk-1", "lesson", "char").length, 3);
});

test("DB lesson API checks guest/free/VIP inheritance, expiry and unavailable policies", async (t) => {
  const root = process.cwd();
  const pg = new PGlite();
  t.after(() => pg.close());
  const oldTypes = CONTENT_ACCESS_TARGET_TYPES.filter((type) => !type.startsWith("writing_") && !type.startsWith("listening_"));
  await pg.exec(`CREATE TYPE content_access_target_type AS ENUM (${oldTypes.map((type) => `'${type}'`).join(",")});`);
  const migration = readFileSync(path.join(root, "drizzle/0031_writing_listening_content.sql"), "utf8");
  for (const statement of migration.split("--> statement-breakpoint")) await pg.exec(statement);
  const catalog = JSON.parse(readFileSync(path.join(root, "content/listening-catalog/index.json"), "utf8"));
  const first = catalog.tracks[0].groups[0].topics[0].lessons[0];
  const lesson = JSON.parse(readFileSync(path.join(root, "content/listening-catalog/lessons", `${first.id}.json`), "utf8"));
  await pg.query("INSERT INTO practice_content_documents (kind,key,payload) VALUES ($1,$2,$3),($4,$5,$6)",
    ["listening_lesson", lesson.id, JSON.stringify(lesson), "listening_catalog", "index", JSON.stringify(catalog)]);
  const state = { db: drizzle(pg), user: null, vip: false, policies: [], failure: false };
  globalThis.__practiceAccessTest = state;
  t.after(() => { delete globalThis.__practiceAccessTest; });
  const server = await createServer({ configFile: false, appType: "custom", root,
    cacheDir: path.join(os.tmpdir(), "himi-vite-tests", "practice-access"),
    optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false, watch: null },
    resolve: { alias: [{ find: "server-only", replacement: path.join(root, "tests/fixtures/server-only.ts") }, { find: "@", replacement: root }] },
    plugins: [{ name: "practice-access-fixtures", enforce: "pre", resolveId(source) {
      if (/auth-session(?:\.ts)?$/.test(source)) return "\0practice:auth";
      if (/db\/index\.ts$/.test(source)) return "\0practice:db";
      if (/content-access-repository(?:\.ts)?$/.test(source)) return "\0practice:policies";
      if (/lesson-access(?:\.ts)?$/.test(source)) return "\0practice:vip";
    }, load(id) {
      if (id === "\0practice:auth") return "export async function getCurrentUser(){return globalThis.__practiceAccessTest.user}";
      if (id === "\0practice:db") return "export async function readDb(fn){return fn(globalThis.__practiceAccessTest.db)}";
      if (id === "\0practice:vip") return "export async function hasActiveVipAccess(){return globalThis.__practiceAccessTest.vip}";
      if (id === "\0practice:policies") return "export async function getContentAccessPolicies(targets,db,options){if(!options?.failClosed)throw new Error('must_fail_closed');if(globalThis.__practiceAccessTest.failure)throw new Error('policy_db_unavailable');return globalThis.__practiceAccessTest.policies}";
    } }],
  });
  t.after(() => server.close());
  const api = await server.ssrLoadModule("/app/api/listening/lessons/[lesson]/route.ts");
  const indexApi = await server.ssrLoadModule("/app/api/listening/catalog/route.ts");
  const get = (id = lesson.id) => api.GET(new Request("https://test.invalid"), { params: Promise.resolve({ lesson: id }) });
  assert.equal((await get()).status, 401);
  state.user = { id: "learner" };
  let response = await get();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Cache-Control"), "private, no-store");
  assert.equal((await response.json()).sentences.length, lesson.sentences.length);
  for (const parent of listeningTargets(lesson)) {
    state.policies = [{ targetType: parent.type, targetKey: parent.key, tier: "vip" }];
    response = await get();
    assert.equal(response.status, 403);
    assert.deepEqual(await response.json(), { error: "vip_required" });
  }
  const index = await (await indexApi.GET()).json();
  assert.equal(index.tracks[0].groups[0].topics[0].lessons[0].access.allowed, false);
  assert.equal(JSON.stringify(index).includes('"sentences":['), false);
  state.vip = true;
  assert.equal((await get()).status, 200);
  state.vip = false; // expired subscription
  assert.equal((await get()).status, 403);
  state.user = null;
  state.policies = [{ targetType: "listening_lesson", targetKey: lesson.id, tier: "guest" }];
  assert.equal((await get()).status, 200);
  assert.equal((await get("missing")).status, 404);
  state.failure = true;
  await assert.rejects(get(), /policy_db_unavailable/);
});
