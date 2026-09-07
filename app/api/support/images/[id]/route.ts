import { withRequestDb } from "@/db";
import { supportFailure, supportUser } from "@/lib/support-api";
import { ownedSupportImage } from "@/lib/support-service";
import { imageMime, readSupportImage } from "@/lib/support-storage";

export const dynamic = "force-dynamic";
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await supportUser(request);
    const { id } = await context.params;
    const image = await withRequestDb(db => ownedSupportImage(db, user.id, id));
    const bytes = await readSupportImage(image.publicId);
    return new Response(new Uint8Array(bytes), { headers: { "Content-Type": imageMime(bytes),
      "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", Vary: "Cookie" } });
  } catch (error) { return supportFailure(error); }
}
