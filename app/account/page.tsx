import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  CalendarDays,
  ChevronRight,
  ChevronLeft,
  Clock3,
  Crown,
  LogOut,
  Mail,
  Sparkles,
  UserRound,
} from "lucide-react";
import { AccountAvatarUploader } from "@/components/account-avatar-uploader";
import { AccountPasswordSheet } from "@/components/account-password-sheet";
import { cancelVipActivationRequestAction } from "@/app/vip/actions";
import { getCurrentUser } from "@/lib/auth-session";
import { LogoutForm } from "@/components/logout-form";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "@/lib/auth-validation";
import { getPendingVipActivationRequest } from "@/lib/vip-activation-request-service";
import { vipPlanDurationLabel } from "@/lib/vip-plan";
import { getActiveVipSubscription, vipDaysRemaining } from "@/lib/vip-subscription";

export const metadata: Metadata = { title: "Tài khoản" };

const roleLabels = {
  learner: "Người học",
  editor: "Biên tập viên",
  reviewer: "Người duyệt",
  admin: "Quản trị viên",
} as const;

const accountErrors = {
  invalid_current_password: "Mật khẩu hiện tại chưa đúng.",
  invalid_password: `Mật khẩu mới cần từ ${MIN_PASSWORD_LENGTH} đến ${MAX_PASSWORD_LENGTH} ký tự.`,
  password_mismatch: "Hai mật khẩu mới chưa trùng nhau.",
  invalid_input: "Yêu cầu chưa hợp lệ. Hãy tải lại trang và thử lại.",
  not_found: "Không tìm thấy yêu cầu VIP này.",
  vip_request_not_pending: "Yêu cầu VIP đã được xử lý trước đó.",
} as const;

const accountSuccess = {
  request_cancelled: "Đã hủy yêu cầu VIP đang chờ.",
} as const;

type AccountError = keyof typeof accountErrors;

function initials(value: string): string {
  return value
    .split(/\s+/u)
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("vi-VN") || "HW";
}

