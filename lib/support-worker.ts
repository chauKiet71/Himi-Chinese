import { and, asc, eq, isNull, lte, sql } from "drizzle-orm";
import type { Database } from "../db/index.ts";
import { supportConversations as conversations, supportMessages as messages, supportImages as images,
  supportJobs as jobs, supportReplySessions as sessions } from "../db/schema.ts";
import { reminderDue, retryDelay, SUPPORT_REMINDER_MS } from "./support-domain.ts";
import { enqueue, latestTelegramAdminReply, type SupportConversation, type SupportTx } from "./support-service.ts";
import { importTelegramPhoto, readSupportImage } from "./support-storage.ts";
import { authorizedTelegramUpdate, notificationText, SUPPORT_NOTIFICATION_TITLE, SUPPORT_REPLY_RECEIPT_TEXT, supportKeyboard, telegramCall, telegramMemberDisplayName, TelegramError, type TelegramCall, type TelegramUpdate } from "./support-telegram.ts";
import { sendSepayNotification } from "./sepay-telegram.ts";

export type SupportTransport = {
  call: TelegramCall;
  readImage: typeof readSupportImage;
  importPhoto: typeof importTelegramPhoto;
};
const transport: SupportTransport = { call: telegramCall, readImage: readSupportImage, importPhoto: importTelegramPhoto };
type Job = typeof jobs.$inferSelect;
function messageId(result: Record<string, unknown>) {
  if (!Number.isSafeInteger(result.message_id)) throw new Error("telegram_missing_message_id");
  return Number(result.message_id);
}

