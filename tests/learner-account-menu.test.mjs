import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const readShell = () => readFile(
  new URL("../components/learner-app-shell.tsx", import.meta.url),
  "utf8",
);

const readLogoutForm = () => readFile(
  new URL("../components/logout-form.tsx", import.meta.url),
  "utf8",
);

const readLogoutRoute = () => readFile(
  new URL("../app/api/auth/logout/route.ts", import.meta.url),
  "utf8",
);

test("learner account menu keeps only profile and logout actions", async () => {
  const shell = await readShell();
  const menu = shell.match(/id="learner-account-menu"[\s\S]*?<\/LogoutForm>/)?.[0] ?? "";

  assert.match(menu, />Hồ sơ</);
  assert.match(menu, />Đăng xuất</);
  assert.doesNotMatch(menu, />Bảng học tập</);
  assert.doesNotMatch(menu, />Giới thiệu bạn bè</);
  assert.doesNotMatch(menu, />Cài đặt</);
  assert.doesNotMatch(menu, />Tải ứng dụng</);
});

test("logout clears the server session before forcing a fresh document navigation", async () => {
  const [shell, logoutForm, logoutRoute] = await Promise.all([
    readShell(),
    readLogoutForm(),
    readLogoutRoute(),
  ]);

  assert.match(shell, /<LogoutForm className="account-menu-logout">/);
  assert.match(logoutForm, /formData\.set\("responseMode", "json"\)/);
  assert.match(logoutForm, /credentials:\s*"same-origin"/);
  assert.match(logoutForm, /window\.location\.replace\(result\.redirectTo\)/);
  assert.match(logoutForm, /HTMLFormElement\.prototype\.submit\.call\(form\)/);
  assert.match(logoutRoute, /NextResponse\.json\(\{ ok: true, redirectTo: returnTo \}\)/);
  assert.match(logoutRoute, /Cache-Control", "no-store"/);
  assert.match(logoutRoute, /maxAge:\s*0/);
});
