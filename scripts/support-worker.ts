import { setTimeout as delay } from "node:timers/promises";
import { closeDb, getDb } from "../db/index.ts";
import { processSupportJob, processSupportReminder, cleanSupportReplySessions } from "../lib/support-worker.ts";
import { supportQueueHealth } from "../lib/support-service.ts";
import { telegramConfig } from "../lib/support-telegram.ts";
import { processRegistrationNotification, registrationChatId, registrationQueueHealth } from "../lib/registration-telegram.ts";

let stopping = false;
process.on("SIGINT", () => { stopping = true; });
process.on("SIGTERM", () => { stopping = true; });
const pollMs = Number(process.env.SUPPORT_WORKER_POLL_MS ?? 1000);
const paymentsOnly = process.argv.includes("--payments-only");
const notificationsOnly = process.argv.includes("--notifications-only");
const alertsOnly = paymentsOnly || notificationsOnly;
if (paymentsOnly && notificationsOnly) throw new Error("Chỉ chọn --payments-only hoặc --notifications-only.");
if (!Number.isFinite(pollMs) || pollMs < 250 || pollMs > 5000) throw new Error("SUPPORT_WORKER_POLL_MS must be 250–5000");
if (alertsOnly) {
  const chatId = process.env.TELEGRAM_PAYMENT_CHAT_ID?.trim() || process.env.TELEGRAM_ADMIN_CHAT_ID?.trim() || "";
  if (!process.env.TELEGRAM_BOT_TOKEN?.trim() || !/^-?[1-9]\d*$/.test(chatId)) throw new Error("Cần TELEGRAM_BOT_TOKEN và chat ID nhận thông báo SePay.");
  if (notificationsOnly && !/^-?[1-9]\d*$/.test(registrationChatId() ?? "")) throw new Error("Cần chat ID nhận thông báo đăng ký.");
} else telegramConfig();
try {
  const db = getDb();
  if (process.argv.includes("--status")) {
    console.log(JSON.stringify({ ...await supportQueueHealth(db), registration: await registrationQueueHealth(db) }));
  } else {
    console.log(alertsOnly ? "[telegram] notification worker started" : "[support] worker started");
    let ticks = 0;
    while (!stopping) {
      try {
        const [job, reminder, registration] = await Promise.all([
          processSupportJob(db, undefined, notificationsOnly ? ["sepay-notify", "registration-notify"] : paymentsOnly ? "sepay-notify" : undefined),
          alertsOnly ? Promise.resolve(false) : processSupportReminder(db),
          paymentsOnly ? Promise.resolve(false) : processRegistrationNotification(db),
        ]);
        if (!alertsOnly && ++ticks % 600 === 0) await cleanSupportReplySessions(db);
        if (!job && !reminder && !registration) await delay(pollMs);
      } catch { console.error("[support] database unavailable; retrying"); await delay(5000); }
    }
  }
} finally { await closeDb(); }