function formatDate(value: Date): string {
  return value.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  });
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: AccountError;
    success?: keyof typeof accountSuccess;
    verified?: string;
  }>;
}) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams]);
  if (!user) redirect("/login?returnTo=/account&error=required");

  const [vipSubscription, pendingVipRequest] = await Promise.all([
    getActiveVipSubscription(user.id),
    getPendingVipActivationRequest(user.id),
  ]);
  const daysRemaining = vipSubscription ? vipDaysRemaining(vipSubscription.endsAt) : null;
  const vipExpiry = vipSubscription?.endsAt ? formatDate(vipSubscription.endsAt) : null;
  const joinedAt = formatDate(user.createdAt);
  const today = formatDate(new Date());
  const passwordErrors: AccountError[] = ["invalid_current_password", "invalid_password", "password_mismatch"];
  const showPasswordEditor = Boolean(params.error && passwordErrors.includes(params.error));
  const membershipState = vipSubscription ? "vip" : pendingVipRequest ? "pending" : "free";
  const membershipStateClass = {
    vip: "account-membership-vip",
    free: "account-membership-free",
    pending: "account-membership-pending",
  }[membershipState];
  const membershipTitle = vipSubscription?.planName ?? pendingVipRequest?.planName ?? "Gói miễn phí";
  const membershipBadge = vipSubscription ? "VIP" : pendingVipRequest ? "Đang chờ duyệt" : "FREE";
  const membershipShortStatus = vipSubscription
    ? daysRemaining === null
      ? "Đang hoạt động"
      : daysRemaining === 0
        ? "Hết hạn hôm nay"
        : `Còn ${daysRemaining} ngày`
    : pendingVipRequest
      ? "Yêu cầu nâng cấp đang được xử lý"
      : "Chưa kích hoạt VIP";
  const membershipDescription = vipSubscription
    ? vipExpiry
      ? `Quyền VIP có hiệu lực đến ${vipExpiry}${daysRemaining === null ? "" : ` · còn ${daysRemaining} ngày`}.`
      : "Toàn bộ quyền lợi VIP đang được mở cho tài khoản này."
    : pendingVipRequest
      ? `Đã gửi ngày ${formatDate(pendingVipRequest.createdAt)} · ${vipPlanDurationLabel(pendingVipRequest.planCode, pendingVipRequest.durationDays)}`
      : "Mở khóa toàn bộ lộ trình và tính năng nâng cao.";

  return (
    <main className={`account-page account-wallet-redesign account-page-${membershipState}`}>
      <div className="account-page-inner">
        <header className="account-mobile-header">
          <Link aria-label="Quay lại trang học" href="/"><ChevronLeft aria-hidden="true" size={26} /></Link>
          <strong>Hồ sơ</strong>
          <Link aria-label="Mở thông báo" href="/notifications"><Bell aria-hidden="true" size={23} /></Link>
        </header>
        <h1 className="account-page-title">Tài khoản của tôi</h1>

        {params.verified === "1" ? <p className="auth-notice account-feedback" role="status">Email đã được xác minh. Tài khoản của bạn đã sẵn sàng.</p> : null}
        {params.success && accountSuccess[params.success] ? <p className="auth-notice account-feedback" role="status">{accountSuccess[params.success]}</p> : null}
        {params.error && accountErrors[params.error] ? <p className="auth-error account-feedback" role="alert">{accountErrors[params.error]}</p> : null}

        <div className={`account-membership-wallet ${membershipStateClass}`}>
          <section className="account-profile-hero" aria-labelledby="account-profile-name">
            <AccountAvatarUploader
              avatarUrl={user.avatarUrl}
              displayName={user.displayName}
              initials={initials(user.displayName)}
            />
            <div className="account-profile-copy">
              <h2 id="account-profile-name">{user.displayName}</h2>
              <em className="account-profile-verified"><BadgeCheck aria-hidden="true" size={15} />Đã xác minh</em>
              <p>{roleLabels[user.role]} Himi Chinese</p>
              <div className="account-profile-email"><Mail aria-hidden="true" size={18} /><span>{user.email}</span><em><BadgeCheck aria-hidden="true" size={14} />Đã xác minh</em></div>
              <Link className="account-vip-outline" href="/vip"><Crown aria-hidden="true" size={19} />Xem quyền lợi VIP</Link>
            </div>
          </section>

          <Image
            alt="Linh vật chim cánh cụt Himi"
            className="account-wallet-mascot"
            height={380}
            sizes="(max-width: 420px) 168px, (max-width: 720px) 180px, (min-width: 1025px) 292px, 1px"
            src="/assets/mascot/himi-v2/himi-wave.webp"
            width={380}
          />

          <section className={`account-membership-band ${vipSubscription ? "is-active" : ""}`} aria-label={`Gói thành viên hiện tại: ${membershipBadge}`}>
            <span className="account-membership-icon">{vipSubscription
              ? <Crown aria-hidden="true" size={23} />
              : pendingVipRequest
                ? <Clock3 aria-hidden="true" size={22} />
                : <Sparkles aria-hidden="true" size={22} />}</span>
            <div>
              <span className="account-membership-status-badge">{membershipBadge}</span>
              <h2>{membershipTitle}</h2>
              <p className="account-membership-short-status">{membershipShortStatus}</p>
              {vipSubscription && daysRemaining !== null ? <span className="account-membership-days"><CalendarDays aria-hidden="true" className="account-membership-meta-icon" size={24} /><small>Còn</small><strong>{daysRemaining} ngày</strong></span> : null}
              <p className="account-membership-description">{membershipDescription}</p>
              {vipExpiry ? <span className="account-membership-expiry"><CalendarDays aria-hidden="true" className="account-membership-meta-icon" size={24} /><small>Hết hạn</small><strong>{vipExpiry}</strong></span> : null}
            </div>
            <Link href="/vip">{vipSubscription || pendingVipRequest ? "Xem quyền lợi" : "Khám phá VIP"} <ArrowRight aria-hidden="true" size={18} /></Link>
          </section>
        </div>

        {pendingVipRequest ? <section className="account-pending-request" aria-label="Yêu cầu VIP đang chờ">
          <Clock3 size={21} />
          <div>
            <strong>Yêu cầu {pendingVipRequest.planName} đang chờ</strong>
            <span>Đã gửi ngày {formatDate(pendingVipRequest.createdAt)} · {vipPlanDurationLabel(pendingVipRequest.planCode, pendingVipRequest.durationDays)}</span>
          </div>
          <form action={cancelVipActivationRequestAction}>
            <input name="requestId" type="hidden" value={pendingVipRequest.id} />
            <input name="returnTo" type="hidden" value="account" />
            <button type="submit">Hủy yêu cầu</button>
          </form>
        </section> : null}

        <section className="account-information" id="account-information" aria-labelledby="account-information-title">
          <h2 id="account-information-title">Thông tin tài khoản</h2>
          <dl>
            <div><dt><UserRound size={20} /><span>Vai trò</span></dt><dd>{roleLabels[user.role]}</dd></div>
            <div id="account-email"><dt><Mail size={20} /><span>Email</span></dt><dd><span>{user.email}</span><em><BadgeCheck size={14} />Đã xác minh</em></dd></div>
            <div><dt><CalendarDays size={20} /><span>Ngày tham gia</span></dt><dd>{joinedAt}</dd></div>
          </dl>
        </section>

        <section className="account-security-panel" aria-labelledby="account-security-title">
          <h2 id="account-security-title">Tài khoản &amp; bảo mật</h2>
          <div className="account-security-list">
            <a className="account-security-row" href="#account-information">
              <UserRound size={22} />
              <span><strong>Thông tin đăng nhập</strong><small>Xem email đang dùng cho tài khoản của bạn</small></span>
              <ChevronRight size={20} />
            </a>
            <AccountPasswordSheet
              maxLength={MAX_PASSWORD_LENGTH}
              minLength={MIN_PASSWORD_LENGTH}
              openOnMount={showPasswordEditor}
            />
            <LogoutForm className="account-logout-form">
              <button className="account-security-row" type="submit">
                <LogOut size={22} />
                <span><strong>Đăng xuất</strong><small>Đăng xuất khỏi tài khoản trên thiết bị này</small></span>
                <ChevronRight size={20} />
              </button>
            </LogoutForm>
          </div>
        </section>

        <footer className="account-page-footer">Himi Chinese © {new Date().getFullYear()} <span>·</span> {today}</footer>
      </div>
    </main>
  );
}
