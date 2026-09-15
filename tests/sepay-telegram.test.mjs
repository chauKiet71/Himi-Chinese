import assert from "node:assert/strict";
import test, { before, after, beforeEach } from "node:test";
import { readFile } from "node:fs/promises";
import { createHmac } from "node:crypto";
import path from "node:path";
import { createServer } from "vite";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema.ts";
import { processSupportJob } from "../lib/support-worker.ts";
import { sendSepayNotification } from "../lib/sepay-telegram.ts";
import { telegramCall, TelegramError } from "../lib/support-telegram.ts";

const userId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const planId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const orderId = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const environmentKeys = ["SEPAY_API_KEY", "SEPAY_WEBHOOK_SECRET", "SEPAY_BANK_ACCOUNT_NUMBER", "TELEGRAM_BOT_TOKEN", "TELEGRAM_ADMIN_CHAT_ID", "TELEGRAM_PAYMENT_CHAT_ID", "TELEGRAM_WEBHOOK_SECRET"];
const originalEnvironment = Object.fromEntries(environmentKeys.map(key => [key, process.env[key]]));
let client, db, server, POST, calls, io;
const payload = {
  id: 92704, gateway: "MBBANK", transactionDate: "2026-09-15 11:08:33",
  accountNumber: "054611111", subAccount: "", code: "HIMI23456789ABCD",
  content: "HIMI23456789ABCD thanh toan VIP", transferType: "in",
  description: "Thanh toan", transferAmount: 11000, accumulated: 1000000,
  referenceCode: "MB92704",
};
const webhook = (value = payload, authorization = "Apikey test-sepay-key") => POST(new Request("http://localhost/api/webhooks/sepay", {
  method: "POST", headers: { authorization, "Content-Type": "application/json" }, body: JSON.stringify(value),
}));
const jobs = () => db.select().from(schema.supportJobs);
const order = async () => (await db.select().from(schema.paymentOrders).where(eq(schema.paymentOrders.id, orderId)))[0];

before(async () => {
  client = new PGlite();
  db = drizzle(client, { schema });
  for (const migration of ["0000_amused_the_initiative", "0004_hesitant_cerise", "0012_magical_silver_centurion", "0013_empty_bloodaxe", "0014_tearful_leader", "0016_natural_marvel_apes", "0018_support_telegram", "0019_support_reminder_retry"]) {
    await client.exec(await readFile(new URL(`../drizzle/${migration}.sql`, import.meta.url), "utf8"));
  }
  server = await createServer({
    appType: "custom", configFile: false, cacheDir: "node_modules/.vite/sepay-telegram-test",
    resolve: { alias: [
      { find: "server-only", replacement: path.resolve("tests/fixtures/server-only.ts") },
      { find: /^\.\.\/db\/index\.ts$/, replacement: path.resolve("tests/fixtures/sepay-db.mjs") },
      { find: "@", replacement: process.cwd() },
    ] },
    server: { hmr: false, middlewareMode: true },
  });
  const fixture = await server.ssrLoadModule("/tests/fixtures/sepay-db.mjs");
  fixture.setSepayTestDb(db);
  ({ POST } = await server.ssrLoadModule("/app/api/webhooks/sepay/route.ts"));
});
after(async () => {
  await server?.close();
  await client?.close();
  for (const [key, value] of Object.entries(originalEnvironment)) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
});
beforeEach(async () => {
  await client.exec("TRUNCATE users, vip_plans CASCADE; TRUNCATE support_jobs");
  process.env.SEPAY_API_KEY = "test-sepay-key";
  delete process.env.SEPAY_WEBHOOK_SECRET;
  process.env.SEPAY_BANK_ACCOUNT_NUMBER = payload.accountNumber;
  process.env.TELEGRAM_BOT_TOKEN = "test-token";
  process.env.TELEGRAM_ADMIN_CHAT_ID = "-100123456";
  delete process.env.TELEGRAM_PAYMENT_CHAT_ID;
  delete process.env.TELEGRAM_WEBHOOK_SECRET;
  await db.insert(schema.users).values({ id: userId, email: "learner@example.test", displayName: "Học viên thử nghiệm", emailVerifiedAt: new Date() });
  await db.insert(schema.vipPlans).values({ id: planId, code: "VIP_1M", name: "VIP 1 tháng", durationDays: 30, priceVnd: 11000 });
  await db.insert(schema.paymentOrders).values({ id: orderId, userId, planId, referenceCode: payload.code, amountVnd: 11000, expiresAt: new Date(Date.now() + 30 * 60_000) });
  calls = [];
  io = { call: async (method, parameters) => { calls.push({ method, parameters }); return { message_id: 123 }; },
    readImage: async () => new Uint8Array(), importPhoto: async () => "unused" };
});

