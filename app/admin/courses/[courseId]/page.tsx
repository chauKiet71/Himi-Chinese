import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminLink } from "@/components/admin-link";
import { AdminConsoleHeader, AdminNotice, ContentAccessPolicyForm, CourseForm, ModuleForm, StatusBadge } from "@/components/admin-console";
import { requireAdminUser } from "@/lib/admin-auth";
import { getAdminCourse } from "@/lib/admin-content-service";
import { getContentAccessPolicy } from "@/lib/content-access-repository";
import { deleteCourseAction, createModuleAction, updateContentAccessPolicyAction, updateCourseAction } from "../../actions";

export const metadata: Metadata = { title: "Chi tiết lộ trình" };

export default async function AdminCoursePage({ params, searchParams }: { params: Promise<{ courseId: string }>; searchParams: Promise<{ error?: string; success?: string }> }) {
  const [{ courseId }, query, user] = await Promise.all([params, searchParams, requireAdminUser()]);
  const [data, accessTier] = await Promise.all([
    getAdminCourse(courseId),
    getContentAccessPolicy("learning_path", courseId),
  ]);
  if (!data) notFound();
  return <main className="admin-page"><div className="section-shell">
    <AdminConsoleHeader backHref="/admin/courses" description={`${data.course.lessonCount} bài · ${data.course.totalMinutes} phút · ${data.course.freeLessonCount} bài miễn phí`} eyebrow="Lộ trình" title={data.course.titleVi} userName={user.displayName} />
    <AdminNotice error={query.error} success={query.success} />
    <div className="admin-detail-grid">
      <section className="admin-panel"><div className="panel-heading"><h2>Thông tin lộ trình</h2><StatusBadge status={data.course.status} /></div><CourseForm action={updateCourseAction} course={data.course} submitLabel="Lưu lộ trình" /></section>
      <aside className="admin-side-stack">
        <section className="admin-panel"><div className="panel-heading"><h2>Quyền truy cập</h2><span>Cả lộ trình</span></div><ContentAccessPolicyForm action={updateContentAccessPolicyAction} currentTier={accessTier} description="Khóa ở đây sẽ áp dụng cho mọi module, bài học và câu hỏi bên dưới." returnTo={`/admin/courses/${courseId}`} targetKey={courseId} targetType="learning_path" /></section>
        <section className="admin-panel danger-panel"><h2>Xóa cứng</h2><p>Chỉ xóa được lộ trình chưa xuất bản và chưa có module.</p><form action={deleteCourseAction} className="admin-delete-form"><input name="courseId" type="hidden" value={data.course.id} /><label><input name="confirmDelete" type="checkbox" value="DELETE" /> Tôi hiểu dữ liệu sẽ bị xóa</label><button className="button button-danger" type="submit">Xóa lộ trình</button></form></section>
      </aside>
    </div>
    <div className="admin-content-grid modules-section">
      <section className="admin-panel"><div className="panel-heading"><h2>Thêm module</h2><span>Trong {data.course.titleVi}</span></div><ModuleForm action={createModuleAction} courseId={data.course.id} submitLabel="Tạo module" /></section>
      <section className="admin-panel"><div className="panel-heading"><h2>{data.modules.length} module</h2><span>Theo thứ tự hiển thị</span></div><div className="admin-record-list">{data.modules.length ? data.modules.map((module) => <AdminLink href={`/admin/modules/${module.id}`} intentPrefetch key={module.id}><span><strong>{module.title}</strong><small>{module.slug} · {module.lessonCount} bài</small></span><b>Chỉnh sửa →</b></AdminLink>) : <p className="admin-empty">Chưa có module. Hãy tạo module đầu tiên.</p>}</div></section>
    </div>
  </div></main>;
}
