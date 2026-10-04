import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, ChevronLeft, Clock3, PenLine } from "lucide-react";
import { getWritingLevel, getWritingLessons, WRITING_LEVEL_IDS } from "@/lib/writing-content";

type WritingLevelPageProps = {
  params: Promise<{ level: string }>;
};

export function generateStaticParams() {
  return WRITING_LEVEL_IDS.map((level) => ({ level }));
}

export async function generateMetadata({ params }: WritingLevelPageProps): Promise<Metadata> {
  const { level: levelParam } = await params;
  const level = getWritingLevel(levelParam);
  if (!level) return { title: "Không tìm thấy cấp độ luyện viết" };
  return {
    title: `Luyện viết theo bài · ${level.label}`,
    description: `Chọn một trong ${level.lessonCount} bài ${level.label} để luyện viết đúng từ vựng của bài.`,
  };
}

export default async function WritingLevelPage({ params }: WritingLevelPageProps) {
  const { level: levelParam } = await params;
  const level = getWritingLevel(levelParam);
  if (!level) notFound();

  const lessons = getWritingLessons(level.id);

  return <main className="learner-dashboard writing-lesson-page">
    <nav aria-label="Quay lại trang Luyện viết" className="writing-level-back">
      <Link href="/writing" prefetch={false}>
        <ChevronLeft aria-hidden="true" size={17} strokeWidth={2.3} /> Về trang Luyện viết
      </Link>
    </nav>

    <section className="writing-lesson-list-section" aria-label="Danh sách bài học">
      <div className="writing-lesson-grid">
        {lessons.map((lesson) => (
          <article className="writing-lesson-card" key={lesson.id}>
            <div className="writing-lesson-card-header">
              <span><BookOpen aria-hidden="true" size={16} /> {lesson.sourceLabel} · Bài {String(lesson.lessonNumber).padStart(2, "0")}</span>
              <small>{lesson.topicTitle}</small>
            </div>
            <div aria-label={`Các chữ đầu tiên: ${lesson.previewCharacters.join(", ")}`} className="writing-lesson-card-characters" lang="zh-CN">
              {lesson.previewCharacters.map((character, index) => <span key={`${character}-${index}`}>{character}</span>)}
            </div>
            <h3>{lesson.title}</h3>
            <p>{lesson.summary}</p>
            <div className="writing-lesson-card-footer">
              <div>
                <span><Clock3 aria-hidden="true" size={15} /> {lesson.minutes} phút</span>
                <span><PenLine aria-hidden="true" size={15} /> {lesson.characterCount} chữ</span>
              </div>
              <Link href={`/writing/${level.id}/${lesson.id}/practice`} prefetch={false}>
                Luyện viết <ArrowRight aria-hidden="true" size={17} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  </main>;
}
