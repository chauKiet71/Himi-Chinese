import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminConsoleHeader } from "@/components/admin-console";
import { AdminHskLessonContent } from "@/components/admin-hsk-lesson-content";
import { requireAdminUser } from "@/lib/admin-auth";
import { ADMIN_HSK_SECTIONS, getAdminHskContentView, type AdminHskSection } from "@/lib/admin-hsk-content";
import { getHskLessonHref } from "@/lib/hsk-routing";

export const metadata: Metadata = { title: "Dữ liệu lộ trình HSK" };

const sectionLabels: Record<AdminHskSection, string> = {
  vocabulary: "Từ vựng và ví dụ", practice: "Luyện tập theo từ", exercises: "Bài tập nguồn",
  writing: "Luyện viết", grammar: "Ngữ pháp", dialogues: "Bài khóa và hội thoại", pronunciation: "Phát âm",
};

export default async function AdminHskPage({ searchParams }: {
  searchParams: Promise<{ level?: string; lesson?: string; section?: string }>;
}) {
  const user = await requireAdminUser();
  const query = await searchParams;
  const view = await getAdminHskContentView(query.level, query.lesson);
  if (!view) notFound();
  const section = ADMIN_HSK_SECTIONS.find((value) => value === query.section) ?? "vocabulary";
  const { levels, level, topic, reference, lesson, practice } = view;
  const sectionCounts = lesson ? {
    vocabulary: lesson.vocabulary.length, practice: practice.length, exercises: lesson.exercises.length,
    writing: lesson.writingCharacters.length, grammar: lesson.grammar.length,
    dialogues: lesson.dialogues.length, pronunciation: lesson.pronunciationTopics.length,
  } : undefined;
  return <main className="admin-page"><div className="section-shell">
    <AdminConsoleHeader title="Dữ liệu lộ trình HSK" eyebrow="HSK" userName={user.displayName}
      description="Xem đầy đủ nội dung HSK đang dùng trên web. Chọn cấp độ, chủ đề và bài học để xem từng phần." />
    <nav className="admin-access-breadcrumbs" aria-label="Điều hướng nội dung HSK">
      <Link href="/admin/courses">Lộ trình & bài học</Link><span>/</span>
      <Link href="/admin/hsk">HSK</Link>
      {level ? <><span>/</span><Link href={`/admin/hsk?level=${level.id}`}>{level.label}</Link></> : null}
      {reference ? <><span>/</span><strong>Bài {reference.lessonNumber}: {reference.title}</strong></> : null}
    </nav>
    <section className="admin-panel">
      {!level ? <>
        <div className="panel-heading"><h2>Các cấp độ HSK</h2><span>{levels.reduce((sum, item) => sum + item.availableLessons, 0)} bài có nội dung</span></div>
        <div className="admin-access-list">{levels.map((item) => <article key={item.id} className="admin-access-node">
          <header><strong>{item.label}</strong><span>{item.topics.length} chủ đề · {item.availableLessons} bài có nội dung{item.plannedLessons ? ` · ${item.plannedLessons} bài dự kiến` : ""}</span></header>
          <p>{item.description}</p><Link href={`/admin/hsk?level=${item.id}`} prefetch={false}>Xem chủ đề và bài học</Link>
        </article>)}</div>
      </> : !reference ? <>
        <div className="panel-heading"><h2>{level.label}</h2><span>{level.topics.length} chủ đề · {level.availableLessons} bài có nội dung</span></div>
        {level.topics.map((group) => <section className="admin-access-group" key={group.id}>
          <h3>{group.title} · {group.lessons.length} bài</h3><div className="admin-access-list">
            {group.lessons.map((item) => <article className="admin-access-node" key={item.id}>
              <header><strong>Bài {item.lessonNumber}: {item.title}</strong><span>{item.available ? "Có nội dung" : "Đang xây dựng"}</span></header>
              <Link href={`/admin/hsk?level=${level.id}&lesson=${item.id}`} prefetch={false}>Xem chi tiết</Link>
            </article>)}
          </div>
        </section>)}
      </> : <>
        <div className="panel-heading"><h2>Bài {reference.lessonNumber}: {reference.title}</h2><span>{topic?.title}</span></div>
        {lesson && sectionCounts ? <>
          <p>{lesson.summary}</p>
          <p>{lesson.minutes} phút · {lesson.levelLabel} · {lesson.greeting}</p>
          <p><Link href={`${getHskLessonHref(level.id, reference.id)}/play`} prefetch={false}>Mở trang học</Link>{" · "}
            <Link href={`/admin/access/hsk?level=${level.id}&lesson=${reference.id}`} prefetch={false}>Quản lý quyền truy cập</Link></p>
          <nav className="admin-access-breadcrumbs" aria-label="Các phần trong bài học">
            {ADMIN_HSK_SECTIONS.map((key) => <Link key={key} prefetch={false} aria-current={section === key ? "page" : undefined}
              href={`/admin/hsk?level=${level.id}&lesson=${reference.id}&section=${key}`}>
              {sectionLabels[key]} ({sectionCounts[key]})
            </Link>)}
          </nav>
          <AdminHskLessonContent lesson={lesson} practice={practice} section={section} />
        </> : <p>{reference.available ? "Chưa tìm thấy dữ liệu chi tiết của bài học." : "Bài dự kiến, chưa có nội dung học."}</p>}
      </>}
    </section>
  </div></main>;
}
