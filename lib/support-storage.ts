import { createHash } from "node:crypto";
import { v2 as cloudinary } from "cloudinary";
import { readCloudinaryCredentials, type CloudinaryCredentials } from "./cloudinary-practice-audio.ts";
import { SUPPORT_IMAGE_BYTES, SupportError } from "./support-domain.ts";
import { telegramCall, telegramConfig } from "./support-telegram.ts";

function configure() {
  const c = readCloudinaryCredentials();
  if (!c) throw new SupportError("Dịch vụ lưu ảnh chưa được cấu hình.", 503);
  cloudinary.config({ cloud_name: c.cloudName, api_key: c.apiKey, api_secret: c.apiSecret, secure: true });
  return c;
}
export function imageMime(bytes: Uint8Array) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if ([137,80,78,71,13,10,26,10].every((v,i) => bytes[i] === v)) return "image/png";
  if (Buffer.from(bytes.subarray(0,4)).toString() === "RIFF" && Buffer.from(bytes.subarray(8,12)).toString() === "WEBP") return "image/webp";
  throw new SupportError("Chỉ chấp nhận ảnh JPG, PNG hoặc WebP.");
}
export async function limitedBytes(response: Response, max = SUPPORT_IMAGE_BYTES) {
  if (!response.ok || !response.body) throw new SupportError("Không tải được ảnh.", 502);
  if (Number(response.headers.get("content-length")) > max) throw new SupportError("Ảnh tối đa 5 MB.", 413);
  const reader = response.body.getReader(); const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      size += value.length; if (size > max) throw new SupportError("Ảnh tối đa 5 MB.", 413);
      chunks.push(value);
    }
  } finally { await reader.cancel().catch(() => undefined); }
  return new Uint8Array(Buffer.concat(chunks));
}
export async function storeSupportImage(bytes: Uint8Array, publicId: string, declaredMime?: string) {
  if (!bytes.length || bytes.length > SUPPORT_IMAGE_BYTES) throw new SupportError("Ảnh tối đa 5 MB.", 413);
  const mime = imageMime(bytes);
  if (declaredMime && mime !== declaredMime) throw new SupportError("Định dạng ảnh không khớp nội dung.");
  configure();
  try {
    await cloudinary.uploader.upload(`data:${mime};base64,${Buffer.from(bytes).toString("base64")}`, {
      public_id: publicId, resource_type: "image", type: "authenticated", overwrite: true,
      allowed_formats: ["jpg", "png", "webp"], transformation: [{ width: 2000, height: 2000, crop: "limit" }], timeout: 15_000,
    });
  } catch { throw new SupportError("Không lưu được ảnh. Vui lòng thử lại.", 502); }
  return publicId;
}
export function supportImageDeliveryUrl(publicId: string, credentials: CloudinaryCredentials) {
  const signature = createHash("sha1")
    .update(publicId + credentials.apiSecret)
    .digest("base64url")
    .slice(0, 8);
  const encodedPublicId = publicId.split("/").map(encodeURIComponent).join("/");
  return `https://res.cloudinary.com/${encodeURIComponent(credentials.cloudName)}/image/authenticated/s--${signature}--/v1/${encodedPublicId}`;
}
export async function readSupportImage(publicId: string) {
  const credentials = configure();
  // Build the documented signed delivery URL directly. cloudinary.url() pulls
  // CommonJS-only internals that reference __dirname in Vinext's ESM runtime.
  const url = supportImageDeliveryUrl(publicId, credentials);
  return limitedBytes(await fetch(url, { signal: AbortSignal.timeout(12_000) }));
}
export async function importTelegramPhoto(fileId: string, publicId: string) {
  const file = await telegramCall("getFile", { file_id: fileId });
  if (typeof file.file_path !== "string" || !/^[\w./-]+$/.test(file.file_path) || file.file_path.includes("..")) throw new SupportError("Ảnh Telegram không hợp lệ.");
  const { token } = telegramConfig();
  const bytes = await limitedBytes(await fetch(`https://api.telegram.org/file/bot${token}/${file.file_path}`, { signal: AbortSignal.timeout(12_000) }));
  return storeSupportImage(bytes, publicId);
}
