import "server-only";

import { and, asc, count, desc, eq, gt, gte, ilike, inArray, isNull, lte, or, sql } from "drizzle-orm";
import { readDb, writeDb } from "../db/index.ts";
import {
  auditLogs,
  authSessions,
  contentVersions,
  paymentEvents,
  paymentOrders,
  practiceScenarioVersions,
  supportConversations,
  supportImages,
  supportJobs,
  supportMessages,
  supportReplySessions,
  subscriptions,
  users,
  vipPlans,
} from "../db/schema.ts";
import type { MutationResult } from "./admin-content-service.ts";
import { adminPeriodRange, type AdminPeriod, type AdminPeriodRange } from "./admin-reporting.ts";
import type { UserRole } from "./auth-service.ts";

export type AdminUserPeriod = "all" | AdminPeriod;

function escapedSearch(value: string): string {
  return value.trim().slice(0, 120).replace(/[\\%_]/gu, "\\$&");
}

export function parseAdminUserPeriod(value: string | null | undefined): AdminUserPeriod {
  return value === "day" || value === "week" || value === "month" ? value : "all";
}

export async function listAdminUsers() {
  return readDb((db) => db.select({
    id: users.id,
    email: users.email,
    displayName: users.displayName,
    role: users.role,
    isActive: users.isActive,
    emailVerifiedAt: users.emailVerifiedAt,
    createdAt: users.createdAt,
  }).from(users).orderBy(asc(users.createdAt), asc(users.email)));
}

export async function getAdminUserConsole(input: {
  limit?: number;
  page?: number;
  pageSize?: number;
  range?: AdminPeriodRange;
  period?: AdminUserPeriod;
  search?: string;
} = {}) {
  const now = new Date();
  const period = input.period ?? "all";
  const search = input.search?.trim().slice(0, 120) ?? "";
  const normalizedSearch = escapedSearch(search);
  const createdAfter = period === "all" ? null : adminPeriodRange(period, now).start;
  const userFilter = and(
    normalizedSearch ? or(
      ilike(users.email, `%${normalizedSearch}%`),
      ilike(users.displayName, `%${normalizedSearch}%`),
    ) : undefined,
    input.range ? gte(users.createdAt, input.range.start) : createdAfter ? gt(users.createdAt, createdAfter) : undefined,
    input.range ? lte(users.createdAt, input.range.end) : undefined,
  );

  return readDb(async (db) => {
    const pageSize = input.limit !== undefined
      ? Math.min(Math.max(Math.trunc(input.limit) || 300, 1), 5_000)
      : [50, 100, 200, 300, 500].includes(input.pageSize ?? 50) ? input.pageSize ?? 50 : 50;
    const [totalRow] = await db.select({ value: count() }).from(users).where(userFilter);
    const totalUsers = totalRow?.value ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize));
    const requestedPage = Number.isFinite(input.page) ? Math.trunc(input.page!) : 1;
    const page = input.limit !== undefined ? 1 : Math.min(Math.max(requestedPage, 1), totalPages);
    const [userRows, planRows] = await Promise.all([
      db.select({
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        role: users.role,
        isActive: users.isActive,
        emailVerifiedAt: users.emailVerifiedAt,
        createdAt: users.createdAt,
      }).from(users)
        .where(userFilter)
        .orderBy(desc(users.createdAt), asc(users.email), asc(users.id))
        .limit(pageSize).offset((page - 1) * pageSize),
      db.select({
        id: vipPlans.id,
        name: vipPlans.name,
        durationDays: vipPlans.durationDays,
        priceVnd: vipPlans.priceVnd,
      }).from(vipPlans).where(eq(vipPlans.isActive, true)).orderBy(asc(vipPlans.durationDays), asc(vipPlans.name)),
    ]);
    const userIds = userRows.map((user) => user.id);
    const subscriptionRows = userIds.length ? await db.select({
      id: subscriptions.id,
      userId: subscriptions.userId,
      planId: subscriptions.planId,
      planName: vipPlans.name,
      endsAt: subscriptions.endsAt,
    }).from(subscriptions)
      .innerJoin(vipPlans, eq(subscriptions.planId, vipPlans.id))
      .where(and(
        inArray(subscriptions.userId, userIds),
        eq(subscriptions.status, "active"),
        or(isNull(subscriptions.startsAt), lte(subscriptions.startsAt, now)),
        or(isNull(subscriptions.endsAt), gt(subscriptions.endsAt, now)),
      ))
      .orderBy(desc(subscriptions.endsAt), desc(subscriptions.createdAt)) : [];
    const subscriptionByUser = new Map<string, (typeof subscriptionRows)[number]>();
    for (const subscription of subscriptionRows) {
      if (!subscriptionByUser.has(subscription.userId)) subscriptionByUser.set(subscription.userId, subscription);
    }
    return {
      period,
      page,
      pageSize,
      totalPages,
      totalUsers,
      plans: planRows,
      search,
      users: userRows.map((user) => ({ ...user, subscription: subscriptionByUser.get(user.id) ?? null })),
    };
  });
}

