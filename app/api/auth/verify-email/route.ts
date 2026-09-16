import { NextResponse } from "next/server";
import { recordAuthEvent } from "@/lib/auth-audit";
import { consumeAuthRateLimit } from "@/lib/auth-rate-limit";
import { createSession, sessionCookieName, sessionCookieOptions } from "@/lib/auth-session";
import { verifyEmailCode, verifyEmailToken } from "@/lib/auth-token-service";
import { normalizeEmail, validateAuthToken, validateEmail, validateEmailVerificationCode } from "@/lib/auth-validation";
import {
  clearPendingEmailChangeCookieOptions,
  clearPendingEmailVerificationCookieOptions,
  pendingEmailChangeCookieName,
  pendingEmailVerificationCookieName,
  pendingEmailVerificationCookieOptions,
} from "@/lib/pending-email-verification";
import { formString, isSameOriginRequest } from "@/lib/request-security";

function verificationFailure(request: Request, error: string, email: string) {
  const response = NextResponse.redirect(new URL(`/verify-email?error=${error}`, request.url), 303);
  if (validateEmail(email)) {
    response.cookies.set(pendingEmailVerificationCookieName(), email, pendingEmailVerificationCookieOptions());
  }
  return response;
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const formData = await request.formData();
  const token = formString(formData, "token", 128);
  const email = normalizeEmail(formString(formData, "email", 255));
  const code = formString(formData, "code", 6).trim();
  const usesCode = validateEmail(email) && validateEmailVerificationCode(code);
  const usesToken = validateAuthToken(token);
  const rateLimit = await consumeAuthRateLimit(request, "verify_email", email || token || "invalid");
  if (!rateLimit.allowed) {
    await recordAuthEvent({ action: "auth.email_verification.rate_limited", request, identifier: email });
    const response = verificationFailure(request, "rate_limited", email);
    response.headers.set("Retry-After", String(rateLimit.retryAfterSeconds));
    return response;
  }
  if (!usesCode && !usesToken) {
    return verificationFailure(request, email ? "invalid_code" : "invalid_or_expired", email);
  }

  const user = usesCode ? await verifyEmailCode(email, code) : await verifyEmailToken(token);
  if (!user) {
    await recordAuthEvent({ action: "auth.email_verification.failed", request, identifier: email });
    return verificationFailure(request, usesCode ? "invalid_code" : "invalid_or_expired", email);
  }

  const session = await createSession(user.id);
  await recordAuthEvent({ action: "auth.email_verification.succeeded", request, userId: user.id });
  const response = NextResponse.redirect(new URL("/?verified=1", request.url), 303);
  response.cookies.set(sessionCookieName(), session.token, sessionCookieOptions(session.expiresAt));
  response.cookies.set(pendingEmailVerificationCookieName(), "", clearPendingEmailVerificationCookieOptions());
  response.cookies.set(pendingEmailChangeCookieName(), "", clearPendingEmailChangeCookieOptions());
  return response;
}
