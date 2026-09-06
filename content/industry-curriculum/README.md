# Giáo trình tiếng Trung theo ngành

Bộ JSON dùng trực tiếp cho web Himi Chinese. Gồm **180 bài**, chia thành **6 lộ trình thuộc 5 nhóm chủ đề**. Mỗi lộ trình có 5 phần, mỗi phần 6 bài.

| Nhóm | File nguồn | Tổng bài | Bài biên soạn mới |
| --- | --- | ---: | ---: |
| Văn phòng | [van-phong-hanh-chinh.json](van-phong-hanh-chinh.json) | 30 | 6 |
| Nhà máy | [nha-may-san-xuat.json](nha-may-san-xuat.json) | 30 | 6 |
| Logistics | [kho-van-logistics.json](kho-van-logistics.json) | 30 | 6 |
| Kinh doanh | [ban-hang-cham-soc-khach-hang.json](ban-hang-cham-soc-khach-hang.json) | 30 | 6 |
| Dịch vụ | [nha-hang-dich-vu.json](nha-hang-dich-vu.json) | 30 | 6 |
| Kinh doanh | [thuong-mai-dien-tu.json](thuong-mai-dien-tu.json) | 30 | 6 |

144 bài đầu được chuyển nguyên nội dung từ nguồn TypeScript có sẵn. 36 bài ở phần **Thực hành** được biên soạn mới, có 216 mục từ vựng theo ngữ cảnh, 144 câu trao đổi và 108 câu kiểm tra. Một từ có thể xuất hiện lại ở nhiều tình huống để ôn tập; số mục từ không phải số từ Hán duy nhất.

## Thiết kế bài mới

Đối tượng: người Việt đã biết pinyin và các câu giao tiếp cơ bản, cần dùng tiếng Trung trong công việc. Mỗi bài khoảng 15 phút:

1. Học 6 từ: chữ Hán, pinyin có dấu, nghĩa Việt và ví dụ song ngữ.
2. Học 4 câu trao đổi gắn với một tình huống cụ thể.
3. Nghe mẫu và đọc lại trong mục **Nghe & nói**.
4. Làm 3 câu kiểm tra: hiểu tình huống, hiểu từ và hiểu câu phản hồi. Mỗi câu có một đáp án đúng và giải thích; đạt 3/3 để mở nút hoàn thành, có thể làm lại.

Các phần thực hành mới:

- **Văn phòng:** lịch họp trùng; tệp đính kèm; thứ tự ưu tiên; làm việc từ xa; bàn giao nghỉ phép; chốt đầu việc sau họp.
- **Nhà máy:** hỏi lại chỉ dẫn; đối chiếu nhãn và phiếu; báo thiếu vật liệu; mô tả vết xước; việc ca sau cần theo dõi; thay đổi kế hoạch ca.
- **Logistics:** giờ nhận hàng; đối chiếu địa chỉ; thùng bị móp; chênh lệch tồn kho; giao hàng chậm; bằng chứng giao hàng.
- **Bán hàng:** làm rõ nhu cầu; phạm vi báo giá; yêu cầu giảm giá; xác nhận mẫu; phản hồi chưa hài lòng; theo dõi báo giá.
- **Dịch vụ:** thời gian chờ bàn; yêu cầu ít cay; món đã hết; món chưa lên; kiểm tra hóa đơn; đồ để quên.
- **Thương mại điện tử:** phân loại sản phẩm; đổi địa chỉ; tách kiện; thiếu phụ kiện; trạng thái hoàn tiền; phản hồi đánh giá.

## Cấu trúc và chỉnh sửa

Schema cho trình soạn thảo: [course.schema.json](course.schema.json). Danh mục và số lượng: [manifest.json](manifest.json).

- `courseSlug` khớp đường dẫn `/courses/{courseSlug}` và `/learn/{courseSlug}`.
- `modules` quyết định thứ tự các phần; `lessons` quyết định thứ tự bài trong phần.
- `moduleSlug` của mỗi bài phải tham chiếu một phần có thật.
- `slug` bài và từ là định danh bền vững. Giữ nguyên khi sửa nội dung để giữ liên kết tiến độ và từ đã lưu.
- `summary` mô tả mục tiêu cụ thể mà người học cần thực hiện.
- `vocabulary` chứa `hanzi`, `pinyin`, `meaning`, `example`, `translation`, `audioUrl`.
- `content.phrases` là câu dùng cho **Cụm từ** và **Nghe & nói**. `content.dialogue` giữ ngữ cảnh trao đổi và tương thích dữ liệu cũ; không tạo thêm tab Hội thoại.
- `content.notes` vẫn được giữ cho bài cũ và có thể đóng góp mẫu câu cho thẻ Cụm từ; không tạo thêm tab Ghi chú. Bài mới dùng câu đầy đủ có pinyin nên để mảng này rỗng.
- `content.challenge.questions[].correctOption` là chỉ số bắt đầu từ 0. `passScore` là số câu đúng tối thiểu, không phải phần trăm.
- `learningDesign` mô tả người học, trình tự và nguồn gốc số lượng bài. Cập nhật cùng `manifest.json` khi thêm bớt bài.

Gói này không chứa file thu âm mới. `audioUrl: null` dùng cơ chế phát âm tiếng Trung sẵn có của web; chấm phát âm tiếp tục dùng tích hợp hiện tại. Nội dung Nhà máy luyện cách trao đổi, không thay cho quy trình thao tác tại nơi làm việc.

## Tích hợp vào web

`lib/industry-curriculum.ts` nhập và kiểm tra 6 file JSON. Các module `*-course-seed.ts` xuất dữ liệu từ nguồn này để danh mục khóa học, lộ trình, bài học, từ luyện tập và lệnh seed cùng dùng một nguồn.

Không có `DATABASE_URL`: web đọc JSON trực tiếp. Có cơ sở dữ liệu: sau khi sửa JSON, chạy lệnh nhập để web đọc bản đã cập nhật trong PostgreSQL:

```sh
npm run content:industry:validate
npm run content:industry:import -- --dry-run
npm run content:industry:import -- --apply
```

Lệnh nhập chỉ xử lý 6 lộ trình trong bộ này. Các khóa học phải có trong danh mục trước. Lệnh tự đọc `.env.local` hoặc `.env`, cập nhật trong một transaction và tạo bản sao dữ liệu trước khi sửa tại `outputs/industry-curriculum-backups/`. Nếu lỗi, transaction được hoàn tác. Bản sao chứa dữ liệu khóa học, phần, bài, từ và liên kết từ, để đối chiếu hoặc phục hồi bởi người quản trị.

ID bài, trạng thái xuất bản và quyền học thử của bài hiện có được giữ lại. Audio hiện có được giữ khi JSON không cung cấp URL mới. Các bài mới được xuất bản và thuộc quyền VIP, giữ 6 bài học thử đầu mỗi lộ trình. Không ghi vào tài khoản, tiến độ học, thanh toán hay gói VIP. Nội dung đã sửa trong Admin có thể bị cập nhật theo JSON khi nhập lại, nên kiểm tra kết quả `--dry-run` trước mỗi lần nhập. Lệnh ghi nhật ký nhập và đường dẫn bản sao trong audit log; không giả danh người biên tập trong lịch sử phiên bản.

Cache nội dung công khai của web hết hạn sau tối đa 300 giây. Triển khai mã nguồn lên một môi trường khác vẫn cần nhập JSON vào đúng cơ sở dữ liệu của môi trường đó.
