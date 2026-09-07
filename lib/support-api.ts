import { getCurrentUser } from "./auth-session.ts";
import { isSameOriginRequest } from "./request-security.ts";
import { SupportError } from "./support-domain.ts";

export async function supportUser(request: Request, mutation = false) {
  if (mutation && !isSameOriginRequest(request)) throw new SupportError("Forbidden", 403);
  const user = await getCurrentUser();
  if (!user) throw new SupportError("Vui lòng đăng nhập để gửi và xem yêu cầu hỗ trợ.", 401);
  return user;
}
export function supportJson(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "private, no-store", Vary: "Cookie" } });
}
export function supportFailure(error: unknown) {
  if (error instanceof SupportError) return supportJson({ error: error.message }, error.status);
  // Never log driver errors: SQL parameters can include email, text or webhook payloads.
  console.error("[support] request failed");
  return supportJson({ error: "Chưa thể xử lý yêu cầu. Vui lòng thử lại.", retryable: true }, 503);
}
export async function supportBody(request: Request, max = 16_384) {
  if (!request.headers.get("content-type")?.includes("application/json")) throw new SupportError("Cần dữ liệu JSON.", 415);
  if (Number(request.headers.get("content-length")) > max) throw new SupportError("Dữ liệu quá lớn.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new SupportError("Dữ liệu trống.");
  let size = 0; const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.length; if (size > max) throw new SupportError("Dữ liệu quá lớn.", 413);
      chunks.push(value);
    }
  } finally { await reader.cancel().catch(() => undefined); }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown; }
  catch { throw new SupportError("JSON không hợp lệ."); }
}
