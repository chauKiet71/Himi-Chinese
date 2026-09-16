import { NextResponse } from "next/server";
import { withRequestDb } from "@/db/index";
import { authenticateWithPassword } from "@/lib/auth-service";
import { recordAuthEvent } from "@/lib/auth-audit";
import { sendAdminLoginCodeEmail } from "@/lib/auth-email";
import { consumeAuthRateLimit, clearSuccessfulLoginLimit } from "@/lib/auth-rate-limit";
import { createSession, sessionCookieName, sessionCookieOptions } from "@/lib/auth-session";
import {
  adminMfaCookieName,
  adminMfaCookieOptions,
  invalidateAdminMfaChallenge,
  issueAdminMfaChallenge,
} from "@/lib/admin-mfa";
import { sendEmailVerificationCode } from "@/lib/auth-workflows";
import {
  createPendingEmailChangeToken,
  pendingEmailChangeCookieName,
  pendingEmailChangeCookieOptions,
  pendingEmailVerificationCookieName,
  pendingEmailVerificationCookieOptions,
} from "@/lib/pending-email-verification";
import { normalizeEmail, safeAdminReturnTo, safeReturnTo, validateEmail, validatePassword } from "@/lib/auth-validation";
import { authRedirectUrl, formString, isSameOriginRequest } from "@/lib/request-security";
import { isPracticeStaffRole } from "@/lib/practice-workflow";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await request.formData();
  const mode = formString(formData, "mode", 20) === "admin" ? "admin" : "learner";
  const loginPath = mode === "admin" ? "/admin/login" : "/login";
  const returnTo = safeReturnTo(formString(formData, "returnTo"), mode === "admin" ? "/admin" : "/");
  const email = normalizeEmail(formString(formData, "email", 255));
  const password = formString(formData, "password", 128);

  return withRequestDb(async (database) => {
    const rateLimit = await consumeAuthRateLimit(request, "login", email || "invalid", database);
    if (!rateLimit.allowed) {
      await recordAuthEvent({ action: "auth.login.rate_limited", request, identifier: email, metadata: { mode } }, database);
      const response = NextResponse.redirect(authRedirectUrl(request, loginPath, { error: "rate_limited", returnTo }), 303);
      response.headers.set("Retry-After", String(rateLimit.retryAfterSeconds));
      return response;
    }

    if (!validateEmail(email) || !validatePassword(password)) {
      await recordAuthEvent({ action: "auth.login.failed", request, identifier: email, metadata: { mode, reason: "invalid_input" } }, database);
      return NextResponse.redirect(authRedirectUrl(request, loginPath, { error: "invalid_credentials", returnTo }), 303);
    }

    const user = await authenticateWithPassword(email, password, database);
    if (!user || (mode === "admin" && !isPracticeStaffRole(user.role))) {
      await recordAuthEvent({ action: "auth.login.failed", request, identifier: email, userId: user?.id, metadata: { mode, reason: user ? "role" : "credentials" } }, database);
      return NextResponse.redirect(authRedirectUrl(request, loginPath, { error: "invalid_credentials", returnTo }), 303);
    }

    if (!user.emailVerified) {
      let delivery: "brevo" | "console" | "failed" = "failed";
      try {
        delivery = await sendEmailVerificationCode(user, database);
      } catch (error) {
        console.error("Không thể gửi email xác minh.", error instanceof Error ? error.message : "unknown");
      }
      await recordAuthEvent({ action: "auth.email_verification.requested", request, identifier: email, userId: user.id, metadata: { delivery } }, database);
      const url = authRedirectUrl(request, "/verify-email");
      url.searchParams.set("required", "1");
      if (delivery === "failed") url.searchParams.set("error", "delivery_failed");
      const response = NextResponse.redirect(url, 303);
      response.cookies.set(pendingEmailVerificationCookieName(), email, pendingEmailVerificationCookieOptions());
      const changeToken = await createPendingEmailChangeToken(user.id, email);
      response.cookies.set(pendingEmailChangeCookieName(), changeToken, pendingEmailChangeCookieOptions());
      return response;
    }

    if (isPracticeStaffRole(user.role)) {
      const adminReturnTo = safeAdminReturnTo(returnTo);
      const staffReturnTo = user.role !== "admin" && adminReturnTo === "/admin" ? "/admin/practice" : adminReturnTo;
      const challenge = await issueAdminMfaChallenge(user.id, staffReturnTo, database);
      let delivery: "brevo" | "console" | "failed" = "failed";
      try {
        delivery = await sendAdminLoginCodeEmail(user, challenge.code, challenge.id);
      } catch (error) {
        await invalidateAdminMfaChallenge(challenge.challengeToken, database);
        console.error("Không thể gửi mã xác minh Console.", error instanceof Error ? error.message : "unknown");
      }
      await recordAuthEvent({
        action: delivery === "failed" ? "auth.admin_mfa.delivery_failed" : "auth.admin_mfa.challenge_issued",
        request,
        identifier: email,
        userId: user.id,
        metadata: { delivery, mode },
      }, database);
      if (delivery === "failed") {
        return NextResponse.redirect(authRedirectUrl(request, "/admin/login", { error: "mfa_delivery_failed", returnTo: staffReturnTo }), 303);
      }
      const response = NextResponse.redirect(authRedirectUrl(request, "/admin/mfa", { returnTo: staffReturnTo }), 303);
      response.cookies.set(adminMfaCookieName(), challenge.challengeToken, adminMfaCookieOptions(challenge.expiresAt));
      return response;
    }

    const session = await createSession(user.id, database);
    await clearSuccessfulLoginLimit(request, email, database);
    await recordAuthEvent({ action: "auth.login.succeeded", request, identifier: email, userId: user.id, metadata: { mode } }, database);
    const response = NextResponse.redirect(authRedirectUrl(request, returnTo), 303);
    response.cookies.set(sessionCookieName(), session.token, sessionCookieOptions(session.expiresAt));
    return response;
  });
}
