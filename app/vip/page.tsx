import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Clock3,
  Crown,
} from "lucide-react";
import { cancelVipActivationRequestAction } from "@/app/vip/actions";
import { HimiSectionBanner } from "@/components/himi-section-banner";
import { VipTransferFlow } from "@/components/vip-transfer-flow";
import { getCurrentUser } from "@/lib/auth-session";
import { getVipUpgradeOverview } from "@/lib/vip-activation-request-service";
import { isLifetimeVipPlan, isTrialVipPlan, vipPlanAccessLabel, vipPlanDurationLabel } from "@/lib/vip-plan";
import { vipDaysRemaining } from "@/lib/vip-subscription";

export const metadata: Metadata = {
  title: "Quyền lợi Himi Chinese VIP",
  description: "Quyền lợi và điều kiện sử dụng nội dung VIP trên Himi Chinese.",
};

const purchaseBenefits = [
  "Toàn bộ bài học VIP",
  "Kho nghe & phản xạ VIP",
  "Luyện lại không giới hạn",
  "Nội dung VIP mới trong thời hạn",
];

const noticeMessages: Record<string, string> = {
  requested: "Yêu cầu của bạn đã vào hàng đợi. Quản trị viên sẽ kiểm tra và kích hoạt trực tiếp trên tài khoản này.",
  request_cancelled: "Đã hủy yêu cầu đang chờ. Quyền truy cập hiện tại của bạn không bị ảnh hưởng.",
};

const errorMessages: Record<string, string> = {
  invalid_input: "Thông tin yêu cầu chưa hợp lệ. Hãy tải lại trang và thử lại.",
  not_found: "Không tìm thấy yêu cầu này hoặc yêu cầu không còn thuộc tài khoản của bạn.",
  vip_plan_inactive: "Quyền truy cập này vừa ngừng nhận yêu cầu. Hãy thử lại sau.",
  vip_request_ineligible: "Tài khoản hiện chưa đủ điều kiện gửi yêu cầu VIP.",
  vip_request_not_pending: "Yêu cầu đã được xử lý trước đó. Trạng thái mới nhất đã được cập nhật bên dưới.",
};

function formatDate(value: Date | null): string {
  if (!value) return "không giới hạn";
  return value.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
  });
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

function planSalePercent(code: string, durationDays: number, configuredDiscount: number): number | null {
  if (configuredDiscount > 0) return configuredDiscount;
  const normalizedCode = code.trim().toUpperCase();
  if (normalizedCode === "VIP_1M" || durationDays === 30) return 10;
  if (normalizedCode === "VIP_3M" || durationDays === 90) return 18;
  if (normalizedCode === "VIP_6M" || durationDays === 180) return 25;
  return null;
}

