import "server-only";
import { cache } from "react";
import { and, eq, gt, isNotNull, lt, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { readDb, writeDb, type Database } from "../db/index.ts";
import { authSessions, notifications, users } from "../db/schema.ts";
import { createSessionToken, hashSessionToken } from "./auth-crypto.ts";
import type { AuthenticatedUser } from "./auth-service.ts";

const LEARNER_SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;
const STAFF_SESSION_TTL_SECONDS = 12 * 60 * 60;
const STAFF_IDLE_TTL_SECONDS = 30 * 60;
const SESSION_TOUCH_INTERVAL_SECONDS = 5 * 60;

export type NewSession = {
  token: string;
  expiresAt: Date;
};

export function secureAuthCookiesEnabled(): boolean {
  const override = process.env.AUTH_COOKIE_SECURE?.trim();
  if (override === "1" || override === "true") return true;
  if (override === "0" || override === "false") return false;
  return process.env.NODE_ENV === "production";
}

export function sessionCookieName(): string {
  return secureAuthCookiesEnabled() ? "__Host-hanziwork-session" : "hanziwork_session";
}

export function sessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    secure: secureAuthCookiesEnabled(),
    sameSite: "lax" as const,
    path: "/",
    expires: expiresAt,
    maxAge: Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1_000)),
  };
}

export async function createSession(userId: string, database?: Database): Promise<NewSession> {
  const token = createSessionToken();
  const tokenHash = await hashSessionToken(token);
  const now = new Date();
  const issue = (db: Database) => db.transaction(async (tx) => {
    const rows = await tx.select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .for("share")
      .limit(1);
    const role = rows[0]?.role;
    if (!role) throw new Error("Không tìm thấy tài khoản để tạo phiên đăng nhập.");
    const ttlSeconds = role === "learner" ? LEARNER_SESSION_TTL_SECONDS : STAFF_SESSION_TTL_SECONDS;
    const expiresAt = new Date(now.getTime() + ttlSeconds * 1_000);
    await tx.insert(authSessions).values({ userId, tokenHash, expiresAt, lastSeenAt: now });
    return expiresAt;
  });
  const expiresAt = await (database ? issue(database) : writeDb(issue));
  return { token, expiresAt };
}

export async function deleteSession(token: string | undefined): Promise<void> {
  if (!token) return;
  const tokenHash = await hashSessionToken(token);
  await writeDb((db) => db.delete(authSessions).where(eq(authSessions.tokenHash, tokenHash)));
}

export async function revokeUserSessions(userId: string, database?: Database): Promise<void> {
  const revoke = (db: Database) => db.delete(authSessions).where(eq(authSessions.userId, userId));
  await (database ? revoke(database) : writeDb(revoke));
}

async function readCurrentUser(): Promise<AuthenticatedUser | null> {
  if (!process.env.DATABASE_URL) return null;
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName())?.value;
  if (!token) return null;

  const tokenHash = await hashSessionToken(token);
  const now = new Date();
  const rows = await readDb((db) => db
    .select({
      sessionId: authSessions.id,
      sessionCreatedAt: authSessions.createdAt,
      sessionLastSeenAt: authSessions.lastSeenAt,
      id: users.id,
      email: users.email,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
      role: users.role,
      emailVerifiedAt: users.emailVerifiedAt,
      createdAt: users.createdAt,
      unreadNotificationCount: sql<number>`(
        select count(*)::int
        from ${notifications}
        where ${notifications.userId} = ${users.id}
          and ${notifications.readAt} is null
      )`,
    })
    .from(authSessions)
    .innerJoin(users, eq(authSessions.userId, users.id))
    .where(and(
      eq(authSessions.tokenHash, tokenHash),
      gt(authSessions.expiresAt, now),
      eq(users.isActive, true),
      isNotNull(users.emailVerifiedAt),
    ))
    .limit(1));

  const user = rows[0];
  if (!user) return null;
  if (user.role !== "learner") {
    const idleBefore = new Date(now.getTime() - STAFF_IDLE_TTL_SECONDS * 1_000);
    const absoluteBefore = new Date(now.getTime() - STAFF_SESSION_TTL_SECONDS * 1_000);
    if (user.sessionLastSeenAt <= idleBefore || user.sessionCreatedAt <= absoluteBefore) {
      await writeDb((db) => db.delete(authSessions).where(eq(authSessions.id, user.sessionId)));
      return null;
    }
    const touchBefore = new Date(now.getTime() - SESSION_TOUCH_INTERVAL_SECONDS * 1_000);
    if (user.sessionLastSeenAt <= touchBefore) {
      await writeDb((db) => db.update(authSessions)
        .set({ lastSeenAt: now })
        .where(and(eq(authSessions.id, user.sessionId), lt(authSessions.lastSeenAt, touchBefore))));
    }
  }

  return user ? {
    id: user.id,
    email: user.email,
    displayName: user.displayName ?? user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
    emailVerified: Boolean(user.emailVerifiedAt),
    unreadNotificationCount: user.unreadNotificationCount,
    createdAt: user.createdAt,
    sessionCreatedAt: user.sessionCreatedAt,
  } : null;
}

export const getCurrentUser = cache(readCurrentUser);
