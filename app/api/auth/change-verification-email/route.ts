import { type NextRequest, NextResponse } from "next/server";
import { withRequestDb } from "@/db/index";
import { recordAuthEvent } from "@/lib/auth-audit";
import { consumeAuthRateLimit } from "@/lib/auth-rate-limit";
import { authenticateWithPassword, changeUnverifiedUserEmail } from "@/lib/auth-service";
import { normalizeEmail, validateEmail } from "@/lib/auth-validation";
import { sendEmailVerificationCode } from "@/lib/auth-workflows";
import {
  createPendingEmailChangeToken,
  pendingEmailChangeCookieName,
  pendingEmailChangeCookieOptions,
  pendingEmailVerificationCookieName,
  pendingEmailVerificationCookieOptions,
  verifyPendingEmailChangeToken,
} from "@/lib/pending-email-verification";
import { formString, isSameOriginRequest } from "@/lib/request-security";

function redirectToVerification(request: Request, error?: string) {
  const url = new URL("/verify-email", request.url);
  if (error) url.searchParams.set("error", error);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await request.formData();
  const nextEmail = normalizeEmail(formString(formData, "email", 255));
  const currentEmail = normalizeEmail(formString(formData, "currentEmail", 255));
  const password = formString(formData, "password", 128);
  if (!validateEmail(nextEmail)) return redirectToVerification(request, "invalid_new_email");
  const verifiedAuthorization = await verifyPendingEmailChangeToken(request.cookies.get(pendingEmailChangeCookieName())?.value);
  const signedAuthorization = verifiedAuthorization?.email === currentEmail ? verifiedAuthorization : null;

  return withRequestDb(async (database) => {
    let authorization = signedAuthorization;
    if (!authorization) {
      const credentialLimit = await consumeAuthRateLimit(request, "login", currentEmail || "invalid", database);
      if (!credentialLimit.allowed) {
        await recordAuthEvent({ action: "auth.email_change.rate_limited", request, identifier: currentEmail }, database);
        const response = redirectToVerification(request, "rate_limited");
        response.headers.set("Retry-After", String(credentialLimit.retryAfterSeconds));
        return response;
      }

      const user = validateEmail(currentEmail) && password
        ? await authenticateWithPassword(currentEmail, password, database)
        : null;
      if (!user || user.emailVerified) {
        await recordAuthEvent({ action: "auth.email_change.denied", request, identifier: currentEmail, userId: user?.id, metadata: { reason: "invalid_credentials" } }, database);
        return redirectToVerification(request, "invalid_change_credentials");
      }
      authorization = { userId: user.id, email: user.email };
    }

    const rateLimit = await consumeAuthRateLimit(request, "resend_verification", nextEmail, database);
    if (!rateLimit.allowed) {
      await recordAuthEvent({ action: "auth.email_change.rate_limited", request, identifier: nextEmail, userId: authorization.userId }, database);
      const response = redirectToVerification(request, "rate_limited");
      response.headers.set("Retry-After", String(rateLimit.retryAfterSeconds));
      return response;
    }

    const changed = await changeUnverifiedUserEmail(
      authorization.userId,
      authorization.email,
      nextEmail,
      database,
    );
    if ("error" in changed) {
      await recordAuthEvent({ action: "auth.email_change.denied", request, identifier: nextEmail, userId: authorization.userId, metadata: { reason: changed.error } }, database);
      return redirectToVerification(request, changed.error === "email_in_use" ? "email_in_use" : "email_change_not_allowed");
    }

    let delivery: "brevo" | "console" | "failed" = "failed";
    try {
      delivery = await sendEmailVerificationCode(changed.user, database);
    } catch (error) {
      console.error("Không thể gửi mã đến email mới.", error instanceof Error ? error.message : "unknown");
    }
    await recordAuthEvent({
      action: "auth.email_change.succeeded",
      request,
      identifier: nextEmail,
      userId: changed.user.id,
      metadata: { delivery },
    }, database);

    const response = redirectToVerification(request, delivery === "failed" ? "delivery_failed" : undefined);
    if (delivery !== "failed") response.headers.set("Location", new URL("/verify-email?email_changed=1", request.url).toString());
    response.cookies.set(pendingEmailVerificationCookieName(), nextEmail, pendingEmailVerificationCookieOptions());
    const changeToken = await createPendingEmailChangeToken(changed.user.id, nextEmail);
    response.cookies.set(pendingEmailChangeCookieName(), changeToken, pendingEmailChangeCookieOptions());
    return response;
  });
}
