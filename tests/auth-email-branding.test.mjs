import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("authentication emails consistently use the Himi Chinese sender identity", async () => {
  const [emailSource, stagingSource, environmentExample] = await Promise.all([
    readFile(new URL("lib/auth-email.ts", root), "utf8"),
    readFile(new URL("scripts/configure-staging-secrets.ts", root), "utf8"),
    readFile(new URL(".env.example", root), "utf8"),
  ]);

  assert.match(emailSource, /DEFAULT_AUTH_EMAIL_SENDER_NAME = "Himi Chinese"/);
  assert.match(emailSource, /sender: \{ email: fromEmail, name: fromName \}/);
  assert.match(stagingSource, /BREVO_FROM_NAME: process\.env\.BREVO_FROM_NAME\?\.trim\(\) \|\| "Himi Chinese"/);
  assert.match(environmentExample, /^BREVO_FROM_NAME=Himi Chinese$/m);
  assert.doesNotMatch(emailSource, /HanziWork/);
});
