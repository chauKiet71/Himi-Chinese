import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("development and production startup migrate the configured database", async () => {
  const packageJson = JSON.parse(await read("package.json"));

  assert.equal(packageJson.scripts.predev, "npm run db:migrate:auto");
  assert.equal(packageJson.scripts.prestart, "npm run db:migrate:auto");
  assert.match(packageJson.scripts["deploy:staging"], /^npm run db:migrate:auto &&/);
});

test("automatic migrations are serialized and use the committed Drizzle history", async () => {
  const script = await read("scripts/auto-migrate-database.ts");

  assert.match(script, /pg_advisory_lock/);
  assert.match(script, /await migrate\(drizzle\(client\), \{ migrationsFolder \}\)/);
  assert.match(script, /DATABASE_AUTO_MIGRATE/);
  assert.doesNotMatch(script, /DATABASE_URL[^\n]*console/u);
});
