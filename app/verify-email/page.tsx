import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Home, MailCheck } from "lucide-react";
import { AuthBrandMark, BrandWordmark } from "@/components/brand-logo";
import { EmailVerificationCodeForm } from "@/components/email-verification-code-form";
import { normalizeEmail, validateAuthToken, validateEmail } from "@/lib/auth-validation";
import {
  pendingEmailChangeCookieName,
  pendingEmailVerificationCookieName,
  verifyPendingEmailChangeToken,
} from "@/lib/pending-email-verification";

export const metadata: Metadata = {
  title: "Xác minh email",
  referrer: "origin",
  robots: { index: false, follow: false },
};

const errors: Record<string, string> = {
  delivery_failed: "Chưa gửi được email. Hãy thử lại sau hoặc kiểm tra cấu hình email của hệ thống.",
  invalid_code: "Mã xác minh không đúng, đã hết hạn hoặc đã được sử dụng.",
  invalid_or_expired: "Liên kết xác minh không hợp lệ, đã hết hạn hoặc đã được sử dụng.",
  rate_limited: "Có quá nhiều yêu cầu. Hãy đợi một lúc rồi thử lại.",
  email_change_not_allowed: "Phiên đổi email đã hết hạn. Hãy quay lại đăng nhập để xác nhận tài khoản trước khi đổi email.",
};

const emailChangeErrors: Record<string, string> = {
  email_in_use: "Email này đã thuộc về một tài khoản khác. Hãy dùng email khác.",
  invalid_change_credentials: "Mật khẩu chưa đúng. Hãy nhập mật khẩu của tài khoản đang chờ xác minh.",
  invalid_new_email: "Email mới chưa đúng định dạng. Hãy kiểm tra và nhập lại.",
};

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string; sent?: string; required?: string; email_changed?: string; error?: string; preview?: string }> }) {
  const params = await searchParams;
  const token = params.token?.slice(0, 128) ?? "";
  const hasToken = validateAuthToken(token);
  const cookieStore = await cookies();
  const previewEmail = process.env.NODE_ENV !== "production" && params.preview === "code" ? "preview@himi.local" : "";
  const pendingEmail = normalizeEmail(cookieStore.get(pendingEmailVerificationCookieName())?.value ?? previewEmail);
  const hasPendingEmail = validateEmail(pendingEmail);
  const emailChangeAuthorization = await verifyPendingEmailChangeToken(cookieStore.get(pendingEmailChangeCookieName())?.value);
  const canChangeEmail = hasPendingEmail && emailChangeAuthorization?.email === pendingEmail;
  const emailChangeErrorKey = params.error && params.error in emailChangeErrors ? params.error : undefined;
  const emailChangeError = emailChangeErrorKey ? emailChangeErrors[emailChangeErrorKey] : undefined;
  const newEmailError = emailChangeErrorKey === "email_in_use" || emailChangeErrorKey === "invalid_new_email" ? emailChangeError : undefined;
  const passwordError = emailChangeErrorKey === "invalid_change_credentials" ? emailChangeError : undefined;
  const heading = hasToken ? "Xác nhận email" : hasPendingEmail ? "Nhập mã xác minh" : "Gửi mã xác minh";
  const verificationPanel = <section className="auth-card auth-card-login-scene auth-card-register-scene auth-card-verify-scene">
      <div className="auth-icon"><MailCheck aria-hidden="true" size={24} /></div>
      <div className="auth-heading"><h1>{heading}</h1><p>{hasToken ? "Bấm xác nhận để kích hoạt tài khoản. Liên kết này chỉ dùng được một lần." : hasPendingEmail ? "Nhập đủ 6 số để hệ thống tự xác minh và đăng nhập ngay." : "Nhập email tài khoản để nhận một mã xác minh mới."}</p></div>
      {params.error && errors[params.error] ? <p className="auth-error" role="alert">{errors[params.error]}</p> : null}
      {!params.error && params.email_changed === "1" ? <p className="auth-notice" role="status">Đã cập nhật email và gửi một mã 6 số mới. Hãy kiểm tra cả thư rác.</p> : null}
      {hasToken ? <form action="/api/auth/verify-email" className="auth-form" method="post">
        <input name="token" type="hidden" value={token} />
        <button className="button button-primary button-full" type="submit">Xác minh và tiếp tục</button>
      </form> : hasPendingEmail ? <>
        <EmailVerificationCodeForm email={pendingEmail} invalid={params.error === "invalid_code"} />
        <form action="/api/auth/resend-verification" className="auth-resend-form" method="post">
          <input name="email" type="hidden" value={pendingEmail} />
          <button className="button button-primary button-full" type="submit">Gửi lại mã</button>
        </form>
        <details className="auth-change-email" open={Boolean(emailChangeError)}>
          <summary>Đổi email</summary>
          <form action="/api/auth/change-verification-email" className="auth-change-email-form" method="post">
            <p>{canChangeEmail ? "Himi sẽ cập nhật tài khoản và gửi mã mới đến địa chỉ này." : "Nhập email mới và mật khẩu hiện tại để bảo vệ tài khoản của bạn."}</p>
            <input name="currentEmail" type="hidden" value={pendingEmail} />
            <label htmlFor="new-verification-email">Email mới<input aria-describedby={newEmailError ? "new-verification-email-error" : undefined} autoCapitalize="none" autoComplete="email" id="new-verification-email" inputMode="email" maxLength={255} name="email" required type="email" /></label>
            {newEmailError ? <p className="auth-field-error" id="new-verification-email-error" role="alert">{newEmailError}</p> : null}
            {!canChangeEmail ? <>
              <label htmlFor="verification-email-password">Mật khẩu hiện tại<input aria-describedby={passwordError ? "verification-email-password-error" : undefined} autoComplete="current-password" id="verification-email-password" maxLength={128} name="password" required type="password" /></label>
              {passwordError ? <p className="auth-field-error" id="verification-email-password-error" role="alert">{passwordError}</p> : null}
            </> : null}
            <button className="button button-secondary button-full" type="submit">Cập nhật và gửi mã mới</button>
          </form>
        </details>
      </> : <form action="/api/auth/resend-verification" className="auth-form" method="post">
        <label>Email<input autoCapitalize="none" autoComplete="email" inputMode="email" maxLength={255} name="email" required type="email" /></label>
        <button className="button button-primary button-full" type="submit">Gửi mã xác minh</button>
      </form>}
      <div className="auth-switch"><Link href="/login">Quay lại đăng nhập</Link></div>
    </section>;

  return <main className="auth-page auth-page-login-scene auth-page-register-scene auth-page-verify-scene">
    <div className="auth-scene-stage"><div aria-hidden="true" className="auth-login-scene-art" />{verificationPanel}</div>
    <Link aria-label="Himi Chinese - Về trang chủ" className="auth-scene-brand" href="/"><AuthBrandMark priority /><BrandWordmark /></Link>
    <Link className="auth-scene-home" href="/"><Home aria-hidden="true" size={17} />Về trang chủ</Link>
  </main>;
}
