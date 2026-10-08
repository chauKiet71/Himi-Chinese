import type { Database } from "../db/index.ts";
import { and, asc, eq, isNull, lte } from "drizzle-orm";
import { registrationNotificationJobs as jobs, type users } from "../db/schema.ts";
import { retryDelay } from "./support-domain.ts";
import { telegramCall, TelegramError, type TelegramCall } from "./support-telegram.ts";

type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];
type NewUser = Pick<typeof users.$inferSelect, "id" | "displayName" | "email" | "createdAt" | "emailVerifiedAt">;
type RegistrationMethod = "email" | "google";

export function registrationChatId() {
  return process.env.TELEGRAM_REGISTRATION_CHAT_ID?.trim()
    || process.env.TELEGRAM_PAYMENT_CHAT_ID?.trim()
    || process.env.TELEGRAM_ADMIN_CHAT_ID?.trim()
    || null;
}

export function registrationNotificationText(user: NewUser, method: RegistrationMethod) {
  const time = user.createdAt.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour12: false });
  // Plain text: names and emails supplied by learners must never become markup.
  const line = (value: string) => value.replace(/[\r\n\t]/gu, " ");
  return [
    "🎉 HIMI · Tài khoản mới",
    "",
    `👤 Tên: ${line(user.displayName?.slice(0, 120) || user.email)}`,
    `📧 Email: ${line(user.email.slice(0, 255))}`,
    `⏰ Thời gian: ${time} (giờ Việt Nam)`,
    `📝 Đăng ký bằng: ${method === "google" ? "Google" : "Email"}`,
    `✅ Xác minh email: ${user.emailVerifiedAt ? "Đã xác minh" : "Chưa xác minh"}`,
  ].join("\n");
}

export async function enqueueRegistrationNotification(tx: Transaction, user: NewUser, method: RegistrationMethod) {
  // Persist in the same transaction as the new account, without calling Telegram in auth.
  await tx.insert(jobs).values({
    userId: user.id,
    payload: { chatId: registrationChatId(), text: registrationNotificationText(user, method) },
  }).onConflictDoNothing({ target: jobs.userId });
}

export async function sendRegistrationNotification(payload: Record<string, unknown>, call: TelegramCall = telegramCall) {
  const chatId = payload.chatId ?? registrationChatId();
  if (typeof chatId !== "string" || !/^-?[1-9]\d*$/u.test(chatId)) throw new Error("registration_telegram_chat_not_configured");
  if (typeof payload.text !== "string" || !payload.text) throw new Error("registration_telegram_message_invalid");
  return call("sendMessage", { chat_id: chatId, text: payload.text });
}

export async function processRegistrationNotification(db: Database, call: TelegramCall = telegramCall) {
  return db.transaction(async (tx) => {
    const [job] = await tx.select().from(jobs).where(and(isNull(jobs.finishedAt), lte(jobs.availableAt, new Date())))
      .orderBy(asc(jobs.availableAt), asc(jobs.createdAt)).limit(1).for("update", { skipLocked: true });
    if (!job) return false;
    try {
      await tx.transaction(async (inner) => {
        const sent = await sendRegistrationNotification(job.payload, call);
        if (!Number.isSafeInteger(sent.message_id) || Number(sent.message_id) <= 0) throw new Error("telegram_missing_message_id");
        await inner.update(jobs).set({ finishedAt: new Date(), telegramMessageId: Number(sent.message_id),
          lastError: null, payload: {} }).where(eq(jobs.id, job.id));
      });
    } catch (error) {
      const delay = Math.max(retryDelay(job.attempts + 1), error instanceof TelegramError ? error.retryAfter : 0);
      const lastError = error instanceof TelegramError ? error.message : "registration_delivery_failed";
      await tx.update(jobs).set({ attempts: job.attempts + 1, availableAt: new Date(Date.now() + delay), lastError })
        .where(eq(jobs.id, job.id));
      console.warn("[registration] delivery retry", { jobId: job.id, attempt: job.attempts + 1, error: lastError });
    }
    return true;
  });
}

export async function registrationQueueHealth(db: Database) {
  const pending = await db.select({ id: jobs.id, attempts: jobs.attempts, createdAt: jobs.createdAt,
    availableAt: jobs.availableAt, lastError: jobs.lastError }).from(jobs).where(isNull(jobs.finishedAt))
    .orderBy(asc(jobs.createdAt));
  return { pendingCount: pending.length, pending };
}
