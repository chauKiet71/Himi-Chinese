import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("registration verification sends and accepts a fixed-email six digit code", async () => {
  const [registerRoute, loginRoute, resendRoute, verifyPage, codeForm, verifyRoute, changeEmailRoute, pendingEmail, workflow, emailTemplate, authCard] = await Promise.all([
    read("app/api/auth/register/route.ts"),
    read("app/api/auth/login/route.ts"),
    read("app/api/auth/resend-verification/route.ts"),
    read("app/verify-email/page.tsx"),
    read("components/email-verification-code-form.tsx"),
    read("app/api/auth/verify-email/route.ts"),
    read("app/api/auth/change-verification-email/route.ts"),
    read("lib/pending-email-verification.ts"),
    read("lib/auth-workflows.ts"),
    read("lib/auth-email.ts"),
    read("components/auth-card.tsx"),
  ]);

  assert.match(registerRoute, /sendEmailVerificationCode\(user\)/u);
  assert.match(registerRoute, /pendingEmailVerificationCookieName/u);
  assert.match(workflow, /issueEmailVerificationCode/u);
  assert.match(emailTemplate, /Mã xác minh email Himi Chinese/u);
  assert.match(codeForm, /autoComplete="one-time-code"/u);
  assert.match(codeForm, /inputMode="numeric"/u);
  assert.match(codeForm, /pattern="\[0-9\]\{6\}"/u);
  assert.match(codeForm, /code\.length !== 6/u);
  assert.match(codeForm, /requestSubmit\(\)/u);
  assert.match(codeForm, /name="email" type="hidden" value=\{email\}/u);
  assert.doesNotMatch(codeForm, /Tự động xác minh khi nhập đủ 6 số/u);
  assert.doesNotMatch(verifyPage, /Mã 6 số đã được gửi\. Bạn có thể nhập ngay bên dưới/u);
  assert.doesNotMatch(verifyPage, /Bảo mật tài khoản/u);
  assert.doesNotMatch(verifyPage, /Mã được gửi đến/u);
  assert.match(verifyRoute, /verifyEmailCode\(email, code\)/u);
  assert.match(verifyRoute, /verifyEmailToken\(token\)/u);
  assert.match(verifyPage, /<summary>Đổi email<\/summary>/u);
  assert.match(verifyPage, /auth-page-verify-scene/u);
  assert.match(verifyPage, /auth-login-scene-art/u);
  assert.match(verifyPage, /auth-card-verify-scene/u);
  assert.match(verifyPage, /Himi Chinese - Về trang chủ/u);
  assert.match(verifyPage, /Mật khẩu hiện tại/u);
  assert.match(changeEmailRoute, /verifyPendingEmailChangeToken/u);
  assert.match(changeEmailRoute, /verifiedAuthorization\?\.email === currentEmail/u);
  assert.match(changeEmailRoute, /changeUnverifiedUserEmail/u);
  assert.match(pendingEmail, /pending-email-change:/u);
  assert.match(registerRoute, /if \(result\.user\)/u);
  assert.match(registerRoute, /result\.duplicate && \(!user \|\| user\.emailVerified\)/u);
  assert.match(registerRoute, /error: "email_in_use", ok: false/u);
  assert.match(registerRoute, /error: "delivery_failed", ok: false/u);
  assert.match(registerRoute, /authRedirectUrl\(request, "\/verify-email"\)/u);
  assert.match(resendRoute, /authRedirectUrl\(request, "\/verify-email"\)/u);
  assert.match(authCard, /delivery_failed: "Chưa gửi được mã xác minh/u);
  assert.match(loginRoute, /createPendingEmailChangeToken\(user\.id, email\)/u);
  assert.doesNotMatch(resendRoute, /pendingEmailChangeCookieName/u);
});
