import { NextResponse } from "next/server";
import { withRequestDb } from "@/db/index";
import {
  adminMfaCookieName,
  clearAdminMfaCookieOptions,
  verifyAdminMfaChallenge,
} from "@/lib/admin-mfa";
import { recordAuthEvent } from "@/lib/auth-audit";
import { clearSuccessfulLoginLimit, consumeAuthRateLimit } from "@/lib/auth-rate-limit";
import { createSession, revokeUserSessions, sessionCookieName, sessionCookieOptions } from "@/lib/auth-session";
import { authRedirectUrl, formString, isSameOriginRequest } from "@/lib/request-security";

function cookieValue(request: Request, name: string): string | undefined {
  const cookieHeader = request.headers.get("cookie") ?? "";
  return cookieHeader
    .split(";")
    .map((part) => part.trim().split("="))
    .find(([cookieName]) => cookieName === name)
    ?.slice(1)
    .join("=");
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const challengeCookieName = adminMfaCookieName();
  const challengeToken = cookieValue(request, challengeCookieName);
  const formData = await request.formData();
  const code = formString(formData, "code", 6).trim();

  if (!challengeToken) {
    return NextResponse.redirect(authRedirectUrl(request, "/admin/login", { error: "mfa_expired" }), 303);
  }

  return withRequestDb(async (database) => {
    const rateLimit = await consumeAuthRateLimit(request, "admin_mfa", challengeToken, database);
    if (!rateLimit.allowed) {
      await recordAuthEvent({ action: "auth.admin_mfa.rate_limited", request }, database);
      const response = NextResponse.redirect(authRedirectUrl(request, "/admin/mfa", { error: "rate_limited" }), 303);
      response.headers.set("Retry-After", String(rateLimit.retryAfterSeconds));
      return response;
    }

    const result = await verifyAdminMfaChallenge(challengeToken, code, database);
    if (!result.ok) {
      await recordAuthEvent({ action: "auth.admin_mfa.failed", request, metadata: { reason: result.error } }, database);
      const path = result.error === "invalid_code" ? "/admin/mfa" : "/admin/login";
      const response = NextResponse.redirect(authRedirectUrl(request, path, { error: result.error === "invalid_code" ? "mfa_invalid" : "mfa_expired" }), 303);
      if (result.error !== "invalid_code") response.cookies.set(challengeCookieName, "", clearAdminMfaCookieOptions());
      return response;
    }

    await revokeUserSessions(result.user.id, database);
    const session = await createSession(result.user.id, database);
    await clearSuccessfulLoginLimit(request, result.user.email, database);
    await recordAuthEvent({
      action: "auth.login.succeeded",
      request,
      identifier: result.user.email,
      userId: result.user.id,
      metadata: { mfa: "email_code", mode: "admin" },
    }, database);

    const response = NextResponse.redirect(authRedirectUrl(request, result.returnTo), 303);
    response.cookies.set(sessionCookieName(), session.token, sessionCookieOptions(session.expiresAt));
    response.cookies.set(challengeCookieName, "", clearAdminMfaCookieOptions());
    return response;
  });
}
