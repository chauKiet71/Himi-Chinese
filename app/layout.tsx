import type { Metadata } from "next";
import Script from "next/script";
import { Suspense, type CSSProperties } from "react";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import "./motion.css";
import "./responsive.css";
import "./white-backgrounds.css";
import "./brand-theme.css";
import "./lesson-interactive.css";
import { SiteHeader, SiteHeaderFallback } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileNav } from "@/components/mobile-nav";
import { LearnerAppShell } from "@/components/learner-app-shell";
import { getCurrentUser } from "@/lib/auth-session";
import { createBrandTheme } from "@/lib/brand";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const roboto = Roboto({
  subsets: ["latin", "vietnamese"],
  weight: "800",
  variable: "--font-roboto",
  display: "swap",
});

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
  const shellUser = user ? {
    displayName: user.displayName,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
    unreadNotificationCount: user.unreadNotificationCount,
  } : null;

  return <html lang="vi" className={`${inter.variable} ${roboto.variable}`} style={createBrandTheme() as CSSProperties}><body>
    {process.env.NODE_ENV === "development" ? <Script
      dangerouslySetInnerHTML={{ __html: developmentBrowserErrorGuard }}
      id="development-browser-error-guard"
      strategy="beforeInteractive"
    /> : null}
    <Suspense fallback={<SiteHeaderFallback />}><SiteHeader /></Suspense>
    <Suspense fallback={<div className="standalone-route-shell">{children}</div>}><LearnerAppShell user={shellUser}>{children}</LearnerAppShell></Suspense>
    <SiteFooter />
    <MobileNav />
  </body></html>;
}
