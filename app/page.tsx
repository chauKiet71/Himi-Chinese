import homeStylesheetHref from "./home-portal.css?url";
import { ReviewHomeStudio } from "@/components/review-home-studio";
import { getCurrentUser } from "@/lib/auth-session";
import { getVipUpgradeOverview } from "@/lib/vip-activation-request-service";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ verified?: string }> }) {
  const [params, user] = await Promise.all([searchParams, getCurrentUser()]);
  const vipOverview = await getVipUpgradeOverview(user?.id);
  const monthlyPlan = vipOverview.plans.find((plan) => {
    const code = plan.code.trim().toUpperCase();
    return code === "VIP_1TH" || code === "VIP_1M";
  }) ?? vipOverview.plans.find((plan) => plan.durationDays === 30) ?? null;
  const canShowWelcomeOffer = Boolean(
    user && monthlyPlan && !vipOverview.activeSubscription && !vipOverview.pendingRequest,
  );
  const monthlyPlanAnchor = monthlyPlan
    ? `/vip#vip-plan-${monthlyPlan.code.trim().toLocaleLowerCase("vi-VN").replaceAll("_", "-")}`
    : "/vip";

  return <>
    <link href={homeStylesheetHref} precedence="himi-home" rel="stylesheet" />
    <ReviewHomeStudio
      verified={params.verified === "1"}
      welcomeOffer={canShowWelcomeOffer && monthlyPlan ? {
        ctaHref: user
          ? monthlyPlanAnchor
          : `/login?returnTo=${encodeURIComponent(monthlyPlanAnchor)}`,
        durationDays: monthlyPlan.durationDays,
        planCode: monthlyPlan.code,
        planName: monthlyPlan.name,
        priceVnd: monthlyPlan.priceVnd,
      } : null}
    />
  </>;
}
