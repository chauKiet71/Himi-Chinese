import { getCurrentUser } from "./auth-session.ts";
import { isSameOriginRequest } from "./request-security.ts";
import { VocabularySetError } from "./vocabulary-sets.ts";

export function setJson(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "private, no-store", Vary: "Cookie" } });
}
export async function setUser(request: Request) {
  if (!isSameOriginRequest(request)) throw new VocabularySetError("Yêu cầu không hợp lệ.", 403);
  const user = await getCurrentUser();
  if (!user) throw new VocabularySetError("Vui lòng đăng nhập để quản lý bộ của bạn.", 401);
  return user;
}
export async function setBody(request: Request): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.includes("application/json")) throw new VocabularySetError("Cần dữ liệu JSON.", 415);
  const reader = request.body?.getReader();
  if (!reader) throw new VocabularySetError("Dữ liệu trống.");
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.length;
      if (size > 16_384) throw new VocabularySetError("Dữ liệu quá lớn.", 413);
      chunks.push(value);
    }
  } finally { await reader.cancel().catch(() => undefined); }
  try {
    const value: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
    return value as Record<string, unknown>;
  } catch { throw new VocabularySetError("JSON không hợp lệ."); }
}
export function setFailure(error: unknown) {
  if (error instanceof VocabularySetError) return setJson({ error: error.message }, error.status);
  console.error("[vocabulary-sets] request failed");
  return setJson({ error: "Chưa thể lưu thay đổi. Vui lòng thử lại." }, 503);
}
