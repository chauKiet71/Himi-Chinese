import { and, asc, desc, eq, gt, isNull, sql } from "drizzle-orm";
import type { Database } from "../db/index.ts";
import { authRateLimits, supportConversations as conversations, supportMessages as messages, supportImages as images,
  supportJobs as jobs, supportReplySessions as sessions, supportTelegramUpdates as updates, users } from "../db/schema.ts";
import { parseSupportCallback, requireUuid, SUPPORT_REMINDER_MS, SupportError, validateSupportInput } from "./support-domain.ts";
import { authorizedTelegramUpdate, SUPPORT_REPLY_RECEIPT_TEXT, telegramCall, telegramUserDisplayName, type TelegramCall, type TelegramUpdate } from "./support-telegram.ts";

export type SupportTx = Parameters<Parameters<Database["transaction"]>[0]>[0];
export type SupportConversation = typeof conversations.$inferSelect;
export type SupportMessage = typeof messages.$inferSelect;
export const SUPPORT_AUTOMATIC_REPLIES = [
  "Himi có thể giúp gì cho Anh/Chị ạ!",
  "Himi đã tiếp nhận thông tin và đang kết nối với nhân viên hỗ trợ, Anh/chị vui lòng chờ trong giây lát.",
] as const;
export async function enqueue(tx: SupportTx, kind: string, dedupeKey: string, conversationId: string | null, payload: Record<string, unknown> = {}) {
  await tx.insert(jobs).values({ kind, dedupeKey, conversationId, payload }).onConflictDoNothing();
}
export async function consumeSupportLimit(db: Database, userId: string, action = "support:send", limit = 10) {
  // A durable, atomic per-account bucket. No email/IP is stored in the key.
  const [row] = await db.insert(authRateLimits).values({ action, keyHash: userId, attempts: 1 }).onConflictDoUpdate({
    target: [authRateLimits.action, authRateLimits.keyHash], set: {
      attempts: sql`case when ${authRateLimits.windowStartedAt} < now() - interval '1 minute' then 1 else ${authRateLimits.attempts} + 1 end`,
      windowStartedAt: sql`case when ${authRateLimits.windowStartedAt} < now() - interval '1 minute' then now() else ${authRateLimits.windowStartedAt} end`,
      updatedAt: new Date(),
    },
  }).returning();
  if (row.attempts > limit) throw new SupportError("Bạn thao tác quá nhanh. Hãy thử lại sau một phút.", 429);
}
export async function submitSupportMessage(db: Database, userId: string, value: unknown, chatId: string, conversationId?: string) {
  const input = validateSupportInput(value);
  if (conversationId) requireUuid(conversationId);
  return db.transaction(async tx => {
    // Serialize account mutations, including retries of the initial create request.
    await tx.select({ id: users.id }).from(users).where(eq(users.id, userId)).for("update");
    const [duplicate] = await tx.select().from(messages).where(and(eq(messages.senderId, userId), eq(messages.requestId, input.requestId)));
    if (duplicate) {
      if (conversationId && duplicate.conversationId !== conversationId) throw new SupportError("Mã gửi đã được sử dụng.", 409);
      if (duplicate.content !== input.content || duplicate.imageId !== input.imageId) throw new SupportError("Mã gửi đã được dùng cho nội dung khác.", 409);
      return { conversationId: duplicate.conversationId, messageId: duplicate.id };
    }
    let image: typeof images.$inferSelect | undefined;
    if (input.imageId) {
      [image] = await tx.select().from(images).where(and(eq(images.id, input.imageId), eq(images.ownerId, userId)));
      if (!image) throw new SupportError("Không tìm thấy ảnh của bạn.", 400);
    }
    let c: SupportConversation;
    const now = new Date();
    if (conversationId) {
      const [existing] = await tx.select().from(conversations).where(and(eq(conversations.id, conversationId), eq(conversations.userId, userId))).for("update");
      if (!existing) throw new SupportError("Không tìm thấy hội thoại.", 404);
      c = existing;
      const reopen = c.status === "COMPLETED";
      const telegramChatChanged = c.telegramChatId !== chatId;
      [c] = await tx.update(conversations).set({
        updatedAt: now, userName: input.userName, userEmail: input.userEmail, telegramChatId: chatId,
        status: reopen ? "OPEN" : c.claimedAt ? "CLAIMED" : "OPEN",
        ...(telegramChatChanged || reopen ? {
          telegramNotificationMessageId: null, telegramReminderMessageId: null, generation: c.generation + 1,
        } : {}),
        ...(telegramChatChanged && !reopen && c.status === "OPEN" && !c.claimedAt ? {
          nextReminderAt: new Date(now.getTime() + SUPPORT_REMINDER_MS), reminderCount: 0,
          reminderFailures: 0, lastReminderError: null,
        } : {}),
        ...(reopen ? { completedAt: null, completedBy: null, claimedAt: null, claimedByTelegramUserId: null,
          nextReminderAt: new Date(now.getTime() + SUPPORT_REMINDER_MS), reminderCount: 0, reminderFailures: 0, lastReminderError: null,
        } : {}),
      }).where(eq(conversations.id, c.id)).returning();
      if (telegramChatChanged) await tx.delete(sessions).where(eq(sessions.conversationId, c.id));
    } else {
      [c] = await tx.insert(conversations).values({ userId, userName: input.userName, userEmail: input.userEmail,
        telegramChatId: chatId, nextReminderAt: new Date(now.getTime() + SUPPORT_REMINDER_MS) }).returning();
    }
    const [{ count: previousUserMessageCount }] = await tx.select({ count: sql<number>`count(*)::int` }).from(messages)
      .where(and(eq(messages.conversationId, c.id), eq(messages.senderType, "USER")));
    const [message] = await tx.insert(messages).values({ conversationId: c.id, senderType: "USER", senderId: userId,
      content: input.content, requestId: input.requestId, imageId: image?.id,
      imageUrl: image ? `/api/support/images/${image.id}` : null, createdAt: now }).returning();
    const automaticReply = SUPPORT_AUTOMATIC_REPLIES[previousUserMessageCount];
    if (automaticReply) await tx.insert(messages).values({
      conversationId: c.id,
      senderType: "SYSTEM",
      senderId: "himi-support-bot",
      content: automaticReply,
      createdAt: new Date(now.getTime() + 1),
    });
    await enqueue(tx, "notify", `notify:${message.id}`, c.id, { messageId: message.id, generation: c.generation });
    if (image) await enqueue(tx, "photo", `photo:${message.id}`, c.id, { messageId: message.id, generation: c.generation });
    return { conversationId: c.id, messageId: message.id };
  });
}
export async function getSupportConversation(db: Database, userId: string, id: string, before?: string) {
  requireUuid(id);
  // Repeatable snapshot prevents a COMPLETED header being paired with reopened messages.
  return db.transaction(async tx => {
    const [c] = await tx.select().from(conversations).where(and(eq(conversations.id, id), eq(conversations.userId, userId)));
    if (!c) throw new SupportError("Không tìm thấy hội thoại.", 404);
    if (before) requireUuid(before);
    if (before) {
      const [cursor] = await tx.select({ id: messages.id }).from(messages).where(and(eq(messages.id, before), eq(messages.conversationId, id)));
      if (!cursor) throw new SupportError("Mốc lịch sử không hợp lệ.");
    }
    const rows = await tx.select({ id: messages.id, senderType: messages.senderType, content: messages.content,
      imageUrl: messages.imageUrl, createdAt: messages.createdAt }).from(messages)
      .where(and(eq(messages.conversationId, id), before
        ? sql`(${messages.createdAt}, ${messages.id}) < (select created_at, id from support_messages where id = ${before}::uuid)`
        : undefined))
      .orderBy(desc(messages.createdAt), desc(messages.id)).limit(101);
    const hasMore = rows.length > 100;
    const page = rows.slice(0, 100).reverse();
    return { conversation: { id: c.id, status: c.status, userName: c.userName, userEmail: c.userEmail,
      completedAt: c.completedAt, updatedAt: c.updatedAt }, messages: page, hasMore,
      nextBefore: hasMore ? page[0].id : null, serverNow: new Date().toISOString() };
  }, { isolationLevel: "repeatable read" });
}
export async function listSupportConversations(db: Database, userId: string) {
  const rows = await db.select({ id: conversations.id, status: conversations.status, completedAt: conversations.completedAt,
    userName: conversations.userName, updatedAt: conversations.updatedAt }).from(conversations)
    .where(eq(conversations.userId, userId)).orderBy(desc(conversations.updatedAt)).limit(50);
  return { conversations: rows, serverNow: new Date().toISOString() };
}

