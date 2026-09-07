import { withRequestDb } from "@/db";
import { supportBody, supportFailure, supportJson, supportUser } from "@/lib/support-api";
import { consumeSupportLimit, listSupportConversations, submitSupportMessage } from "@/lib/support-service";
import { telegramConfig } from "@/lib/support-telegram";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    const user = await supportUser(request);
    const result = await withRequestDb(async db => {
      await consumeSupportLimit(db, user.id, "support:read", 90);
      return listSupportConversations(db, user.id);
    });
    return supportJson({ ...result, profile: { userName: user.displayName, userEmail: user.email } });
  } catch (error) { return supportFailure(error); }
}
export async function POST(request: Request) {
  try {
    const user = await supportUser(request, true);
    const body = await supportBody(request);
    const { chatId } = telegramConfig();
    const result = await withRequestDb(async db => {
      await consumeSupportLimit(db, user.id);
      return submitSupportMessage(db, user.id, body, chatId);
    });
    return supportJson({ ...result, delivery: "queued" }, 201);
  } catch (error) { return supportFailure(error); }
}
