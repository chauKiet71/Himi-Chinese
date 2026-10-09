import { getCurrentUser } from "@/lib/auth-session";
import { getListeningCatalog } from "@/lib/practice-content-repository";

export const dynamic = "force-dynamic";
export async function GET() {
  const user = await getCurrentUser();
  const catalog = await getListeningCatalog(user?.id ?? null);
  return Response.json(catalog ?? { error: "not_found" }, { status: catalog ? 200 : 404,
    headers: { "Cache-Control": "private, no-store", Vary: "Cookie" } });
}
