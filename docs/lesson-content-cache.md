# Tải bài học theo nhu cầu và lưu trên trình duyệt

Áp dụng cho bài HSK (`play`, trang nội dung, `quiz`, `flashcard`) và bài theo chủ đề tại `/learn/[slug]`.

## Luồng tải

Khi chọn box bài trong lộ trình HSK, trạng thái của box đổi thành vòng 12 vạch và “Đang tải bài học...”. Trình duyệt lấy mô tả phiên bản qua `?metadata=1`, tải/đọc cache và chờ ghi IndexedDB hoàn tất trước khi chuyển hướng. Nếu lỗi, giữ nguyên trang lộ trình để người học thử lại. Không tải trước khi hover và không tự tải bài khác khi người dùng click lặp trong lúc chờ.

1. Trang lộ trình hiển thị thông tin tóm tắt, không gọi API nội dung bài chưa chọn.
2. Khi mở bài, máy chủ kiểm tra quyền như trước và tạo mô tả nhỏ gồm URL, phiên bản SHA-256, phạm vi tài khoản/phiên đăng nhập. Nội dung đã lọc quyền không còn được nhúng vào props của trang học.
3. Trình duyệt tìm đúng bài và phiên bản trong RAM, sau đó IndexedDB. Nếu có, mở bài mà không gọi lại API nội dung.
4. Nếu chưa có, gọi API của riêng bài đó. API kiểm tra lại tài khoản, quyền và phiên bản trước khi trả nội dung.
5. Hiển thị bài ngay; ghi IndexedDB bất đồng bộ. Khi sửa nội dung hoặc thay đổi các mục được phép học, mã phiên bản thay đổi và lần mở sau tải lại bài tương ứng.

Trang vẫn cần liên lạc với máy chủ để lấy quyền truy cập và mã phiên bản hiện tại. Đây là cache nội dung bài học, chưa phải chế độ offline toàn bộ ứng dụng. Âm thanh, hình ảnh và dữ liệu nét viết tiếp tục theo cơ chế tải hiện có.

## Giới hạn và hành vi lỗi

- IndexedDB: `himi-lesson-content-v1`, hai kho `content` và `metadata`.
- Tối đa 200 bài / 40 MiB dữ liệu JSON; loại bài ít dùng nhất khi vượt giới hạn. RAM giữ tối đa 6 bài. Bài trên 2 MiB vẫn mở được nhưng không lưu cache.
- Các yêu cầu đồng thời cho cùng bài/phiên bản dùng chung một lượt tải. Rời bài chỉ hủy người chờ, không phá yêu cầu đang được thành phần khác dùng chung.
- Lỗi mạng có nút thử lại. IndexedDB bị chặn, đầy hoặc lỗi không làm mất khả năng học qua mạng.
- Nội dung khác phiên bản không được dùng thay thế khi lỗi mạng. Phiên bản hiện tại không bị tự thay giữa buổi học.
- Cache tách theo tài khoản, vai trò và phiên đăng nhập; xóa khi đăng xuất hoặc đổi phạm vi. Các tab khác nhận thông báo để tải lại phiên. Tiến độ học vẫn theo cơ chế riêng, không nằm trong JSON nội dung được cache.
- Không có thay đổi nội dung giáo trình hoặc tự nhập các bộ dữ liệu đã xuất trong `output/`.

## Các tệp chính

- `lib/lesson-resource.ts`, `lib/lesson-resource-server.ts`: mô tả phiên bản, định danh phạm vi và phản hồi API.
- `lib/lesson-content-store.ts`: IndexedDB, giới hạn dung lượng và loại dữ liệu ít dùng.
- `lib/lesson-content-cache.ts`: đọc cache, tải mạng, gộp yêu cầu, hủy chờ và quản lý phiên.
- `components/cached-lesson-boundary.tsx`: trạng thái tải, lỗi, thử lại; giữ bố cục toàn màn hình khi chờ.
- `components/hsk-lesson-loader.tsx`, `components/industry-lesson-loader.tsx`: nối dữ liệu với giao diện hiện có.
- `app/api/lessons/hsk/[level]/[lesson]/route.ts`, `app/api/lessons/industry/[course]/[lesson]/route.ts`: API riêng cho từng bài.
- `lib/hsk-routing.ts`: các hàm đường dẫn dùng ở trình duyệt, không nhập JSON giáo trình.

## Kiểm chứng

Các test chạy bằng Node:

```powershell
node --experimental-strip-types --test tests/lesson-content-cache.test.mjs tests/lesson-resource-api.test.mjs tests/browser-api-cache.test.mjs tests/hsk-guided-lesson.test.mjs tests/hsk-curriculum.test.mjs tests/hsk-lesson.test.mjs tests/industry-guided-lesson-ui.test.mjs
```

Kiểm tra Chrome thực tế: chạy dev server cổng 3100 rồi `node scripts/verify-lesson-cache-browser.mjs`. Script dùng Playwright; có thể đặt `HIMI_PLAYWRIGHT_MODULE` trỏ tới `playwright/index.mjs` có sẵn trong môi trường và `HIMI_VERIFY_URL` nếu đổi cổng. Yêu cầu bài HSK1 đầu tiên và thứ hai được cấu hình cho khách học thử. Script tạo trình duyệt riêng, không sửa dữ liệu trình duyệt của người dùng.

Kết quả trình duyệt được ghi tại `qa-artifacts/lesson-cache-browser-report.json`, ảnh desktop/mobile ở cùng thư mục. Đã xác nhận mở lần đầu tải một bài, reload và quiz không tải lại, chuyển bài chỉ tải bài mới, phiên bản cũ tải lại, giới hạn IndexedDB hoạt động và có thể thử lại khi lỗi mạng.

Bài Văn phòng ở môi trường hiện tại yêu cầu đăng nhập: đã kiểm tra chuyển hướng đúng; API chủ đề được kiểm tra bằng dữ liệu giả lập trong test. Chưa kiểm tra buổi học chủ đề bằng tài khoản đăng nhập thực.

Kiểm tra TypeScript toàn kho hiện bị chặn bởi các lỗi ở khai báo `*.css?url`, `typing-practice-studio.tsx` và `admin-analytics-service.ts`. Build bị lỗi `EPERM` trong plugin Sites khi xóa `dist/.openai/hosting.json`, kể cả khi đã dừng dev server. Không có lỗi TypeScript được báo ở các tệp cache mới.