test("authenticated SePay webhook commits VIP and notification before Telegram delivery", async () => {
  const response = await webhook();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal((await order()).status, "paid");
  assert.equal((await db.select().from(schema.subscriptions)).length, 1);
  const [job] = await jobs();
  assert.equal(job.kind, "sepay-notify");
  assert.equal(job.conversationId, null);
  assert.equal(job.finishedAt, null);
  assert.equal(calls.length, 0);
  await processSupportJob(db, io);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].method, "sendMessage");
  assert.equal(calls[0].parameters.chat_id, "-100123456");
  const { text, parse_mode, reply_markup } = calls[0].parameters;
  for (const value of ["Thanh toán thành công", "11.000 đ", payload.code, String(payload.id), orderId, "learner@example.test", "Học viên thử nghiệm", "VIP 1 tháng"]) assert.ok(text.includes(value), value);
  assert.equal(parse_mode, undefined);
  assert.equal(reply_markup, undefined);
  assert.ok((await jobs())[0].finishedAt);
  assert.deepEqual((await jobs())[0].payload, {});
});

test("repeated webhook neither extends VIP twice nor queues or sends another notification", async () => {
  await webhook();
  const endsAt = (await db.select().from(schema.subscriptions))[0].endsAt;
  await processSupportJob(db, io);
  assert.equal((await webhook()).status, 200);
  assert.equal((await jobs()).length, 1);
  assert.equal((await db.select().from(schema.paymentEvents)).length, 1);
  assert.equal((await db.select().from(schema.subscriptions))[0].endsAt.getTime(), endsAt.getTime());
  assert.equal(await processSupportJob(db, io), false);
  assert.equal(calls.length, 1);
});

test("HMAC-authenticated SePay webhook queues a payment notification", async () => {
  process.env.SEPAY_WEBHOOK_SECRET = "test-hmac-secret";
  const body = JSON.stringify(payload);
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = createHmac("sha256", process.env.SEPAY_WEBHOOK_SECRET).update(`${timestamp}.${body}`).digest("hex");
  const response = await POST(new Request("http://localhost/api/webhooks/sepay", {
    method: "POST", body, headers: { "x-sepay-signature": `sha256=${signature}`, "x-sepay-timestamp": timestamp },
  }));
  assert.equal(response.status, 200);
  assert.equal((await order()).status, "paid");
  assert.equal((await jobs()).length, 1);
});

for (const reason of ["amount_mismatch", "order_expired"]) {
  test(`SePay ${reason} alerts admin and keeps VIP unactivated`, async () => {
    if (reason === "order_expired") await db.update(schema.paymentOrders).set({ expiresAt: new Date(0) }).where(eq(schema.paymentOrders.id, orderId));
    assert.equal((await webhook({ ...payload, transferAmount: reason === "amount_mismatch" ? 10000 : payload.transferAmount })).status, 200);
    assert.equal((await order()).status, "manual_review");
    assert.equal((await db.select().from(schema.subscriptions)).length, 0);
    await processSupportJob(db, io);
    assert.ok(calls[0].parameters.text.includes("Cần đối soát thủ công"));
    assert.ok(calls[0].parameters.text.includes(reason === "amount_mismatch" ? "Số tiền không khớp đơn" : "Đơn đã hết hạn"));
  });
}

test("a transfer without a matching order still alerts admin", async () => {
  assert.equal((await webhook({ ...payload, code: null, content: "Khong co ma don" })).status, 200);
  assert.equal((await order()).status, "pending");
  await processSupportJob(db, io);
  assert.ok(calls[0].parameters.text.includes("Không tìm thấy đơn thanh toán"));
});

test("outgoing transfers and wrong bank accounts report ignored without granting VIP", async () => {
  await webhook({ ...payload, transferType: "out" });
  await webhook({ ...payload, id: payload.id + 1, accountNumber: "99999999" });
  assert.equal((await order()).status, "pending");
  assert.equal((await db.select().from(schema.subscriptions)).length, 0);
  await processSupportJob(db, io);
  await processSupportJob(db, io);
  assert.equal(calls.length, 2);
  for (const call of calls) assert.ok(call.parameters.text.includes("Giao dịch không đủ điều kiện xử lý"));
});