export default async function VipPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const [params, user] = await Promise.all([searchParams, getCurrentUser()]);
  const overview = await getVipUpgradeOverview(user?.id);
  const pending = overview.pendingRequest;
  const active = overview.activeSubscription;
  const daysRemaining = active ? vipDaysRemaining(active.endsAt) : null;
  const notice = params.success ? noticeMessages[params.success] : null;
  const error = params.error ? errorMessages[params.error] : null;
  const hasAccountStatus = Boolean(notice || error || active || pending);
  const featuredPlanId = overview.plans.find((plan) => plan.code.trim().toUpperCase() === "VIP_1M")?.id
    ?? overview.plans.find((plan) => plan.durationDays === 30)?.id
    ?? overview.plans[0]?.id;
  const displayPlans = [...overview.plans].sort((left, right) => {
    const leftLifetime = isLifetimeVipPlan(left.code);
    const rightLifetime = isLifetimeVipPlan(right.code);
    if (leftLifetime !== rightLifetime) return leftLifetime ? 1 : -1;
    return left.durationDays - right.durationDays;
  });

  return <main className="vip-page">
    <section className="section-shell himi-banner-shell vip-page-header"><HimiSectionBanner
      description="Mở bài học và tình huống nâng cao, giữ trọn tiến độ trên một tài khoản."
      titleId="vip-page-title"
      titleLines={["Học liền mạch.", "Mở trọn hành trình."]}
      variant="vip"
    /></section>

    {hasAccountStatus ? <section className="section-shell vip-request-feedback" aria-live="polite">
      {notice ? <p className="vip-request-notice success"><Check size={17} />{notice}</p> : null}
      {error ? <p className="vip-request-notice error" role="alert"><AlertCircle size={17} />{error}</p> : null}
      {active ? <div className="vip-current-status is-active">
        <span className="vip-current-status-icon"><Crown size={20} /></span>
        <div><span>VIP đang hoạt động</span><strong>{active.planName}</strong><small>Hiệu lực đến {formatDate(active.endsAt)}{daysRemaining === null ? "" : ` · còn ${daysRemaining} ngày`}</small></div>
        <Link href="/account">Xem tài khoản <ArrowRight size={15} /></Link>
      </div> : null}
      {pending ? <div className="vip-current-status is-pending">
        <span className="vip-current-status-icon"><Clock3 size={20} /></span>
        <div><span>Đang chờ quản trị viên duyệt</span><strong>{pending.planName}</strong><small>Gửi ngày {formatDate(pending.createdAt)} · bạn có thể hủy yêu cầu nếu muốn điều chỉnh sau</small></div>
        <form action={cancelVipActivationRequestAction}>
          <input name="requestId" type="hidden" value={pending.id} />
          <input name="returnTo" type="hidden" value="vip" />
          <button type="submit">Hủy yêu cầu</button>
        </form>
      </div> : null}
    </section> : null}

    <section className="section-shell vip-purchase-section" aria-labelledby="vip-purchase-title">
      <header className="vip-purchase-heading">
        <h2 id="vip-purchase-title">Chọn gói VIP phù hợp</h2>
        <p>Chọn thời hạn, quét QR và hệ thống sẽ cập nhật quyền học sau khi giao dịch được đối soát.</p>
      </header>
      <div className="pricing-grid vip-pricing-grid" aria-label="Các gói VIP">
        {displayPlans.map((plan) => {
          const featured = plan.id === featuredPlanId;
          const lifetime = isLifetimeVipPlan(plan.code);
          const trial = isTrialVipPlan(plan.code, plan.durationDays);
          const trialAlreadyUsed = trial && overview.hasPurchasedTrial;
          const salePercent = planSalePercent(plan.code, plan.durationDays, plan.discountPercent);
          const isPendingPlan = pending?.planId === plan.id;
          const buttonText = trialAlreadyUsed
            ? "Đã dùng gói trải nghiệm"
            : isPendingPlan
            ? "Đang chờ duyệt"
            : pending
              ? "Đổi sang gói này"
              : active
                ? "Yêu cầu gia hạn"
                : "Nâng cấp";

          return <article
            className={`price-card vip-plan-card ${featured ? "featured" : ""}`}
            id={`vip-plan-${plan.code.toLocaleLowerCase("vi-VN").replaceAll("_", "-")}`}
            key={plan.id}
          >
            <div className="vip-plan-badges">
              {featured ? <span className="price-badge">Được chọn nhiều</span> : null}
              {salePercent ? <span className="vip-sale-tag">
                <i aria-hidden="true" className="vip-sale-cord" />
                <span className="vip-sale-badge"><span>Sale</span><strong>-{salePercent}%</strong></span>
              </span> : null}
            </div>
            <span className="price-name">{plan.name}</span>
            <div className="price"><strong>{formatPrice(plan.priceVnd)}</strong><span>/ {vipPlanDurationLabel(plan.code, plan.durationDays).toLocaleLowerCase("vi-VN")}</span></div>
            <p className="price-description">{lifetime
              ? "Đầy đủ quyền VIP, không cần gia hạn."
              : `Đầy đủ quyền VIP trong ${plan.durationDays} ngày.`}</p>
            <ul className="feature-list">{purchaseBenefits.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}</ul>
            {trialAlreadyUsed ? <p className="vip-trial-used-note" role="status"><Check size={16} />
              <span><strong>Bạn đã dùng gói 3 ngày.</strong> Cảm ơn bạn đã trải nghiệm! Gói 1 tháng sẽ phù hợp để tiếp tục học.</span>
            </p> : null}
            {user ? <VipTransferFlow
              buttonText={buttonText}
              durationLabel={vipPlanAccessLabel(plan.code, plan.durationDays)}
              featured={featured}
              isPendingPlan={isPendingPlan}
              purchaseDisabled={trialAlreadyUsed}
              planCode={plan.code}
              planId={plan.id}
              planName={plan.name}
              priceLabel={formatPrice(plan.priceVnd)}
            /> : <Link className={`button button-full ${featured ? "button-light" : "button-primary"}`} href="/login?returnTo=%2Fvip">Đăng nhập để thanh toán</Link>}
          </article>;
        })}
      </div>
    </section>

    <nav className="section-shell vip-bottom-actions" aria-label="Liên kết sau bảng giá">
      <Link className="vip-policy-button is-primary" href="/courses">Xem nội dung VIP <ArrowRight size={17} /></Link>
      <Link className="vip-policy-button is-secondary" href="/terms">Đọc điều khoản đầy đủ</Link>
    </nav>

  </main>;
}
