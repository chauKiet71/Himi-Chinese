import { NextResponse } from "next/server";
import { recordAuthEvent } from "@/lib/auth-audit";
import { consumeAuthRateLimit } from "@/lib/auth-rate-limit";
import { findActiveUserByEmail } from "@/lib/auth-service";
import { normalizeEmail, validateEmail } from "@/lib/auth-validation";
import { sendEmailVerificationCode } from "@/lib/auth-workflows";
import { pendingEmailVerificationCookieName, pendingEmailVerificationCookieOptions } from "@/lib/pending-email-verification";
import { authRedirectUrl, formString, isSameOriginRequest } from "@/lib/request-security";

function verificationResponse(request: Request, email: string, error?: string) {
  const url = authRedirectUrl(request, "/verify-email");
  url.searchParams.set("sent", "1");
  if (error) url.searchParams.set("error", error);
  const response = NextResponse.redirect(url, 303);
  if (validateEmail(email)) {
    response.cookies.set(pendingEmailVerificationCookieName(), email, pendingEmailVerificationCookieOptions());
  }
  return response;
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const formData = await request.formData();
  const email = normalizeEmail(formString(formData, "email", 255));
  const rateLimit = await consumeAuthRateLimit(request, "resend_verification", email || "invalid");
  if (!rateLimit.allowed) {
    await recordAuthEvent({ action: "auth.email_verification.rate_limited", request, identifier: email });
    const response = verificationResponse(request, email, "rate_limited");
    response.headers.set("Retry-After", String(rateLimit.retryAfterSeconds));
    return response;
  }

  let userId: string | undefined;
  let delivery: "brevo" | "console" | "failed" | "not_needed" = "not_needed";
  if (validateEmail(email)) {
    const user = await findActiveUserByEmail(email);
    userId = user?.id;
    if (user && !user.emailVerified) {
      try {
        delivery = await sendEmailVerificationCode(user);
      } catch (error) {
        delivery = "failed";
        console.error("Không thể gửi lại email xác minh.", error instanceof Error ? error.message : "unknown");
      }
    }
  }

  await recordAuthEvent({ action: "auth.email_verification.requested", request, identifier: email, userId, metadata: { delivery } });
  return verificationResponse(request, email, delivery === "failed" ? "delivery_failed" : undefined);
}
