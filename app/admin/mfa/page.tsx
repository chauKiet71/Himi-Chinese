import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminMfaCookieName, getPendingAdminMfaMethod } from "@/lib/admin-mfa";
import { KeyRound, ShieldCheck } from "lucide-react";
import { BrandMark, BrandWordmark } from "@/components/brand-logo";

export const metadata: Metadata = {
  title: "Xác minh đăng nhập quản trị",
  robots: { index: false, follow: false, nocache: true },
};

const errorMessages: Record<string, string> = {
  mfa_expired: "Phiên xác minh đã hết hạn. Hãy đăng nhập lại để nhận mã mới.",
  mfa_invalid: "Mã xác minh không đúng hoặc đã được sử dụng. Hãy lấy mã mới và thử lại.",
  rate_limited: "Bạn đã thử quá nhiều lần. Hãy đợi một lúc rồi đăng nhập lại.",
};

export default async function AdminMfaPage({ searchParams }: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const method = await getPendingAdminMfaMethod((await cookies()).get(adminMfaCookieName())?.value);
  if (!method) redirect("/admin/login?error=mfa_expired");
  const totp = method === "totp";
  return <main className="auth-page">
    <section className="auth-card auth-card-admin">
      <div className="auth-brand"><BrandMark priority /><BrandWordmark /></div>
      <div className="auth-icon"><ShieldCheck aria-hidden="true" size={24} /></div>
      <div className="auth-heading">
        <span>Himi Chinese Console</span>
        <h1>Xác minh bước hai</h1>
        <p>{totp ? "Nhập mã 6 số từ ứng dụng xác thực của bạn. Bạn cũng có thể dùng một mã khôi phục." : "Nhập mã 6 số vừa được gửi đến email quản trị. Mã chỉ dùng một lần và hết hạn sau 10 phút."}</p>
      </div>
      {error && errorMessages[error] ? <p className="auth-error" role="alert">{errorMessages[error]}</p> : null}
      <form action="/api/auth/admin-mfa" className="auth-form" method="post">
        <label>
          <span>Mã xác minh</span>
          <span className="auth-input-shell">
            <KeyRound aria-hidden="true" size={18} />
            <input
              autoComplete="one-time-code"
              autoFocus
              inputMode={totp ? "text" : "numeric"}
              maxLength={totp ? 32 : 6}
              minLength={6}
              name="code"
              pattern={totp ? undefined : "[0-9]{6}"}
              placeholder="000000"
              required
              type="text"
            />
          </span>
        </label>
        <button className="button button-primary button-full" type="submit">Hoàn tất đăng nhập</button>
      </form>
      <div className="auth-switch"><Link href="/admin/login?error=reauth_required">{totp ? "Đăng nhập lại" : "Nhận mã khác"}</Link><span>·</span><Link href="/">Về trang chủ</Link></div>
    </section>
  </main>;
}
