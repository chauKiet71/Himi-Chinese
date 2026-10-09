"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";

const messages: Record<string, string> = {
  invalid_credentials: "Mật khẩu hoặc mã xác thực hiện tại không đúng. Hãy kiểm tra và thử lại.",
  invalid_code: "Mã không đúng hoặc phiên thiết lập đã hết hạn. Lấy mã mới hoặc bắt đầu lại.",
  rate_limited: "Bạn đã thử quá nhiều lần. Hãy đợi một lúc rồi thử lại.",
  reauth_required: "Vui lòng đăng nhập lại để thay đổi cài đặt xác thực.",
  not_configured: "Chức năng xác thực chưa được cấu hình. Vui lòng liên hệ người quản lý hệ thống.",
  login_required: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
};
type Setup = { secret: string; qr: string; expiresAt: string };

export function AdminTotpSettings({ initiallyEnabled, configured }: { initiallyEnabled: boolean; configured: boolean }) {
  const [enabled, setEnabled] = useState(initiallyEnabled);
  const [setup, setSetup] = useState<Setup | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/auth/admin-totp", { method: "POST", body: data, cache: "no-store" });
      const result = await response.json();
      if (!response.ok) { setError(result.error ?? "failed"); return; }
      form.reset();
      if (data.get("action") === "begin") { setSetup(result); setRecoveryCodes([]); }
      else { setSetup(null); setEnabled(true); setRecoveryCodes(result.recoveryCodes); }
    } catch { setError("failed"); } finally { setBusy(false); }
  }
  return <section className="admin-panel">
    <div className="panel-heading"><h2>Xác thực bằng ứng dụng</h2><span>{enabled ? "TOTP đang bật" : "Chưa bật TOTP"}</span></div>
    <p>{enabled ? "Khi đăng nhập Console, dùng mã từ ứng dụng xác thực hoặc một mã khôi phục." : "Thiết lập ứng dụng xác thực để thay thế mã đăng nhập qua email."}</p>
    {error ? <p className="auth-error" role="alert">{messages[error] ?? "Chưa hoàn tất thao tác. Hãy thử lại."}</p> : null}
    {error === "reauth_required" || error === "login_required" ? <Link href="/admin/login?error=reauth_required&returnTo=%2Fadmin%2Fsecurity">Đăng nhập lại</Link> : null}
    {!configured ? <p role="status">Chức năng xác thực chưa được cấu hình. Vui lòng liên hệ người quản lý hệ thống.</p> : null}
    {recoveryCodes.length ? <section aria-label="Mã khôi phục">
      <h3>Đã kích hoạt TOTP</h3><p>Lưu các mã dưới đây ở nơi an toàn trước khi rời trang. Mỗi mã dùng một lần; chúng chỉ hiển thị ở lần này.</p>
      <pre aria-label="Danh sách mã khôi phục">{recoveryCodes.join("\n")}</pre>
      <button className="button button-secondary" type="button" onClick={async () => {
        try { await navigator.clipboard.writeText(recoveryCodes.join("\n")); } catch { setError("failed"); }
      }}>Sao chép mã khôi phục</button>
      <button className="button button-primary" type="button" onClick={() => setRecoveryCodes([])}>Tôi đã lưu các mã</button>
    </section> : setup ? <section aria-label="Kết nối ứng dụng xác thực">
      <p>Quét QR bằng ứng dụng Authenticator hoặc nhập key thủ công. Phiên thiết lập có hiệu lực 10 phút.</p>
      <Image alt="QR thiết lập ứng dụng xác thực" src={setup.qr} width={240} height={240} unoptimized />
      <p>Key thiết lập: <code style={{ overflowWrap: "anywhere" }}>{setup.secret}</code></p>
      <form className="auth-form" onSubmit={submit}>
        <input type="hidden" name="action" value="confirm" />
        <label><span>Mã 6 số từ ứng dụng</span><input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" minLength={6} maxLength={6} required /></label>
        <button className="button button-primary" disabled={busy} type="submit">{busy ? "Đang xác nhận…" : "Xác nhận và bật TOTP"}</button>
      </form>
      <button className="button button-secondary" disabled={busy} onClick={() => setSetup(null)} type="button">Bắt đầu lại</button>
    </section> : configured ? <form className="auth-form" onSubmit={submit}>
      <input type="hidden" name="action" value="begin" />
      <label><span>Mật khẩu hiện tại</span><input type="password" name="password" autoComplete="current-password" maxLength={128} required /></label>
      {enabled ? <label><span>Mã TOTP hiện tại hoặc mã khôi phục</span><input name="currentCode" autoComplete="one-time-code" maxLength={32} required /></label> : null}
      {enabled ? <p>Khi xác nhận key mới, key cũ và các mã khôi phục cũ sẽ hết hiệu lực.</p> : null}
      <button className="button button-primary" disabled={busy} type="submit">{busy ? "Đang chuẩn bị…" : enabled ? "Thiết lập key mới" : "Thiết lập TOTP"}</button>
    </form> : null}
  </section>;
}
