import "server-only";
import { and, eq, gt, isNotNull, isNull, lt, or } from "drizzle-orm";
import { writeDb, type Database } from "../db/index.ts";
import { adminLoginChallenges, authRateLimits, authSessions, authTokens, users } from "../db/schema.ts";
import { createAuthToken, createSixDigitCode, hashAuthToken, hashPassword, hashPrivateIdentifier } from "./auth-crypto.ts";
import { normalizeEmail } from "./auth-validation.ts";

export type AuthTokenPurpose = typeof authTokens.$inferSelect.purpose;

const tokenTtlMinutes: Record<AuthTokenPurpose, number> = {
  verify_email: 24 * 60,
  reset_password: 30,
};

export type IssuedAuthToken = {
  id: string;
  token: string;
  expiresAt: Date;
};

export type IssuedEmailVerificationCode = {
  id: string;
  code: string;
  expiresAt: Date;
};

const EMAIL_VERIFICATION_CODE_TTL_MINUTES = 10;

export async function issueAuthToken(
  userId: string,
  purpose: AuthTokenPurpose,
  database?: Database,
): Promise<IssuedAuthToken> {
  const token = createAuthToken();
  const tokenHash = await hashAuthToken(token);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + tokenTtlMinutes[purpose] * 60_000);

  const issue = (db: Database) => db.transaction(async (tx) => {
    await tx.update(authTokens).set({ usedAt: now }).where(and(
      eq(authTokens.userId, userId),
      eq(authTokens.purpose, purpose),
      isNull(authTokens.usedAt),
    ));
    return tx.insert(authTokens).values({ userId, purpose, tokenHash, expiresAt }).returning({ id: authTokens.id });
  });
  const inserted = database ? await issue(database) : await writeDb(issue);

  return { id: inserted[0].id, token, expiresAt };
}

export async function issueEmailVerificationCode(
  userId: string,
  email: string,
  database?: Database,
): Promise<IssuedEmailVerificationCode> {
  const normalizedEmail = normalizeEmail(email);
  const code = createSixDigitCode();
  const tokenHash = await hashPrivateIdentifier(`email-verification:${normalizedEmail}:${code}`);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + EMAIL_VERIFICATION_CODE_TTL_MINUTES * 60_000);

  const issue = (db: Database) => db.transaction(async (tx) => {
    await tx.update(authTokens).set({ usedAt: now }).where(and(
      eq(authTokens.userId, userId),
      eq(authTokens.purpose, "verify_email"),
      isNull(authTokens.usedAt),
    ));
    return tx.insert(authTokens).values({ userId, purpose: "verify_email", tokenHash, expiresAt }).returning({ id: authTokens.id });
  });
  const inserted = database ? await issue(database) : await writeDb(issue);

  return { id: inserted[0].id, code, expiresAt };
}

type VerifiedEmailUser = { id: string; email: string; displayName: string };

export async function verifyEmailCode(
  email: string,
  code: string,
  database?: Database,
): Promise<VerifiedEmailUser | null> {
  const normalizedEmail = normalizeEmail(email);
  const tokenHash = await hashPrivateIdentifier(`email-verification:${normalizedEmail}:${code}`);
  const now = new Date();
  const verify = (db: Database) => db.transaction(async (tx) => {
    const rows = await tx.select({
      tokenId: authTokens.id,
      userId: users.id,
      email: users.email,
      displayName: users.displayName,
      isActive: users.isActive,
    }).from(authTokens)
      .innerJoin(users, eq(authTokens.userId, users.id))
      .where(and(
        eq(authTokens.tokenHash, tokenHash),
        eq(authTokens.purpose, "verify_email"),
        eq(users.email, normalizedEmail),
        isNull(authTokens.usedAt),
        gt(authTokens.expiresAt, now),
      ))
      .limit(1);
    const row = rows[0];
    if (!row?.isActive) return null;

    const consumed = await tx.update(authTokens).set({ usedAt: now }).where(and(
      eq(authTokens.id, row.tokenId),
      isNull(authTokens.usedAt),
    )).returning({ id: authTokens.id });
    if (!consumed[0]) return null;

    await tx.update(users).set({ emailVerifiedAt: now, updatedAt: now }).where(eq(users.id, row.userId));
    return { id: row.userId, email: row.email, displayName: row.displayName ?? row.email };
  });

  return database ? verify(database) : writeDb(verify);
}

