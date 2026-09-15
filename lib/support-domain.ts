export const SUPPORT_IMAGE_BYTES = 5 * 1024 * 1024;
export const SUPPORT_REMINDER_MS = 30_000;
export const SUPPORT_HIDE_MS = 60_000;
export type SupportStatus = "OPEN" | "CLAIMED" | "WAITING_USER" | "COMPLETED";
export class SupportError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; }
}
export function requireUuid(value: unknown): string {
  if (typeof value !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    throw new SupportError("Mã yêu cầu không hợp lệ.");
  }
  return value;
}
export function validateSupportInput(value: unknown) {
  if (!value || typeof value !== "object") throw new SupportError("Dữ liệu không hợp lệ.");
  const input = value as Record<string, unknown>;
  const content = typeof input.content === "string" ? input.content.trim() : "";
  const userName = typeof input.userName === "string" ? input.userName.trim() : "";
  const userEmail = typeof input.userEmail === "string" ? input.userEmail.trim().toLowerCase() : "";
  const imageId = input.imageId ? requireUuid(input.imageId) : null;
  if (userName.length < 2 || userName.length > 120 || /[\r\n\x00-\x1f]/.test(userName)) throw new SupportError("Tên cần từ 2–120 ký tự.");
  if (userEmail.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) throw new SupportError("Email không hợp lệ.");
  if (content.length > 3000 || (!content && !imageId)) throw new SupportError("Nhập nội dung (tối đa 3.000 ký tự) hoặc chọn ảnh.");
  return { content, userName, userEmail, imageId, requestId: requireUuid(input.requestId) };
}
export function hiddenAfterCompletion(completedAt: string | Date | null, now = Date.now()) {
  return completedAt !== null && now >= new Date(completedAt).getTime() + SUPPORT_HIDE_MS;
}
export function reminderDue(c: { status: string; claimedAt: Date | null; nextReminderAt: Date | null }, now = new Date()) {
  return c.status === "OPEN" && !c.claimedAt && !!c.nextReminderAt && c.nextReminderAt <= now;
}
export function parseSupportCallback(data: unknown) {
  if (typeof data !== "string") return null;
  // Generation invalidates buttons when the Telegram destination changes.
  // Separate conversation IDs keep completed requests apart from new ones.
  // The optional form keeps already-sent primary notification buttons working.
  const match = /^(support_reply|support_complete):([0-9a-f-]{36})(?::([1-9]\d*))?$/i.exec(data);
  if (!match) return null;
  const generation = match[3] === undefined ? null : Number(match[3]);
  if (generation !== null && !Number.isSafeInteger(generation)) return null;
  try { return { action: match[1], conversationId: requireUuid(match[2]), generation }; } catch { return null; }
}
export function retryDelay(attempt: number) { return Math.min(300_000, 1000 * 2 ** Math.min(attempt, 9)); }
