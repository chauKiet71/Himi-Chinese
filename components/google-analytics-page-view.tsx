"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function GoogleAnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams?.toString() ?? "";
  const lastLocation = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    const location = window.location.origin + pathname + (query ? `?${query}` : "");
    if (lastLocation.current === location) return;
    const analyticsWindow = window as typeof window & {
      gtag?: (...args: unknown[]) => void;
    };
    if (!analyticsWindow.gtag) return;
    analyticsWindow.gtag("event", "page_view", {
      send_to: "G-SKK9GGRTS1",
      page_location: location,
      page_title: document.title,
      page_referrer: lastLocation.current ?? document.referrer,
    });
    lastLocation.current = location;
  }, [pathname, query]);

  return null;
}
