import { withRequestDb } from "@/db";
import { supportFailure, supportJson, supportUser } from "@/lib/support-api";
import { consumeSupportLimit, getSupportConversation } from "@/lib/support-service";

export const dynamic = "force-dynamic";
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await supportUser(request);
    const { id } = await context.params;
    const before = new URL(request.url).searchParams.get("before") ?? undefined;
    return supportJson(await withRequestDb(async db => {
      await consumeSupportLimit(db, user.id, "support:read", 90);
      return getSupportConversation(db, user.id, id, before);
    }));
  } catch (error) { return supportFailure(error); }
}
