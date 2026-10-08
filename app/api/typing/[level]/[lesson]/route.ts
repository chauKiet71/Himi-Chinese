import { getCurrentUser } from "@/lib/auth-session";
import { getTypingLessonContent } from "@/lib/typing-content-repository";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ level: string; lesson: string }> }) {
  const [{ level, lesson }, user] = await Promise.all([params, getCurrentUser()]);
  const data = await getTypingLessonContent(level, lesson, user?.id ?? null);
  const headers = { "Cache-Control": "private, no-store", Vary: "Cookie" };
  if (!data) return Response.json({ error: "not_found" }, { status: 404, headers });
  if (!data.access.allowed) {
    const error = data.access.source === "vip_required" ? "vip_required" : "login_required";
    return Response.json({ error }, { status: user ? 403 : 401, headers });
  }
  return Response.json(data.lesson, { headers });
}
