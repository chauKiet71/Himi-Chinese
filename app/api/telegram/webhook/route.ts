import { withRequestDb } from "@/db";
import { supportBody, supportFailure, supportJson } from "@/lib/support-api";
import { acceptTelegramUpdate } from "@/lib/support-service";
import { SupportError } from "@/lib/support-domain";
import { telegramCall, telegramConfig, telegramGroupIdCommand, validTelegramUpdate, verifyTelegramSecret } from "@/lib/support-telegram";

export async function POST(request: Request) {
  try {
    const config = telegramConfig();
    if (!verifyTelegramSecret(request.headers.get("X-Telegram-Bot-Api-Secret-Token"), config.secret)) return supportJson({ error: "Forbidden" }, 403);
    const update = await supportBody(request, 65_536);
    const groupChatId = telegramGroupIdCommand(update, config.admins);
    if (groupChatId) {
      await telegramCall("sendMessage", { chat_id: groupChatId,
        text: `ID nhóm Telegram: ${groupChatId}\nGửi ID này cho Codex để hoàn tất cấu hình.` });
      return supportJson({ ok: true });
    }
    if (!validTelegramUpdate(update)) return supportJson({ ok: true, ignored: true });
    // Telegram retries non-2xx responses. A valid but unauthorized update must be
    // acknowledged and ignored so it cannot block later group setup commands.
    // Callback queries also need an explicit Bot API acknowledgement; otherwise
    // Telegram leaves the button spinner running even though the webhook returned 200.
    let text: string;
    try {
      text = await withRequestDb(db => acceptTelegramUpdate(db, update, config));
    } catch (error) {
      if (!(error instanceof SupportError) || error.status !== 403) throw error;
      if (update.callback_query) {
        await telegramCall("answerCallbackQuery", {
          callback_query_id: update.callback_query.id,
          text: "Chỉ thành viên hiện tại của nhóm hỗ trợ mới được thao tác. Hãy dùng tài khoản cá nhân.",
          show_alert: true,
        }).catch(() => undefined);
      }
      return supportJson({ ok: true, ignored: true });
    }
    if (update.callback_query) {
      // Bound acknowledgement latency; durable prompt/edits happen in the worker, not the webhook.
      await telegramCall("answerCallbackQuery", { callback_query_id: update.callback_query.id, text }).catch(() => undefined);
    }
    return supportJson({ ok: true });
  } catch (error) { return supportFailure(error); }
}
