import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  BellRing,
  Check,
  CheckCheck,
  CircleAlert,
  CreditCard,
  Crown,
  ShieldCheck,
} from "lucide-react";
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
  openNotificationAction,
} from "@/app/notifications/actions";
import { getCurrentUser } from "@/lib/auth-session";
import { getUnreadNotificationCount, getUserNotifications } from "@/lib/notification-service";

export const metadata: Metadata = { title: "Thông báo" };

const successMessages = {
  read: "Đã đánh dấu thông báo là đã đọc.",
  all_read: "Đã đọc toàn bộ thông báo.",
} as const;

const errorMessages = {
  invalid_input: "Thông báo chưa hợp lệ. Hãy tải lại trang.",
  not_found: "Không tìm thấy thông báo này trong tài khoản của bạn.",
} as const;

function formatCreatedAt(value: Date): string {
  return value.toLocaleString("vi-VN", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
  });
}

function NotificationIcon({ type }: { type: string }) {
  if (type === "payment_succeeded") return <CreditCard size={20} />;
  if (type === "vip_request_approved") return <Crown size={20} />;
  if (type === "vip_request_rejected") return <CircleAlert size={20} />;
  return <ShieldCheck size={20} />;
}

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: keyof typeof errorMessages;
    success?: keyof typeof successMessages;
  }>;
}) {
  const [params, user] = await Promise.all([searchParams, getCurrentUser()]);
  if (!user) redirect("/login?returnTo=%2Fnotifications");
  const [items, unreadCount] = await Promise.all([
    getUserNotifications(user.id),
    getUnreadNotificationCount(user.id),
  ]);

  return <main className="notifications-page">
    <div className="section-shell notifications-page-inner">
      <header className="notification-hero">
        <div className="notification-hero-copy">
          <h1>Thông báo</h1>
          <div className="notification-hero-meta">
            <span><BellRing aria-hidden="true" size={19} /><strong>{unreadCount}</strong> chưa đọc</span>
          </div>
        </div>
        <p className="notification-hero-note">Himi sẽ báo bạn<br />ngay khi có tin mới</p>
      </header>

      {params.success && successMessages[params.success] ? <p className="notification-message success" role="status"><Check size={16} />{successMessages[params.success]}</p> : null}
      {params.error && errorMessages[params.error] ? <p className="notification-message error" role="alert"><CircleAlert size={16} />{errorMessages[params.error]}</p> : null}

      <section className="notification-feed" aria-label="Danh sách thông báo">
        <div className="notification-feed-heading">
          <div>
            <h2>Hộp thư của bạn</h2>
            <p>{items.length ? "Cập nhật mới nhất được xếp ở trên" : "Thông báo mới sẽ xuất hiện tại đây"}</p>
          </div>
          {unreadCount > 0 ? <form action={markAllNotificationsReadAction}><button type="submit"><CheckCheck size={15} /> Đánh dấu tất cả đã đọc</button></form> : <span className="notification-all-read"><Check size={14} /> Bạn đã xem hết</span>}
        </div>

        {items.length ? <div className="notification-list">{items.map((item) => <article className={`notification-item ${item.readAt ? "is-read" : "is-unread"}`} key={item.id}>
          <span className={`notification-item-icon ${item.type}`}><NotificationIcon type={item.type} /></span>
          <form action={openNotificationAction} className="notification-open-form">
            <input name="notificationId" type="hidden" value={item.id} />
            <button className="notification-open" type="submit">
              <span className="notification-item-title">{item.title}{item.readAt ? null : <i aria-label="Chưa đọc" />}</span>
              <span className="notification-item-message">{item.message}</span>
              <small>{formatCreatedAt(item.createdAt)}</small>
            </button>
          </form>
          <div className="notification-item-actions">
            <form action={openNotificationAction}>
              <input name="notificationId" type="hidden" value={item.id} />
              <button aria-label={`Mở ${item.title}`} title="Mở nội dung" type="submit"><ArrowUpRight size={17} /></button>
            </form>
            {!item.readAt ? <form action={markNotificationReadAction}>
              <input name="notificationId" type="hidden" value={item.id} />
              <button aria-label={`Đánh dấu ${item.title} đã đọc`} title="Đánh dấu đã đọc" type="submit"><Check size={17} /></button>
            </form> : null}
          </div>
        </article>)}</div> : <div className="notification-empty">
          <div className="notification-empty-copy">
            <span className="notification-empty-icon"><CheckCheck size={28} /></span>
            <div>
              <h2>Hộp thư đang yên</h2>
              <p>Bạn đã xem hết mọi cập nhật. Himi sẽ giữ những thông tin quan trọng ở đây để bạn không bỏ lỡ thay đổi nào.</p>
            </div>
            <Link className="notification-empty-action" href="/courses">Khám phá lộ trình <ArrowUpRight size={17} /></Link>
          </div>

          <aside className="notification-empty-guide" aria-label="Những cập nhật sẽ xuất hiện trong hộp thư">
            <h3>Bạn sẽ nhận cập nhật về</h3>
            <ul>
              <li>
                <span><CreditCard aria-hidden="true" size={19} /></span>
                <div><strong>Thanh toán</strong><small>Xác nhận giao dịch và trạng thái xử lý</small></div>
              </li>
              <li>
                <span><Crown aria-hidden="true" size={19} /></span>
                <div><strong>Quyền VIP</strong><small>Kết quả yêu cầu và thời hạn sử dụng</small></div>
              </li>
              <li>
                <span><ShieldCheck aria-hidden="true" size={19} /></span>
                <div><strong>Tài khoản &amp; hệ thống</strong><small>Những thay đổi cần bạn chú ý</small></div>
              </li>
            </ul>
          </aside>
        </div>}
      </section>
    </div>
  </main>;
}
