import type { Metadata } from "next";
import { AdminConsoleHeader, AdminNotice, ContentAccessPolicyForm } from "@/components/admin-console";
import { requireAdminUser } from "@/lib/admin-auth";
import { getContentAccessPolicies } from "@/lib/content-access-repository";
import {
  contentAccessPolicyKey,
  hskLessonTarget,
  hskLevelTarget,
  hskQuestionTarget,
  hskVocabularyTarget,
  hskWritingTarget,
  type ContentAccessTarget,
} from "@/lib/content-access-types";
import { HSK_CURRICULUM } from "@/lib/hsk-curriculum";
import { getHskLearningLessonContent } from "@/lib/hsk-learning-content";
import { updateContentAccessPolicyAction } from "../actions";

export const metadata: Metadata = { title: "Khóa nội dung VIP" };

export default async function AdminContentAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const [user, query] = await Promise.all([requireAdminUser(), searchParams]);
  const levels = HSK_CURRICULUM.map((level) => ({
    ...level,
    target: hskLevelTarget(level.id),
    topics: level.topics.map((topic) => ({
      ...topic,
      lessons: topic.lessons.map((lesson) => {
        const content = getHskLearningLessonContent(level.id, lesson.id);
        return {
          ...lesson,
          content,
          target: hskLessonTarget(level.id, lesson.id, content?.accessTier ?? "free"),
          vocabulary: (content?.vocabulary ?? []).map((item) => ({
            item,
            target: hskVocabularyTarget(level.id, lesson.id, item.id, item.accessTier ?? "free"),
          })),
          writing: (content?.writingCharacters ?? []).map((character) => ({
            character,
            target: hskWritingTarget(level.id, lesson.id, character.id, character.accessTier ?? "free"),
          })),
          questions: (content?.exercises ?? []).map((exercise) => ({
            exercise,
            target: hskQuestionTarget(level.id, lesson.id, exercise.id, exercise.accessTier ?? "free"),
          })),
        };
      }),
    })),
  }));
  const targets: ContentAccessTarget[] = levels.flatMap((level) => [
    level.target,
    ...level.topics.flatMap((topic) => topic.lessons.flatMap((lesson) => [
      lesson.target,
      ...lesson.vocabulary.map((entry) => entry.target),
      ...lesson.writing.map((entry) => entry.target),
      ...lesson.questions.map((question) => question.target),
    ])),
  ]);
  const policyMap = new Map((await getContentAccessPolicies(targets)).map((policy) => [
    contentAccessPolicyKey(policy.targetType, policy.targetKey),
    policy.tier,
  ]));
  const currentTier = (target: ContentAccessTarget) => policyMap.get(contentAccessPolicyKey(target.type, target.key));

  return <main className="admin-page"><div className="section-shell">
    <AdminConsoleHeader
      description="Cấu hình quyền ở cấp khóa, bài, từ vựng, chữ luyện viết và câu. Cấp cha VIP luôn khóa toàn bộ cấp con, kể cả khi cấp con được đặt Miễn phí."
      eyebrow="Content access"
      title="Khóa nội dung HSK"
      userName={user.displayName}
    />
    <AdminNotice error={query.error} success={query.success} />
    <section className="admin-panel">
      <div className="panel-heading"><h2>Khóa HSK</h2><span>{levels.length} cấp độ</span></div>
      <div className="admin-access-tree">
        {levels.map((level) => <details key={level.id}>
          <summary>{level.label} · {level.topics.reduce((total, topic) => total + topic.lessons.length, 0)} bài</summary>
          <div>
            <div className="admin-access-node">
              <header><strong>Toàn bộ {level.label}</strong><span>{level.description}</span></header>
              <ContentAccessPolicyForm action={updateContentAccessPolicyAction} currentTier={currentTier(level.target)} description="Áp dụng cho tất cả bài, từ vựng, chữ luyện viết và câu trong cấp độ này." returnTo="/admin/access" targetKey={level.target.key} targetType={level.target.type} />
            </div>
            {level.topics.flatMap((topic) => topic.lessons).map((lesson) => <details key={lesson.id}>
              <summary>Bài {lesson.lessonNumber}: {lesson.title}</summary>
              <div>
                <div className="admin-access-node">
                  <header><strong>Toàn bộ bài học</strong><span>{lesson.content?.summary ?? `Bài ${lesson.lessonNumber}: ${lesson.title}`}</span></header>
                  <ContentAccessPolicyForm action={updateContentAccessPolicyAction} currentTier={currentTier(lesson.target)} defaultTier={lesson.content?.accessTier ?? "free"} returnTo="/admin/access" targetKey={lesson.target.key} targetType={lesson.target.type} />
                </div>
                {lesson.vocabulary.length ? <section className="admin-access-group" aria-label={`Từ vựng bài ${lesson.lessonNumber}`}>
                  <h3>Từ vựng · {lesson.vocabulary.length} mục</h3>
                  {lesson.vocabulary.map(({ item, target }, index) => <div className="admin-access-node" key={target.key}>
                    <header><strong>Từ {index + 1}: <span lang="zh-CN">{item.hanzi}</span></strong><span>{item.pinyin} · {item.meaning}</span></header>
                    <ContentAccessPolicyForm action={updateContentAccessPolicyAction} currentTier={currentTier(target)} defaultTier={item.accessTier ?? "free"} returnTo="/admin/access" targetKey={target.key} targetType={target.type} />
                  </div>)}
                </section> : null}
                {lesson.writing.length ? <section className="admin-access-group" aria-label={`Luyện viết bài ${lesson.lessonNumber}`}>
                  <h3>Luyện viết · {lesson.writing.length} chữ</h3>
                  {lesson.writing.map(({ character, target }, index) => <div className="admin-access-node" key={target.key}>
                    <header><strong>Chữ {index + 1}: <span lang="zh-CN">{character.hanzi}</span></strong><span>{character.pinyin} · từ {character.word} · {character.meaning}</span></header>
                    <ContentAccessPolicyForm action={updateContentAccessPolicyAction} currentTier={currentTier(target)} defaultTier={character.accessTier ?? "free"} returnTo="/admin/access" targetKey={target.key} targetType={target.type} />
                  </div>)}
                </section> : null}
                {lesson.questions.length ? <h3 className="admin-access-group-title">Luyện tập · {lesson.questions.length} câu</h3> : null}
                {lesson.questions.map(({ exercise, target }, index) => <div className="admin-access-node" key={target.key}>
                  <header><strong>Câu {index + 1}</strong><span>{exercise.instruction}{exercise.prompt ? ` · ${exercise.prompt}` : ""}</span></header>
                  <ContentAccessPolicyForm action={updateContentAccessPolicyAction} currentTier={currentTier(target)} defaultTier={exercise.accessTier ?? "free"} returnTo="/admin/access" targetKey={target.key} targetType={target.type} />
                </div>)}
              </div>
            </details>)}
          </div>
        </details>)}
      </div>
    </section>
  </div></main>;
}
