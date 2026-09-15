import { eq } from "drizzle-orm";
import type { Database } from "../db/index.ts";
import { supportJobs, users, vipPlans } from "../db/schema.ts";
import { extractSepayPaymentCode, type SepayWebhookPayload } from "./sepay.ts";
import { telegramCall, type TelegramCall } from "./support-telegram.ts";

type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];
type Outcome = "duplicate" | "ignored" | "manual_review" | "paid" | "unmatched";
type Notification = {
  payload: SepayWebhookPayload;
  outcome: Outcome;
  order?: { id: string; userId: string; planId: string; amountVnd: number } | null;
  reason?: "amount_mismatch" | "order_expired";
};

export function sepayNotificationText(input: Notification & { userName?: string; userEmail?: string; planName?: string }) {
  const status = {
    paid: "✅ Kết quả: Thanh toán thành công 🎉",
    manual_review: "⚠️ Kết quả: Cần đối soát thủ công",
    unmatched: "⚠️ Kết quả: Không tìm thấy đơn thanh toán",
    ignored: "⚠️ Kết quả: Giao dịch không đủ điều kiện xử lý",
    duplicate: "⚠️ Kết quả: Đơn đã thanh toán trước đó · Cần kiểm tra khoản chuyển thêm",
  }[input.outcome];
  const amount = (value: number) => `${value.toLocaleString("vi-VN")} đ`;
  return [
    "🔔 HIMI · SePay báo giao dịch",
    "",
    status,
    `💰 Số tiền: ${amount(input.payload.transferAmount)}`,
    `⏰ Thời gian: ${input.payload.transactionDate}`,
    `🧾 Mã thanh toán: ${extractSepayPaymentCode(input.payload) ?? "Không có"}`,
    `👨‍🎓 Học viên: ${input.userName?.slice(0, 120) || "Không xác định"}`,
    `📧 Email: ${input.userEmail?.slice(0, 255) || "Không xác định"}`,
    `💎 Gói VIP: ${input.planName?.slice(0, 120) || "Không xác định"} ⭐`,
  ].join("\n");
}

export async function enqueueSepayNotification(tx: Transaction, input: Notification) {
  const [learners, plans] = input.order ? await Promise.all([
    tx.select({ name: users.displayName, email: users.email }).from(users).where(eq(users.id, input.order.userId)).limit(1),
    tx.select({ name: vipPlans.name }).from(vipPlans).where(eq(vipPlans.id, input.order.planId)).limit(1),
  ]) : [[], []];
  // Commit the notification with the payment. Telegram outages cannot roll back VIP access.
  await tx.insert(supportJobs).values({
    kind: "sepay-notify",
    dedupeKey: `sepay-notify:${input.payload.id}`,
    payload: {
      chatId: process.env.TELEGRAM_PAYMENT_CHAT_ID?.trim() || process.env.TELEGRAM_ADMIN_CHAT_ID?.trim() || null,
      text: sepayNotificationText({ ...input, userName: learners[0]?.name ?? undefined, userEmail: learners[0]?.email, planName: plans[0]?.name }),
    },
  }).onConflictDoNothing({ target: supportJobs.dedupeKey });
}

export async function sendSepayNotification(payload: Record<string, unknown>, call: TelegramCall = telegramCall) {
  // Fall back to worker configuration if the web runtime has no Telegram destination.
  const chatId = payload.chatId ?? (process.env.TELEGRAM_PAYMENT_CHAT_ID?.trim() || process.env.TELEGRAM_ADMIN_CHAT_ID?.trim());
  if (typeof chatId !== "string" || !/^-?[1-9]\d*$/.test(chatId)) throw new Error("sepay_telegram_chat_not_configured");
  if (typeof payload.text !== "string" || !payload.text) throw new Error("sepay_telegram_message_invalid");
  await call("sendMessage", { chat_id: chatId, text: payload.text });
}
