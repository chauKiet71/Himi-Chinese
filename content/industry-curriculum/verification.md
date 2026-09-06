# Kết quả kiểm tra tích hợp — 06/09/2026

- 6 file khóa học đạt JSON Schema và bộ kiểm tra cấu trúc TypeScript.
- 37 kiểm thử dữ liệu, quyền truy cập, lộ trình và giao diện bài học đạt.
- 1 kiểm thử bổ sung duyệt cả 36 bài mới: thẻ từ, câu có pinyin, luyện phát âm và 3 câu hỏi với 9 lựa chọn đều render được; nút chấm và hoàn thành khóa đúng trạng thái ban đầu. Tổng cộng 38 kiểm thử liên quan đạt.
- ESLint các file triển khai mới/thay đổi và `git diff --check` đạt.
- `npm run build` hoàn tất thành công.
- Nhập PostgreSQL thành công trong một transaction: thêm 6 phần, 36 bài, 216 mục từ; 144 bài cũ không đổi nội dung.
- Đối chiếu sau nhập: 180 bài không có thay đổi, 0 bài hoặc từ cần tạo/cập nhật khi chạy lại.
- Trên trình duyệt: danh mục hiển thị 30 bài cho cả 6 lộ trình; lộ trình Văn phòng có 5 phần; bài mới hiển thị tiêu đề và quyền VIP đúng. Trang chủ và điều hướng sang danh mục hoạt động.
- Kiểm tra HTTP một bài mới của từng lộ trình: cả 6 trả về 200 và đúng tiêu đề. Phiên không có VIP không nhận nội dung bài trả phí.

## Giới hạn kiểm tra

Phiên trình duyệt hiện tại chưa có VIP, nên phần nội dung đầy đủ của bài mới được kiểm tra bằng component tests với dữ liệu đã cấp quyền, không cấp thêm VIP hoặc đánh dấu hoàn thành vào tài khoản thật. Chưa kiểm tra ghi âm/chấm phát âm trực tiếp; các bài dùng tích hợp audio có sẵn, không có file thu âm mới.

TypeScript toàn dự án còn 4 lỗi TS7053 ở `lib/admin-analytics-service.ts` (dòng 63, 64, 65, 92), ngoài các file thay đổi của bộ giáo trình. Trình duyệt cũng ghi nhận cảnh báo hydration ở animation/mascot trang chủ (`home-portal-hero`), không nằm trong giao diện nội dung JSON. Không tuyên bố toàn bộ dự án không có lỗi.

Máy chủ dev đã được khởi động lại để nạp danh mục mới. `vite.config.ts` dùng `node_modules/.vite-app` để tách cache app khỏi cache mặc định `.vite` của các kiểm thử middleware, tránh lỗi khóa file trên Windows. Không thực hiện một lần triển khai hosting từ xa trong công việc này; nội dung đã được nhập vào cơ sở dữ liệu đang cấu hình và hiển thị ở localhost:3000.