export async function verifyEmailToken(token: string): Promise<VerifiedEmailUser | null> {
  const tokenHash = await hashAuthToken(token);
  const now = new Date();
  return writeDb((db) => db.transaction(async (tx) => {
    const rows = await tx.select({
      tokenId: authTokens.id,
      userId: users.id,
      email: users.email,
      displayName: users.displayName,
      isActive: users.isActive,
    }).from(authTokens)
      .innerJoin(users, eq(authTokens.userId, users.id))
      .where(and(
        eq(authTokens.tokenHash, tokenHash),
        eq(authTokens.purpose, "verify_email"),
        isNull(authTokens.usedAt),
        gt(authTokens.expiresAt, now),
      ))
      .limit(1);
    const row = rows[0];
    if (!row?.isActive) return null;

    const consumed = await tx.update(authTokens).set({ usedAt: now }).where(and(
      eq(authTokens.id, row.tokenId),
      isNull(authTokens.usedAt),
    )).returning({ id: authTokens.id });
    if (!consumed[0]) return null;

    await tx.update(users).set({ emailVerifiedAt: now, updatedAt: now }).where(eq(users.id, row.userId));
    return { id: row.userId, email: row.email, displayName: row.displayName ?? row.email };
  }));
}

export async function resetPasswordWithToken(token: string, password: string): Promise<{ id: string; email: string; displayName: string } | null> {
  const [tokenHash, passwordHash] = await Promise.all([hashAuthToken(token), hashPassword(password)]);
  const now = new Date();
  return writeDb((db) => db.transaction(async (tx) => {
    const rows = await tx.select({
      tokenId: authTokens.id,
      userId: users.id,
      email: users.email,
      displayName: users.displayName,
      isActive: users.isActive,
    }).from(authTokens)
      .innerJoin(users, eq(authTokens.userId, users.id))
      .where(and(
        eq(authTokens.tokenHash, tokenHash),
        eq(authTokens.purpose, "reset_password"),
        isNull(authTokens.usedAt),
        gt(authTokens.expiresAt, now),
      ))
      .limit(1);
    const row = rows[0];
    if (!row?.isActive) return null;

    const consumed = await tx.update(authTokens).set({ usedAt: now }).where(and(
      eq(authTokens.id, row.tokenId),
      isNull(authTokens.usedAt),
    )).returning({ id: authTokens.id });
    if (!consumed[0]) return null;

    await tx.update(users).set({ passwordHash, emailVerifiedAt: now, updatedAt: now }).where(eq(users.id, row.userId));
    await tx.delete(authSessions).where(eq(authSessions.userId, row.userId));
    await tx.update(authTokens).set({ usedAt: now }).where(and(
      eq(authTokens.userId, row.userId),
      isNull(authTokens.usedAt),
    ));
    return { id: row.userId, email: row.email, displayName: row.displayName ?? row.email };
  }));
}

export async function cleanupExpiredAuthData(): Promise<{ challenges: number; sessions: number; tokens: number; rateLimits: number }> {
  const now = new Date();
  const staleRateLimitBefore = new Date(now.getTime() - 48 * 60 * 60_000);
  const result = await writeDb((db) => db.transaction(async (tx) => {
    const removedSessions = await tx.delete(authSessions).where(lt(authSessions.expiresAt, now)).returning({ id: authSessions.id });
    const removedChallenges = await tx.delete(adminLoginChallenges).where(or(
      lt(adminLoginChallenges.expiresAt, now),
      and(isNotNull(adminLoginChallenges.usedAt), lt(adminLoginChallenges.usedAt, staleRateLimitBefore)),
    )).returning({ id: adminLoginChallenges.id });
    const removedTokens = await tx.delete(authTokens).where(or(
      lt(authTokens.expiresAt, now),
      and(isNotNull(authTokens.usedAt), lt(authTokens.usedAt, staleRateLimitBefore)),
    )).returning({ id: authTokens.id });
    const removedRateLimits = await tx.delete(authRateLimits).where(lt(authRateLimits.updatedAt, staleRateLimitBefore)).returning({ keyHash: authRateLimits.keyHash });
    return { challenges: removedChallenges.length, sessions: removedSessions.length, tokens: removedTokens.length, rateLimits: removedRateLimits.length };
  }));
  return result;
}
