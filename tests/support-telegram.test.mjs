import test from "node:test";
import assert from "node:assert/strict";
import { telegramCall, TelegramError } from "../lib/support-telegram.ts";

test("Telegram migration response retains destination and a safe diagnostic without resending blindly", async () => {
  const previousFetch = globalThis.fetch;
  const keys = ["TELEGRAM_BOT_TOKEN", "TELEGRAM_ADMIN_CHAT_ID", "TELEGRAM_WEBHOOK_SECRET"];
  const previous = keys.map(key => process.env[key]);
  let requests = 0;
  try {
    process.env.TELEGRAM_BOT_TOKEN = "test-token";
    process.env.TELEGRAM_ADMIN_CHAT_ID = "-12345";
    process.env.TELEGRAM_WEBHOOK_SECRET = "test-secret";
    globalThis.fetch = async () => {
      requests++;
      return Response.json({ ok: false, error_code: 400,
        description: "Bad Request: group chat was upgraded to a supergroup chat",
        parameters: { migrate_to_chat_id: -1009876543210 },
      }, { status: 400 });
    };
    await assert.rejects(telegramCall("sendMessage", { chat_id: "-12345", text: "test" }), error => {
      assert.ok(error instanceof TelegramError);
      assert.equal(error.message, "telegram_400_group_migrated");
      assert.equal(error.migrateToChatId, "-1009876543210");
      return true;
    });
    assert.equal(requests, 1, "migration requires updating web, worker and stored conversation together");
  } finally {
    globalThis.fetch = previousFetch;
    keys.forEach((key, i) => { if (previous[i] === undefined) delete process.env[key]; else process.env[key] = previous[i]; });
  }
});

test("Telegram errors never retain arbitrary API descriptions or invalid migration IDs", () => {
  const error = new TelegramError(400, 0, { description: "private-token customer@example.test", migrateToChatId: 123 });
  assert.equal(error.message, "telegram_400");
  assert.equal(error.migrateToChatId, undefined);
  assert.equal(JSON.stringify(error).includes("customer"), false);
  assert.equal(new TelegramError(400, 0, { migrateToChatId: -100000000000000000000 }).migrateToChatId, undefined);
  assert.equal(new TelegramError(400, 0, { description: "Bad Request: chat not found" }).message, "telegram_400_chat_not_found");
  assert.equal(new TelegramError(429, 12000).retryAfter, 12000);
  assert.equal(new TelegramError(429, 12000).message, "telegram_429");
});
