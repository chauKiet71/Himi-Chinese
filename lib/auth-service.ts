import "server-only";
import { and, eq, isNull } from "drizzle-orm";
import { readDb, writeDb, type Database } from "../db/index.ts";
import { users } from "../db/schema.ts";
import { hashPassword, passwordNeedsRehash, verifyPassword } from "./auth-crypto.ts";
import type { RegistrationInput } from "./auth-validation.ts";

export type UserRole = typeof users.$inferSelect.role;

export type AuthenticatedUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  emailVerified: boolean;
  unreadNotificationCount: number;
  createdAt: Date;
  sessionCreatedAt?: Date;
};

function toAuthenticatedUser(user: typeof users.$inferSelect): AuthenticatedUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName ?? user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
    emailVerified: Boolean(user.emailVerifiedAt),
    unreadNotificationCount: 0,
    createdAt: user.createdAt,
  };
}

export async function registerLearner(input: RegistrationInput): Promise<{ user?: AuthenticatedUser; duplicate?: true }> {
  const passwordHash = await hashPassword(input.password);
  const inserted = await writeDb((db) => db
    .insert(users)
    .values({
      displayName: input.displayName,
      email: input.email,
      passwordHash,
      role: "learner",
    })
    .onConflictDoNothing({ target: users.email })
    .returning());

  const user = inserted[0];
  return user ? { user: toAuthenticatedUser(user) } : { duplicate: true };
}

export async function authenticateWithPassword(
  email: string,
  password: string,
  database?: Database,
): Promise<AuthenticatedUser | null> {
  const query = (db: Database) => db.select().from(users).where(eq(users.email, email)).limit(1);
  const rows = database ? await query(database) : await readDb(query);
  const user = rows[0];

  if (!user?.passwordHash) {
    await hashPassword(password);
    return null;
  }

  const passwordValid = await verifyPassword(password, user.passwordHash);
  if (!passwordValid || !user.isActive) return null;
  if (passwordNeedsRehash(user.passwordHash)) {
    const passwordHash = await hashPassword(password);
    const update = (db: Database) => db.update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, user.id));
    await (database ? update(database) : writeDb(update));
  }
  return toAuthenticatedUser(user);
}

export async function changePassword(userId: string, currentPassword: string, nextPassword: string): Promise<boolean> {
  const rows = await readDb((db) => db.select({ passwordHash: users.passwordHash, isActive: users.isActive }).from(users).where(eq(users.id, userId)).limit(1));
  const user = rows[0];
  if (!user?.passwordHash || !user.isActive || !await verifyPassword(currentPassword, user.passwordHash)) return false;

  const passwordHash = await hashPassword(nextPassword);
  await writeDb((db) => db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, userId)));
  return true;
}

export async function findActiveUserByEmail(email: string): Promise<AuthenticatedUser | null> {
  const rows = await readDb((db) => db.select().from(users).where(eq(users.email, email)).limit(1));
  const user = rows[0];
  return user?.isActive ? toAuthenticatedUser(user) : null;
}

export async function changeUnverifiedUserEmail(
  userId: string,
  currentEmail: string,
  nextEmail: string,
  database?: Database,
): Promise<{ user: AuthenticatedUser } | { error: "email_in_use" | "not_allowed" }> {
  const change = (db: Database) => db.transaction(async (tx) => {
    const currentRows = await tx.select().from(users).where(eq(users.id, userId)).for("update").limit(1);
    const currentUser = currentRows[0];
    if (!currentUser?.isActive || currentUser.emailVerifiedAt || currentUser.email !== currentEmail) {
      return { error: "not_allowed" as const };
    }

    const existingRows = await tx.select({ id: users.id }).from(users).where(eq(users.email, nextEmail)).limit(1);
    if (existingRows[0] && existingRows[0].id !== userId) return { error: "email_in_use" as const };

    const updatedRows = await tx.update(users).set({ email: nextEmail, updatedAt: new Date() }).where(and(
      eq(users.id, userId),
      eq(users.email, currentEmail),
      isNull(users.emailVerifiedAt),
    )).returning();
    const updated = updatedRows[0];
    return updated ? { user: toAuthenticatedUser(updated) } : { error: "not_allowed" as const };
  });

  try {
    return await (database ? change(database) : writeDb(change));
  } catch (error) {
    const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
    if (code === "23505") return { error: "email_in_use" };
    throw error;
  }
}
