import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const subscriptionsPage = await readFile(new URL("../app/admin/subscriptions/page.tsx", import.meta.url), "utf8");
const usersPage = await readFile(new URL("../app/admin/users/page.tsx", import.meta.url), "utf8");
const subscriptionService = await readFile(new URL("../lib/admin-subscription-service.ts", import.meta.url), "utf8");

test("VIP admin mutations submit identifiers using Vinext-safe form controls", () => {
  assert.match(subscriptionsPage, /function HiddenFormValue/);
  assert.match(subscriptionsPage, /type="text" value=\{value\}/);
  assert.doesNotMatch(subscriptionsPage, /name="planId" type="hidden"/);
  assert.match(subscriptionsPage, /<HiddenFormValue name="planId" value=\{plan\.id\}/);
});

test("VIP plan ordering is deterministic when duration and name are duplicated", () => {
  assert.match(
    subscriptionService,
    /orderBy\(asc\(vipPlans\.durationDays\), asc\(vipPlans\.name\), asc\(vipPlans\.code\)\)/,
  );
});

test("manual VIP grants preserve user and return-path identifiers after hydration", () => {
  assert.match(usersPage, /function HiddenFormValue/);
  assert.match(usersPage, /<HiddenFormValue name="returnTo" value="\/admin\/users" \/>/);
  assert.match(usersPage, /<HiddenFormValue name="userId" value=\{member\.id\} \/>/);
  assert.doesNotMatch(usersPage, /name="userId" type="hidden"/);
  assert.doesNotMatch(usersPage, /name="returnTo" type="hidden"/);
});
