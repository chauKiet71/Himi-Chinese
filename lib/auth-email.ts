import "server-only";
import type { AuthTokenPurpose, IssuedAuthToken, IssuedEmailVerificationCode } from "./auth-token-service.ts";
import { hashPrivateIdentifier } from "./auth-crypto.ts";

type AuthEmailUser = { email: string; displayName: string };
const DEFAULT_AUTH_EMAIL_SENDER_NAME = "Himi Chinese";
const BRAND_RED = "#FF4C3B";
const BRAND_ORANGE = "#FF8E2D";
const BRAND_INK = "#222222";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/gu, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  })[character] ?? character);
}

function appBaseUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!configuredUrl && process.env.NODE_ENV === "production") throw new Error("NEXT_PUBLIC_APP_URL chưa được cấu hình.");
  const value = configuredUrl ?? "http://localhost:3000";
  const url = new URL(value);
  if (!/^https?:$/u.test(url.protocol)) throw new Error("NEXT_PUBLIC_APP_URL phải dùng http hoặc https.");
  return url.origin;
}

function authLink(purpose: AuthTokenPurpose, token: string): string {
  const pathname = purpose === "verify_email" ? "/verify-email" : "/reset-password";
  const url = new URL(pathname, appBaseUrl());
  url.searchParams.set("token", token);
  return url.toString();
}

function renderBrandedAuthEmail(input: {
  body: string;
  eyebrow: string;
  greeting: string;
  note: string;
  title: string;
  action?: { href: string; label: string };
  code?: string;
}): string {
  const logoUrl = escapeHtml(new URL("/assets/brand/himi-mascot-icon.png", appBaseUrl()).toString());
  const action = input.action
    ? `<tr><td style="padding:8px 36px 30px"><a href="${escapeHtml(input.action.href)}" style="display:inline-block;padding:15px 24px;border-radius:12px;background:${BRAND_RED};color:#FFFFFF;text-decoration:none;font-size:15px;font-weight:800;box-shadow:0 8px 20px rgba(255,76,59,.22)">${escapeHtml(input.action.label)} &nbsp;→</a></td></tr>`
    : "";
  const code = input.code
    ? `<tr><td style="padding:6px 36px 28px"><div style="padding:18px 14px;border:1px solid #FFD5CE;border-radius:14px;background:#FFF0EE;color:${BRAND_INK};font-size:31px;font-weight:800;letter-spacing:.24em;text-align:center">${escapeHtml(input.code)}</div></td></tr>`
    : "";

  return `<!doctype html><html><body style="margin:0;padding:0;background:#FFF8F2;color:${BRAND_INK};font-family:Arial,'Helvetica Neue',sans-serif"><div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(input.title)} — Himi Chinese</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#FFF8F2"><tr><td align="center" style="padding:30px 14px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:580px;overflow:hidden;border:1px solid #F1DED7;border-radius:22px;background:#FFFFFF;box-shadow:0 18px 48px rgba(70,42,32,.08)"><tr><td style="height:6px;background:linear-gradient(90deg,${BRAND_RED},${BRAND_ORANGE})"></td></tr><tr><td style="padding:26px 36px 20px"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td style="padding-right:12px"><img src="${logoUrl}" width="52" height="52" alt="Himi Chinese" style="display:block;width:52px;height:52px;border:0;border-radius:15px"></td><td style="font-size:20px;font-weight:800;line-height:1.1"><span style="color:${BRAND_RED}">Himi</span> <span style="color:${BRAND_INK}">Chinese</span><div style="margin-top:5px;color:#7A6E69;font-size:11px;font-weight:600;letter-spacing:.03em">TIẾNG TRUNG CHO NGƯỜI ĐI LÀM</div></td></tr></table></td></tr><tr><td style="padding:8px 36px 0;color:${BRAND_RED};font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase">${escapeHtml(input.eyebrow)}</td></tr><tr><td style="padding:10px 36px 0"><h1 style="margin:0;color:${BRAND_INK};font-size:28px;line-height:1.25;letter-spacing:-.02em">${escapeHtml(input.title)}</h1></td></tr><tr><td style="padding:18px 36px 8px;color:#554B47;font-size:15px;line-height:1.7"><p style="margin:0 0 12px">${input.greeting}</p>${input.body}</td></tr>${code}${action}<tr><td style="padding:20px 36px;border-top:1px solid #F0E4DF;background:#FFFBF8;color:#7A6E69;font-size:12px;line-height:1.6">${escapeHtml(input.note)}</td></tr><tr><td style="padding:18px 36px;color:#9A8E89;font-size:11px;text-align:center">© Himi Chinese · Học tiếng Trung mỗi ngày cùng Himi</td></tr></table></td></tr></table></body></html>`;
}

