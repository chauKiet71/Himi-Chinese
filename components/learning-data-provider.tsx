"use client";

import { createContext, Suspense, useContext, useEffect, useMemo, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { createBrowserApiCache, type BrowserApiCache } from "@/lib/browser-api-cache";

const LearningDataContext = createContext<BrowserApiCache | null>(null);
const backgroundExcluded = /^\/(?:admin|login|register|forgot-password|reset-password|verify-email|terms|privacy)(?:\/|$)/;

function learningWarmupUrls(pathname: string, authenticated: boolean): string[] {
  if (pathname === "/games") return ["/api/games/vocabulary?level=hsk-1"];
  if (authenticated && (pathname === "/" || pathname.startsWith("/practice"))) {
    return ["/api/progress/practice"];
  }
  return [];
}

export function LearningDataProvider({ scope, authenticated, children }: { scope: string; authenticated: boolean; children: ReactNode }) {
  const cache = useMemo(() => createBrowserApiCache({ scope }), [scope]);
  useEffect(() => { void cache.removeOtherScopes(); }, [cache]);
  return <LearningDataContext.Provider value={cache}>
    <Suspense fallback={null}><LearningDataWarmup cache={cache} authenticated={authenticated} /></Suspense>
    {children}
  </LearningDataContext.Provider>;
}

function LearningDataWarmup({ cache, authenticated }: { cache: BrowserApiCache; authenticated: boolean }) {
  const pathname = usePathname();
  const enabled = !backgroundExcluded.test(pathname);

  useEffect(() => {
    if (!enabled) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const urls = learningWarmupUrls(pathname, authenticated);
    if (!urls.length) return;
    let cancelled = false;
    let running = false;
    let index = 0;
    let timer: number | undefined;
    let idle: number | undefined;
    const canWarm = () => !cancelled && navigator.onLine && document.visibilityState === "visible"
      && !connection?.saveData && !["slow-2g", "2g"].includes(connection?.effectiveType ?? "");
    // One background request at a time, yielding between datasets. Foreground
    // reads share any pending request and are never placed behind this queue.
    const run = async () => {
      if (running || !canWarm() || index >= urls.length) return;
      running = true;
      const url = urls[index++];
      try { await cache.get(url); } catch { /* A failure must not block other datasets. */ }
      running = false;
      schedule();
    };
    const schedule = () => {
      if (!canWarm() || running || index >= urls.length) return;
      if (timer !== undefined) window.clearTimeout(timer);
      if (idle !== undefined) window.cancelIdleCallback?.(idle);
      if (window.requestIdleCallback) idle = window.requestIdleCallback(() => { void run(); }, { timeout: 4_000 });
      else timer = window.setTimeout(() => { void run(); }, 1_500);
    };
    schedule();
    window.addEventListener("online", schedule);
    document.addEventListener("visibilitychange", schedule);
    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
      if (idle !== undefined) window.cancelIdleCallback?.(idle);
      window.removeEventListener("online", schedule);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [cache, authenticated, enabled, pathname]);

  return null;
}

export function useLearningData() {
  const cache = useContext(LearningDataContext);
  if (!cache) throw new Error("LearningDataProvider is required");
  return cache;
}
