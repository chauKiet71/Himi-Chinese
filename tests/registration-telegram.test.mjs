import assert from "node:assert/strict";
import test, { before, after, beforeEach } from "node:test";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createServer } from "vite";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema.ts";
import { processSupportJob } from "../lib/support-worker.ts";
import { enqueueRegistrationNotification, processRegistrationNotification, registrationNotificationText, registrationQueueHealth, sendRegistrationNotification } from "../lib/registration-telegram.ts";
import { TelegramError } from "../lib/support-telegram.ts";

const environmentKeys = ["AUTH_SECRET", "TELEGRAM_BOT_TOKEN", "TELEGRAM_ADMIN_CHAT_ID", "TELEGRAM_PAYMENT_CHAT_ID", "TELEGRAM_REGISTRATION_CHAT_ID"];
const originalEnvironment = Object.fromEntries(environmentKeys.map(key => [key, process.env[key]]));
const input = { displayName: "Học viên mới", email: "new@example.test", password: "Registration-test-2026!" };
const profile = { subject: "google-new-user", email: input.email, displayName: input.displayName };
const jobs = () => db.select().from(schema.registrationNotificationJobs);
let client, db, server, registerLearner, authenticateWithGoogle, calls, io;

before(async () => {
  client = new PGlite();
  db = drizzle(client, { schema });
  for (const migration of ["0000_amused_the_initiative", "0004_hesitant_cerise", "0016_natural_marvel_apes", "0018_support_telegram", "0019_support_reminder_retry", "0027_light_fat_cobra", "0030_registration_notifications"]) {
    await client.exec(await readFile(new URL(`../drizzle/${migration}.sql`, import.meta.url), "utf8"));
  }
  server = await createServer({
    appType: "custom", configFile: false, cacheDir: "node_modules/.vite/registration-telegram-test",
    resolve: { alias: [
      { find: "server-only", replacement: path.resolve("tests/fixtures/server-only.ts") },
      { find: /^\.\.\/db\/index\.ts$/, replacement: path.resolve("tests/fixtures/sepay-db.mjs") },
    ] },
    server: { hmr: false, middlewareMode: true },
  });
  const fixture = await server.ssrLoadModule("/tests/fixtures/sepay-db.mjs");
  fixture.setSepayTestDb(db);
  ({ registerLearner, authenticateWithGoogle } = await server.ssrLoadModule("/lib/auth-service.ts"));
});

after(async () => {
  await server?.close();
  await client?.close();
  for (const [key, value] of Object.entries(originalEnvironment)) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
});

beforeEach(async () => {
  await client.exec("TRUNCATE users CASCADE; TRUNCATE support_jobs");
  process.env.AUTH_SECRET = "registration-test-secret";
  process.env.TELEGRAM_BOT_TOKEN = "test-token";
  process.env.TELEGRAM_ADMIN_CHAT_ID = "-100123456";
  delete process.env.TELEGRAM_PAYMENT_CHAT_ID;
  delete process.env.TELEGRAM_REGISTRATION_CHAT_ID;
  calls = [];
  io = { call: async (method, parameters) => { calls.push({ method, parameters }); return { message_id: 123 }; },
    readImage: async () => new Uint8Array(), importPhoto: async () => "unused" };
});

test("email registration commits one alert and worker delivers it without exposing credentials", async () => {
  const { user } = await registerLearner(input);
  assert.equal(user.emailVerified, false);
  const [job] = await jobs();
  assert.equal(job.userId, user.id);
  assert.equal((await db.select().from(schema.supportJobs)).length, 0);
  assert.equal(job.finishedAt, null);
  assert.equal(calls.length, 0);
  assert.doesNotMatch(JSON.stringify(job.payload), /Registration-test|password|pbkdf2|token/iu);
  await processRegistrationNotification(db, io.call);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].method, "sendMessage");
  const { text, chat_id, parse_mode, reply_markup } = calls[0].parameters;
  assert.equal(chat_id, "-100123456");
  assert.match(text, /HIMI · Tài khoản mới/u);
  assert.match(text, /Học viên mới/u);
  assert.match(text, /new@example.test/u);
  assert.match(text, /Đăng ký bằng: Email/u);
  assert.match(text, /Chưa xác minh/u);
  assert.equal(parse_mode, undefined);
  assert.equal(reply_markup, undefined);
  assert.ok((await jobs())[0].finishedAt);
  assert.equal((await jobs())[0].telegramMessageId, 123);
  assert.deepEqual((await jobs())[0].payload, {});
  assert.equal(await processRegistrationNotification(db, io.call), false);
});