async function deliverEmail(input: {
  to: string;
  subject: string;
  text: string;
  html: string;
  idempotencyKey: string;
  developmentLink?: string;
}): Promise<"brevo" | "console"> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const fromEmail = process.env.BREVO_FROM_EMAIL?.trim();
  const fromName = process.env.BREVO_FROM_NAME?.trim() || DEFAULT_AUTH_EMAIL_SENDER_NAME;
  if (!apiKey || !fromEmail) {
    const partiallyConfigured = Boolean(apiKey || fromEmail);
    if (process.env.NODE_ENV === "production" || partiallyConfigured) {
      throw new Error("BREVO_API_KEY và BREVO_FROM_EMAIL chưa được cấu hình đầy đủ.");
    }
    console.info(`[Himi Chinese email dev] ${input.subject}: ${input.to}${input.developmentLink ? ` -> ${input.developmentLink}` : ""}`);
    return "console";
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { email: fromEmail, name: fromName },
      to: [{ email: input.to }],
      subject: input.subject,
      textContent: input.text,
      htmlContent: input.html,
      headers: { "Idempotency-Key": input.idempotencyKey },
      tags: ["hanziwork-auth"],
    }),
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => null) as { code?: string; message?: string } | null;
    const reason = detail?.message || detail?.code;
    throw new Error(`Brevo trả về HTTP ${response.status}${reason ? `: ${reason}` : "."}`);
  }
  return "brevo";
}

export async function sendAuthLinkEmail(user: AuthEmailUser, purpose: AuthTokenPurpose, issued: IssuedAuthToken): Promise<"brevo" | "console"> {
  const link = authLink(purpose, issued.token);
  const verification = purpose === "verify_email";
  const title = verification ? "Xác minh email Himi Chinese" : "Đặt lại mật khẩu Himi Chinese";
  const instruction = verification
    ? "Xác nhận địa chỉ email để kích hoạt tài khoản và bắt đầu lưu tiến độ học."
    : "Mở liên kết để đặt mật khẩu mới. Liên kết chỉ dùng một lần và hết hạn sau 30 phút.";
  const button = verification ? "Xác minh email" : "Đặt lại mật khẩu";
  const safeName = escapeHtml(user.displayName);
  return deliverEmail({
    to: user.email,
    subject: title,
    text: `Xin chào ${user.displayName},\n\n${instruction}\n\n${link}\n\nNếu bạn không thực hiện yêu cầu này, hãy bỏ qua email.`,
    html: renderBrandedAuthEmail({
      action: { href: link, label: button },
      body: `<p style="margin:0">${escapeHtml(instruction)}</p>`,
      eyebrow: verification ? "Bảo mật tài khoản" : "Khôi phục tài khoản",
      greeting: `Xin chào ${safeName},`,
      note: "Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email. Tài khoản của bạn vẫn an toàn.",
      title,
    }),
    idempotencyKey: `${purpose}/${issued.id}`,
    developmentLink: link,
  });
}

