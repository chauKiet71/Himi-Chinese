import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const readShell = () => readFile(
  new URL("../components/learner-app-shell.tsx", import.meta.url),
  "utf8",
);

test("learner account menu keeps only profile and logout actions", async () => {
  const shell = await readShell();
  const menu = shell.match(/id="learner-account-menu"[\s\S]*?<\/form>/)?.[0] ?? "";

  assert.match(menu, />Hồ sơ</);
  assert.match(menu, />Đăng xuất</);
  assert.doesNotMatch(menu, />Bảng học tập</);
  assert.doesNotMatch(menu, />Giới thiệu bạn bè</);
  assert.doesNotMatch(menu, />Cài đặt</);
  assert.doesNotMatch(menu, />Tải ứng dụng</);
});
