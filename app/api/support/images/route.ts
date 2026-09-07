import { eq } from "drizzle-orm";
import { withRequestDb } from "@/db";
import { supportImages } from "@/db/schema";
import { supportFailure, supportJson, supportUser } from "@/lib/support-api";
import { requireUuid, SUPPORT_IMAGE_BYTES, SupportError } from "@/lib/support-domain";
import { consumeSupportLimit } from "@/lib/support-service";
import { limitedBytes, storeSupportImage } from "@/lib/support-storage";

export async function POST(request: Request) {
  try {
    const user = await supportUser(request, true);
    const id = requireUuid(request.headers.get("Idempotency-Key"));
    const mime = request.headers.get("content-type") ?? "";
    if (!["image/jpeg", "image/png", "image/webp"].includes(mime)) throw new SupportError("Chọn ảnh JPG, PNG hoặc WebP.", 415);
    const bytes = await limitedBytes(new Response(request.body, { headers: request.headers }), SUPPORT_IMAGE_BYTES);
    await withRequestDb(async db => {
      await consumeSupportLimit(db, user.id, "support:upload", 5);
      const [existing] = await db.select().from(supportImages).where(eq(supportImages.id, id));
      if (existing) {
        if (existing.ownerId !== user.id) throw new SupportError("Mã tải ảnh không hợp lệ.", 409);
        return;
      }
      const publicId = await storeSupportImage(bytes, `hanziwork/support/${user.id}/${id}`, mime);
      await db.insert(supportImages).values({ id, ownerId: user.id, publicId }).onConflictDoNothing();
    });
    return supportJson({ imageId: id, imageUrl: `/api/support/images/${id}` }, 201);
  } catch (error) { return supportFailure(error); }
}
