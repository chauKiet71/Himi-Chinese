import { telegramCall, telegramConfig } from "../lib/support-telegram.ts";

const { secret } = telegramConfig();
const origin = process.env.SUPPORT_WEBHOOK_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL;
if (!origin || new URL(origin).protocol !== "https:") throw new Error("Set SUPPORT_WEBHOOK_BASE_URL to your public HTTPS origin.");
try {
  await telegramCall("setWebhook", { url: new URL("/api/telegram/webhook", origin).href,
    secret_token: secret, allowed_updates: ["message", "callback_query"], drop_pending_updates: false });
  console.log("Support webhook registered; token and secret were not logged.");
} catch { console.error("Webhook registration failed. Check configuration and bot access."); process.exitCode = 1; }
