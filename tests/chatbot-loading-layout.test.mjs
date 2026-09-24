import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const chatbot = await readFile(new URL("../components/himi-chatbot.tsx", import.meta.url), "utf8");

test("support chat keeps its full panel and composer while authentication loads", () => {
  assert.match(chatbot, /authenticated === false \? " is-compact" : ""/);
  assert.match(chatbot, /!loaded \? <p className="sr-only" role="status">Đang tải hỗ trợ…<\/p>/);
  assert.match(chatbot, /authenticated !== false \? <form aria-busy=\{!loaded\} className="himi-chatbot-composer"/);
  assert.match(chatbot, /disabled=\{!loaded \|\| busy\}/);
  assert.match(chatbot, /authenticated !== true \|\| busyRef\.current/);
});
