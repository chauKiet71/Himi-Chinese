"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import type { SyntheticEvent } from "react";
import { AdminLink } from "@/components/admin-link";
import { AdminNavigation } from "@/components/admin-navigation";
import { BrandLogoImage } from "@/components/brand-logo";
import type { UserRole } from "@/lib/auth-service";

const roleLabels: Record<UserRole, string> = {
  learner: "Học viên",
  editor: "Biên tập viên",
  reviewer: "Kiểm duyệt viên",
  admin: "Quản trị viên",
};

function AdminSidebar({ userName, userRole }: { userName: string; userRole: UserRole }) {
  const userInitial = userName.trim().slice(0, 1).toLocaleUpperCase("vi-VN") || "H";

  return <aside className="admin-sidebar">
    <AdminLink aria-label="Himi Chinese Console - Tổng quan" className="admin-sidebar-brand" href="/admin">
      <span><BrandLogoImage priority size={40} /></span>
      <div><strong>Himi Chinese</strong><small>Admin Console</small></div>
    </AdminLink>
    <AdminNavigation userRole={userRole} />
    <div className="admin-sidebar-footer">
      <Link href="/account" prefetch={false}>
        <span aria-hidden="true" className="admin-user-avatar">{userInitial}</span>
        <span><strong>{userName}</strong><small>{roleLabels[userRole]}</small></span>
        <ArrowUpRight aria-hidden="true" size={14} />
      </Link>
    </div>
  </aside>;
}

export function AdminShell({
  children,
  userName,
  userRole,
}: {
  children: React.ReactNode;
  userName: string;
  userRole: UserRole;
}) {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === "/admin/login" || pathname === "/admin/mfa") return children;

  const prefetchIntentRoute = (event: SyntheticEvent<HTMLElement>) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a[data-admin-prefetch="intent"]');
    const href = link?.getAttribute("href");
    if (href?.startsWith("/admin")) router.prefetch(href);
  };

  return <div
    className="admin-shell"
    onFocusCapture={prefetchIntentRoute}
    onMouseOver={prefetchIntentRoute}
    onTouchStartCapture={prefetchIntentRoute}
  >
    <AdminSidebar userName={userName} userRole={userRole} />
    <span aria-hidden="true" className="admin-route-progress"><span /></span>
    {children}
  </div>;
}
