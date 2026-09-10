"use client";

import Link, { useLinkStatus } from "next/link";
import { LoaderCircle } from "lucide-react";
import type { ComponentProps } from "react";

type AdminLinkProps = ComponentProps<typeof Link> & {
  intentPrefetch?: boolean;
  pendingLabel?: string;
  pendingVisual?: boolean;
};

export function AdminLinkPendingStatus({
  label = "Đang mở trang…",
  visual = true,
}: {
  label?: string;
  visual?: boolean;
}) {
  const { pending } = useLinkStatus();
  if (!pending) return null;

  return <>
    <span aria-hidden="true" className={`admin-link-pending${visual ? " is-visual" : ""}`}>
      {visual ? <LoaderCircle className="admin-nav-spinner" size={14} /> : null}
    </span>
    <span aria-live="polite" className="sr-only" role="status">{label}</span>
  </>;
}

export function AdminLink({
  children,
  className,
  href,
  intentPrefetch = false,
  pendingLabel,
  pendingVisual = true,
  prefetch,
  ...props
}: AdminLinkProps) {
  const linkClassName = ["admin-smart-link", className].filter(Boolean).join(" ");

  return <Link
    {...props}
    className={linkClassName}
    data-admin-prefetch={intentPrefetch ? "intent" : undefined}
    href={href}
    prefetch={prefetch ?? (intentPrefetch ? false : "auto")}
  >
    {children}
    <AdminLinkPendingStatus label={pendingLabel} visual={pendingVisual} />
  </Link>;
}
