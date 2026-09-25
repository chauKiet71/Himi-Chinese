import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("reset password uses the shared paper scene without changing the reset flow", async () => {
  const [page, styles] = await Promise.all([
    read("app/reset-password/page.tsx"),
    read("app/globals.css"),
  ]);

  assert.match(page, /auth-page-reset-scene/u);
  assert.match(page, /auth-login-scene-art/u);
  assert.match(page, /auth-card-reset-scene/u);
  assert.match(page, /Himi Chinese - Về trang chủ/u);
  assert.match(page, /action="\/api\/auth\/reset-password"/u);
  assert.match(page, /name="password"/u);
  assert.match(page, /name="confirmPassword"/u);
  assert.match(styles, /\.auth-card-reset-scene/u);
});

test("successful password reset returns to login with a success notice", async () => {
  const [route, loginPage] = await Promise.all([
    read("app/api/auth/reset-password/route.ts"),
    read("app/login/page.tsx"),
  ]);
  assert.match(route, /\/login\?success=password_reset/);
  assert.match(loginPage, /params\.success \?\? params\.error/);
});
