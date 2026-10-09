import QRCode from "qrcode";
import { getCurrentUser, createSession, sessionCookieName, sessionCookieOptions } from "@/lib/auth-session";
import { beginAdminTotpSetup, confirmAdminTotpSetup } from "@/lib/admin-totp";
import { consumeAuthRateLimit } from "@/lib/auth-rate-limit";
import { formString, isSameOriginRequest } from "@/lib/request-security";
import { isPracticeStaffRole } from "@/lib/practice-workflow";
import { totpEncryptionConfigured } from "@/lib/totp-crypto";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store", Vary: "Cookie", "Referrer-Policy": "no-referrer" };
export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "forbidden" }, { status: 403, headers });
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "login_required" }, { status: 401, headers });
  if (!isPracticeStaffRole(user.role)) return NextResponse.json({ error: "forbidden" }, { status: 403, headers });
  if (!user.sessionCreatedAt || Date.now() - user.sessionCreatedAt.getTime() > 15 * 60_000) {
    return NextResponse.json({ error: "reauth_required" }, { status: 409, headers });
  }
  if (!totpEncryptionConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503, headers });
  const limit = await consumeAuthRateLimit(request, "admin_mfa", `totp-setup:${user.id}`);
  if (!limit.allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { ...headers, "Retry-After": String(limit.retryAfterSeconds) } });
  const form = await request.formData();
  const action = formString(form, "action", 12);
  if (action === "begin") {
    const password = formString(form, "password", 128);
    if (!password || password.length > 128) return NextResponse.json({ error: "invalid_credentials" }, { status: 400, headers });
    const result = await beginAdminTotpSetup(user.id, password, formString(form, "currentCode", 32));
    if (!result) return NextResponse.json({ error: "invalid_credentials" }, { status: 400, headers });
    // QR is generated locally; the provisioning secret never goes to a QR API.
    const svg = await QRCode.toString(result.uri, { type: "svg", margin: 4, errorCorrectionLevel: "M" });
    return NextResponse.json({ ...result, qr: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}` }, { headers });
  }
  if (action === "confirm") {
    const result = await confirmAdminTotpSetup(user.id, formString(form, "code", 6).trim());
    if (!result) return NextResponse.json({ error: "invalid_code" }, { status: 400, headers });
    const session = await createSession(user.id);
    const response = NextResponse.json(result, { headers });
    response.cookies.set(sessionCookieName(), session.token, sessionCookieOptions(session.expiresAt));
    return response;
  }
  return NextResponse.json({ error: "invalid_action" }, { status: 400, headers });
}
