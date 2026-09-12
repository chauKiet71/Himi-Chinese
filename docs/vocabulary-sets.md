# Bộ từ vựng

## Phạm vi

- `/vocabulary`: bốn bộ có sẵn (32 từ) và danh sách bộ cá nhân theo tài khoản.
- `/vocabulary/[setId]`: chi tiết, tìm từ, sao chép bộ có sẵn, sửa tên/mô tả, thêm/xóa từ và xóa bộ cá nhân.
- `/vocabulary/[setId]/study/vocabulary`: nghĩa, pinyin, ví dụ và phát âm.
- `/vocabulary/[setId]/study/hanzi`: tách chữ Hán trùng, xem nét và luyện viết với Hanzi Writer.
- `/vocabulary/[setId]/study/flashcard`: lật thẻ, tự đánh giá, tổng kết và ôn lại các từ chưa nhớ.
- Điều hướng: mục riêng trên desktop; Luyện tập → Bộ từ vựng trên điện thoại.

Khách học được bộ có sẵn. Tạo, sao chép và chỉnh sửa cần đăng nhập. Bộ cá nhân lưu PostgreSQL; kết quả lượt học hiện giữ trong phiên giao diện và đặt lại khi tải trang. Phát âm dùng giọng tiếng Trung của trình duyệt; Hanzi Writer cần kết nối để tải dữ liệu nét.

## Cơ sở dữ liệu

Migration `drizzle/0022_vocabulary_sets.sql` thêm hai bảng `vocabulary_sets` và `vocabulary_set_words`. Chạy `npm run db:migrate` với `DATABASE_URL` của môi trường đích trước khi sử dụng lưu bộ cá nhân. Không cần chạy seed cho các bộ có sẵn.

Các thao tác thay đổi yêu cầu session và kiểm tra cùng origin. Truy vấn bộ cá nhân giới hạn theo người dùng. Giao dịch khóa bộ khi thêm/xóa từ; khóa tài khoản khi tạo bộ. Giới hạn 100 bộ/tài khoản và 500 từ/bộ. Từ trùng được xác định bằng chữ Hán và pinyin sau chuẩn hóa NFC, loại bỏ khoảng trắng đầu/cuối.

## Kiểm tra

`node --experimental-strip-types --test tests/vocabulary-sets.test.mjs`

Kiểm thử chạy migration trên PGlite riêng, bao gồm lưu và đọc lại, quyền sở hữu, xóa dây chuyền, sao chép độc lập, từ trùng, dữ liệu sai và giới hạn dung lượng.

Kiểm tra thủ công với tài khoản thử nghiệm sau migration: tạo bộ rỗng → thêm hai từ → tải lại → sửa tên → xóa một từ → học cả ba chế độ → xóa bộ. Với flashcard, đánh dấu một từ chưa nhớ rồi xác nhận lượt ôn chỉ chứa từ đó. Thử trên điện thoại và xác nhận mục Bộ từ vựng xuất hiện trong menu Luyện tập.
