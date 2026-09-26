import "server-only";
import { constantTimeTextEqual, createAuthToken, hashSessionToken } from "./auth-crypto.ts";

const GOOGLE_AUTHORIZATION_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";
const OAUTH_COOKIE_TTL_SECONDS = 10 * 60;
export const GOOGLE_STATE_COOKIE = "hanziwork_google_state";
export const GOOGLE_VERIFIER_COOKIE = "hanziwork_google_verifier";
export const GOOGLE_RETURN_TO_COOKIE = "hanziwork_google_return_to";

export type GoogleProfile = { subject: string; email: string; displayName: string; avatarUrl?: string };

function googleConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) throw new Error("Google OAuth chưa được cấu hình.");
  return { clientId, clientSecret };
}

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}

export function googleOAuthEnabled(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim());
}

export function googleOAuthCookieOptions() {
  return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/api/auth/google", maxAge: OAUTH_COOKIE_TTL_SECONDS };
}

export function createGoogleOAuthAttempt() {
  return { state: createAuthToken(), verifier: createAuthToken() };
}

export async function googleAuthorizationUrl(redirectUri: string, state: string, verifier: string): Promise<URL> {
  const { clientId } = googleConfig();
  const challenge = base64Url(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))));
  const url = new URL(GOOGLE_AUTHORIZATION_URL);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("prompt", "select_account");
  return url;
}

export async function validateGoogleState(received: string, expected: string): Promise<boolean> {
  if (!received || !expected) return false;
  const [receivedHash, expectedHash] = await Promise.all([hashSessionToken(received), hashSessionToken(expected)]);
  return constantTimeTextEqual(receivedHash, expectedHash);
}

export async function exchangeGoogleCode(code: string, verifier: string, redirectUri: string): Promise<GoogleProfile> {
  const { clientId, clientSecret } = googleConfig();
  const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code", code_verifier: verifier }),
    cache: "no-store",
  });
  if (!tokenResponse.ok) throw new Error("Không thể đổi mã Google OAuth.");
  const tokens = await tokenResponse.json() as { access_token?: string };
  if (!tokens.access_token) throw new Error("Google không trả về access token.");

  const profileResponse = await fetch(GOOGLE_USERINFO_URL, { headers: { authorization: `Bearer ${tokens.access_token}` }, cache: "no-store" });
  if (!profileResponse.ok) throw new Error("Không thể đọc hồ sơ Google.");
  const profile = await profileResponse.json() as { sub?: string; email?: string; email_verified?: boolean; name?: string; picture?: string };
  if (!profile.sub || !profile.email || profile.email_verified !== true) throw new Error("Email Google chưa được xác minh.");
  return { subject: profile.sub, email: profile.email.trim().toLowerCase(), displayName: profile.name?.trim() || profile.email, avatarUrl: profile.picture };
}