test("duplicate email attempts and verification resubmissions do not enqueue another alert", async () => {
  const { user } = await registerLearner(input, db);
  assert.deepEqual(await registerLearner(input, db), { duplicate: true });
  await db.update(schema.users).set({ emailVerifiedAt: new Date() }).where(eq(schema.users.id, user.id));
  assert.deepEqual(await registerLearner(input, db), { duplicate: true });
  assert.equal((await jobs()).length, 1);
});

test("new Google accounts alert once; subsequent Google logins do not", async () => {
  const user = await authenticateWithGoogle(profile, db);
  assert.equal(user.emailVerified, true);
  assert.equal((await jobs()).length, 1);
  assert.match((await jobs())[0].payload.text, /Đăng ký bằng: Google/u);
  assert.match((await jobs())[0].payload.text, /Đã xác minh/u);
  assert.equal((await authenticateWithGoogle(profile, db)).id, user.id);
  assert.equal((await jobs()).length, 1);
});

test("linking Google to an existing learner creates no registration alert", async () => {
  await db.insert(schema.users).values({ email: input.email, displayName: input.displayName });
  assert.ok(await authenticateWithGoogle(profile, db));
  assert.equal((await jobs()).length, 0);
});

test("rejected Google accounts and rolled-back Google creations leave no alert", async () => {
  await db.insert(schema.users).values({ email: input.email, role: "admin" });
  assert.equal(await authenticateWithGoogle(profile, db), null);
  assert.equal((await jobs()).length, 0);
  await db.insert(schema.oauthAccounts).values({ userId: (await db.select().from(schema.users))[0].id,
    provider: "google", providerAccountId: "occupied-subject" });
  // Failure after enqueue must roll back both the new user and its alert.
  await client.exec("CREATE FUNCTION reject_oauth_insert() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'fixture rollback'; END $$; CREATE TRIGGER reject_oauth BEFORE INSERT ON oauth_accounts FOR EACH ROW EXECUTE FUNCTION reject_oauth_insert()");
  try {
    await assert.rejects(authenticateWithGoogle({ ...profile, email: "rollback@example.test" }, db));
    assert.equal((await db.select().from(schema.users)).length, 1);
    assert.equal((await jobs()).length, 0);
  } finally {
    await client.exec("DROP TRIGGER reject_oauth ON oauth_accounts; DROP FUNCTION reject_oauth_insert()");
  }
});

test("email registration rolls back the new account if saving its alert fails", async () => {
  await client.exec("CREATE FUNCTION reject_alert_insert() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'fixture rollback'; END $$; CREATE TRIGGER reject_alert BEFORE INSERT ON registration_notification_jobs FOR EACH ROW EXECUTE FUNCTION reject_alert_insert()");
  try {
    await assert.rejects(registerLearner(input, db));
    assert.equal((await db.select().from(schema.users)).length, 0);
    assert.equal((await jobs()).length, 0);
  } finally {
    await client.exec("DROP TRIGGER reject_alert ON registration_notification_jobs; DROP FUNCTION reject_alert_insert()");
  }
});

test("Telegram rate limit keeps the account and alert for retry, respecting retry_after", async () => {
  await registerLearner(input, db);
  await processRegistrationNotification(db, async () => { throw new TelegramError(429, 120_000); });
  const [job] = await jobs();
  assert.equal(job.finishedAt, null);
  assert.equal(job.attempts, 1);
  assert.equal(job.lastError, "telegram_429");
  assert.ok(job.availableAt.getTime() > Date.now() + 115_000);
  assert.equal((await db.select().from(schema.users)).length, 1);
  await db.update(schema.registrationNotificationJobs).set({ availableAt: new Date(0) }).where(eq(schema.registrationNotificationJobs.id, job.id));
  await processRegistrationNotification(db, io.call);
  assert.equal(calls.length, 1);
  assert.ok((await jobs())[0].finishedAt);
});

