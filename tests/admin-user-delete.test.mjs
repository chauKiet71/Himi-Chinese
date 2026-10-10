import assert from "node:assert/strict";
import test, { before, after, beforeEach } from "node:test";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createServer } from "vite";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema.ts";
import { resolveAdminDateSelection } from "../lib/admin-date-range.ts";

let client, db, server, deleteAdminUser, getAdminUserConsole, getAdminBusinessAnalytics, getAdminVipConsole, admin, learner;
before(async () => {
  client = new PGlite();
  db = drizzle(client, { schema });
  const journal = JSON.parse(await readFile(new URL("../drizzle/meta/_journal.json", import.meta.url), "utf8"));
  for (const { tag } of journal.entries) await client.exec(await readFile(new URL(`../drizzle/${tag}.sql`, import.meta.url), "utf8"));
  server = await createServer({ appType: "custom", configFile: false, cacheDir: "node_modules/.vite/admin-user-delete-test",
    resolve: { alias: [
      { find: "server-only", replacement: path.resolve("tests/fixtures/server-only.ts") },
      { find: /^\.\.\/db\/index\.ts$/, replacement: path.resolve("tests/fixtures/sepay-db.mjs") },
    ] }, server: { hmr: false, middlewareMode: true } });
  (await server.ssrLoadModule("/tests/fixtures/sepay-db.mjs")).setSepayTestDb(db);
  ({ deleteAdminUser, getAdminUserConsole } = await server.ssrLoadModule("/lib/admin-user-service.ts"));
  ({ getAdminBusinessAnalytics } = await server.ssrLoadModule("/lib/admin-analytics-service.ts"));
  ({ getAdminVipConsole } = await server.ssrLoadModule("/lib/admin-subscription-service.ts"));
});
after(async () => { await server?.close(); await client?.close(); });
beforeEach(async () => {
  await client.exec("TRUNCATE users CASCADE");
  [admin, learner] = await db.insert(schema.users).values([
    { email: "admin@example.test", role: "admin" },
    { email: "learner@example.test", role: "learner" },
  ]).returning();
});

test("deletion removes an account with payment, support and authentication records and frees its email", async () => {
  const [plan] = await db.insert(schema.vipPlans).values({ code: "delete-test", name: "Test", durationDays: 3, priceVnd: 29000 }).onConflictDoUpdate({ target: schema.vipPlans.code, set: { name: "Test" } }).returning();
  const [subscription] = await db.insert(schema.subscriptions).values({ userId: learner.id, planId: plan.id, status: "active", activatedBy: admin.id }).returning();
  const [order] = await db.insert(schema.paymentOrders).values({ userId: learner.id, planId: plan.id, subscriptionId: subscription.id, referenceCode: "DELETE-TEST", amountVnd: 29000, expiresAt: new Date() }).returning();
  await db.insert(schema.paymentEvents).values({ orderId: order.id, payload: {} });
  await db.insert(schema.authSessions).values({ userId: learner.id, tokenHash: "test", expiresAt: new Date() });
  await db.insert(schema.oauthAccounts).values({ userId: learner.id, provider: "google", providerAccountId: "test" });
  const [conversation] = await db.insert(schema.supportConversations).values({ userId: learner.id, userName: "Test", userEmail: learner.email, telegramChatId: "test" }).returning();
  await db.insert(schema.supportMessages).values({ conversationId: conversation.id, senderType: "USER", senderId: learner.id, content: "Test" });
  await db.insert(schema.supportJobs).values({ conversationId: conversation.id, kind: "test", dedupeKey: "delete-test" });
  await db.insert(schema.supportReplySessions).values({ conversationId: conversation.id, telegramChatId: "test", telegramAdminUserId: "test", promptMessageId: 1, expiresAt: new Date() });
  assert.deepEqual(await deleteAdminUser(learner.id, admin.id), { ok: true, id: learner.id });
  assert.equal((await db.select().from(schema.users).where(eq(schema.users.id, learner.id))).length, 0);
  for (const table of [schema.authSessions, schema.oauthAccounts, schema.subscriptions, schema.paymentOrders, schema.paymentEvents, schema.supportConversations, schema.supportMessages, schema.supportJobs, schema.supportReplySessions]) {
    assert.equal((await db.select().from(table)).length, 0);
  }
  assert.equal((await db.select().from(schema.auditLogs))[0].action, "admin.user.deleted");
  await db.insert(schema.users).values({ email: learner.email });
});

test("previously locked learners can be deleted", async () => {
  await db.update(schema.users).set({ isActive: false }).where(eq(schema.users.id, learner.id));
  assert.equal((await deleteAdminUser(learner.id, admin.id)).ok, true);
});