export async function sendPasswordChangedEmail(user: AuthEmailUser): Promise<"brevo" | "console"> {
  const subject = "Mật khẩu Himi Chinese đã được thay đổi";
  const emailKey = await hashPrivateIdentifier(user.email);
  return deliverEmail({
    to: user.email,
    subject,
    text: `Xin chào ${user.displayName},\n\nMật khẩu Himi Chinese của bạn vừa được thay đổi. Mọi phiên đăng nhập cũ đã bị thu hồi. Nếu đây không phải là bạn, hãy liên hệ hỗ trợ ngay.`,
    html: renderBrandedAuthEmail({
      body: "<p style=\"margin:0 0 12px\">Mật khẩu của bạn vừa được thay đổi. Mọi phiên đăng nhập cũ đã bị thu hồi.</p><p style=\"margin:0;color:#D43D31;font-weight:700\">Nếu đây không phải là bạn, hãy liên hệ hỗ trợ ngay.</p>",
      eyebrow: "Thông báo bảo mật",
      greeting: `Xin chào ${escapeHtml(user.displayName)},`,
      note: "Đây là email tự động nhằm bảo vệ tài khoản Himi Chinese của bạn.",
      title: subject,
    }),
    idempotencyKey: `password-changed/${emailKey}/${Date.now()}`,
  });
}

export async function sendEmailVerificationCodeEmail(
  user: AuthEmailUser,
  issued: IssuedEmailVerificationCode,
): Promise<"brevo" | "console"> {
  const subject = "Mã xác minh email Himi Chinese";
  const safeName = escapeHtml(user.displayName);
  const safeCode = escapeHtml(issued.code);
  return deliverEmail({
    to: user.email,
    subject,
    text: `Xin chào ${user.displayName},\n\nMã xác minh tài khoản Himi Chinese của bạn là: ${issued.code}\n\nMã hết hạn sau 10 phút và chỉ dùng được một lần. Nếu bạn không đăng ký tài khoản, hãy bỏ qua email này.`,
    html: renderBrandedAuthEmail({
      body: "<p style=\"margin:0\">Nhập mã bên dưới để xác minh email và kích hoạt tài khoản học tập của bạn.</p>",
      code: safeCode,
      eyebrow: "Kích hoạt tài khoản",
      greeting: `Xin chào ${safeName},`,
      note: "Mã hết hạn sau 10 phút và chỉ dùng được một lần. Nếu bạn không đăng ký tài khoản, hãy bỏ qua email này.",
      title: subject,
    }),
    idempotencyKey: `verify-email/${issued.id}`,
    developmentLink: `code=${issued.code}`,
  });
}

export async function sendAdminLoginCodeEmail(
  user: AuthEmailUser,
  code: string,
  challengeId: string,
): Promise<"brevo" | "console"> {
  const subject = "Mã xác minh đăng nhập Himi Chinese Console";
  const safeName = escapeHtml(user.displayName);
  const safeCode = escapeHtml(code);
  return deliverEmail({
    to: user.email,
    subject,
    text: `Xin chào ${user.displayName},\n\nMã xác minh đăng nhập Console của bạn là: ${code}\n\nMã hết hạn sau 10 phút và chỉ dùng được một lần. Nếu bạn không thực hiện yêu cầu này, hãy đổi mật khẩu ngay.`,
    html: renderBrandedAuthEmail({
      body: "<p style=\"margin:0\">Nhập mã bên dưới để hoàn tất đăng nhập Himi Chinese Console.</p>",
      code: safeCode,
      eyebrow: "Xác minh quản trị",
      greeting: `Xin chào ${safeName},`,
      note: "Mã hết hạn sau 10 phút và chỉ dùng được một lần. Nếu bạn không thực hiện yêu cầu này, hãy đổi mật khẩu ngay.",
      title: subject,
    }),
    idempotencyKey: `admin-mfa/${challengeId}`,
    developmentLink: `code=${code}`,
  });
}
