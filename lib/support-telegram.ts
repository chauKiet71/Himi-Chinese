import { timingSafeEqual } from "node:crypto";
import { parseSupportCallback, SupportError } from "./support-domain.ts";

export type TelegramMessage = {
  message_id: number; chat: { id: number }; from?: { id: number; first_name?: string };
  text?: string; caption?: string; photo?: { file_id: string; file_size?: number }[];
  reply_to_message?: { message_id: number };
};
export type TelegramUpdate = {
  update_id: number;
  callback_query?: { id: string; from: { id: number; first_name?: string }; data?: string; message?: TelegramMessage };
  message?: TelegramMessage;
};
export function telegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const admins = (process.env.TELEGRAM_ADMIN_USER_IDS ?? "").split(",").map(x => x.trim()).filter(x => /^\d+$/.test(x));
  if (!token || !chatId || !/^-?\d+$/.test(chatId) || !secret || !admins.length) throw new SupportError("Kênh hỗ trợ chưa được cấu hình.", 503);
  return { token, chatId, secret, admins };
}
export function verifyTelegramSecret(actual: string | null, expected: string) {
  const a = Buffer.from(actual ?? ""); const b = Buffer.from(expected);
  return a.length === b.length && b.length > 0 && timingSafeEqual(a, b);
}
export function authorizedTelegramUpdate(update: TelegramUpdate, config: { chatId: string; admins: string[] }) {
  const actor = update.callback_query?.from ?? update.message?.from;
  const message = update.callback_query?.message ?? update.message;
  return !!actor && !!message && String(message.chat?.id) === config.chatId && config.admins.includes(String(actor.id));
}
export function telegramGroupIdCommand(value: unknown, admins: string[]) {
  if (!value || typeof value !== "object") return null;
  const message = (value as TelegramUpdate).message;
  const chatId = message?.chat?.id;
  const adminId = message?.from?.id;
  if (!Number.isSafeInteger(chatId) || Number(chatId) >= 0 || !Number.isSafeInteger(adminId)) return null;
  if (!admins.includes(String(adminId)) || !/^\/groupid(?:@\w+)?$/i.test(message?.text?.trim() ?? "")) return null;
  return String(chatId);
}
export function validTelegramUpdate(value: unknown): value is TelegramUpdate {
  if (!value || typeof value !== "object") return false;
  const u = value as TelegramUpdate;
  if (!Number.isSafeInteger(u.update_id) || u.update_id < 0) return false;
  const m = u.callback_query?.message ?? u.message;
  const actor = u.callback_query?.from ?? m?.from;
  if (!m || !Number.isSafeInteger(m.message_id) || !Number.isSafeInteger(m.chat?.id) || !Number.isSafeInteger(actor?.id)) return false;
  if (u.callback_query) return typeof u.callback_query.id === "string" && u.callback_query.id.length <= 256 && !!parseSupportCallback(u.callback_query.data);
  return !!m.reply_to_message && Number.isSafeInteger(m.reply_to_message.message_id) &&
    (typeof m.text === "string" || Array.isArray(m.photo)) && (m.text ?? m.caption ?? "").length <= 3000 &&
    (!m.photo || (m.photo.length <= 10 && m.photo.every(p => typeof p.file_id === "string" && p.file_id.length < 512)));
}
export class TelegramError extends Error {
  retryAfter: number;
  constructor(code: number, retryAfter = 0) { super(`telegram_${code}`); this.retryAfter = retryAfter; }
}
export type TelegramCall = (method: string, parameters: Record<string, unknown>, photo?: Uint8Array) => Promise<Record<string, unknown>>;
export const telegramCall: TelegramCall = async (method, parameters, photo) => {
  const { token } = telegramConfig();
  const form = photo ? new FormData() : null;
  if (form) {
    for (const [key, value] of Object.entries(parameters)) form.set(key, typeof value === "object" ? JSON.stringify(value) : String(value));
    form.set("photo", new Blob([new Uint8Array(photo!)]), "support.jpg");
  }
  let response: Response;
  try {
    response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST", headers: form ? undefined : { "Content-Type": "application/json" },
      body: form ?? JSON.stringify(parameters), signal: AbortSignal.timeout(method === "answerCallbackQuery" ? 1500 : 12_000),
    });
  } catch { throw new TelegramError(503); }
  const data = await response.json() as { ok: boolean; result: Record<string, unknown>; error_code?: number; description?: string; parameters?: { retry_after?: number } };
  // Editing the same deterministic payload is safe to retry after an ambiguous response.
  if (!data.ok && method.startsWith("editMessage") && data.description?.includes("message is not modified")) return {};
  if (!data.ok) throw new TelegramError(data.error_code ?? response.status, (data.parameters?.retry_after ?? 0) * 1000);
  return data.result;
};
export function supportKeyboard(id: string, generation: number) {
  return { inline_keyboard: [[{ text: "Trả lời", callback_data: `support_reply:${id}:${generation}` },
    { text: "Hoàn thành", callback_data: `support_complete:${id}:${generation}` }]] };
}
export function notificationText(c: { userName: string; userEmail: string }, content: string) {
  // Plain text deliberately: user-controlled markup is never parsed by Telegram.
  return `HIMI · Yêu cầu hỗ trợ\nTên: ${c.userName}\nEmail: ${c.userEmail}\n\n${content || "[Hình ảnh đính kèm]"}`;
}