test("registration destination overrides payment and support; absent web destination falls back to worker", async () => {
  process.env.TELEGRAM_PAYMENT_CHAT_ID = "222222";
  process.env.TELEGRAM_REGISTRATION_CHAT_ID = "111111";
  await registerLearner(input, db);
  await processRegistrationNotification(db, io.call);
  assert.equal(calls[0].parameters.chat_id, "111111");
  delete process.env.TELEGRAM_REGISTRATION_CHAT_ID;
  await sendRegistrationNotification({ text: "test", chatId: null }, io.call);
  assert.equal(calls[1].parameters.chat_id, "222222");
  delete process.env.TELEGRAM_PAYMENT_CHAT_ID;
  await sendRegistrationNotification({ text: "test" }, io.call);
  assert.equal(calls[2].parameters.chat_id, "-100123456");
  await assert.rejects(sendRegistrationNotification({ text: "test", chatId: "0" }, io.call), /chat_not_configured/u);
  await assert.rejects(sendRegistrationNotification({ chatId: "111111" }, io.call), /message_invalid/u);
});

test("missing Telegram configuration does not break registration and alert can be delivered later", async () => {
  delete process.env.TELEGRAM_ADMIN_CHAT_ID;
  delete process.env.TELEGRAM_BOT_TOKEN;
  const { user } = await registerLearner(input, db);
  assert.ok(user);
  assert.equal((await jobs())[0].payload.chatId, null);
  await processRegistrationNotification(db, io.call);
  assert.equal(calls.length, 0);
  const [job] = await jobs();
  assert.equal(job.finishedAt, null);
  process.env.TELEGRAM_REGISTRATION_CHAT_ID = "111111";
  await db.update(schema.registrationNotificationJobs).set({ availableAt: new Date(0) }).where(eq(schema.registrationNotificationJobs.id, job.id));
  await processRegistrationNotification(db, io.call);
  assert.equal(calls[0].parameters.chat_id, "111111");
});

test("account deduplication and separate queues protect registration alerts from older support workers", async () => {
  const { user } = await registerLearner(input, db);
  const [row] = await db.select().from(schema.users).where(eq(schema.users.id, user.id));
  await db.transaction(tx => enqueueRegistrationNotification(tx, row, "email"));
  assert.equal((await jobs()).length, 1);
  // An existing worker polling support_jobs must never find the account alert.
  assert.equal(await processSupportJob(db, io), false);
  assert.equal((await jobs())[0].finishedAt, null);
  assert.equal((await jobs())[0].telegramMessageId, null);
  await db.insert(schema.supportJobs).values({ kind: "receipt", dedupeKey: "support-test", payload: { chatId: "-100123456", text: "support" } });
  await processRegistrationNotification(db, io.call);
  assert.match(calls[0].parameters.text, /Tài khoản mới/u);
  assert.equal(await processRegistrationNotification(db, io.call), false);
  assert.equal((await db.select().from(schema.supportJobs))[0].finishedAt, null);
});

test("two registration workers only deliver one alert and queue health reflects pending/retry state", async () => {
  await registerLearner(input, db);
  assert.equal((await registrationQueueHealth(db)).pendingCount, 1);
  await Promise.all([processRegistrationNotification(db, io.call), processRegistrationNotification(db, io.call)]);
  assert.equal(calls.length, 1);
  assert.equal((await registrationQueueHealth(db)).pendingCount, 0);
});

test("Telegram success without a message ID cannot mark the alert delivered", async () => {
  await registerLearner(input, db);
  await processRegistrationNotification(db, async () => ({}));
  const [job] = await jobs();
  assert.equal(job.finishedAt, null);
  assert.equal(job.telegramMessageId, null);
  assert.equal(job.attempts, 1);
  assert.match(job.payload.text, /Tài khoản mới/u);
  assert.equal((await registrationQueueHealth(db)).pending[0].lastError, "registration_delivery_failed");
});

test("notification time uses Vietnam timezone and user-controlled markup stays plain text", () => {
  const text = registrationNotificationText({ id: "unused", displayName: "<b>New</b>\n✅ fake", email: "new@example.test",
    createdAt: new Date("2026-10-09T01:02:03Z"), emailVerifiedAt: null }, "email");
  assert.match(text, /08:02:03/u);
  assert.match(text, /9\/10\/2026/u);
  assert.match(text, /<b>New<\/b> ✅ fake/u);
});
