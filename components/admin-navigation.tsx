"use client";

import { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpenText,
  Crown,
  Headphones,
  Languages,
  LayoutDashboard,
  LockKeyhole,
  LoaderCircle,
  UserCog,
  UsersRound,
} from "lucide-react";
import { AdminLink } from "@/components/admin-link";
import type { UserRole } from "@/lib/auth-service";

const navigationGroups = [
  {
    label: "Vận hành",
    items: [
      {
        href: "/admin",
        label: "Tổng quan",
        icon: LayoutDashboard,
        matches: (pathname: string) => pathname === "/admin",
      },
    ],
  },
  {
    label: "Nội dung học",
    items: [
      {
        href: "/admin/courses",
        label: "Lộ trình & bài học",
        icon: BookOpenText,
        matches: (pathname: string) => ["/admin/courses", "/admin/modules", "/admin/lessons"].some((prefix) => pathname.startsWith(prefix)),
      },
      {
        href: "/admin/vocabulary",
        label: "Kho từ vựng",
        icon: Languages,
        matches: (pathname: string) => pathname.startsWith("/admin/vocabulary"),
      },
      {
        href: "/admin/practice",
        label: "Kho Luyện ca",
        icon: Headphones,
        matches: (pathname: string) => pathname.startsWith("/admin/practice"),
      },
      {
        href: "/admin/access",
        label: "Khóa nội dung VIP",
        icon: LockKeyhole,
        matches: (pathname: string) => pathname.startsWith("/admin/access"),
      },
    ],
  },
  {
    label: "Kinh doanh & hệ thống",
    items: [
      {
        href: "/admin/users",
        label: "Người dùng",
        icon: UserCog,
        matches: (pathname: string) => pathname.startsWith("/admin/users"),
      },
      {
        href: "/admin/subscriptions",
        label: "VIP & Thanh toán",
        icon: Crown,
        matches: (pathname: string) => pathname.startsWith("/admin/subscriptions"),
      },
      {
        href: "/admin/analytics",
        label: "Thống kê",
        icon: BarChart3,
        matches: (pathname: string) => pathname.startsWith("/admin/analytics"),
      },
      {
        href: "/admin/team",
        label: "Đội nội dung",
        icon: UsersRound,
        matches: (pathname: string) => pathname.startsWith("/admin/team"),
      },
    ],
  },
] as const;

function canSeeItem(role: UserRole, href: string): boolean {
  return role === "admin" || href === "/admin/practice";
}

function AdminNavigationIcon({ Icon }: { Icon: typeof LayoutDashboard }) {
  const { pending } = useLinkStatus();
  return pending
    ? <LoaderCircle aria-hidden="true" className="admin-nav-spinner" size={17} />
    : <Icon aria-hidden="true" size={17} />;
}

export function AdminNavigation({ userRole }: { userRole: UserRole }) {
  const pathname = usePathname();

  return <nav aria-label="Điều hướng Console" className="admin-nav">
    {navigationGroups.map((group) => {
      const items = group.items.filter((item) => canSeeItem(userRole, item.href));
      if (!items.length) return null;
      return <div className="admin-nav-group" key={group.label}>
        <span>{group.label}</span>
        <div>{items.map(({ href, icon: Icon, label, matches }) => {
          const active = matches(pathname);
          return <AdminLink
            aria-current={active ? "page" : undefined}
            className={active ? "active" : undefined}
            href={href}
            intentPrefetch
            key={href}
            pendingLabel={`Đang mở ${label}…`}
            pendingVisual={false}
          >
            <AdminNavigationIcon Icon={Icon} />
            <span>{label}</span>
          </AdminLink>;
        })}</div>
      </div>;
    })}
  </nav>;
}
