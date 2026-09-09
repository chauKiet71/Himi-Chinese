import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound, ShieldCheck } from "lucide-react";
import { BrandMark, BrandWordmark } from "@/components/brand-logo";

export const metadata: Metadata = {
  title: "Xác minh đăng nhập quản trị",
  robots: { index: false, follow: false, nocache: true },
};

const errorMessages: Record<string, string> = {
  mfa_expired: "Phiên xác minh đã hết hạn. Hãy đăng nhập lại để nhận mã mới.",
  mfa_invalid: "Mã xác minh chưa đúng. Hãy kiểm tra email và thử lại.",
  rate_limited: "Bạn đã thử quá nhiều lần. Hãy đợi một lúc rồi đăng nhập lại.",
};

export default async function AdminMfaPage({ searchParams }: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return <main className="auth-page">
    <section className="auth-card auth-card-admin">
      <div className="auth-brand"><BrandMark priority /><BrandWordmark /></div>
      <div className="auth-icon"><ShieldCheck aria-hidden="true" size={24} /></div>
      <div className="auth-heading">
        <span>Himi Chinese Console</span>
        <h1>Xác minh bước hai</h1>
        <p>Nhập mã 6 số vừa được gửi đến email quản trị. Mã chỉ dùng một lần và hết hạn sau 10 phút.</p>
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
              inputMode="numeric"
              maxLength={6}
              minLength={6}
              name="code"
              pattern="[0-9]{6}"
              placeholder="000000"
              required
              type="text"
            />
          </span>
        </label>
        <button className="button button-primary button-full" type="submit">Hoàn tất đăng nhập</button>
      </form>
      <div className="auth-switch"><Link href="/admin/login?error=reauth_required">Nhận mã khác</Link><span>·</span><Link href="/">Về trang chủ</Link></div>
    </section>
  </main>;
}
