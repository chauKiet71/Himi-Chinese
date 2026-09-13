import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth-session.ts";
import { safeReturnTo } from "./auth-validation.ts";

export function learnerLoginPath(returnTo: string): string {
  const target = safeReturnTo(returnTo, "/");
  return `/login?error=required&returnTo=${encodeURIComponent(target)}`;
}

export async function requireLearnerUser(returnTo: string) {
  const user = await getCurrentUser();
  if (!user) redirect(learnerLoginPath(returnTo));
  return user;
}
