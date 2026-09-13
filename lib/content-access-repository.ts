import { and, eq, inArray } from "drizzle-orm";
import { unstable_cache } from "next/cache.js";
import { readDb, writeDb, type Database } from "../db/index.ts";
import { auditLogs, contentAccessPolicies } from "../db/schema.ts";
import {
  contentAccessPolicyKey,
  resolveContentAccess,
  type AccessTier,
  type ContentAccessPolicy,
  type ContentAccessState,
  type ContentAccessTarget,
  type ContentAccessTargetType,
} from "./content-access-types.ts";
import { getActiveVipSubscription } from "./vip-subscription.ts";

const getCachedContentAccessPolicyRows = unstable_cache(async () => readDb((db) => db.select({
  targetType: contentAccessPolicies.targetType,
  targetKey: contentAccessPolicies.targetKey,
  tier: contentAccessPolicies.tier,
}).from(contentAccessPolicies)), ["content-access-policies"], {
  revalidate: 300,
  tags: ["content-access-policies"],
});

export async function getContentAccessPolicies(
  targets: ContentAccessTarget[],
  database?: Database,
): Promise<ContentAccessPolicy[]> {
  if (!process.env.DATABASE_URL || targets.length === 0) return [];
  const targetTypes = [...new Set(targets.map((target) => target.type))];
  const targetKeys = [...new Set(targets.map((target) => target.key))];
  const wanted = new Set(targets.map((target) => contentAccessPolicyKey(target.type, target.key)));
  const query = (db: Database) => db.select({
    targetType: contentAccessPolicies.targetType,
    targetKey: contentAccessPolicies.targetKey,
    tier: contentAccessPolicies.tier,
  }).from(contentAccessPolicies).where(and(
    inArray(contentAccessPolicies.targetType, targetTypes),
    inArray(contentAccessPolicies.targetKey, targetKeys),
  ));
  const rows = database ? await query(database) : await getCachedContentAccessPolicyRows();
  return rows.filter((row) => wanted.has(contentAccessPolicyKey(row.targetType, row.targetKey)));
}

export async function getContentAccessState({
  targets,
  userId,
  database,
  policies,
  viewerHasVip,
}: {
  targets: ContentAccessTarget[];
  userId: string | null;
  database?: Database;
  policies?: ContentAccessPolicy[];
  viewerHasVip?: boolean;
}): Promise<ContentAccessState> {
  const [resolvedPolicies, hasVip] = await Promise.all([
    policies ?? getContentAccessPolicies(targets, database),
    viewerHasVip === undefined
      ? userId && process.env.DATABASE_URL
        ? getActiveVipSubscription(userId, database).then(Boolean)
        : Promise.resolve(false)
      : Promise.resolve(viewerHasVip),
  ]);
  return resolveContentAccess({ targets, policies: resolvedPolicies, viewerHasVip: hasVip });
}

export async function setContentAccessPolicy(input: {
  targetType: ContentAccessTargetType;
  targetKey: string;
  tier: AccessTier;
  actorId: string;
}): Promise<void> {
  await writeDb((db) => db.transaction(async (tx) => {
    const now = new Date();
    await tx.insert(contentAccessPolicies).values({
      targetType: input.targetType,
      targetKey: input.targetKey,
      tier: input.tier,
      updatedBy: input.actorId,
      updatedAt: now,
    }).onConflictDoUpdate({
      target: [contentAccessPolicies.targetType, contentAccessPolicies.targetKey],
      set: { tier: input.tier, updatedBy: input.actorId, updatedAt: now },
    });
    await tx.insert(auditLogs).values({
      actorId: input.actorId,
      action: "admin.content_access.updated",
      entityType: input.targetType,
      metadata: { targetKey: input.targetKey, tier: input.tier },
    });
  }));
}

export async function getContentAccessPolicy(
  targetType: ContentAccessTargetType,
  targetKey: string,
  database?: Database,
): Promise<AccessTier | null> {
  if (!process.env.DATABASE_URL) return null;
  if (!database) {
    const rows = await getCachedContentAccessPolicyRows();
    return rows.find((row) => row.targetType === targetType && row.targetKey === targetKey)?.tier ?? null;
  }
  const query = (db: Database) => db.select({ tier: contentAccessPolicies.tier })
    .from(contentAccessPolicies)
    .where(and(eq(contentAccessPolicies.targetType, targetType), eq(contentAccessPolicies.targetKey, targetKey)))
    .limit(1);
  const rows = await query(database);
  return rows[0]?.tier ?? null;
}
