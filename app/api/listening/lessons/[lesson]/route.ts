import { getCurrentUser } from "@/lib/auth-session";
import { getListeningPractice } from "@/lib/practice-content-repository";

export const dynamic = "force-dynamic";
export async function GET(_request: Request, { params }: { params: Promise<{ lesson: string }> }) {
  const [{ lesson }, user] = await Promise.all([params, getCurrentUser()]);
  const data = await getListeningPractice(lesson, user?.id ?? null);
  const headers = { "Cache-Control": "private, no-store", Vary: "Cookie" };
  if (!data) return Response.json({ error: "not_found" }, { status: 404, headers });
  if (!data.access.allowed) return Response.json({ error: data.access.source }, { status: user ? 403 : 401, headers });
  return Response.json(data.lesson, { headers });
}
