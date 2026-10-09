import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminConsoleHeader, AdminNotice } from "@/components/admin-console";
import { requireAdminUser } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Khóa nội dung VIP" };

export default async function AdminContentAccessPage({ searchParams }: {
  searchParams: Promise<{ error?: string; lesson?: string; level?: string; success?: string }>;
}) {
  const [user, query] = await Promise.all([requireAdminUser(), searchParams]);
  // Keep existing HSK lesson links and saved form redirects working.
  if (query.level || query.lesson) {
    const params = new URLSearchParams();
    for (const key of ["level", "lesson", "error", "success"] as const) {
      if (query[key]) params.set(key, query[key]);
    }
    redirect(`/admin/access/hsk?${params}`);
  }

  return <main className="admin-page"><div className="section-shell">
    <AdminConsoleHeader title="Khóa nội dung VIP" eyebrow="Content access" userName={user.displayName}
      description="Chọn phần cần quản lý. Quyền truy cập của HSK, Luyện gõ, Luyện viết và Luyện nghe được lưu riêng." />
    <AdminNotice error={query.error} success={query.success} />
    <section className="admin-panel" aria-labelledby="access-groups-title">
      <div className="panel-heading"><h2 id="access-groups-title">Chọn nhóm nội dung</h2><span>4 phần</span></div>
      <div className="admin-access-groups">
        <Link className="admin-access-group-card" href="/admin/access/writing" prefetch={false}><h3>Luyện viết</h3><p>Khóa cấp độ, bài học và từng chữ luyện viết.</p><span>Quản lý khóa Luyện viết →</span></Link>
        <Link className="admin-access-group-card" href="/admin/access/listening" prefetch={false}><h3>Luyện nghe</h3><p>Khóa loại nội dung, cấp độ, chủ đề và bài luyện nghe.</p><span>Quản lý khóa Luyện nghe →</span></Link>
        <Link className="admin-access-group-card" href="/admin/access/hsk" prefetch={false}>
          <h3>Lộ trình HSK</h3>
          <p>Khóa cấp độ, bài học, từ vựng, chữ luyện viết và câu hỏi của Lộ trình HSK.</p>
          <span>Quản lý khóa Lộ trình HSK →</span>
        </Link>
        <Link className="admin-access-group-card" href="/admin/access/typing" prefetch={false}>
          <h3>Luyện gõ</h3>
          <p>Khóa cấp độ HSK, bài luyện gõ và từng mục từ/câu dùng để luyện gõ pinyin.</p>
          <span>Quản lý khóa Luyện gõ →</span>
        </Link>
      </div>
    </section>
  </div></main>;
}
