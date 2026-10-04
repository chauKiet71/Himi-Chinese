"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getClientBreadcrumb } from "@/lib/client-breadcrumb";

export function ClientBreadcrumb() {
  const pathname = usePathname();
  const breadcrumb = getClientBreadcrumb(pathname);
  if (!breadcrumb) return null;

  return <div className="client-breadcrumb-bar">
    <nav aria-label="Điều hướng trang" className="client-breadcrumb">
      <Link href={breadcrumb.parentHref} prefetch={false}>
        <ArrowLeft aria-hidden="true" size={19} strokeWidth={2} />
        <span>{breadcrumb.parentLabel}</span>
      </Link>
      <span aria-hidden="true" className="client-breadcrumb-separator">/</span>
      <span aria-current="page" className="client-breadcrumb-current">{breadcrumb.currentLabel}</span>
    </nav>
  </div>;
}
