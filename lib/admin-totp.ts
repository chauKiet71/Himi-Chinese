import "server-only";
import { eq } from "drizzle-orm";
import { readDb, writeDb, type Database } from "../db/index.ts";
import { adminTotpCredentials, auditLogs, authSessions, users } from "../db/schema.ts";
import { constantTimeTextEqual, hashPrivateIdentifier, verifyPassword } from "./auth-crypto.ts";
import { createRecoveryCodes, createTotpSecret, decryptTotpSecret, encryptTotpSecret, matchTotpStep, normalizeRecoveryCode, totpProvisioningUri } from "./totp-crypto.ts";

export async function getAdminTotpStatus(userId: string, database?: Database) {
  const query = (db: Database) => db.select({ enabledAt: adminTotpCredentials.enabledAt, version: adminTotpCredentials.version })
    .from(adminTotpCredentials).where(eq(adminTotpCredentials.userId, userId)).limit(1);
  const [row] = await (database ? query(database) : readDb(query));
  return { enabled: Boolean(row?.enabledAt), version: row?.enabledAt ? row.version : null };
}

// Caller holds the credential's row lock. Consumption must share the enclosing
// transaction with the login challenge so concurrent requests cannot reuse codes.
export async function consumeTotpCredential(tx: Database, credential: typeof adminTotpCredentials.$inferSelect, code: string, now = new Date()): Promise<boolean> {
  if (!credential.enabledAt || !credential.encryptedSecret) return false;
  const recovery = normalizeRecoveryCode(code);
  if (recovery) {
    const hash = await hashPrivateIdentifier(`admin-totp-recovery:${credential.userId}:${recovery}`);
    const index = credential.recoveryHashes.findIndex((value) => constantTimeTextEqual(value, hash));
    if (index < 0) return false;
    await tx.update(adminTotpCredentials).set({ recoveryHashes: credential.recoveryHashes.filter((_, i) => i !== index), updatedAt: now })
      .where(eq(adminTotpCredentials.userId, credential.userId));
    return true;
  }
  const secret = await decryptTotpSecret(credential.encryptedSecret, credential.userId);
  const step = await matchTotpStep(secret, code.trim(), credential.lastUsedStep, now.getTime());
  if (step === null) return false;
  await tx.update(adminTotpCredentials).set({ lastUsedStep: step, updatedAt: now }).where(eq(adminTotpCredentials.userId, credential.userId));
  return true;
}

export async function beginAdminTotpSetup(userId: string, password: string, currentCode: string, database?: Database) {
  const operation = (db: Database) => db.transaction(async (tx) => {
    const [user] = await tx.select().from(users).where(eq(users.id, userId)).for("update").limit(1);
    if (!user?.isActive || !user.emailVerifiedAt || user.role === "learner" || !user.passwordHash || !await verifyPassword(password, user.passwordHash)) return null;
    const [credential] = await tx.select().from(adminTotpCredentials).where(eq(adminTotpCredentials.userId, userId)).for("update").limit(1);
    if (credential?.enabledAt && !await consumeTotpCredential(tx as unknown as Database, credential, currentCode)) return null;
    const secret = createTotpSecret();
    const pendingSecret = await encryptTotpSecret(secret, userId);
    const now = new Date();
    const pendingExpiresAt = new Date(now.getTime() + 10 * 60_000);
    await tx.insert(adminTotpCredentials).values({ userId, pendingSecret, pendingExpiresAt }).onConflictDoUpdate({
      target: adminTotpCredentials.userId, set: { pendingSecret, pendingExpiresAt, pendingAttempts: 0, updatedAt: now },
    });
    await tx.insert(auditLogs).values({ actorId: userId, action: "auth.totp.setup_started", entityType: "user", entityId: userId });
    return { secret, uri: totpProvisioningUri(secret, user.email), expiresAt: pendingExpiresAt.toISOString() };
  });
  return database ? operation(database) : writeDb(operation);
}

export async function confirmAdminTotpSetup(userId: string, code: string, database?: Database) {
  const operation = (db: Database) => db.transaction(async (tx) => {
    const [user] = await tx.select().from(users).where(eq(users.id, userId)).for("update").limit(1);
    if (!user?.isActive || !user.emailVerifiedAt || user.role === "learner") return null;
    const [credential] = await tx.select().from(adminTotpCredentials).where(eq(adminTotpCredentials.userId, userId)).for("update").limit(1);
    const now = new Date();
    if (!credential?.pendingSecret || !credential.pendingExpiresAt || credential.pendingExpiresAt <= now || credential.pendingAttempts >= 5) return null;
    const secret = await decryptTotpSecret(credential.pendingSecret, userId);
    const step = await matchTotpStep(secret, code, null, now.getTime());
    if (step === null) {
      await tx.update(adminTotpCredentials).set({ pendingAttempts: credential.pendingAttempts + 1 }).where(eq(adminTotpCredentials.userId, userId));
      return null;
    }
    const recoveryCodes = createRecoveryCodes();
    const recoveryHashes = await Promise.all(recoveryCodes.map((value) => hashPrivateIdentifier(`admin-totp-recovery:${userId}:${normalizeRecoveryCode(value)!}`)));
    await tx.update(adminTotpCredentials).set({ encryptedSecret: credential.pendingSecret, enabledAt: now, version: crypto.randomUUID(),
      lastUsedStep: step, recoveryHashes, pendingSecret: null, pendingExpiresAt: null, pendingAttempts: 0, updatedAt: now,
    }).where(eq(adminTotpCredentials.userId, userId));
    await tx.delete(authSessions).where(eq(authSessions.userId, userId));
    await tx.insert(auditLogs).values({ actorId: userId, action: "auth.totp.enabled", entityType: "user", entityId: userId });
    return { recoveryCodes };
  });
  return database ? operation(database) : writeDb(operation);
}