test("another transfer to an already paid order alerts about the extra money", async () => {
  await webhook();
  await processSupportJob(db, io);
  await webhook({ ...payload, id: payload.id + 1 });
  await processSupportJob(db, io);
  assert.equal(calls.length, 2);
  assert.ok(calls[1].parameters.text.includes("Cần kiểm tra khoản chuyển thêm"));
  assert.equal((await db.select().from(schema.subscriptions)).length, 1);
});

test("Telegram rate limits preserve a durable retry to the configured personal chat", async () => {
  process.env.TELEGRAM_PAYMENT_CHAT_ID = "123456789";
  await webhook();
  const send = io.call;
  io.call = async () => { throw new TelegramError(429, 60_000); };
  const start = Date.now();
  await processSupportJob(db, io);
  const [retry] = await jobs();
  assert.equal((await order()).status, "paid");
  assert.equal(retry.finishedAt, null);
  assert.equal(retry.attempts, 1);
  assert.equal(retry.lastError, "telegram_429");
  assert.ok(retry.availableAt.getTime() >= start + 60_000);
  assert.ok(retry.payload.text.includes("Thanh toán thành công"));
  await webhook();
  assert.equal((await jobs()).length, 1);
  assert.equal(await processSupportJob(db, io), false);
  await db.update(schema.supportJobs).set({ availableAt: new Date(0) }).where(eq(schema.supportJobs.id, retry.id));
  io.call = send;
  await processSupportJob(db, io);
  assert.equal(calls[0].parameters.chat_id, "123456789");
  assert.ok((await jobs())[0].finishedAt);
});

test("unauthorized and invalid webhooks cannot send Telegram notifications", async () => {
  assert.equal((await webhook(payload, "Apikey wrong-key")).status, 401);
  assert.equal((await webhook({ ...payload, transferAmount: -1 })).status, 400);
  assert.equal((await jobs()).length, 0);
  assert.equal((await db.select().from(schema.paymentEvents)).length, 0);
});

test("failed VIP activation rolls back payment and does not queue a success alert", async () => {
  await db.update(schema.vipPlans).set({ isActive: false }).where(eq(schema.vipPlans.id, planId));
  assert.equal((await webhook()).status, 500);
  assert.equal((await order()).status, "pending");
  assert.equal((await jobs()).length, 0);
  assert.equal((await db.select().from(schema.paymentEvents)).length, 0);
});

test("worker destination fallback works and rejects invalid destinations", async () => {
  process.env.TELEGRAM_PAYMENT_CHAT_ID = "123456789";
  await sendSepayNotification({ chatId: null, text: "test" }, io.call);
  assert.equal(calls[0].parameters.chat_id, "123456789");
  await assert.rejects(sendSepayNotification({ chatId: "0", text: "test" }, io.call), /sepay_telegram_chat_not_configured/);
  assert.equal(calls.length, 1);
});

test("a payments-only worker delivers SePay notifications while leaving support jobs pending", async () => {
  await db.insert(schema.supportJobs).values({ kind: "receipt", dedupeKey: "support-receipt", payload: { chatId: "-100123456", text: "Support receipt" }, availableAt: new Date(0) });
  await webhook();
  assert.equal(await processSupportJob(db, io, "sepay-notify"), true);
  assert.equal(await processSupportJob(db, io, "sepay-notify"), false);
  assert.equal(calls.length, 1);
  assert.ok(calls[0].parameters.text.includes("SePay báo giao dịch"));
  assert.equal((await jobs()).find(job => job.kind === "receipt").finishedAt, null);
});

test("sending payment notifications requires only the bot token, without a Telegram inbound webhook", async () => {
  const originalFetch = globalThis.fetch;
  delete process.env.TELEGRAM_ADMIN_CHAT_ID;
  delete process.env.TELEGRAM_WEBHOOK_SECRET;
  try {
    globalThis.fetch = async (_url, options) => {
      assert.deepEqual(JSON.parse(options.body), { chat_id: "123456789", text: "test" });
      return Response.json({ ok: true, result: { message_id: 123 } });
    };
    assert.deepEqual(await telegramCall("sendMessage", { chat_id: "123456789", text: "test" }), { message_id: 123 });
  } finally { globalThis.fetch = originalFetch; }
});
