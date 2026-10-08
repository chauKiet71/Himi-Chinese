import type { Metadata } from "next";
import { AdminLink } from "@/components/admin-link";
import { AdminConsoleHeader, AdminNotice, CourseForm, StatusBadge } from "@/components/admin-console";
import { requireAdminUser } from "@/lib/admin-auth";
import { listAdminCourses } from "@/lib/admin-content-service";
import { getAdminHskCatalog } from "@/lib/admin-hsk-content";
import { createCourseAction } from "../actions";

export const metadata: Metadata = { title: "Quản lý nội dung" };

export default async function AdminCoursesPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const [user, params] = await Promise.all([requireAdminUser(), searchParams]);
  const courses = await listAdminCourses();
  const hskLevels = getAdminHskCatalog();
  return <main className="admin-page"><div className="section-shell">
    <AdminConsoleHeader description="Tạo lộ trình mới hoặc mở từng lộ trình để quản lý module và bài học." eyebrow="Content CRUD" title="Lộ trình học" userName={user.displayName} />
    <AdminNotice error={params.error} success={params.success} />
    <section className="admin-panel">
      <div className="panel-heading"><h2>Lộ trình HSK</h2><AdminLink href="/admin/hsk" intentPrefetch>Xem toàn bộ HSK</AdminLink></div>
      <div className="table-scroll"><table className="data-table">
        <thead><tr><th>Cấp độ</th><th>Chủ đề</th><th>Bài có nội dung</th><th>Bài dự kiến</th></tr></thead>
        <tbody>{hskLevels.map((level) => <tr key={level.id}>
          <td><AdminLink href={`/admin/hsk?level=${level.id}`} intentPrefetch>{level.label}</AdminLink></td>
          <td>{level.topics.length}</td><td>{level.availableLessons}</td><td>{level.plannedLessons}</td>
        </tr>)}</tbody>
      </table></div>
    </section>
    <div className="admin-content-grid">
      <section className="admin-panel"><div className="panel-heading"><h2>Tạo lộ trình</h2><span>Mặc định bản nháp</span></div><CourseForm action={createCourseAction} submitLabel="Tạo lộ trình" /></section>
      <section className="admin-panel"><div className="panel-heading"><h2>{courses.length} lộ trình</h2><span>PostgreSQL</span></div><div className="table-scroll"><table className="data-table"><thead><tr><th>Lộ trình</th><th>Bài</th><th>Miễn phí</th><th>Trạng thái</th></tr></thead><tbody>{courses.map((course) => <tr key={course.id}><td><AdminLink className="table-course" href={`/admin/courses/${course.id}`} intentPrefetch><span className="table-mark">{course.hanzi}</span><span>{course.titleVi}<small>{course.slug}</small></span></AdminLink></td><td>{course.lessonCount}</td><td>{course.freeLessonCount}</td><td><StatusBadge status={course.status} /></td></tr>)}</tbody></table></div></section>
    </div>
  </div></main>;
}
