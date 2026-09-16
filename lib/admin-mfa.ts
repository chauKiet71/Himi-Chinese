import "server-only";

import { and, eq, gt, isNull } from "drizzle-orm";
import { writeDb, type Database } from "../db/index.ts";
import { adminLoginChallenges, users } from "../db/schema.ts";
import {
  constantTimeTextEqual,
  createAuthToken,
  createSixDigitCode,
  hashAuthToken,
  hashPrivateIdentifier,
} from "./auth-crypto.ts";
import { secureAuthCookiesEnabled } from "./auth-session.ts";
import { safeAdminReturnTo } from "./auth-validation.ts";

const ADMIN_MFA_TTL_SECONDS = 10 * 60;
const ADMIN_MFA_MAX_ATTEMPTS = 5;

export type AdminMfaChallenge = {
  id: string;
  challengeToken: string;
  code: string;
  expiresAt: Date;
};

export function adminMfaCookieName(): string {
  return secureAuthCookiesEnabled() ? "__Host-hanziwork-admin-challenge" : "hanziwork_admin_challenge";
}

export function adminMfaCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    secure: secureAuthCookiesEnabled(),
    sameSite: "strict" as const,
    path: "/",
    expires: expiresAt,
    maxAge: Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1_000)),
  };
}

export function clearAdminMfaCookieOptions() {
  return {
    httpOnly: true,
    secure: secureAuthCookiesEnabled(),
    sameSite: "strict" as const,
    path: "/",
    maxAge: 0,
  };
}

export async function issueAdminMfaChallenge(
  userId: string,
  returnTo: string | null | undefined,
  database?: Database,
): Promise<AdminMfaChallenge> {
  const challengeToken = createAuthToken();
  const code = createSixDigitCode();
  const [challengeHash, codeHash] = await Promise.all([
    hashAuthToken(challengeToken),
    hashPrivateIdentifier(`${challengeToken}:${code}`),
  ]);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ADMIN_MFA_TTL_SECONDS * 1_000);

  const issue = (db: Database) => db.transaction(async (tx) => {
    await tx.update(adminLoginChallenges).set({ usedAt: now }).where(and(
      eq(adminLoginChallenges.userId, userId),
      isNull(adminLoginChallenges.usedAt),
    ));
    return tx.insert(adminLoginChallenges).values({
      userId,
      challengeHash,
      codeHash,
      returnTo: safeAdminReturnTo(returnTo),
      expiresAt,
    }).returning({ id: adminLoginChallenges.id });
  });
  const inserted = await (database ? issue(database) : writeDb(issue));
  return { id: inserted[0].id, challengeToken, code, expiresAt };
}

export async function invalidateAdminMfaChallenge(challengeToken: string, database?: Database): Promise<void> {
  const challengeHash = await hashAuthToken(challengeToken);
  const invalidate = (db: Database) => db.update(adminLoginChallenges)
    .set({ usedAt: new Date() })
    .where(and(eq(adminLoginChallenges.challengeHash, challengeHash), isNull(adminLoginChallenges.usedAt)));
  await (database ? invalidate(database) : writeDb(invalidate));
}

export async function verifyAdminMfaChallenge(
  challengeToken: string,
  code: string,
  database?: Database,
): Promise<{
  ok: true;
  user: { id: string; email: string; displayName: string; role: "editor" | "reviewer" | "admin" };
  returnTo: string;
} | { ok: false; error: "invalid_or_expired" | "invalid_code" }> {
  if (!/^[0-9]{6}$/u.test(code)) return { ok: false, error: "invalid_code" };
  const [challengeHash, codeHash] = await Promise.all([
    hashAuthToken(challengeToken),
    hashPrivateIdentifier(`${challengeToken}:${code}`),
  ]);
  const now = new Date();

  const verify = (db: Database) => db.transaction(async (tx) => {
    const challengeRows = await tx.select({
      id: adminLoginChallenges.id,
      userId: adminLoginChallenges.userId,
      codeHash: adminLoginChallenges.codeHash,
      returnTo: adminLoginChallenges.returnTo,
      attempts: adminLoginChallenges.attempts,
    }).from(adminLoginChallenges).where(and(
      eq(adminLoginChallenges.challengeHash, challengeHash),
      isNull(adminLoginChallenges.usedAt),
      gt(adminLoginChallenges.expiresAt, now),
    )).for("update").limit(1);
    const challenge = challengeRows[0];
    if (!challenge || challenge.attempts >= ADMIN_MFA_MAX_ATTEMPTS) {
      return { ok: false as const, error: "invalid_or_expired" as const };
    }

    if (!constantTimeTextEqual(codeHash, challenge.codeHash)) {
      const attempts = challenge.attempts + 1;
      await tx.update(adminLoginChallenges).set({
        attempts,
        usedAt: attempts >= ADMIN_MFA_MAX_ATTEMPTS ? now : null,
      }).where(eq(adminLoginChallenges.id, challenge.id));
      return { ok: false as const, error: "invalid_code" as const };
    }

    const consumed = await tx.update(adminLoginChallenges).set({ usedAt: now })
      .where(and(eq(adminLoginChallenges.id, challenge.id), isNull(adminLoginChallenges.usedAt)))
      .returning({ id: adminLoginChallenges.id });
    if (!consumed[0]) return { ok: false as const, error: "invalid_or_expired" as const };

    const userRows = await tx.select({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
      role: users.role,
      isActive: users.isActive,
      emailVerifiedAt: users.emailVerifiedAt,
    }).from(users).where(eq(users.id, challenge.userId)).for("share").limit(1);
    const user = userRows[0];
    if (!user?.isActive || !user.emailVerifiedAt || user.role === "learner") {
      return { ok: false as const, error: "invalid_or_expired" as const };
    }

    return {
      ok: true as const,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName ?? user.email,
        role: user.role,
      },
      returnTo: safeAdminReturnTo(challenge.returnTo),
    };
  });

  return database ? verify(database) : writeDb(verify);
}
