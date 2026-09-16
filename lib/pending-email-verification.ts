import "server-only";

import { constantTimeTextEqual, hashPrivateIdentifier } from "./auth-crypto.ts";
import { secureAuthCookiesEnabled } from "./auth-session.ts";
import { normalizeEmail, validateEmail } from "./auth-validation.ts";

const PENDING_EMAIL_TTL_SECONDS = 30 * 60;
const USER_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

export type PendingEmailChangeAuthorization = {
  userId: string;
  email: string;
};

export function pendingEmailVerificationCookieName(): string {
  return secureAuthCookiesEnabled() ? "__Host-hanziwork-verification-email" : "hanziwork_verification_email";
}

export function pendingEmailChangeCookieName(): string {
  return secureAuthCookiesEnabled() ? "__Host-hanziwork-email-change" : "hanziwork_email_change";
}

export function pendingEmailVerificationCookieOptions() {
  return {
    httpOnly: true,
    secure: secureAuthCookiesEnabled(),
    sameSite: "lax" as const,
    path: "/",
    maxAge: PENDING_EMAIL_TTL_SECONDS,
  };
}

export function pendingEmailChangeCookieOptions() {
  return {
    httpOnly: true,
    secure: secureAuthCookiesEnabled(),
    sameSite: "strict" as const,
    path: "/",
    maxAge: PENDING_EMAIL_TTL_SECONDS,
  };
}

export async function createPendingEmailChangeToken(userId: string, email: string): Promise<string> {
  const expiresAt = Date.now() + PENDING_EMAIL_TTL_SECONDS * 1_000;
  const material = `${userId}|${expiresAt}|${encodeURIComponent(normalizeEmail(email))}`;
  const signature = await hashPrivateIdentifier(`pending-email-change:${material}`);
  return `${material}|${signature}`;
}

export async function verifyPendingEmailChangeToken(token: string | undefined): Promise<PendingEmailChangeAuthorization | null> {
  if (!token || token.length > 1_500) return null;
  const parts = token.split("|");
  if (parts.length !== 4) return null;
  const [userId, expiresAtValue, encodedEmail, signature] = parts;
  const expiresAt = Number(expiresAtValue);
  if (!USER_ID_PATTERN.test(userId) || !Number.isSafeInteger(expiresAt) || expiresAt <= Date.now()) return null;
  if (expiresAt > Date.now() + PENDING_EMAIL_TTL_SECONDS * 1_000 + 60_000) return null;

  const material = `${userId}|${expiresAtValue}|${encodedEmail}`;
  const expectedSignature = await hashPrivateIdentifier(`pending-email-change:${material}`);
  if (!constantTimeTextEqual(signature, expectedSignature)) return null;

  try {
    const email = normalizeEmail(decodeURIComponent(encodedEmail));
    return validateEmail(email) ? { userId, email } : null;
  } catch {
    return null;
  }
}

export function clearPendingEmailVerificationCookieOptions() {
  return {
    httpOnly: true,
    secure: secureAuthCookiesEnabled(),
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}

export const clearPendingEmailChangeCookieOptions = clearPendingEmailVerificationCookieOptions;
