import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AdminAccessBulkSave } from "@/components/admin-access-bulk-save";
import { AdminAccessSections } from "@/components/admin-access-sections";
import { AdminConsoleHeader, AdminNotice, ContentAccessPolicyForm } from "@/components/admin-console";
import { requireAdminUser } from "@/lib/admin-auth";
import { buildAdminTypingAccessView } from "@/lib/admin-typing-access-view";
import { getContentAccessPolicies } from "@/lib/content-access-repository";
import { contentAccessPolicyKey, typingLevelTarget, type ContentAccessTarget } from "@/lib/content-access-types";
import { updateContentAccessPoliciesAction, updateContentAccessPolicyAction } from "../../actions";

export const metadata: Metadata = { title: "Khóa VIP Luyện gõ" };

export default async function AdminTypingAccessPage({ searchParams }: {
  searchParams: Promise<{ error?: string; lesson?: string; level?: string; success?: string }>;
}) {
  const [user, query] = await Promise.all([requireAdminUser(), searchParams]);
  const view = await buildAdminTypingAccessView(query.level, query.lesson);
  const policies = new Map((await getContentAccessPolicies(view.targets)).map((policy) => [
    contentAccessPolicyKey(policy.targetType, policy.targetKey), policy.tier,
  ]));
  const currentTier = (target: ContentAccessTarget) => policies.get(contentAccessPolicyKey(target.type, target.key));
  const base = "/admin/access/typing";
  const levelHref = view.selectedLevel ? `${base}?level=${view.selectedLevel.id}` : base;
  const returnTo = view.selectedLesson ? `${levelHref}&lesson=${view.selectedLesson.id}` : levelHref;

  const panel = <section className="admin-panel">
      <div className="panel-heading"><h2>{view.selectedLesson?.titleVi ?? view.selectedLevel?.label ?? "Chọn cấp độ cần quản lý"}</h2><span>{view.selectedLesson ? `${view.questions.length} mục từ/câu` : view.selectedLevel ? `${view.lessonEntries.length} bài` : `${view.levels.length} cấp độ`}</span></div>
      {!view.selectedLevel ? <div className="admin-access-list">
        {view.levels.map((level) => {
          const target = typingLevelTarget(level.id);
          return <article className="admin-access-node" key={level.id}>
            <header><strong>Toàn bộ Luyện gõ {level.label}</strong><span>{level.lessonCount} bài · {level.wordCount} từ · {level.sentenceCount} câu</span></header>
            <ContentAccessPolicyForm action={updateContentAccessPolicyAction} currentTier={currentTier(target)} returnTo={returnTo} targetKey={target.key} targetType={target.type} />
            <Link className="admin-access-open" href={`${base}?level=${level.id}`}>Quản lý bài học <ArrowRight aria-hidden="true" size={15} /></Link>
          </article>;
        })}
      </div> : <>
        {view.levelTarget ? <div className="admin-access-node admin-access-parent-node">
          <header><strong>Toàn bộ Luyện gõ {view.selectedLevel.label}</strong><span>Áp dụng cho tất cả bài, từ và câu trong cấp độ này.</span></header>
          <ContentAccessPolicyForm action={updateContentAccessPolicyAction} currentTier={currentTier(view.levelTarget)} returnTo={returnTo} targetKey={view.levelTarget.key} targetType={view.levelTarget.type} />
        </div> : null}
        {!view.selectedLesson ? <div className="admin-access-list">
          {view.lessonEntries.map((lesson) => <article className="admin-access-node" key={lesson.id}>
            <header><strong>Bài {lesson.number}: {lesson.titleVi}</strong><span>{lesson.wordCount} từ · {lesson.sentenceCount} câu</span></header>
            <ContentAccessPolicyForm action={updateContentAccessPolicyAction} currentTier={currentTier(lesson.target)} returnTo={returnTo} targetKey={lesson.target.key} targetType={lesson.target.type} />
            <Link className="admin-access-open" href={`${levelHref}&lesson=${lesson.id}`}>Quản lý từng mục từ/câu <ArrowRight aria-hidden="true" size={15} /></Link>
          </article>)}
        </div> : <>
          {view.lessonTarget ? <div className="admin-access-node admin-access-parent-node">
            <header><strong>Toàn bộ bài {view.selectedLesson.number}</strong><span>{view.selectedLesson.titleVi}</span></header>
            <ContentAccessPolicyForm action={updateContentAccessPolicyAction} currentTier={currentTier(view.lessonTarget)} returnTo={returnTo} targetKey={view.lessonTarget.key} targetType={view.lessonTarget.type} />
          </div> : null}
          {(["word", "sentence"] as const).map((stage) => {
            const entries = view.questions.filter(({ item }) => item.stage === stage);
            return entries.length ? <section aria-label={stage === "word" ? "Từ vựng và cụm từ" : "Câu luyện gõ"} className="admin-access-group" key={stage}>
              <h3>{stage === "word" ? "Từ vựng và cụm từ" : "Câu"} · {entries.length} mục</h3>
              {entries.map(({ item, target }, index) => <div className="admin-access-node" key={target.key}>
                <header><strong>{stage === "word" ? "Từ" : "Câu"} {index + 1}: <span lang="zh-CN">{item.hanzi}</span></strong><span>{item.meaning}</span></header>
                <p>Đáp án pinyin: {item.pinyin}</p>
                <ContentAccessPolicyForm action={updateContentAccessPolicyAction} currentTier={currentTier(target)} returnTo={returnTo} targetKey={target.key} targetType={target.type} />
              </div>)}
            </section> : null;
          })}
        </>}
      </>}
    </section>;

  return <main className="admin-page"><div className="section-shell">
    <AdminConsoleHeader description="Quản lý riêng quyền Luyện gõ theo cấp độ HSK, bài học và từng mục từ/câu. Khóa VIP ở cấp cha áp dụng cho mọi mục bên dưới." eyebrow="Content access" title="Khóa VIP Luyện gõ" userName={user.displayName} />
    <AdminAccessSections selected="typing" />
    <AdminNotice error={query.error} success={query.success} />
    {view.selectedLevel ? <nav aria-label="Điều hướng phân quyền Luyện gõ" className="admin-access-breadcrumbs">
      <Link href={base}><ArrowLeft aria-hidden="true" size={15} /> Cấp độ HSK</Link><span>/</span>
      {view.selectedLesson ? <Link href={levelHref}>{view.selectedLevel.label}</Link> : <strong>{view.selectedLevel.label}</strong>}
      {view.selectedLesson ? <><span>/</span><strong>Bài {view.selectedLesson.number}</strong></> : null}
    </nav> : null}
    {view.selectedLesson ? <AdminAccessBulkSave action={updateContentAccessPoliciesAction} returnTo={returnTo}>{panel}</AdminAccessBulkSave> : panel}
  </div></main>;
}
