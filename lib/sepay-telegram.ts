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
    paid: "Thanh toán thành công · VIP đã được kích hoạt/gia hạn",
    manual_review: "Cần đối soát thủ công · Chưa kích hoạt VIP",
    unmatched: "Không tìm thấy đơn thanh toán · Cần kiểm tra giao dịch",
    ignored: "Giao dịch không đủ điều kiện xử lý · Không thay đổi quyền VIP",
    duplicate: "Đơn đã thanh toán trước đó · Cần kiểm tra khoản chuyển thêm",
  }[input.outcome];
  const amount = (value: number) => `${value.toLocaleString("vi-VN")} đ`;
  return [
    "HIMI · SePay báo giao dịch",
    `Kết quả: ${status}`,
    ...(input.reason ? [`Lý do: ${input.reason === "amount_mismatch" ? "Số tiền không khớp đơn" : "Đơn đã hết hạn"}`] : []),
    `Số tiền: ${amount(input.payload.transferAmount)}`,
    ...(input.order ? [`Số tiền đơn: ${amount(input.order.amountVnd)}`] : []),
    `Loại giao dịch: ${input.payload.transferType === "in" ? "Tiền vào" : "Tiền ra"}`,
    `Ngân hàng: ${input.payload.gateway}`,
    `Thời gian: ${input.payload.transactionDate}`,
    `ID giao dịch SePay: ${input.payload.id}`,
    `Mã thanh toán: ${extractSepayPaymentCode(input.payload) ?? "Không có"}`,
    ...(input.order ? [`ID đơn: ${input.order.id}`] : []),
    ...(input.userName ? [`Học viên: ${input.userName.slice(0, 120)}`] : []),
    ...(input.userEmail ? [`Email: ${input.userEmail.slice(0, 255)}`] : []),
    ...(input.planName ? [`Gói VIP: ${input.planName.slice(0, 120)}`] : []),
    `Mã tham chiếu ngân hàng: ${input.payload.referenceCode || "Không có"}`,
    `Nội dung: ${input.payload.content}`,
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
