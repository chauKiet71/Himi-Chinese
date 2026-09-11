import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AdminConsoleHeader, AdminNotice, ContentAccessPolicyForm } from "@/components/admin-console";
import { requireAdminUser } from "@/lib/admin-auth";
import { buildAdminHskAccessView } from "@/lib/admin-content-access-view";
import { getContentAccessPolicies } from "@/lib/content-access-repository";
import { contentAccessPolicyKey, hskLevelTarget, type ContentAccessTarget } from "@/lib/content-access-types";
import { updateContentAccessPolicyAction } from "../actions";

export const metadata: Metadata = { title: "Khóa nội dung VIP" };

export default async function AdminContentAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; lesson?: string; level?: string; success?: string }>;
}) {
  const [user, query] = await Promise.all([requireAdminUser(), searchParams]);
  const view = await buildAdminHskAccessView(query.level, query.lesson);
  const policyMap = new Map((await getContentAccessPolicies(view.targets)).map((policy) => [
    contentAccessPolicyKey(policy.targetType, policy.targetKey),
    policy.tier,
  ]));
  const currentTier = (target: ContentAccessTarget) => policyMap.get(contentAccessPolicyKey(target.type, target.key));
  const selectedLevelId = view.selectedLevel?.id ?? "";
  const returnTo = view.selectedLesson
    ? `/admin/access?level=${selectedLevelId}&lesson=${view.selectedLesson.id}`
    : view.selectedLevel
      ? `/admin/access?level=${view.selectedLevel.id}`
      : "/admin/access";

  return <main className="admin-page"><div className="section-shell">
    <AdminConsoleHeader
      description="Chỉ tải cấp độ hoặc bài đang quản lý để thao tác nhanh. Quyền chữ luyện viết được dùng chung tại bài HSK, chủ đề và kho Luyện viết."
      eyebrow="Content access"
      title="Khóa nội dung HSK"
      userName={user.displayName}
    />
    <AdminNotice error={query.error} success={query.success} />

    {view.selectedLevel ? <nav aria-label="Điều hướng phân quyền" className="admin-access-breadcrumbs">
      <Link href="/admin/access"><ArrowLeft aria-hidden="true" size={15} /> Cấp độ HSK</Link>
      <span>/</span>
      {view.selectedLesson
        ? <Link href={`/admin/access?level=${view.selectedLevel.id}`}>{view.selectedLevel.label}</Link>
        : <strong>{view.selectedLevel.label}</strong>}
      {view.selectedLesson ? <><span>/</span><strong>Bài {view.selectedLesson.lessonNumber}</strong></> : null}
    </nav> : null}

    <section className="admin-panel">
      {!view.selectedLevel ? <>
        <div className="panel-heading"><h2>Chọn cấp độ cần quản lý</h2><span>{view.levels.length} cấp độ</span></div>
        <div className="admin-access-list">
          {view.levels.map((level) => {
            const target = hskLevelTarget(level.id);
            const lessonCount = level.topics.reduce((total, topic) => total + topic.lessons.length, 0);
            return <article className="admin-access-node" key={level.id}>
              <header><strong>Toàn bộ {level.label}</strong><span>{level.description}</span></header>
              <ContentAccessPolicyForm action={updateContentAccessPolicyAction} currentTier={currentTier(target)} description="Cấp cha VIP sẽ khóa toàn bộ nội dung con." returnTo={returnTo} targetKey={target.key} targetType={target.type} />
              <Link className="admin-access-open" href={`/admin/access?level=${level.id}`}>Quản lý {lessonCount} bài <ArrowRight aria-hidden="true" size={15} /></Link>
            </article>;
          })}
        </div>
      </> : !view.selectedLesson ? <>
        <div className="panel-heading"><h2>{view.selectedLevel.label}</h2><span>{view.lessonEntries.length} bài</span></div>
        {view.levelTarget ? <div className="admin-access-node admin-access-parent-node">
          <header><strong>Toàn bộ {view.selectedLevel.label}</strong><span>{view.selectedLevel.description}</span></header>
          <ContentAccessPolicyForm action={updateContentAccessPolicyAction} currentTier={currentTier(view.levelTarget)} description="Áp dụng cho tất cả bài, từ vựng, chữ luyện viết và câu trong cấp độ này." returnTo={returnTo} targetKey={view.levelTarget.key} targetType={view.levelTarget.type} />
        </div> : null}
        <div className="admin-access-list">
          {view.lessonEntries.map((lesson) => <article className="admin-access-node" key={lesson.id}>
            <header><strong>Bài {lesson.lessonNumber}: {lesson.title}</strong><span>{lesson.topicTitle} · {lesson.content?.summary ?? "Chưa có nội dung chi tiết"}</span></header>
            <ContentAccessPolicyForm action={updateContentAccessPolicyAction} currentTier={currentTier(lesson.target)} defaultTier={lesson.content?.accessTier ?? "free"} returnTo={returnTo} targetKey={lesson.target.key} targetType={lesson.target.type} />
            {lesson.content ? <Link className="admin-access-open" href={`/admin/access?level=${selectedLevelId}&lesson=${lesson.id}`}>Từ vựng, luyện viết và câu <ArrowRight aria-hidden="true" size={15} /></Link> : null}
          </article>)}
        </div>
      </> : <>
        <div className="panel-heading"><h2>Bài {view.selectedLesson.lessonNumber}: {view.selectedLesson.title}</h2><span>{view.vocabulary.length + view.writing.length + view.questions.length} mục</span></div>
        <div className="admin-access-node admin-access-parent-node">
          <header><strong>Toàn bộ bài học</strong><span>{view.selectedLesson.content?.summary}</span></header>
          <ContentAccessPolicyForm action={updateContentAccessPolicyAction} currentTier={currentTier(view.selectedLesson.target)} defaultTier={view.selectedLesson.content?.accessTier ?? "free"} returnTo={returnTo} targetKey={view.selectedLesson.target.key} targetType={view.selectedLesson.target.type} />
        </div>

        {view.vocabulary.length ? <section className="admin-access-group" aria-label={`Từ vựng bài ${view.selectedLesson.lessonNumber}`}>
          <h3>Từ vựng · {view.vocabulary.length} mục</h3>
          {view.vocabulary.map(({ item, target }, index) => <div className="admin-access-node" key={target.key}>
            <header><strong>Từ {index + 1}: <span lang="zh-CN">{item.hanzi}</span></strong><span>{item.pinyin} · {item.meaning}</span></header>
            <ContentAccessPolicyForm action={updateContentAccessPolicyAction} currentTier={currentTier(target)} defaultTier={item.accessTier ?? "free"} returnTo={returnTo} targetKey={target.key} targetType={target.type} />
          </div>)}
        </section> : null}

        {view.writing.length ? <section className="admin-access-group" aria-label={`Luyện viết bài ${view.selectedLesson.lessonNumber}`}>
          <h3>Luyện viết · {view.writing.length} chữ</h3>
          {view.writing.map(({ character, target }, index) => <div className="admin-access-node" key={target.key}>
            <header><strong>Chữ {index + 1}: <span lang="zh-CN">{character.hanzi}</span></strong><span>{character.pinyin} · từ {character.word} · {character.meaning}</span></header>
            <ContentAccessPolicyForm action={updateContentAccessPolicyAction} currentTier={currentTier(target)} defaultTier={character.accessTier ?? "free"} returnTo={returnTo} targetKey={target.key} targetType={target.type} />
          </div>)}
        </section> : null}

        {view.questions.length ? <section className="admin-access-group" aria-label={`Luyện tập bài ${view.selectedLesson.lessonNumber}`}>
          <h3>Luyện tập · {view.questions.length} câu</h3>
          {view.questions.map(({ exercise, target }, index) => <div className="admin-access-node" key={target.key}>
            <header><strong>Câu {index + 1}</strong><span>{exercise.instruction}{exercise.prompt ? ` · ${exercise.prompt}` : ""}</span></header>
            <ContentAccessPolicyForm action={updateContentAccessPolicyAction} currentTier={currentTier(target)} defaultTier={exercise.accessTier ?? "free"} returnTo={returnTo} targetKey={target.key} targetType={target.type} />
          </div>)}
        </section> : null}
      </>}
    </section>
  </div></main>;
}