export async function deleteAdminUser(userId: string, actorId: string): Promise<MutationResult> {
  return writeDb((db) => db.transaction(async (tx) => {
    const rows = await tx.select({
      id: users.id,
      email: users.email,
      isActive: users.isActive,
      role: users.role,
    }).from(users).where(eq(users.id, userId)).for("update").limit(1);
    const target = rows[0];
    if (!target) return { ok: false, error: "not_found" };
    if (target.id === actorId || target.role !== "learner") {
      return { ok: false, error: "user_delete_forbidden" };
    }
    const now = new Date();
    // Remove restrictive foreign keys before deleting the account. Other
    // learner-owned records (sessions, progress, notifications) cascade.
    const conversations = tx.select({ id: supportConversations.id }).from(supportConversations).where(eq(supportConversations.userId, target.id));
    const images = tx.select({ id: supportImages.id }).from(supportImages).where(eq(supportImages.ownerId, target.id));
    await tx.delete(supportJobs).where(inArray(supportJobs.conversationId, conversations));
    await tx.delete(supportReplySessions).where(inArray(supportReplySessions.conversationId, conversations));
    await tx.delete(supportMessages).where(or(inArray(supportMessages.conversationId, conversations), inArray(supportMessages.imageId, images)));
    await tx.delete(supportConversations).where(eq(supportConversations.userId, target.id));
    await tx.delete(supportImages).where(eq(supportImages.ownerId, target.id));
    const ownedSubscriptions = tx.select({ id: subscriptions.id }).from(subscriptions).where(eq(subscriptions.userId, target.id));
    const ownedOrders = tx.select({ id: paymentOrders.id }).from(paymentOrders).where(eq(paymentOrders.userId, target.id));
    await tx.delete(paymentEvents).where(inArray(paymentEvents.orderId, ownedOrders));
    await tx.delete(paymentOrders).where(eq(paymentOrders.userId, target.id));
    await tx.update(paymentOrders).set({ subscriptionId: null }).where(inArray(paymentOrders.subscriptionId, ownedSubscriptions));
    await tx.delete(subscriptions).where(eq(subscriptions.userId, target.id));
    await tx.update(subscriptions).set({ activatedBy: null }).where(eq(subscriptions.activatedBy, target.id));
    await tx.delete(contentVersions).where(eq(contentVersions.createdBy, target.id));
    await tx.delete(practiceScenarioVersions).where(eq(practiceScenarioVersions.createdBy, target.id));
    await tx.delete(users).where(eq(users.id, target.id));
    await tx.insert(auditLogs).values({
      actorId,
      action: "admin.user.deleted",
      entityType: "user",
      entityId: target.id,
      metadata: { email: target.email, deletedAt: now.toISOString() },
    });
    return { ok: true, id: target.id };
  }));
}

export async function updateUserRole(userId: string, role: UserRole, actorId: string): Promise<MutationResult> {
  return writeDb((db) => db.transaction(async (tx) => {
    // Serialize every role change so two concurrent demotions cannot both
    // conclude that another administrator will remain.
    await tx.execute(sql`select pg_advisory_xact_lock(48494, 1)`);
    const rows = await tx.select({ id: users.id, email: users.email, role: users.role, emailVerifiedAt: users.emailVerifiedAt })
      .from(users).where(eq(users.id, userId)).for("update").limit(1);
    const target = rows[0];
    if (!target) return { ok: false, error: "not_found" };
    if (target.id === actorId || (!target.emailVerifiedAt && role !== "learner")) {
      return { ok: false, error: "role_change_forbidden" };
    }
    if (target.role === "admin" && role !== "admin") {
      const adminRows = await tx.select({ value: count() }).from(users).where(eq(users.role, "admin"));
      if ((adminRows[0]?.value ?? 0) <= 1) return { ok: false, error: "role_change_forbidden" };
    }
    await tx.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, userId));
    if (target.role !== role) await tx.delete(authSessions).where(eq(authSessions.userId, userId));
    await tx.insert(auditLogs).values({
      actorId,
      action: "admin.user.role_updated",
      entityType: "user",
      entityId: userId,
      metadata: { email: target.email, fromRole: target.role, sessionsRevoked: target.role !== role, toRole: role },
    });
    return { ok: true, id: userId };
  }));
}
