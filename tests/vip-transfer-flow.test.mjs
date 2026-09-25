import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("VIP policy page explains access and keeps the SePay purchase flow available", async () => {
  const [page, policyStyles, transferFlow, styles, brandStyles, motionStyles, seed, subscriptionService, paymentService, webhookRoute, orderRoute] = await Promise.all([
    read("app/vip/page.tsx"),
    read("app/vip/vip-policy.css"),
    read("components/vip-transfer-flow.tsx"),
    read("app/globals.css"),
    read("app/brand-theme.css"),
    read("app/motion.css"),
    read("db/seed.ts"),
    read("lib/admin-subscription-service.ts"),
    read("lib/sepay-payment-service.ts"),
    read("app/api/webhooks/sepay/route.ts"),
    read("app/api/payments/sepay/orders/route.ts"),
  ]);

  assert.match(page, /VipTransferFlow/);
  assert.match(page, /formatPrice/);
  assert.match(page, /displayPlans\.map/);
  assert.match(page, /leftLifetime !== rightLifetime\) return leftLifetime \? 1 : -1/);
  assert.match(page, /leftTrial !== rightTrial\) return leftTrial \? -1 : 1/);
  assert.match(page, /Đăng nhập để thanh toán/);
  assert.match(page, /quét QR/);
  assert.doesNotMatch(page, /Quyền lợi của bạn|Điều kiện áp dụng/);
  assert.match(page, /Toàn bộ bài học VIP/);
  assert.match(page, /Kho nghe & phản xạ VIP/);
  assert.doesNotMatch(page, /Tiến độ của bạn luôn được giữ lại/);
  assert.match(page, /Xem nội dung VIP/);
  assert.match(page, /Đọc điều khoản đầy đủ/);
  assert.match(page, /Chọn gói VIP phù hợp/);
  assert.match(page, /code\.trim\(\)\.toUpperCase\(\) === "VIP_1M"/);
  assert.match(page, /vip-sale-cord/);
  assert.match(page, /vip-sale-badge[\s\S]*?<span>Sale<\/span><strong>-\{salePercent\}%<\/strong>/);
  assert.match(page, /Bạn đã dùng gói 3 ngày một lần rồi/);
  assert.doesNotMatch(page, /Chọn quyền truy cập/);
  assert.match(policyStyles, /\.vip-purchase-section/);
  assert.match(policyStyles, /@media \(max-width: 720px\)/);
  assert.match(transferFlow, /onClick=\{openTransfer\}/);
  assert.match(transferFlow, /<h2 id=\{titleId\}>Quét QR chuyển khoản<\/h2>/);
  assert.match(transferFlow, /fetch\("\/api\/payments\/sepay\/orders"/);
  assert.match(transferFlow, /\/api\/payments\/sepay\/orders\/\$\{pollingOrderId\}/);
  assert.match(transferFlow, /readPaymentResponse/);
  assert.match(transferFlow, /payment_service_unavailable/);
  assert.doesNotMatch(transferFlow, /response\.json\(\)/);
  assert.match(transferFlow, /Đang chờ SePay xác nhận/);
  assert.match(transferFlow, /Chào mừng thành viên/);
  assert.match(transferFlow, /Thanh toán hoàn tất/);
  assert.doesNotMatch(transferFlow, /Khám phá bài học VIP/);
  assert.match(transferFlow, /himi-celebrate\.webp/);
  assert.match(transferFlow, /formatVipAccessEnd/);
  assert.doesNotMatch(transferFlow, /SePay đã xác nhận/);
  assert.doesNotMatch(transferFlow, /Trạng thái giao dịch/);
  assert.match(transferFlow, /role="dialog"/);
  assert.match(transferFlow, /<Image/);
  assert.match(page, /vipPlanAccessLabel/);
  assert.doesNotMatch(page, /Học miễn phí|Tiếp tục học miễn phí|is-free/);
  assert.match(seed, /name: "VIP vĩnh viễn"[\s\S]*priceVnd: 1_090_000/);
  assert.match(seed, /code: "VIP_3N"[\s\S]*?durationDays: 3[\s\S]*?priceVnd: 29_000/);
  assert.match(seed, /code: "VIP_1M"[\s\S]*?priceVnd: 11_000/);
  assert.match(subscriptionService, /calculateVipPlanEndsAt/);
  assert.match(subscriptionService, /endsAt: endsAt\?\.toISOString\(\) \?\? null/);
  assert.match(paymentService, /accessEndsAt: subscriptions\.endsAt/);
  assert.match(paymentService, /select\(\{ id: paymentOrders\.id \}\)\.from\(paymentOrders\)[\s\S]*?\.for\("update"\)/);
  assert.doesNotMatch(paymentService, /const existingRows = await tx\.select\([\s\S]*?\.leftJoin\(subscriptions[\s\S]*?\.for\("update"\)/);
  assert.match(paymentService, /VIP đã được kích hoạt/);
  assert.match(paymentService, /trial_plan_already_used/);
  assert.match(paymentService, /eq\(paymentOrders\.status, "paid"\)/);
  assert.match(paymentService, /previousTrialSubscriptions/);
  assert.match(transferFlow, /purchaseDisabled/);
  assert.match(transferFlow, /Bạn đã trải nghiệm gói VIP 3 ngày rồi/);
  assert.doesNotMatch(transferFlow, /requestVipActivationAction|name="userNote"/);
  assert.match(webhookRoute, /authenticateSepayWebhook/);
  assert.match(webhookRoute, /processSepayWebhook/);
  assert.match(webhookRoute, /success: true/);
  assert.match(orderRoute, /createOrReuseSepayPaymentOrder/);
  assert.match(orderRoute, /payment_service_unavailable/);
  assert.match(styles, /\.vip-plan-request-form \.button:hover:not\(:disabled\)[\s\S]*translateY\(-3px\)/);
  assert.match(styles, /\.vip-plan-request-form \.button:active:not\(:disabled\)/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /@keyframes vip-success-mascot-idle/);
  assert.match(styles, /@keyframes vip-success-ticket-in/);
  assert.match(styles, /transform 220ms cubic-bezier\(\.22, 1, \.36, 1\)/);
  assert.match(styles, /transform: translateY\(-2px\)/);
  assert.match(motionStyles, /\.vip-plan-request-form \.button[\s\S]*transition-duration: 220ms, 180ms, 180ms, 180ms !important/);
  assert.match(brandStyles, /\.vip-plan-card\.featured\s*\{[\s\S]*?background:\s*#ffd0c4/);
  assert.match(brandStyles, /\.vip-plan-card:hover\s*\{[\s\S]*?transform:\s*translateY\(-7px\) scale\(1\.012\)/);
  assert.match(brandStyles, /\.vip-plan-card\.featured:hover\s*\{[\s\S]*?background:\s*#ffc3b5/);
  assert.match(brandStyles, /\.vip-plan-card\.featured:hover\s*\{[\s\S]*?transform:\s*translateY\(-13px\) scale\(1\.012\)/);
  assert.match(brandStyles, /@keyframes himi-vip-card-sheen/);
  assert.match(brandStyles, /\.vip-plan-card:hover::before\s*\{[\s\S]*?animation:\s*himi-vip-card-sheen/);
  assert.match(brandStyles, /\.vip-plan-card:hover::after\s*\{[\s\S]*?transform:\s*scale\(1\.12\)/);
  assert.match(brandStyles, /\.vip-plan-card:hover \.vip-plan-request-form \.button:not\(:hover\)/);
  assert.match(brandStyles, /\.vip-plan-card:focus-within/);
  assert.doesNotMatch(brandStyles, /\.vip-plan-card\.featured\s*\{[\s\S]*?background:\s*var\(--himi-black\)/);
});