async function processJob(tx: SupportTx, job: Job, io: SupportTransport) {
  if (job.kind === "sepay-notify") {
    await sendSepayNotification(job.payload, io.call);
    return;
  }
  if (job.kind === "admin-reply") {
    const u = job.payload.update as TelegramUpdate;
    const m = u.message!; const adminId = String(m.from!.id); const chatId = String(m.chat.id);
    const [mapping] = await tx.select().from(sessions).where(and(eq(sessions.telegramChatId, chatId),
      eq(sessions.telegramAdminUserId, adminId), eq(sessions.promptMessageId, m.reply_to_message!.message_id)));
    const [c] = mapping ? await tx.select().from(conversations).where(eq(conversations.id, mapping.conversationId)).for("update") : [];
    if (!mapping || mapping.expiresAt <= new Date() || !c || c.status === "COMPLETED" || c.claimedByTelegramUserId !== adminId) {
      await enqueue(tx, "receipt", `receipt:${u.update_id}`, null, { chatId, text: "Không gửi phản hồi: phiên trả lời đã hết hạn hoặc không thuộc bạn. Hãy bấm Trả lời ở yêu cầu cần xử lý." });
      return;
    }
    if (!await authorizedTelegramUpdate(u, { chatId: c.telegramChatId }, io.call)) {
      await enqueue(tx, "receipt", `receipt:${u.update_id}`, null, { chatId,
        text: "Không gửi phản hồi: người phụ trách không còn là thành viên của nhóm hỗ trợ." });
      return;
    }
    let imageId: string | null = null;
    if (m.photo?.length) {
      const photo = m.photo[m.photo.length - 1];
      if ((photo.file_size ?? 0) > 5 * 1024 * 1024) {
        await enqueue(tx, "receipt", `receipt:${u.update_id}`, null, { chatId, text: "Ảnh quá 5 MB. Vui lòng gửi ảnh nhỏ hơn." });
        return;
      }
      imageId = crypto.randomUUID();
      // Stable Cloudinary object key makes upload retries overwrite the same private object.
      const publicId = await io.importPhoto(photo.file_id, `hanziwork/support/${c.userId}/telegram-${u.update_id}`);
      await tx.insert(images).values({ id: imageId, ownerId: c.userId, publicId });
    }
    await tx.insert(messages).values({ conversationId: c.id, senderType: "ADMIN", senderId: adminId,
      content: m.text ?? m.caption ?? "", imageId, imageUrl: imageId ? `/api/support/images/${imageId}` : null, telegramMessageId: m.message_id });
    await tx.update(conversations).set({ status: "WAITING_USER", nextReminderAt: null, updatedAt: new Date() }).where(eq(conversations.id, c.id));
    await enqueue(tx, "receipt", `receipt:${u.update_id}`, c.id, {
      chatId, text: SUPPORT_REPLY_RECEIPT_TEXT, generation: c.generation,
    });
    return;
  }
  if (job.kind === "receipt") {
    const [receiptConversation] = job.conversationId
      ? await tx.select().from(conversations).where(eq(conversations.id, job.conversationId)) : [];
    const actionable = receiptConversation && receiptConversation.status !== "COMPLETED" &&
      receiptConversation.generation === job.payload.generation;
    await io.call("sendMessage", { chat_id: job.payload.chatId, text: job.payload.text,
      ...(actionable ? { reply_markup: supportKeyboard(receiptConversation.id, receiptConversation.generation) } : {}),
    });
    return;
  }
  const [c] = job.conversationId ? await tx.select().from(conversations).where(eq(conversations.id, job.conversationId)).for("update") : [];
  if (!c || c.generation !== job.payload.generation) return;
  const base = { chat_id: c.telegramChatId };
  if (job.kind === "notify") {
    const [m] = await tx.select().from(messages).where(eq(messages.id, String(job.payload.messageId)));
    if (!m) return;
    const primary = !c.telegramNotificationMessageId;
    // Preserve the reply target selected when the learner sent the message. Older web versions omit it.
    const replyId = "replyToMessageId" in job.payload ? job.payload.replyToMessageId : await latestTelegramAdminReply(tx, c, m.createdAt);
    const followup = !primary && Number.isSafeInteger(replyId) && Number(replyId) > 0;
    const result = await io.call("sendMessage", { ...base, text: notificationText(c, m.content, followup),
      ...(!followup ? { entities: [{ type: "bold", offset: 0, length: SUPPORT_NOTIFICATION_TITLE.length }] } : {}),
      reply_markup: c.status === "COMPLETED" ? { inline_keyboard: [] } : supportKeyboard(c.id, c.generation),
      ...(!primary ? { reply_parameters: { message_id: followup ? replyId : c.telegramNotificationMessageId, allow_sending_without_reply: true } } : {}),
    });
    const id = messageId(result);
    await tx.update(messages).set({ telegramMessageId: id }).where(eq(messages.id, m.id));
    if (primary) await tx.update(conversations).set({ telegramNotificationMessageId: id }).where(eq(conversations.id, c.id));
    return;
  }
  if (job.kind === "photo") {
    const [m] = await tx.select().from(messages).where(eq(messages.id, String(job.payload.messageId)));
    if (!m?.imageId) return;
    if (!m.telegramMessageId) throw new Error("awaiting_notification");
    const [image] = await tx.select().from(images).where(eq(images.id, m.imageId));
    await io.call("sendPhoto", { ...base, caption: "Ảnh đính kèm",
      reply_parameters: { message_id: m.telegramMessageId, allow_sending_without_reply: true },
      reply_markup: c.status === "COMPLETED" ? { inline_keyboard: [] } : supportKeyboard(c.id, c.generation),
    }, await io.readImage(image.publicId));
    return;
  }
  if (job.kind === "prompt") {
    if (c.status === "COMPLETED" || c.claimedByTelegramUserId !== job.payload.adminId) return;
    const savedName = typeof job.payload.adminName === "string" ? job.payload.adminName.trim() : "";
    // Older webhook versions queued only the actor ID; resolve that person's profile in the worker.
    const adminName = savedName || await telegramMemberDisplayName(c.telegramChatId, String(job.payload.adminId), io.call);
    const adminLabel = adminName ? `Admin ${adminName}` : "Nhân viên hỗ trợ";
    const result = await io.call("sendMessage", { ...base,
      text: `${adminLabel}: Nhập phản hồi cho học viên. Hãy Reply trực tiếp vào tin nhắn này (hiệu lực 24 giờ).`,
      reply_markup: { force_reply: true, input_field_placeholder: "Nhập phản hồi cho học viên…" },
      ...(Number.isSafeInteger(job.payload.sourceMessageId) ? {
        reply_parameters: { message_id: job.payload.sourceMessageId, allow_sending_without_reply: true },
      } : {}),
    });
    await tx.insert(sessions).values({ telegramChatId: c.telegramChatId, telegramAdminUserId: String(job.payload.adminId),
      promptMessageId: messageId(result), conversationId: c.id, expiresAt: new Date(Date.now() + 86_400_000) });
    if (c.telegramReminderMessageId) await enqueue(tx, "claimed-reminder", `claimed-reminder:${job.id}`, c.id, { generation: c.generation });
    return;
  }
  if (job.kind === "claimed-reminder") {
    if (c.status === "COMPLETED" || !c.telegramReminderMessageId) return;
    await io.call("editMessageText", { ...base, message_id: c.telegramReminderMessageId,
      text: `Admin ${c.claimedByTelegramUserId} đã tiếp nhận. Đã dừng nhắc.`,
      reply_markup: supportKeyboard(c.id, c.generation) });
    return;
  }
  if (job.kind === "complete") {
    if (c.status !== "COMPLETED") return;
    const receiptId = job.payload.receiptMessageId;
    if (Number.isSafeInteger(receiptId) && Number(receiptId) > 0 &&
      receiptId !== c.telegramNotificationMessageId && receiptId !== c.telegramReminderMessageId) {
      // deleteMessages skips already-missing messages, so a retry can continue after deletion succeeded.
      await io.call("deleteMessages", { ...base, message_ids: [receiptId] });
    }
    for (const id of [c.telegramNotificationMessageId, c.telegramReminderMessageId]) {
      if (id) await io.call("editMessageReplyMarkup", { ...base, message_id: id,
        reply_markup: { inline_keyboard: [] } });
    }
    await io.call("sendMessage", { ...base, text: "Đã xử lí" });
    return;
  }
  throw new Error("unknown_support_job");
}

