import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth-session.ts";
import type { AuthenticatedUser } from "./auth-service.ts";
import { safeAdminReturnTo } from "./auth-validation.ts";
import { isPracticeStaffRole } from "./practice-workflow.ts";

const RECENT_ADMIN_AUTH_SECONDS = 15 * 60;

export async function requireAdminUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login?error=required");
  if (user.role !== "admin") redirect("/admin/login?error=forbidden");
  return user;
}

export function hasRecentAdminAuthentication(user: AuthenticatedUser, now = new Date()): boolean {
  return user.role === "admin"
    && Boolean(user.sessionCreatedAt)
    && now.getTime() - user.sessionCreatedAt!.getTime() <= RECENT_ADMIN_AUTH_SECONDS * 1_000;
}

export async function requireRecentAdminUser(returnTo = "/admin") {
  const user = await requireAdminUser();
  if (!hasRecentAdminAuthentication(user)) {
    redirect(`/admin/login?error=reauth_required&returnTo=${encodeURIComponent(safeAdminReturnTo(returnTo))}`);
  }
  return user;
}

export async function requirePracticeStaffUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login?error=required&returnTo=/admin/practice");
  if (!isPracticeStaffRole(user.role)) redirect("/admin/login?error=forbidden&returnTo=/admin/practice");
  return { ...user, role: user.role };
}
