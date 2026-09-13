import { and, desc, eq, gt, isNull, lte, or } from "drizzle-orm";
import { cache } from "react";
import { readDb, type Database } from "../db/index.ts";
import { subscriptions, vipPlans } from "../db/schema.ts";
import { isLifetimeVipPlan } from "./vip-plan.ts";

const dayMilliseconds = 24 * 60 * 60 * 1_000;

export type ActiveVipSubscription = {
  id: string;
  planId: string;
  planCode: string;
  planName: string;
  durationDays: number;
  startsAt: Date | null;
  endsAt: Date | null;
};

export function calculateVipEndsAt(now: Date, currentEndsAt: Date | null, durationDays: number): Date {
  if (!Number.isInteger(durationDays) || durationDays < 1 || durationDays > 3_650) {
    throw new RangeError("Thời hạn VIP không hợp lệ.");
  }
  const base = currentEndsAt && currentEndsAt.getTime() > now.getTime() ? currentEndsAt : now;
  return new Date(base.getTime() + durationDays * dayMilliseconds);
}

export function calculateVipPlanEndsAt(
  now: Date,
  currentEndsAt: Date | null,
  planCode: string,
  durationDays: number,
): Date | null {
  return isLifetimeVipPlan(planCode) ? null : calculateVipEndsAt(now, currentEndsAt, durationDays);
}

export function vipDaysRemaining(endsAt: Date | null, now = new Date()): number | null {
  if (!endsAt) return null;
  return Math.max(0, Math.ceil((endsAt.getTime() - now.getTime()) / dayMilliseconds));
}

async function readActiveVipSubscription(
  userId: string,
  database: Database | undefined,
  now: Date,
): Promise<ActiveVipSubscription | null> {
  if (!process.env.DATABASE_URL) return null;
  const query = (db: Database) => db.select({
    id: subscriptions.id,
    planId: subscriptions.planId,
    planCode: vipPlans.code,
    planName: vipPlans.name,
    durationDays: vipPlans.durationDays,
    startsAt: subscriptions.startsAt,
    endsAt: subscriptions.endsAt,
  }).from(subscriptions)
    .innerJoin(vipPlans, eq(subscriptions.planId, vipPlans.id))
    .where(and(
      eq(subscriptions.userId, userId),
      eq(subscriptions.status, "active"),
      or(isNull(subscriptions.startsAt), lte(subscriptions.startsAt, now)),
      or(isNull(subscriptions.endsAt), gt(subscriptions.endsAt, now)),
    ))
    .orderBy(desc(subscriptions.endsAt), desc(subscriptions.createdAt))
    .limit(1);
  const rows = database ? await query(database) : await readDb(query);
  return rows[0] ?? null;
}

const getRequestCachedActiveVipSubscription = cache((userId: string) => (
  readActiveVipSubscription(userId, undefined, new Date())
));

export function getActiveVipSubscription(
  userId: string,
  database?: Database,
  now?: Date,
): Promise<ActiveVipSubscription | null> {
  if (database || now) return readActiveVipSubscription(userId, database, now ?? new Date());
  return getRequestCachedActiveVipSubscription(userId);
}