export async function acceptTelegramUpdate(db: Database, u: TelegramUpdate, config: { chatId: string }, call: TelegramCall = telegramCall) {
  if (!await authorizedTelegramUpdate(u, config, call)) throw new SupportError("Forbidden", 403);
  return db.transaction(async tx => {
    const inserted = await tx.insert(updates).values({ updateId: String(u.update_id) }).onConflictDoNothing().returning();
    if (!inserted.length) return "Yêu cầu này đã được tiếp nhận.";
    const cb = u.callback_query;
    if (!cb) {
      await enqueue(tx, "admin-reply", `update:${u.update_id}`, null, { update: u });
      return "Đã tiếp nhận phản hồi.";
    }
    const parsed = parseSupportCallback(cb.data);
    if (!parsed) return "Thao tác không hợp lệ.";
    const [c] = await tx.select().from(conversations).where(eq(conversations.id, parsed.conversationId)).for("update");
    const legacyPrimaryButton = parsed.generation === null && cb.message?.message_id === c?.telegramNotificationMessageId;
    if (!c || c.telegramChatId !== config.chatId ||
      (parsed.generation === null ? !legacyPrimaryButton : parsed.generation !== c.generation)) {
      return "Thông báo đã cũ. Hãy dùng thông báo mới nhất.";
    }
    const adminId = String(cb.from.id);
    if (c.status === "COMPLETED") return "Yêu cầu đã hoàn thành.";
    if (c.claimedByTelegramUserId && c.claimedByTelegramUserId !== adminId) return `Admin ${c.claimedByTelegramUserId} đang xử lý yêu cầu này.`;
    if (parsed.action === "support_complete" && !c.claimedByTelegramUserId) return "Hãy bấm Trả lời để nhận phụ trách yêu cầu trước khi hoàn thành.";
    const now = new Date();
    if (parsed.action === "support_reply") {
      const clickedMessageId = cb.message!.message_id;
      const [clickedUserNotification] = await tx.select({ id: messages.id }).from(messages).where(and(
        eq(messages.conversationId, c.id), eq(messages.senderType, "USER"), eq(messages.telegramMessageId, clickedMessageId),
      )).limit(1);
      // Reminder/receipt buttons route back to the original issue. Buttons on a
      // user notification or its Telegram photo keep the exact clicked context.
      const sourceMessageId = clickedUserNotification || cb.message?.photo?.length
        ? clickedMessageId : c.telegramNotificationMessageId;
      await tx.update(conversations).set({ status: "CLAIMED", claimedByTelegramUserId: adminId,
        claimedAt: c.claimedAt ?? now, nextReminderAt: null, updatedAt: now }).where(eq(conversations.id, c.id));
      await enqueue(tx, "prompt", `prompt:${u.update_id}`, c.id, {
        adminId, adminName: telegramUserDisplayName(cb.from), generation: c.generation, sourceMessageId,
      });
      return "Bạn đã tiếp nhận. Hãy trả lời tin nhắn hướng dẫn của bot.";
    }
    await tx.update(conversations).set({ status: "COMPLETED", completedAt: now, completedBy: adminId,
      nextReminderAt: null, updatedAt: now }).where(eq(conversations.id, c.id));
    await tx.delete(sessions).where(eq(sessions.conversationId, c.id));
    await tx.insert(messages).values({ conversationId: c.id, senderType: "SYSTEM", senderId: adminId,
      content: "Cảm ơn anh/chị đã dành thời gian liên hệ!" });
    await enqueue(tx, "complete", `complete:${c.id}:${c.generation}`, c.id, {
      generation: c.generation,
      ...(cb.message!.text === SUPPORT_REPLY_RECEIPT_TEXT ? { receiptMessageId: cb.message!.message_id } : {}),
    });
    return "Đã xử lí";
  });
}

export async function ownedSupportImage(db: Database, userId: string, id: string) {
  requireUuid(id);
  const [image] = await db.select().from(images).where(and(eq(images.id, id), eq(images.ownerId, userId)));
  if (!image) throw new SupportError("Không tìm thấy ảnh.", 404);
  return image;
}

export async function supportQueueHealth(db: Database) {
  const [pending] = await db.select({ count: sql<number>`count(*)::int`, oldest: sql<Date | null>`min(${jobs.createdAt})` })
    .from(jobs).where(isNull(jobs.finishedAt));
  const failed = await db.select({ id: jobs.id, kind: jobs.kind, attempts: jobs.attempts, lastError: jobs.lastError })
    .from(jobs).where(and(isNull(jobs.finishedAt), gt(jobs.attempts, 0))).orderBy(asc(jobs.availableAt)).limit(20);
  const reminderFailures = await db.select({ id: conversations.id, failures: conversations.reminderFailures,
    lastError: conversations.lastReminderError, nextReminderAt: conversations.nextReminderAt }).from(conversations)
    .where(and(eq(conversations.status, "OPEN"), gt(conversations.reminderFailures, 0))).limit(20);
  return { pending, failed, reminderFailures };
}
