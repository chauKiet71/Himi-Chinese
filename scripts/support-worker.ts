import { setTimeout as delay } from "node:timers/promises";
import { closeDb, getDb } from "../db/index.ts";
import { processSupportJob, processSupportReminder, cleanSupportReplySessions } from "../lib/support-worker.ts";
import { supportQueueHealth } from "../lib/support-service.ts";
import { telegramConfig } from "../lib/support-telegram.ts";

let stopping = false;
process.on("SIGINT", () => { stopping = true; });
process.on("SIGTERM", () => { stopping = true; });
const pollMs = Number(process.env.SUPPORT_WORKER_POLL_MS ?? 1000);
const paymentsOnly = process.argv.includes("--payments-only");
if (!Number.isFinite(pollMs) || pollMs < 250 || pollMs > 5000) throw new Error("SUPPORT_WORKER_POLL_MS must be 250–5000");
if (paymentsOnly) {
  const chatId = process.env.TELEGRAM_PAYMENT_CHAT_ID?.trim() || process.env.TELEGRAM_ADMIN_CHAT_ID?.trim() || "";
  if (!process.env.TELEGRAM_BOT_TOKEN?.trim() || !/^-?[1-9]\d*$/.test(chatId)) throw new Error("Cần TELEGRAM_BOT_TOKEN và chat ID nhận thông báo SePay.");
} else telegramConfig();
try {
  const db = getDb();
  if (process.argv.includes("--status")) {
    console.log(JSON.stringify(await supportQueueHealth(db)));
  } else {
    console.log(paymentsOnly ? "[sepay] notification worker started" : "[support] worker started");
    let ticks = 0;
    while (!stopping) {
      try {
        const [job, reminder] = await Promise.all([
          processSupportJob(db, undefined, paymentsOnly ? "sepay-notify" : undefined),
          paymentsOnly ? Promise.resolve(false) : processSupportReminder(db),
        ]);
        if (!paymentsOnly && ++ticks % 600 === 0) await cleanSupportReplySessions(db);
        if (!job && !reminder) await delay(pollMs);
      } catch { console.error("[support] database unavailable; retrying"); await delay(5000); }
    }
  }
} finally { await closeDb(); }
