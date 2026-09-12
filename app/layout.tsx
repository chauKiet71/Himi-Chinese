import type { Metadata } from "next";
import Script from "next/script";
import { Suspense, type CSSProperties } from "react";
import "./globals.css";
import "./motion.css";
import "./responsive.css";
import "./white-backgrounds.css";
import "./brand-theme.css";
import "./chatbot-widget.css";
import "./game-motion.css";
import "./account-wallet.css";
import "./lesson-interactive.css";
import "./vip/vip-policy.css";
import "./learning-journey-responsive.css";
import "./adaptive-responsive.css";
import { SiteHeader, SiteHeaderFallback } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileNav } from "@/components/mobile-nav";
import { HimiChatbot } from "@/components/himi-chatbot";
import { LearnerAppShell } from "@/components/learner-app-shell";
import { LearningDataProvider } from "@/components/learning-data-provider";
import { getCurrentUser } from "@/lib/auth-session";
import { createBrandTheme } from "@/lib/brand";

export const metadata: Metadata = {
  title: { default: "Himi Chinese — Tiếng Trung cho người đi làm", template: "%s | Himi Chinese" },
  description: "Học tiếng Trung chuyên ngành theo tình huống thực tế tại nơi làm việc.",
};

const developmentBrowserErrorGuard = String.raw`(() => {
  const extensionOrigin = "chrome-extension://eppiocemhmnlbhjplcgkofciiegomcon/";
  const isUrbanVpnRejection = (reason) => {
    const details = [reason?.message, reason?.stack, reason?.cause?.stack]
      .filter(Boolean)
      .join("\n");
    return details.includes(extensionOrigin) && details.includes("M_ID");
  };

  window.addEventListener("unhandledrejection", (event) => {
    if (!isUrbanVpnRejection(event.reason)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, { capture: true });
})();`;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  const learningCacheScope = user ? `${user.id}:${user.role}:${user.sessionCreatedAt?.toISOString() ?? "session"}` : "guest";
  const shellUser = user ? {
    displayName: user.displayName,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
    unreadNotificationCount: user.unreadNotificationCount,
  } : null;

  return <html lang="vi" style={createBrandTheme() as CSSProperties}><body>
    {process.env.NODE_ENV === "development" ? <Script
      dangerouslySetInnerHTML={{ __html: developmentBrowserErrorGuard }}
      id="development-browser-error-guard"
      strategy="beforeInteractive"
    /> : null}
    <Suspense fallback={<SiteHeaderFallback />}><SiteHeader /></Suspense>
    <LearningDataProvider key={learningCacheScope} authenticated={Boolean(user)} scope={learningCacheScope}>
      <Suspense fallback={<div className="standalone-route-shell">{children}</div>}>
        <LearnerAppShell user={shellUser}>{children}</LearnerAppShell>
      </Suspense>
    </LearningDataProvider>
    <SiteFooter />
    <MobileNav />
    <HimiChatbot />
  </body></html>;
}
