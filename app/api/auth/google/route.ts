import { NextResponse } from "next/server";
import { createGoogleOAuthAttempt, googleAuthorizationUrl, googleOAuthCookieOptions, GOOGLE_RETURN_TO_COOKIE, GOOGLE_STATE_COOKIE, GOOGLE_VERIFIER_COOKIE } from "@/lib/google-oauth";
import { requestOrigin } from "@/lib/request-security";
import { safeReturnTo } from "@/lib/auth-validation";

export async function GET(request: Request) {
  try {
    const returnTo = safeReturnTo(new URL(request.url).searchParams.get("returnTo") ?? undefined);
    const redirectUri = `${requestOrigin(request)}/api/auth/google/callback`;
    const { state, verifier } = createGoogleOAuthAttempt();
    const authorizationUrl = await googleAuthorizationUrl(redirectUri, state, verifier);
    const response = NextResponse.redirect(authorizationUrl);
    const options = googleOAuthCookieOptions();
    response.cookies.set(GOOGLE_STATE_COOKIE, state, options);
    response.cookies.set(GOOGLE_VERIFIER_COOKIE, verifier, options);
    response.cookies.set(GOOGLE_RETURN_TO_COOKIE, returnTo, options);
    return response;
  } catch (error) {
    console.error("Không thể khởi tạo Google OAuth.", error instanceof Error ? error.message : "unknown");
    return NextResponse.redirect(new URL("/login?error=google_unavailable", requestOrigin(request)), 303);
  }
}
