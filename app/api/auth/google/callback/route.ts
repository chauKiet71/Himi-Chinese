import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { withRequestDb } from "@/db/index";
import { authenticateWithGoogle } from "@/lib/auth-service";
import { createSession, sessionCookieName, sessionCookieOptions } from "@/lib/auth-session";
import { exchangeGoogleCode, googleOAuthCookieOptions, GOOGLE_RETURN_TO_COOKIE, GOOGLE_STATE_COOKIE, GOOGLE_VERIFIER_COOKIE, validateGoogleState } from "@/lib/google-oauth";
import { recordAuthEvent } from "@/lib/auth-audit";
import { authRedirectUrl, requestOrigin } from "@/lib/request-security";
import { safeReturnTo } from "@/lib/auth-validation";

function clearAttempt(response: NextResponse) {
  const options = { ...googleOAuthCookieOptions(), maxAge: 0 };
  response.cookies.set(GOOGLE_STATE_COOKIE, "", options);
  response.cookies.set(GOOGLE_VERIFIER_COOKIE, "", options);
  response.cookies.set(GOOGLE_RETURN_TO_COOKIE, "", options);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cookieStore = await cookies();
  const returnTo = safeReturnTo(cookieStore.get(GOOGLE_RETURN_TO_COOKIE)?.value);
  const fail = (error: string) => {
    const response = NextResponse.redirect(authRedirectUrl(request, "/login", { error, returnTo }), 303);
    clearAttempt(response);
    return response;
  };

  if (url.searchParams.get("error")) return fail("google_cancelled");
  const code = url.searchParams.get("code") ?? "";
  const state = url.searchParams.get("state") ?? "";
  const expectedState = cookieStore.get(GOOGLE_STATE_COOKIE)?.value ?? "";
  const verifier = cookieStore.get(GOOGLE_VERIFIER_COOKIE)?.value ?? "";
  if (!code || !verifier || !await validateGoogleState(state, expectedState)) return fail("google_invalid_state");

  try {
    const redirectUri = `${requestOrigin(request)}/api/auth/google/callback`;
    const profile = await exchangeGoogleCode(code, verifier, redirectUri);
    return await withRequestDb(async (database) => {
      const user = await authenticateWithGoogle(profile, database);
      if (!user) return fail("google_account_not_allowed");
      const session = await createSession(user.id, database);
      await recordAuthEvent({ action: "auth.google.succeeded", request, identifier: profile.email, userId: user.id }, database);
      const response = NextResponse.redirect(authRedirectUrl(request, returnTo), 303);
      response.cookies.set(sessionCookieName(), session.token, sessionCookieOptions(session.expiresAt));
      clearAttempt(response);
      return response;
    });
  } catch (error) {
    console.error("Google OAuth thất bại.", error instanceof Error ? error.message : "unknown");
    return fail("google_failed");
  }
}
