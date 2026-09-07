import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("VIP policy page explains access and keeps the SePay purchase flow available", async () => {
  const [page, policyStyles, transferFlow, styles, motionStyles, seed, subscriptionService, webhookRoute, orderRoute] = await Promise.all([
    read("app/vip/page.tsx"),
    read("app/vip/vip-policy.css"),
    read("components/vip-transfer-flow.tsx"),
    read("app/globals.css"),
    read("app/motion.css"),
    read("db/seed.ts"),
    read("lib/admin-subscription-service.ts"),
    read("app/api/webhooks/sepay/route.ts"),
    read("app/api/payments/sepay/orders/route.ts"),
  ]);

  assert.match(page, /VipTransferFlow/);
  assert.match(page, /formatPrice/);
  assert.match(page, /displayPlans\.map/);
  assert.match(page, /leftLifetime !== rightLifetime\) return leftLifetime \? 1 : -1/);
  assert.match(page, /Đăng nhập để thanh toán/);
  assert.match(page, /quét QR/);
  assert.doesNotMatch(page, /Quyền lợi của bạn|Điều kiện áp dụng/);
  assert.match(page, /Toàn bộ bài học VIP/);
  assert.match(page, /Kho nghe & phản xạ VIP/);
  assert.doesNotMatch(page, /Tiến độ của bạn luôn được giữ lại/);
  assert.match(page, /Xem nội dung VIP/);
  assert.match(page, /Đọc điều khoản đầy đủ/);
  assert.match(page, /Chọn gói VIP phù hợp/);
  assert.doesNotMatch(page, /Chọn quyền truy cập/);
  assert.match(policyStyles, /\.vip-purchase-section/);
  assert.match(policyStyles, /@media \(max-width: 720px\)/);
  assert.match(transferFlow, /onClick=\{openTransfer\}/);
  assert.match(transferFlow, /<h2 id=\{titleId\}>Quét QR chuyển khoản<\/h2>/);
  assert.match(transferFlow, /fetch\("\/api\/payments\/sepay\/orders"/);
  assert.match(transferFlow, /\/api\/payments\/sepay\/orders\/\$\{pollingOrderId\}/);
  assert.match(transferFlow, /Đang chờ SePay xác nhận/);
  assert.match(transferFlow, /Thanh toán thành công/);
  assert.match(transferFlow, /role="dialog"/);
  assert.match(transferFlow, /<Image/);
  assert.match(page, /vipPlanAccessLabel/);
  assert.doesNotMatch(page, /Học miễn phí|Tiếp tục học miễn phí|is-free/);
  assert.match(seed, /name: "VIP vĩnh viễn"[\s\S]*priceVnd: 1_090_000/);
  assert.match(seed, /code: "VIP_1M"[\s\S]*?priceVnd: 11_000/);
  assert.match(subscriptionService, /calculateVipPlanEndsAt/);
  assert.match(subscriptionService, /endsAt: endsAt\?\.toISOString\(\) \?\? null/);
  assert.doesNotMatch(transferFlow, /requestVipActivationAction|name="userNote"/);
  assert.match(webhookRoute, /authenticateSepayWebhook/);
  assert.match(webhookRoute, /processSepayWebhook/);
  assert.match(webhookRoute, /success: true/);
  assert.match(orderRoute, /createOrReuseSepayPaymentOrder/);
  assert.match(styles, /\.vip-plan-request-form \.button:hover:not\(:disabled\)[\s\S]*translateY\(-3px\)/);
  assert.match(styles, /\.vip-plan-request-form \.button:active:not\(:disabled\)/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /transform 220ms cubic-bezier\(\.22, 1, \.36, 1\)/);
  assert.match(styles, /transform: translateY\(-2px\)/);
  assert.match(motionStyles, /\.vip-plan-request-form \.button[\s\S]*transition-duration: 220ms, 180ms, 180ms, 180ms !important/);
});
