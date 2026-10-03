import "server-only";
import type { LessonResource } from "./lesson-resource.ts";

// Hash the actual access-filtered content, so editorial changes AND item-level
// access changes invalidate precisely the affected lesson, without a global TTL.
export async function createLessonResource(url: string, data: unknown, scope: string): Promise<LessonResource> {
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const version = `1-${Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
  return { url, version, scope };
}

export function lessonApiError(message: string, status: number) {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "private, no-store" } });
}

export async function lessonApiResponse(request: Request, url: string, data: unknown, scope: string) {
  const resource = await createLessonResource(url, data, scope);
  if (new URL(request.url).searchParams.get("metadata") === "1") {
    return Response.json(resource, { headers: { "Cache-Control": "private, no-store", "Vary": "Cookie" } });
  }
  if (request.headers.get("X-Himi-Lesson-Version") !== resource.version) {
    return lessonApiError("Bài học vừa được cập nhật. Vui lòng tải lại.", 409);
  }
  return Response.json({ version: resource.version, scope, data }, {
    headers: { "Cache-Control": "private, no-store", "Vary": "Cookie" },
  });
}