test("self and staff deletion are rejected and missing accounts return not_found", async () => {
  assert.equal((await deleteAdminUser(admin.id, admin.id)).error, "user_delete_forbidden");
  assert.equal((await deleteAdminUser(learner.id, learner.id)).error, "user_delete_forbidden");
  const [editor] = await db.insert(schema.users).values({ email: "editor@example.test", role: "editor" }).returning();
  assert.equal((await deleteAdminUser(editor.id, admin.id)).error, "user_delete_forbidden");
  await deleteAdminUser(learner.id, admin.id);
  assert.equal((await deleteAdminUser(learner.id, admin.id)).error, "not_found");
});

test("a failure rolls back related data deletion", async () => {
  await db.insert(schema.authSessions).values({ userId: learner.id, tokenHash: "rollback", expiresAt: new Date() });
  await assert.rejects(deleteAdminUser(learner.id, "00000000-0000-0000-0000-000000000000"));
  assert.equal((await db.select().from(schema.users).where(eq(schema.users.id, learner.id))).length, 1);
  assert.equal((await db.select().from(schema.authSessions)).length, 1);
});

test("user pagination counts filtered results, avoids overlap and clamps invalid pages", async () => {
  await db.insert(schema.users).values(Array.from({ length: 105 }, (_, index) => ({ email: `paged-${String(index).padStart(3, "0")}@example.test` })));
  const first = await getAdminUserConsole({ search: "paged-", page: 1, pageSize: 50 });
  const second = await getAdminUserConsole({ search: "paged-", page: 2, pageSize: 50 });
  const last = await getAdminUserConsole({ search: "paged-", page: 999, pageSize: 50 });
  assert.equal(first.totalUsers, 105);
  assert.equal(first.totalPages, 3);
  assert.equal(first.users.length, 50);
  assert.equal(second.users.length, 50);
  assert.equal(new Set([...first.users, ...second.users].map(user => user.id)).size, 100);
  assert.equal(last.page, 3);
  assert.equal(last.users.length, 5);
  const resized = await getAdminUserConsole({ search: "paged-", pageSize: 100 });
  assert.equal(resized.users.length, 100);
  assert.equal(resized.totalPages, 2);
  const empty = await getAdminUserConsole({ search: "missing-account", page: -10, pageSize: 17 });
  assert.equal(empty.totalUsers, 0);
  assert.equal(empty.page, 1);
  assert.equal(empty.pageSize, 50);
  const exported = await getAdminUserConsole({ search: "paged-", limit: 5000, page: 2 });
  assert.equal(exported.users.length, 105);
  assert.equal(exported.page, 1);
});

test("date filters bound users, VIP subscriptions, paid revenue and pending requests", async () => {
  const { range } = resolveAdminDateSelection({ datePreset: "custom", from: "2026-10-09", to: "2026-10-09" });
  const [plan] = await db.insert(schema.vipPlans).values({ code: "date-test", name: "Date test", durationDays: 30, priceVnd: 100 }).onConflictDoUpdate({ target: schema.vipPlans.code, set: { name: "Date test" } }).returning();
  await db.update(schema.users).set({ createdAt: range.start }).where(eq(schema.users.id, learner.id));
  await db.update(schema.users).set({ createdAt: new Date(range.end.getTime() + 1) }).where(eq(schema.users.id, admin.id));
  for (const [index, createdAt] of [new Date(range.start.getTime() - 1), range.start, range.end, new Date(range.end.getTime() + 1)].entries()) {
    await db.insert(schema.subscriptions).values({ userId: learner.id, planId: plan.id, createdAt });
    await db.insert(schema.paymentOrders).values({ userId: learner.id, planId: plan.id, referenceCode: `DATE-${index}`, amountVnd: 100, status: "paid", paidAt: createdAt, createdAt, expiresAt: createdAt });
  }
  await db.insert(schema.vipActivationRequests).values({ userId: learner.id, planId: plan.id, createdAt: range.start });
  const users = await getAdminUserConsole({ range });
  assert.equal(users.totalUsers, 1);
  const analytics = await getAdminBusinessAnalytics(range);
  assert.equal(analytics.stats.newUsers, 1);
  assert.equal(analytics.stats.vipRegistrations, 2);
  assert.equal(analytics.stats.revenue, 200);
  assert.equal(analytics.recentTransactions.length, 2);
  const vip = await getAdminVipConsole("", range);
  assert.equal(vip.subscribers.length, 2);
  assert.equal(vip.transactions.length, 2);
  assert.equal(vip.pendingRequestCount, 1);
  assert.equal(vip.learners.length, 1);
});
