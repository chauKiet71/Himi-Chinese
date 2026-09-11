"use client";

import { useLinkStatus } from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { useCallback, useEffect, useRef } from "react";
import { AdminLink } from "@/components/admin-link";
import type { UserRole } from "@/lib/auth-service";

const ADMIN_PREFETCH_STEP_MS = 180;
const ADMIN_PREFETCH_IDLE_TIMEOUT_MS = 1_500;

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

export function getAdminPrefetchHrefs(role: UserRole): string[] {
  return navigationGroups.flatMap((group) => group.items
    .filter((item) => canSeeItem(role, item.href))
    .map((item) => item.href));
}

function AdminNavigationIcon({ Icon }: { Icon: typeof LayoutDashboard }) {
  const { pending } = useLinkStatus();
  return pending
    ? <LoaderCircle aria-hidden="true" className="admin-nav-spinner" size={17} />
    : <Icon aria-hidden="true" size={17} />;
}

export function AdminNavigation({ userRole }: { userRole: UserRole }) {
  const pathname = usePathname();
  const router = useRouter();
  const initialPathnameRef = useRef(pathname);
  const prefetchedHrefsRef = useRef(new Set<string>());
  const prepareRoute = useCallback((href: string) => {
    if (prefetchedHrefsRef.current.has(href)) return;
    prefetchedHrefsRef.current.add(href);
    router.prefetch(href);
  }, [router]);

  useEffect(() => {
    const timeoutIds: number[] = [];
    const prefetchAdminRoutes = () => {
      getAdminPrefetchHrefs(userRole)
        .filter((href) => href !== initialPathnameRef.current)
        .forEach((href, index) => {
          timeoutIds.push(window.setTimeout(() => prepareRoute(href), index * ADMIN_PREFETCH_STEP_MS));
        });
    };

    let idleCallbackId: number | undefined;
    let fallbackTimeoutId: number | undefined;
    const scheduleWhenIdle = window.requestIdleCallback?.bind(window);
    if (scheduleWhenIdle) {
      idleCallbackId = scheduleWhenIdle(prefetchAdminRoutes, { timeout: ADMIN_PREFETCH_IDLE_TIMEOUT_MS });
    } else {
      fallbackTimeoutId = window.setTimeout(prefetchAdminRoutes, ADMIN_PREFETCH_STEP_MS);
    }

    return () => {
      if (idleCallbackId !== undefined) window.cancelIdleCallback(idleCallbackId);
      if (fallbackTimeoutId !== undefined) window.clearTimeout(fallbackTimeoutId);
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [prepareRoute, userRole]);

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
            key={href}
            onFocus={() => prepareRoute(href)}
            onMouseEnter={() => prepareRoute(href)}
            pendingLabel={`Đang mở ${label}…`}
            pendingVisual={false}
            prefetch={false}
          >
            <AdminNavigationIcon Icon={Icon} />
            <span>{label}</span>
          </AdminLink>;
        })}</div>
      </div>;
    })}
  </nav>;
}