export async function processSupportJob(db: Database, io: SupportTransport = transport, kind?: string) {
  return db.transaction(async tx => {
    const [job] = await tx.select().from(jobs).where(and(isNull(jobs.finishedAt), lte(jobs.availableAt, new Date()),
      ...(kind ? [eq(jobs.kind, kind)] : [])))
      .orderBy(asc(jobs.availableAt), asc(jobs.createdAt)).limit(1).for("update", { skipLocked: true });
    if (!job) return false;
    try {
      // A savepoint rolls back local effects on failure, preserving the durable job for retry.
      await tx.transaction(inner => processJob(inner, job, io));
      await tx.update(jobs).set({ finishedAt: new Date(), lastError: null, payload: {} }).where(eq(jobs.id, job.id));
    } catch (error) {
      const delay = Math.max(retryDelay(job.attempts + 1), error instanceof TelegramError ? error.retryAfter : 0);
      await tx.update(jobs).set({ attempts: job.attempts + 1, availableAt: new Date(Date.now() + delay),
        lastError: error instanceof TelegramError ? error.message : "support_delivery_failed" }).where(eq(jobs.id, job.id));
      console.warn("[support] delivery retry", { jobId: job.id, kind: job.kind, attempt: job.attempts + 1,
        error: error instanceof TelegramError ? error.message : "support_delivery_failed" });
    }
    return true;
  });
}

export function reminderText(c: SupportConversation, count: number) {
  const link = c.telegramChatId.startsWith("-100") && c.telegramNotificationMessageId
    ? `\nhttps://t.me/c/${c.telegramChatId.slice(4)}/${c.telegramNotificationMessageId}` : "";
  return `⏰ Nhắc lần ${count}: yêu cầu đang chờ tiếp nhận.\nBấm Trả lời tại thông báo gốc.${link}`;
}
export async function processSupportReminder(db: Database, io: SupportTransport = transport, now = new Date()) {
  return db.transaction(async tx => {
    // Keep this row lock through the external edit/send. Claim and completion use the same lock.
    const [c] = await tx.select().from(conversations).where(and(eq(conversations.status, "OPEN"),
      isNull(conversations.claimedAt), lte(conversations.nextReminderAt, now)))
      .orderBy(asc(conversations.nextReminderAt)).limit(1).for("update", { skipLocked: true });
    if (!c || !reminderDue(c, now)) return false;
    if (!c.telegramNotificationMessageId) {
      await tx.update(conversations).set({ nextReminderAt: new Date(now.getTime() + SUPPORT_REMINDER_MS) }).where(eq(conversations.id, c.id));
      return true;
    }
    try {
      const count = c.reminderCount + 1;
      const result = await io.call(c.telegramReminderMessageId ? "editMessageText" : "sendMessage", {
        chat_id: c.telegramChatId, text: reminderText(c, count),
        reply_markup: supportKeyboard(c.id, c.generation),
        ...(c.telegramReminderMessageId ? { message_id: c.telegramReminderMessageId } :
          { reply_parameters: { message_id: c.telegramNotificationMessageId, allow_sending_without_reply: true } }),
      });
      await tx.update(conversations).set({ reminderCount: count, reminderFailures: 0, lastReminderError: null,
        telegramReminderMessageId: c.telegramReminderMessageId ?? messageId(result),
        nextReminderAt: new Date(now.getTime() + SUPPORT_REMINDER_MS) }).where(eq(conversations.id, c.id));
    } catch (error) {
      await tx.update(conversations).set({ reminderFailures: c.reminderFailures + 1,
        lastReminderError: error instanceof TelegramError ? error.message : "reminder_delivery_failed",
        nextReminderAt: new Date(now.getTime() + Math.max(SUPPORT_REMINDER_MS, retryDelay(c.reminderFailures + 5),
        error instanceof TelegramError ? error.retryAfter : 0)) }).where(eq(conversations.id, c.id));
      console.warn("[support] reminder retry", { conversationId: c.id });
    }
    return true;
  });
}

export async function cleanSupportReplySessions(db: Database) {
  await db.delete(sessions).where(lte(sessions.expiresAt, new Date()));
  // Completed jobs retain only non-sensitive operational metadata; update IDs remain for deduplication.
  await db.delete(jobs).where(and(sql`${jobs.finishedAt} is not null`, lte(jobs.finishedAt, new Date(Date.now() - 30 * 86_400_000))));
}
