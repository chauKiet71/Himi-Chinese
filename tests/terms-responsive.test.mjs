import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("terms page uses the selected Himi split layout and accessible accordions", async () => {
  const [page, css, layout, footer] = await Promise.all([
    read("app/terms/page.tsx"),
    read("app/legal.css"),
    read("app/layout.tsx"),
    read("components/site-footer.tsx"),
  ]);

  assert.match(page, /className="terms-page-v3"/);
  assert.match(page, /himi-cheer\.webp/);
  assert.match(page, /<details className="terms-item"/);
  assert.match(page, /open=\{index === 0\}/);
  assert.match(page, /terms\.map/);
  assert.match(page, /aria-label="Nội dung điều khoản sử dụng"/);
  assert.match(page, /Minh bạch/);
  assert.match(page, /Tôn trọng/);
  assert.match(page, /An toàn/);
  assert.match(page, /mailto:giahuy041204@gmail\.com/);
  assert.doesNotMatch(page, /Chúng tôi trình bày mọi điều khoản/);
  assert.doesNotMatch(page, /cập nhật 07\/08\/2026/);
  assert.doesNotMatch(page, /Mọi thông tin bạn cần, trong một trang/);
  assert.doesNotMatch(page, /Chọn từng mục để xem nội dung chi tiết/);
  assert.doesNotMatch(page, /Trạng thái beta|giai đoạn beta|Thanh toán chưa được mở/i);
  assert.match(page, /sản phẩm phát hành chính thức/);
  assert.match(page, /Gói VIP và thanh toán/);
  assert.match(page, /VietQR/);
  assert.match(page, /SePay/);
  assert.match(page, /Hủy giao dịch và hoàn tiền/);
  assert.match(page, /mã đơn cùng biên lai/);
  assert.match(css, /grid-template-columns:\s*minmax\(360px, 36%\) minmax\(0, 1fr\)/);
  assert.match(css, /@media \(max-width: 920px\)/);
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(layout, /import "\.\/legal\.css"/);
  assert.doesNotMatch(footer, /giai đoạn beta|chưa mở thanh toán/i);
  assert.match(footer, /Sản phẩm phát hành chính thức/);
  assert.match(footer, /Thanh toán VIP qua VietQR và SePay/);
});
