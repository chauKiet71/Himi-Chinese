import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createServer } from "vite";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "../db/schema.ts";
import { CONTENT_ACCESS_TARGET_TYPES } from "../lib/content-access-types.ts";
import { batchMatchesContentAccessTargets, parseContentAccessPolicyBatch } from "../lib/admin-content-access-batch.ts";

test("batch validation rejects malformed, duplicate, missing and unrelated rules", () => {
  const policies = [{ targetType: "typing_lesson", targetKey: "hsk-1:hsk1-l1", tier: "vip" }];
  assert.deepEqual(parseContentAccessPolicyBatch(JSON.stringify(policies)), policies);
  for (const value of [null, "", "bad json", "{}", "[]", JSON.stringify([...policies, ...policies]), JSON.stringify([{ ...policies[0], tier: "invalid" }]), JSON.stringify([{ ...policies[0], targetType: "unknown" }]), JSON.stringify(Array(1001).fill(policies[0]))]) {
    assert.equal(parseContentAccessPolicyBatch(value), null);
  }
  const targets = [{ type: "typing_lesson", key: "hsk-1:hsk1-l1" }];
  assert.equal(batchMatchesContentAccessTargets(policies, targets), true);
  assert.equal(batchMatchesContentAccessTargets([], targets), false);
  assert.equal(batchMatchesContentAccessTargets([{ ...policies[0], targetKey: "other-lesson" }], targets), false);
  assert.equal(batchMatchesContentAccessTargets([{ ...policies[0], targetType: "hsk_lesson" }], targets), false);
});

test("bulk writes update all tiers atomically with audit records and rollback on failure", async (t) => {
  const client = new PGlite();
  const server = await createServer({
    configFile: false, appType: "custom", root: process.cwd(),
    cacheDir: path.join(os.tmpdir(), "himi-vite-tests", "content-access-batch"),
    server: { middlewareMode: true, hmr: false, watch: null },
    resolve: { alias: { "@": process.cwd() } },
  });
  t.after(async () => { await server.close(); await client.close(); });
  await client.exec(`
    CREATE TYPE content_access_target_type AS ENUM (${CONTENT_ACCESS_TARGET_TYPES.map((type) => `'${type}'`).join(",")});
    CREATE TYPE access_tier AS ENUM ('guest','free','vip');
    CREATE TABLE content_access_policies (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), target_type content_access_target_type NOT NULL,
      target_key varchar(500) NOT NULL, tier access_tier NOT NULL, updated_by uuid,
      created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE(target_type,target_key)
    );
    CREATE TABLE audit_logs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), actor_id uuid, action varchar(100) NOT NULL,
      entity_type varchar(80) NOT NULL, entity_id uuid, metadata jsonb NOT NULL DEFAULT '{}',
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
  const db = drizzle(client, { schema });
  const { setContentAccessPolicies } = await server.ssrLoadModule("/lib/content-access-repository.ts");
  const actorId = "11111111-1111-4111-8111-111111111111";
  const policies = [
    { targetType: "typing_level", targetKey: "hsk-1", tier: "free" },
    { targetType: "typing_lesson", targetKey: "hsk-1:hsk1-l1", tier: "guest" },
    { targetType: "typing_question", targetKey: "hsk-1:hsk1-l1:word:1", tier: "vip" },
  ];
  await setContentAccessPolicies({ actorId, policies }, db);
  const rows = (await client.query("SELECT target_type, target_key, tier FROM content_access_policies ORDER BY target_type")).rows;
  assert.deepEqual(rows.map((row) => row.tier), ["free", "guest", "vip"]);
  assert.equal((await client.query("SELECT count(*)::int AS n FROM audit_logs")).rows[0].n, 3);
  await setContentAccessPolicies({ actorId, policies: policies.map((policy) => ({ ...policy, tier: "vip" })) }, db);
  assert.equal((await client.query("SELECT count(*)::int AS n FROM content_access_policies WHERE tier='vip'")).rows[0].n, 3);
  await client.exec("ALTER TABLE audit_logs ADD CONSTRAINT reject_one_audit CHECK (metadata->>'targetKey' <> 'blocked');");
  await assert.rejects(setContentAccessPolicies({ actorId, policies: [
    { ...policies[0], tier: "guest" },
    { targetType: "typing_question", targetKey: "blocked", tier: "free" },
  ] }, db));
  assert.equal((await client.query("SELECT count(*)::int AS n FROM content_access_policies WHERE tier='vip'")).rows[0].n, 3);
  assert.equal((await client.query("SELECT count(*)::int AS n FROM content_access_policies WHERE target_key='blocked'")).rows[0].n, 0);
  assert.equal((await client.query("SELECT count(*)::int AS n FROM audit_logs")).rows[0].n, 6);
});
