# Himi Support qua Telegram

## Phạm vi và kiến trúc

### Quyền nhân viên (cập nhật 10/09/2026)

Mọi thành viên hiện tại của **đúng nhóm hỗ trợ được cấu hình** đều có thể nhận yêu cầu, không cần khai báo ID từng nhân viên. Ai bấm `Trả lời` và claim thành công đầu tiên là người phụ trách duy nhất; người khác không được trả lời hay hoàn thành thay. Yêu cầu chưa có người nhận phải được claim trước khi hoàn thành. Khóa hàng PostgreSQL bảo vệ cả khi bấm đồng thời; không cần migration mới cho thay đổi quyền này.

Webhook kiểm tra secret rồi gọi `getChatMember` trước khi ghi DB; worker kiểm tra lại trước khi chuyển phản hồi đã xếp hàng. Chỉ chấp nhận creator/administrator/member hoặc restricted còn `is_member=true`; từ chối người đã rời/bị xóa khỏi nhóm, bot và tin nhắn gửi ẩn danh dưới danh nghĩa nhóm. Lỗi API kiểm tra quyền được retry, không cấp quyền mặc định và không ghi nhận update là đã xử lý. Nhân viên cần trả lời bằng tài khoản cá nhân.

**Đặt bot làm quản trị viên nhóm** để `getChatMember` hoạt động đáng tin cậy đối với các thành viên khác; không cần cấp thêm quyền xóa tin/chặn người cho chức năng này. Bot là quản trị viên có thể nhận tin nhắn nhóm dù privacy mode đang bật. Chỉ dùng nhóm hỗ trợ riêng tư; thêm một người vào nhóm đồng nghĩa cấp quyền nhận yêu cầu và xem thông tin khách hàng. [Telegram getChatMember](https://core.telegram.org/bots/api#getchatmember), [privacy mode](https://core.telegram.org/bots/features#privacy-mode).

`TELEGRAM_ADMIN_USER_IDS` không còn là danh sách cấp quyền hỗ trợ: giữ tùy chọn cho người cấu hình dùng lệnh `/groupid` ở nhóm mới. Không cần sửa/xóa biến này khi thêm nhân viên. Muốn thu hồi quyền hỗ trợ, loại nhân viên khỏi nhóm. Không tự chuyển yêu cầu khi người phụ trách rời nhóm; cần quy trình bàn giao riêng, tránh âm thầm đổi chủ sở hữu. Sau cập nhật, khởi động lại/redeploy web và worker; chưa tự thay quyền bot hoặc triển khai production trong phiên code này.

Widget Himi hiện có được nối với hỗ trợ **do nhân viên trả lời**, không có LLM/câu trả lời AI giả. Màu đỏ–cam và mascot giữ theo website.

Luồng: client có session → API cùng origin → transaction PostgreSQL lưu conversation + message + outbox → worker Node gửi Telegram → webhook lưu update/claim hoặc enqueue reply → worker xử lý ForceReply/ảnh → client polling.

- Next/Vinext tiếp tục chạy Cloudflare như hiện tại. **Worker support là tiến trình Node riêng, thường trực**, triển khai trên VM/container/Railway worker hoặc máy vận hành có kết nối PostgreSQL. Không chạy script này trong request Cloudflare, Vercel Function hay Next.js. Không cần Redis/WebSocket.
- Dữ liệu/lịch nhắc/backoff nằm trong PostgreSQL. Worker dùng transaction, row lock và `FOR UPDATE SKIP LOCKED`; có thể chạy nhiều replica. Khóa conversation được giữ qua lượt gửi nhắc để claim/complete không chạy xen giữa kiểm tra và gửi.
- Polling 5 giây khi widget mở và tab hiện, backoff tối đa 30 giây lúc lỗi; không chồng request. Ẩn dựa trên `completedAt + 60 giây`, có bù lệch đồng hồ từ `serverNow`. Không xóa hội thoại/tin nhắn. Danh sách lấy 50 hội thoại gần nhất, lịch sử tin phân trang 100 mục với cursor ID.
- State: `OPEN → CLAIMED → WAITING_USER → CLAIMED` (người dùng hỏi tiếp); complete từ trạng thái chưa hoàn thành; tin mới trên `COMPLETED → OPEN` xóa claim/completion, tăng generation và tạo thông báo Telegram mới. Nút trên mọi thông báo active mang conversation ID + generation, vì vậy callback từ generation cũ không tác động lần mở lại mới.
- Mọi thông báo văn bản, ảnh, reminder và biên nhận đang còn xử lý đều có `Trả lời` / `Hoàn thành`. Một admin sở hữu conversation sau claim; admin khác được báo ID người đang xử lý, không ghi đè và không complete thay. Khi bấm `Trả lời`, bot tạo một ForceReply trả lời đúng thông báo vừa bấm; prompt này dùng bàn phím ForceReply thay cho inline keyboard theo mô hình `reply_markup` của Telegram. ForceReply có hiệu lực 24 giờ, mapping chính xác theo chat ID + admin ID + prompt message ID. Reply thường không trả lời đúng prompt sẽ bị bỏ qua/từ chối, không tự đoán hội thoại.

## Migration và file chính

- `drizzle/0018_support_telegram.sql`: enums và 6 bảng support (conversations, messages, images, jobs, reply sessions, processed Telegram updates).
- `drizzle/0019_support_reminder_retry.sql`: số lỗi/lỗi gần nhất của reminder.
- `db/schema.ts`, `lib/support-domain.ts`, `support-service.ts`, `support-worker.ts`, `support-telegram.ts`, `support-storage.ts`, `support-api.ts`.
- `app/api/support/**`, `app/api/telegram/webhook/route.ts`.
- `components/himi-chatbot.tsx`, `app/chatbot-widget.css`; root layout đã gắn widget.
- `scripts/support-worker.ts`, `scripts/support-webhook.ts`, `tests/support-chat.test.mjs`.

Migration chỉ thêm bảng/cột, không xóa hoặc sửa dữ liệu học/auth hiện có. Backup DB theo quy trình hiện tại rồi chạy `npm run db:migrate` ở môi trường đích **trước khi bật widget/API mới**. Chưa tự chạy migration vào DB của người dùng trong phiên triển khai này.

## Cấu hình

Điền trong secret store của web **và** worker, không đưa vào biến `NEXT_PUBLIC_*`, Git, URL trình duyệt hay log:

| Biến | Giá trị |
| --- | --- |
| `DATABASE_URL` | PostgreSQL hiện có, cả web và worker dùng cùng DB |
| `AUTH_SECRET` | Secret auth hiện có của website |
| `CLOUDINARY_URL` | Storage hiện có; cần cho ảnh user/admin |
| `TELEGRAM_BOT_TOKEN` | Token do BotFather cấp |
| `TELEGRAM_ADMIN_CHAT_ID` | Numeric ID của một group/supergroup hỗ trợ, giữ dấu âm |
| `TELEGRAM_ADMIN_USER_IDS` | Tùy chọn: numeric IDs của người cấu hình được dùng `/groupid`; không giới hạn nhân viên hỗ trợ |
| `TELEGRAM_WEBHOOK_SECRET` | Chuỗi ngẫu nhiên 32–64 ký tự thuộc A-Z/a-z/0-9/_/- |
| `SUPPORT_WEBHOOK_BASE_URL` | Origin HTTPS công khai; local dùng tunnel HTTPS |
| `SUPPORT_WORKER_POLL_MS` | Mặc định 1000; cho phép 250–5000 |

Web sử dụng biến môi trường hiện có theo runtime Cloudflare. Các script npm `support:*` local hiện nạp `.env` mà không in giá trị; giữ cùng cấu hình với web (lưu ý `.env.local` có thể ghi đè khi chạy web). Container production inject env và chạy trực tiếp `node --experimental-strip-types scripts/support-worker.ts`, không cần tạo file env. Dùng supervisor có restart tự động; graceful shutdown SIGTERM/SIGINT chờ xử lý hiện tại kết thúc.

### Lỗi gửi sau khi nâng cấp nhóm thành supergroup

Telegram đổi chat ID khi nhóm được nâng cấp. `sendMessage` tới ID cũ trả lỗi 400 kèm `parameters.migrate_to_chat_id`; `getChat` ở ID cũ vẫn có thể thành công, nên kiểm tra token/quyền đơn thuần chưa đủ. Xem [Telegram ResponseParameters](https://core.telegram.org/bots/api#responseparameters).

Transport giữ `TelegramError.migrateToChatId` và lưu mã an toàn `telegram_400_group_migrated` vào hàng đợi/log, không lưu nguyên văn mô tả API hoặc tự gửi lại sang một đích khác khi cấu hình web chưa đồng bộ. Cần xác minh ID mới do Telegram trả về, cập nhật `TELEGRAM_ADMIN_CHAT_ID` ở cả web và worker, chuyển conversation bị ảnh hưởng sang cùng ID mới, vô hiệu hóa mapping ForceReply/message ID cũ và retry các job chưa gửi. Giữ nguyên nội dung, người phụ trách và lịch sử; không đánh dấu job hoàn thành trước khi Telegram xác nhận. Khởi động lại các tiến trình để nạp cấu hình mới. Kiểm tra `npm run support:status`: pending bằng 0, failed và reminderFailures rỗng.

## Tạo bot, lấy ID, đăng ký webhook

1. Mở [BotFather](https://t.me/BotFather), dùng `/newbot`, lưu token trong secret store.
2. Tạo group hỗ trợ riêng, thêm bot và các nhân viên. Đặt bot làm quản trị viên và cho phép gửi tin/ảnh. Mọi thành viên hiện tại đều có thể nhận yêu cầu; nhân viên không cần quyền quản trị Telegram.
3. Lấy numeric ID nhóm để đặt `TELEGRAM_ADMIN_CHAT_ID`. Nếu webhook đã chạy và người cấu hình có trong `TELEGRAM_ADMIN_USER_IDS`, dùng `/groupid@TenBot` trong nhóm. Hoặc trước khi đặt webhook, gửi lệnh nhắc tên bot rồi dùng Bot API `getUpdates` ở server để đọc `message.chat.id`. Không dùng `getUpdates` khi webhook đang bật; không dán token vào thanh địa chỉ/ảnh chụp/log. Không cần lấy ID từng nhân viên.
4. Nhân viên bấm `Trả lời` rồi Reply vào ForceReply bằng tài khoản cá nhân. Không gửi dưới danh nghĩa nhóm hoặc quản trị viên ẩn danh. Việc bot là quản trị viên cho phép bot nhận tin nhắn nhóm, nhưng hệ thống chỉ xử lý các lệnh/callback/reply hợp lệ.
5. Cấu hình các biến trên rồi chạy:

```powershell
npm run db:migrate
npm run dev
```

Terminal khác:

```powershell
npm run support:worker
```

Sau khi HTTPS domain/tunnel trỏ tới web:

```powershell
npm run support:webhook
```

Script gọi `setWebhook` với `secret_token`, `allowed_updates: ["message", "callback_query"]`, **không** drop update đang chờ. Endpoint là `POST /api/telegram/webhook`; header bí mật `X-Telegram-Bot-Api-Secret-Token` được so sánh timing-safe. Chạy script đăng ký webhook là thao tác thay đổi cấu hình bot: chỉ thực hiện trên đúng bot/môi trường.

Bot API tham chiếu: [webhook](https://core.telegram.org/bots/api#setwebhook), [ForceReply](https://core.telegram.org/bots/api#forcereply), [gửi ảnh](https://core.telegram.org/bots/api#sendphoto).

## API và dữ liệu

Client cần cookie session thật; mutation bắt buộc Origin trùng website. GET không cache và chỉ trả DTO của chủ sở hữu.

- `GET /api/support/conversations`: profile và 50 hội thoại gần nhất.
- `POST /api/support/conversations`: `{ requestId: UUID, userName, userEmail, content, imageId?: UUID }`.
- `GET /api/support/conversations/:id?before=<messageUUID>`: status, completedAt, serverNow, messages, nextBefore.
- `POST /api/support/conversations/:id/messages`: body như create; mở lại nếu đã hoàn thành.
- `POST /api/support/images`: body binary JPG/PNG/WebP, Content-Type đúng MIME, header `Idempotency-Key: UUID`.
- `GET /api/support/images/:id`: kiểm tra session/owner trước khi lấy ảnh private từ Cloudinary.

Tên 2–120 ký tự, email tối đa 255, tin tối đa 3.000 ký tự; ảnh tối đa 5 MB, kiểm cả MIME lẫn magic bytes, Cloudinary decode/giới hạn kích thước 2000px. Ảnh user và admin lưu `authenticated`, không dùng URL Telegram làm nơi lưu chính, không trả signed Cloudinary URL cho client. Worker tải ảnh về server rồi multipart-upload cho Telegram. Tin đầy đủ nằm ở message văn bản có nút; ảnh gửi kèm dưới dạng reply và cũng có nút để admin thao tác ngay trên ảnh mà không cắt nội dung ở giới hạn caption.

Rate limit bền vững theo tài khoản: 10 mutation/phút, 5 upload/phút, 90 lượt đọc/phút. API trả 401/403/404/400/413/429 rõ ràng; lỗi hạ tầng trả thông báo chung 503. Idempotency key retry phải giữ nguyên nội dung/ảnh; thay nội dung dùng key mới. UI khóa submit và giữ key khi request lỗi.

## Reminder, retry và vận hành

- Hạn nhắc đầu = thời điểm tạo/mở lại + 30 giây; các lần tiếp = +30 giây khi vẫn OPEN/chưa claim. Độ trễ thực tế phụ thuộc poll worker, backlog, mạng và Telegram rate limit; không phải cam kết chính xác tuyệt đối từng mili giây.
- Nếu thông báo đầu chưa gửi được, outbox tiếp tục retry và nhắc chờ thông báo gốc tồn tại.
- Chỉ tạo **một message nhắc** mỗi generation, sau đó edit số lần nhắc và liên kết thông báo gốc. **Telegram không phát push mới cho mỗi lần edit**; đây là lựa chọn chống spam group. Nếu nghiệp vụ cần âm thanh/push mỗi 30 giây, cần đổi chính sách gửi tin mới và kiểm soát giới hạn Telegram.
- Claim/complete xóa deadline ngay trong transaction. Worker đọc lại DB mỗi lượt, không có scheduler trong API. Backoff outbox 2 giây → tối đa 5 phút; reminder lỗi backoff tối đa 5 phút; tôn trọng `retry_after` của Telegram. Không mất message user khi Telegram hỏng.
- Kiểm tra `npm run support:status`: job pending/lỗi và độ cũ của backlog, không in nội dung/email/token. Xem thêm `reminder_failures`/`last_reminder_error` nếu nhắc không chạy. Cảnh báo vận hành khi worker dừng, pending kéo dài, lỗi 401/403/429 hoặc DB không truy cập được. Không tự bỏ job sau N lần.
- Reply session hết hạn được dọn định kỳ; job đã xong giữ metadata 30 ngày rồi dọn; payload nhạy cảm bị xóa khi job thành công. Update ID giữ để chống replay. Hội thoại/message không bị dọn. Upload chưa gắn vào tin có thể thành orphan nếu người dùng bỏ form: lên lịch chính sách retention riêng trước khi vận hành quy mô lớn.

### Giới hạn exactly-once

DB mutation/webhook được dedup, row locks ngăn hai worker gửi cùng lượt bình thường. Tuy nhiên Telegram `sendMessage/sendPhoto` không hỗ trợ idempotency key: nếu Telegram đã nhận nhưng kết nối mất/worker chết **trước khi DB commit**, retry có thể tạo thêm một notification/photo/prompt/reminder đầu. Không thể đảm bảo exactly-once giữa DB và Telegram bằng transaction DB. Edit reminder/complete là idempotent; mọi prompt không có mapping đã commit đều không thể chuyển nhầm phản hồi. Khi gặp notification trùng, dùng thông báo có nút còn hợp lệ; đối chiếu conversation ID. Đây là giới hạn cần chấp nhận trước production, không tuyên bố gửi Telegram exactly-once.

## Kiểm thử và nghiệm thu thật

```powershell
npm run test:support
npx tsc --noEmit
npm run lint -- --ignore-pattern .vinext --ignore-pattern tmp
npm test
npm run build
```

Test support dùng PGlite (PostgreSQL nhúng) chạy migration thật, service và transaction thật, chỉ thay transport Telegram/Cloudinary. Bao phủ tạo/idempotency, payload text/ảnh, 30 giây/repeat/stop, hai claim đồng thời, hai worker, mapping đúng, update trùng, allowlist, complete, hide60s/refresh, mở lại, ownership, lỗi Telegram/restart/backoff và phân trang. PGlite serialize transaction trên một kết nối: **cần kiểm tra nhiều kết nối PostgreSQL/replica thật** trước production, không coi test này là load test distributed.

Checklist bắt buộc với bot + DB + Cloudinary thật (chưa được tự xác nhận trong phiên code):

1. Đăng nhập learner A, gửi text và một JPG. Refresh vẫn có tin; Telegram nhận đúng tên/email/mã, nội dung và ảnh; cả thông báo text lẫn ảnh đều có hai nút.
2. Chờ ít nhất 65 giây không claim: một reminder xuất hiện rồi được edit lần 2. Đối chiếu deadline/count DB; không xuất hiện reminder mới vô hạn.
3. Hai thành viên nhóm (không cần có trong `TELEGRAM_ADMIN_USER_IDS`) bấm Trả lời gần đồng thời, chỉ một người claim. Người còn lại không trả lời hoặc hoàn thành thay được. Chờ 35 giây: count không tăng. Người ngoài nhóm/đã rời nhóm không làm đổi DB; lỗi `getChatMember` không tự cấp quyền.
4. Tạo thêm hội thoại B, bấm Trả lời B rồi Reply vào prompt A bằng text và ảnh có caption: chỉ A nhận, status WAITING_USER.
5. Gửi lại cùng webhook update (giữ secret trong công cụ server): không thêm message. Mở A bằng session learner khác: 404.
6. Admin sở hữu bấm Hoàn thành hai lần: chỉ một completedAt và system message; nút gốc bị bỏ. Refresh client sau 30 giây: còn khoảng 30 giây; đủ 60 giây ẩn. Query DB vẫn còn lịch sử.
7. Gửi tin mới từ ô chat sau khi ẩn: A mở lại, deadline mới, completedAt null, thông báo gốc cũ không complete được A.
8. Tạm dừng worker, gửi tin, refresh: tin vẫn có. Chạy lại worker: gửi tiếp. Thử lỗi mạng Telegram rồi khôi phục; kiểm tra backlog được giải phóng. Chạy hai worker để kiểm tra khóa trên PostgreSQL thật.

Không dùng thông tin cá nhân/ảnh nhạy cảm thật cho fixture; xóa fixture chỉ sau khi đã xác định đúng IDs và được phép. Không tự gọi webhook bot thật hoặc migrate DB thật chỉ để làm xanh test.
