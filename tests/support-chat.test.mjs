import test, { before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema.ts";
import { submitSupportMessage, getSupportConversation, acceptTelegramUpdate, consumeSupportLimit, ownedSupportImage, SUPPORT_AUTOMATIC_REPLIES } from "../lib/support-service.ts";
import { processSupportJob, processSupportReminder } from "../lib/support-worker.ts";
import { hiddenAfterCompletion, validateSupportInput, parseSupportCallback, retryDelay } from "../lib/support-domain.ts";
import { notificationText, supportKeyboard, authorizedTelegramUpdate, verifyTelegramSecret, validTelegramUpdate, telegramGroupIdCommand, TelegramError } from "../lib/support-telegram.ts";
import { imageMime, supportImageDeliveryUrl } from "../lib/support-storage.ts";

const user = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const other = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const config = { chatId: "-100123456", admins: ["111", "222"] };
let client, db, calls, nextMessageId, sequence;
let io;
before(async () => {
  client = new PGlite();
  db = drizzle(client, { schema });
  await client.exec("CREATE TABLE users(id uuid PRIMARY KEY); CREATE TABLE auth_rate_limits(action varchar(50), key_hash varchar(64), attempts integer NOT NULL DEFAULT 0, window_started_at timestamptz NOT NULL DEFAULT now(), blocked_until timestamptz, updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(action,key_hash));");
  await client.exec(await readFile(new URL("../drizzle/0018_support_telegram.sql", import.meta.url), "utf8"));
  await client.exec(await readFile(new URL("../drizzle/0019_support_reminder_retry.sql", import.meta.url), "utf8"));
  await client.query("INSERT INTO users VALUES ($1), ($2)", [user, other]);
});
after(async () => { await client?.close(); });
beforeEach(async () => {
  await client.exec("TRUNCATE support_messages, support_images, support_jobs, support_reply_sessions, support_telegram_updates, support_conversations, auth_rate_limits CASCADE");
  calls = []; nextMessageId = 100; sequence = 0;
  io = {
    call: async (method, parameters, photo) => { calls.push({ method, parameters, photo }); return { message_id: ++nextMessageId }; },
    readImage: async () => new Uint8Array([255, 216, 255, 1]),
    importPhoto: async (_file, publicId) => publicId,
  };
});
const input = (overrides = {}) => ({ requestId: crypto.randomUUID(), userName: "Học viên thử nghiệm", userEmail: "learner@example.test", content: "Cần hỗ trợ <b>HSK</b>", ...overrides });
const create = (value = input()) => submitSupportMessage(db, user, value, config.chatId);
async function row(id) { return (await db.select().from(schema.supportConversations).where(eq(schema.supportConversations.id, id)))[0]; }
async function drain() { for (let i = 0; i < 30 && await processSupportJob(db, io); i++); }
function callback(c, action = "reply", admin = 111, messageId = c.telegramNotificationMessageId) {
  return { update_id: ++sequence, callback_query: { id: String(sequence), from: { id: admin },
    data: "support_" + action + ":" + c.id + ":" + c.generation,
    message: { message_id: messageId, chat: { id: Number(config.chatId) } } } };
}
async function claimed() {
  const created = await create(); await drain(); const c = await row(created.conversationId);
  await acceptTelegramUpdate(db, callback(c), config); await drain();
  return row(c.id);
}
function reply(promptId, text = "Đây là phản hồi từ nhân viên.", admin = 111, photo) {
  return { update_id: ++sequence, message: { message_id: ++nextMessageId, chat: { id: Number(config.chatId) },
    from: { id: admin }, reply_to_message: { message_id: promptId }, ...(photo ? { photo, caption: text } : { text }) } };
}

test("create commits conversation, user message and outbox before any Telegram call; duplicate create is idempotent", async () => {
  const value = input();
  const [a, b] = await Promise.all([create(value), create(value)]);
  assert.equal(a.conversationId, b.conversationId);
  const c = await row(a.conversationId);
  assert.equal(c.status, "OPEN"); assert.equal(c.userId, user);
  assert.ok(Math.abs(c.nextReminderAt.getTime() - c.createdAt.getTime() - 30_000) < 1000);
  const persistedMessages = await db.select().from(schema.supportMessages);
  assert.equal(persistedMessages.filter(m => m.senderType === "USER").length, 1);
  assert.equal(persistedMessages.filter(m => m.senderType === "SYSTEM").length, 1);
  assert.equal((await db.select().from(schema.supportJobs)).length, 1);
  assert.equal(calls.length, 0);
});

test("the bot automatically replies to only the first two user messages", async () => {
  const created = await create(input({ content: "Xin chào" }));
  let detail = await getSupportConversation(db, user, created.conversationId);
  assert.deepEqual(detail.messages.map(m => [m.senderType, m.content]), [
    ["USER", "Xin chào"],
    ["SYSTEM", SUPPORT_AUTOMATIC_REPLIES[0]],
  ]);

  await submitSupportMessage(db, user, input({ content: "Tôi cần hỗ trợ" }), config.chatId, created.conversationId);
  detail = await getSupportConversation(db, user, created.conversationId);
  assert.deepEqual(detail.messages.slice(-2).map(m => [m.senderType, m.content]), [
    ["USER", "Tôi cần hỗ trợ"],
    ["SYSTEM", SUPPORT_AUTOMATIC_REPLIES[1]],
  ]);

  await submitSupportMessage(db, user, input({ content: "Thông tin bổ sung" }), config.chatId, created.conversationId);
  detail = await getSupportConversation(db, user, created.conversationId);
  assert.equal(detail.messages.filter(m => m.senderType === "SYSTEM").length, 2);
  assert.equal(detail.messages.at(-1).content, "Thông tin bổ sung");
});

test("an existing conversation moves to a newly configured Telegram chat", async () => {
  const oldChatId = "-100999999999";
  const created = await submitSupportMessage(db, user, input({ content: "Tin ở kênh cũ" }), oldChatId);
  await drain();
  const before = await row(created.conversationId);
  assert.equal(before.telegramChatId, oldChatId);
  assert.ok(before.telegramNotificationMessageId);

  calls = [];
  await submitSupportMessage(db, user, input({ content: "Tin sau khi đổi nhóm" }), config.chatId, created.conversationId);
  const moved = await row(created.conversationId);
  assert.equal(moved.telegramChatId, config.chatId);
  assert.equal(moved.generation, before.generation + 1);
  assert.equal(moved.telegramNotificationMessageId, null);
  assert.equal(moved.telegramReminderMessageId, null);
  assert.equal((await db.select().from(schema.supportReplySessions)).length, 0);

  await drain();
  const notification = calls.find(call => call.method === "sendMessage" && call.parameters.text.includes("Tin sau khi đổi nhóm"));
  assert.equal(String(notification.parameters.chat_id), config.chatId);
  assert.equal(notification.parameters.reply_parameters, undefined);
  assert.deepEqual(notification.parameters.reply_markup, supportKeyboard(moved.id, moved.generation));
});
test("text and private photo are delivered with actions for the current conversation generation", async () => {
  const imageId = crypto.randomUUID();
  await db.insert(schema.supportImages).values({ id: imageId, ownerId: user, publicId: "private-test-image" });
  const created = await create(input({ imageId })); await drain();
  const c = await row(created.conversationId);
  const text = calls.find(c => c.method === "sendMessage");
  assert.equal(text.parameters.text, notificationText(c, "Cần hỗ trợ <b>HSK</b>"));
  assert.ok(!text.parameters.text.includes(c.id));
  assert.equal(text.parameters.parse_mode, undefined);
  assert.deepEqual(text.parameters.reply_markup, supportKeyboard(c.id, c.generation));
  for (const button of supportKeyboard(c.id, c.generation).inline_keyboard[0]) {
    assert.ok(Buffer.byteLength(button.callback_data) <= 64);
    assert.ok(!button.callback_data.includes("@")); assert.ok(parseSupportCallback(button.callback_data));
  }
  const photo = calls.find(c => c.method === "sendPhoto");
  assert.ok(photo.photo instanceof Uint8Array);
  assert.ok(!photo.parameters.caption.includes(c.id));
  assert.equal(photo.parameters.reply_parameters.message_id, c.telegramNotificationMessageId);
  assert.deepEqual(photo.parameters.reply_markup, supportKeyboard(c.id, c.generation));
  const data = await getSupportConversation(db, user, c.id);
  assert.equal(data.messages[0].imageUrl, "/api/support/images/" + imageId);
});
test("reminder does not run before 30 seconds; repeats at 30-second deadlines using the same Telegram message", async () => {
  const created = await create(); await drain(); let c = await row(created.conversationId);
  assert.equal(await processSupportReminder(db, io, new Date(c.nextReminderAt.getTime() - 1)), false);
  const due = c.nextReminderAt;
  assert.equal(await processSupportReminder(db, io, due), true);
  c = await row(c.id); assert.equal(c.reminderCount, 1); const reminderId = c.telegramReminderMessageId;
  assert.equal(c.nextReminderAt.getTime(), due.getTime() + 30_000);
  assert.equal(await processSupportReminder(db, io, c.nextReminderAt), true);
  c = await row(c.id); assert.equal(c.reminderCount, 2); assert.equal(c.telegramReminderMessageId, reminderId);
  assert.equal(calls.at(-1).method, "editMessageText"); assert.match(calls.at(-1).parameters.text, /https:\/\/t.me\/c\//);
  assert.ok(!calls.at(-1).parameters.text.includes(c.id));
  assert.deepEqual(calls.at(-1).parameters.reply_markup, supportKeyboard(c.id, c.generation));
  await acceptTelegramUpdate(db, callback(c, "reply", 111, reminderId), config); await drain();
  const prompt = calls.find(call => call.method === "sendMessage" && call.parameters.reply_markup?.force_reply);
  assert.equal(prompt.parameters.reply_parameters.message_id, c.telegramNotificationMessageId);
});
test("every user notification has working actions and Reply targets the clicked Telegram message", async () => {
  const created = await create(); await drain();
  let c = await row(created.conversationId);
  await submitSupportMessage(db, user, input({ content: "Tin nhắn thứ hai" }), config.chatId, c.id);
  await drain(); c = await row(c.id);
  const userMessages = (await db.select().from(schema.supportMessages)).filter(m => m.senderType === "USER");
  const second = userMessages.find(m => m.content === "Tin nhắn thứ hai");
  assert.ok(second.telegramMessageId);
  const notification = calls.find(call => call.method === "sendMessage" && call.parameters.text.includes("Tin nhắn thứ hai"));
  assert.deepEqual(notification.parameters.reply_markup, supportKeyboard(c.id, c.generation));
  const result = await acceptTelegramUpdate(db, callback(c, "reply", 111, second.telegramMessageId), config);
  assert.match(result, /Bạn đã tiếp nhận/);
  await drain();
  const prompt = calls.find(call => call.method === "sendMessage" && call.parameters.reply_markup?.force_reply);
  assert.equal(prompt.parameters.reply_parameters.message_id, second.telegramMessageId);
});
test("two simultaneous admin claims retain exactly one owner and stop reminders", async () => {
  const created = await create(); await drain(); let c = await row(created.conversationId);
  const results = await Promise.all([acceptTelegramUpdate(db, callback(c, "reply", 111), config), acceptTelegramUpdate(db, callback(c, "reply", 222), config)]);
  assert.equal(results.filter(x => x.includes("Bạn đã tiếp nhận")).length, 1);
  c = await row(c.id); assert.equal(c.status, "CLAIMED"); assert.ok(c.claimedAt); assert.equal(c.nextReminderAt, null);
  assert.equal(await processSupportReminder(db, io, new Date(Date.now() + 120_000)), false);
  assert.equal((await db.select().from(schema.supportJobs)).filter(j => j.kind === "prompt").length, 1);
});
test("ForceReply mapping routes to exact conversation, not last active conversation; duplicate update produces one reply", async () => {
  const a = await claimed(); const b = await claimed();
  const sessions = await db.select().from(schema.supportReplySessions);
  const target = sessions.find(s => s.conversationId === a.id);
  const update = reply(target.promptMessageId);
  assert.equal(validTelegramUpdate(update), true);
  await Promise.all([acceptTelegramUpdate(db, update, config), acceptTelegramUpdate(db, update, config)]);
  await drain();
  assert.equal((await row(a.id)).status, "WAITING_USER"); assert.equal((await row(b.id)).status, "CLAIMED");
  const messages = await db.select().from(schema.supportMessages);
  assert.equal(messages.filter(m => m.senderType === "ADMIN").length, 1);
  assert.equal(messages.find(m => m.senderType === "ADMIN").conversationId, a.id);
  const receipt = calls.find(call => call.method === "sendMessage" && call.parameters.text.startsWith("Đã gửi phản hồi"));
  assert.deepEqual(receipt.parameters.reply_markup, supportKeyboard(a.id, a.generation));
});
test("admin photo and caption persist in existing storage; cross-admin reply to a prompt is not routed", async () => {
  const c = await claimed(); const [session] = await db.select().from(schema.supportReplySessions);
  await acceptTelegramUpdate(db, reply(session.promptMessageId, "Sai người", 222), config); await drain();
  assert.equal((await db.select().from(schema.supportMessages)).filter(m => m.senderType === "ADMIN").length, 0);
  await acceptTelegramUpdate(db, reply(session.promptMessageId, "Hình hướng dẫn", 111, [{ file_id: "test-photo" }]), config); await drain();
  const detail = await getSupportConversation(db, user, c.id);
  const m = detail.messages.find(m => m.senderType === "ADMIN");
  assert.equal(m.content, "Hình hướng dẫn"); assert.match(m.imageUrl, /^\/api\/support\/images\//);
  assert.equal((await db.select().from(schema.supportImages))[0].ownerId, user);
});
test("unauthorized admin/chat and wrong secret fail closed", async () => {
  const created = await create(); await drain(); const c = await row(created.conversationId);
  await assert.rejects(acceptTelegramUpdate(db, callback(c, "reply", 333), config), e => e.status === 403);
  const update = callback(c); update.callback_query.message.chat.id = -999;
  assert.equal(authorizedTelegramUpdate(update, config), false);
  assert.equal(verifyTelegramSecret("test-secret", "test-secret"), true);
  assert.equal(verifyTelegramSecret("other", "test-secret"), false);
  assert.equal(verifyTelegramSecret(null, ""), false);
  assert.equal((await row(c.id)).status, "OPEN");
});

test("an authorized admin can discover a Telegram group id without authorizing support actions there", () => {
  const command = { update_id: 1, message: { message_id: 2, chat: { id: -100987654321 }, from: { id: 111 }, text: "/groupid@HimiiaagentBot" } };
  assert.equal(telegramGroupIdCommand(command, config.admins), "-100987654321");
  assert.equal(telegramGroupIdCommand({ ...command, message: { ...command.message, from: { id: 333 } } }, config.admins), null);
  assert.equal(telegramGroupIdCommand({ ...command, message: { ...command.message, chat: { id: 123 } } }, config.admins), null);
  assert.equal(authorizedTelegramUpdate(command, config), false);
});
test("complete is idempotent, clears mappings/reminders, edits Telegram and retains history after 60 seconds/refresh", async () => {
  const c = await claimed();
  const update = callback(c, "complete");
  assert.equal(await acceptTelegramUpdate(db, update, config), "Đã xử lí");
  const first = await row(c.id);
  await acceptTelegramUpdate(db, update, config);
  await acceptTelegramUpdate(db, callback(c, "complete"), config);
  await drain();
  const completed = await row(c.id);
  assert.equal(completed.status, "COMPLETED"); assert.equal(completed.completedAt.getTime(), first.completedAt.getTime());
  assert.equal(completed.nextReminderAt, null);
  assert.equal((await db.select().from(schema.supportReplySessions)).length, 0);
  const systemMessages = (await db.select().from(schema.supportMessages)).filter(m => m.senderType === "SYSTEM");
  assert.equal(systemMessages.length, 2);
  assert.equal(systemMessages.at(-1).content, "Cảm ơn anh/chị đã dành thời gian liên hệ!");
  const fresh = await getSupportConversation(db, user, c.id);
  const completedAt = JSON.parse(JSON.stringify(fresh.conversation)).completedAt;
  assert.equal(hiddenAfterCompletion(completedAt, first.completedAt.getTime() + 59_999), false);
  assert.equal(hiddenAfterCompletion(completedAt, first.completedAt.getTime() + 60_000), true);
  assert.equal(hiddenAfterCompletion(completedAt, first.completedAt.getTime() + 120_000), true);
  assert.equal(fresh.messages.length, 3);
  assert.deepEqual(calls.at(-1).parameters.reply_markup, { inline_keyboard: [] });
  assert.equal(calls.at(-1).parameters.text, "Đã xử lí");
  for (const call of calls) {
    assert.ok(!String(call.parameters.text ?? "").includes(c.id));
    assert.ok(!String(call.parameters.caption ?? "").includes(c.id));
  }
});
test("new user message reopens COMPLETED and old Telegram callbacks cannot complete the new generation", async () => {
  const c = await claimed(); await acceptTelegramUpdate(db, callback(c, "complete"), config); await drain();
  await submitSupportMessage(db, user, input({ content: "Tôi cần hỏi thêm" }), config.chatId, c.id);
  const reopened = await row(c.id);
  assert.equal(reopened.status, "OPEN"); assert.equal(reopened.completedAt, null);
  assert.equal(reopened.claimedAt, null); assert.equal(reopened.generation, 2); assert.ok(reopened.nextReminderAt);
  await drain();
  const result = await acceptTelegramUpdate(db, callback(c, "complete"), config);
  assert.match(result, /Thông báo đã cũ/);
  assert.equal((await row(c.id)).status, "OPEN");
});
test("conversation and image ownership prevents cross-user reads and writes", async () => {
  const created = await create();
  await assert.rejects(getSupportConversation(db, other, created.conversationId), e => e.status === 404);
  await assert.rejects(submitSupportMessage(db, other, input(), config.chatId, created.conversationId), e => e.status === 404);
  const imageId = crypto.randomUUID();
  await db.insert(schema.supportImages).values({ id: imageId, ownerId: user, publicId: "private" });
  await assert.rejects(ownedSupportImage(db, other, imageId), e => e.status === 404);
  await assert.rejects(submitSupportMessage(db, other, input({ imageId }), config.chatId), e => e.status === 400);
});
test("Telegram failure does not lose committed message; durable outbox retries after simulated restart", async () => {
  const created = await create();
  const broken = { ...io, call: async () => { throw new TelegramError(429, 60_000); } };
  await processSupportJob(db, broken);
  let [job] = await db.select().from(schema.supportJobs);
  assert.equal(job.finishedAt, null); assert.equal(job.attempts, 1); assert.equal(job.lastError, "telegram_429");
  assert.ok(job.availableAt.getTime() > Date.now() + 58_000);
  assert.equal((await getSupportConversation(db, user, created.conversationId)).messages.length, 2);
  await db.update(schema.supportJobs).set({ availableAt: new Date(0) }).where(eq(schema.supportJobs.id, job.id));
  const restartedDb = drizzle(client, { schema });
  await processSupportJob(restartedDb, io);
  [job] = await db.select().from(schema.supportJobs);
  assert.ok(job.finishedAt); assert.deepEqual(job.payload, {});
});
test("duplicate callback update does not produce duplicate ForceReply sessions", async () => {
  const created = await create(); await drain(); const c = await row(created.conversationId);
  const update = callback(c);
  await acceptTelegramUpdate(db, update, config); await acceptTelegramUpdate(db, update, config); await drain();
  assert.equal((await db.select().from(schema.supportReplySessions)).length, 1);
});
test("rate limits persist across requests and validation rejects unsafe/oversized input", async () => {
  await consumeSupportLimit(db, user, "support:send", 2);
  await consumeSupportLimit(db, user, "support:send", 2);
  await assert.rejects(consumeSupportLimit(db, user, "support:send", 2), e => e.status === 429);
  assert.throws(() => validateSupportInput(input({ content: "x".repeat(3001) })));
  assert.throws(() => validateSupportInput(input({ userEmail: "invalid" })));
  assert.throws(() => validateSupportInput(input({ userName: "x\ny" })));
  assert.equal(parseSupportCallback("support_reply:not-a-uuid"), null);
  assert.equal(imageMime(new Uint8Array([255,216,255,0])), "image/jpeg");
  assert.throws(() => imageMime(new TextEncoder().encode("<svg></svg>")));
  assert.equal(supportImageDeliveryUrl("folder/image", { cloudName: "demo", apiKey: "key", apiSecret: "secret" }),
    "https://res.cloudinary.com/demo/image/authenticated/s--xrvaqxLb--/v1/folder/image");
  assert.equal(retryDelay(30), 300_000);
});
test("expired ForceReply is rejected without writing admin content", async () => {
  await claimed();
  const [session] = await db.select().from(schema.supportReplySessions);
  await db.update(schema.supportReplySessions).set({ expiresAt: new Date(0) });
  await acceptTelegramUpdate(db, reply(session.promptMessageId), config); await drain();
  assert.equal((await db.select().from(schema.supportMessages)).filter(m => m.senderType === "ADMIN").length, 0);
  assert.match(calls.at(-1).parameters.text, /hết hạn/);
});

test("reminder failures persist bounded backoff and clear after recovery", async () => {
  const created = await create(); await drain();
  let c = await row(created.conversationId); const due = c.nextReminderAt;
  await processSupportReminder(db, { ...io, call: async () => { throw new TelegramError(429, 90_000); } }, due);
  c = await row(c.id);
  assert.equal(c.reminderFailures, 1); assert.equal(c.lastReminderError, "telegram_429");
  assert.equal(c.nextReminderAt.getTime(), due.getTime() + 90_000); assert.equal(c.reminderCount, 0);
  await processSupportReminder(db, io, c.nextReminderAt);
  c = await row(c.id); assert.equal(c.reminderFailures, 0); assert.equal(c.lastReminderError, null);
});
test("history pagination preserves messages with identical timestamps", async () => {
  const created = await create();
  const time = new Date();
  await db.insert(schema.supportMessages).values(Array.from({ length: 105 }, (_, i) => ({
    conversationId: created.conversationId, senderType: "ADMIN", senderId: "111", content: "Page " + i, createdAt: time,
  })));
  const a = await getSupportConversation(db, user, created.conversationId);
  const b = await getSupportConversation(db, user, created.conversationId, a.nextBefore);
  assert.equal(a.messages.length, 100); assert.equal(b.messages.length, 7);
  assert.equal(new Set([...a.messages, ...b.messages].map(m => m.id)).size, 107);
});
test("a reused idempotency key with a changed message is rejected", async () => {
  const value = input(); await create(value);
  await assert.rejects(create({ ...value, content: "Different content" }), e => e.status === 409);
});
test("two concurrent workers do not deliver the same queued notification twice", async () => {
  await create();
  await Promise.all([processSupportJob(db, io), processSupportJob(db, io)]);
  assert.equal(calls.filter(c => c.method === "sendMessage").length, 1);
});
