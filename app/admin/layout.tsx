import type { Metadata } from "next";
import { AdminShell } from "@/components/admin-shell";
import { getCurrentUser } from "@/lib/auth-session";
import { isPracticeStaffRole } from "@/lib/practice-workflow";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  if (!user || !isPracticeStaffRole(user.role)) return children;

  return <AdminShell userName={user.displayName} userRole={user.role}>{children}</AdminShell>;
}
