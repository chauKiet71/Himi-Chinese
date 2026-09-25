import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("forgot-password reuses the learner authentication scene", async () => {
  const [page, authCard, brandLogo] = await Promise.all([
    read("app/forgot-password/page.tsx"),
    read("components/auth-card.tsx"),
    read("components/brand-logo.tsx"),
  ]);

  assert.match(page, /mode="forgot-password"/);
  assert.match(authCard, /learnerLogin \|\| registering \|\| forgotPassword/);
  assert.match(authCard, /forgotPassword \? "\/api\/auth\/forgot-password"/);
  assert.match(authCard, /forgotPassword \? "Gửi liên kết đặt lại"/);
  assert.match(authCard, /handleForgotPasswordSubmit/);
  assert.match(authCard, /Đang gửi liên kết/);
  assert.match(authCard, /auth-forgot-toast/);
  assert.match(authCard, /<strong>Yêu cầu đã được ghi nhận<\/strong>/);
  assert.doesNotMatch(authCard, /Nếu email khớp với một tài khoản, liên kết đặt lại đã được gửi/);
  assert.match(authCard, /aria-live="polite"/);
  assert.match(authCard, /Quay lại đăng nhập/);
  assert.match(authCard, /auth-page-forgot-scene/);
  assert.match(authCard, /auth-card-forgot-scene/);
  assert.match(authCard, /if \(typeof window !== "undefined"\) gsap\.registerPlugin\(useGSAP\);/);
  assert.match(authCard, /<AuthBrandMark priority \/><BrandWordmark \/>/);
  assert.match(brandLogo, /himi-sidebar-logo-transparent\.webp/);
});
