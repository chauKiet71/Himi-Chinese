import { withRequestDb } from "@/db";
import { supportBody, supportFailure, supportJson, supportUser } from "@/lib/support-api";
import { consumeSupportLimit, submitSupportMessage } from "@/lib/support-service";
import { telegramConfig } from "@/lib/support-telegram";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await supportUser(request, true);
    const { id } = await context.params;
    const body = await supportBody(request);
    const { chatId } = telegramConfig();
    const result = await withRequestDb(async db => {
      await consumeSupportLimit(db, user.id);
      return submitSupportMessage(db, user.id, body, chatId, id);
    });
    return supportJson({ ...result, delivery: "queued" }, 201);
  } catch (error) { return supportFailure(error); }
}
