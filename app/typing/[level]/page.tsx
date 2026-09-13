import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Keyboard, MessageSquareText } from "lucide-react";
import { getTypingLevel, TYPING_LEVEL_IDS } from "@/lib/typing-practice";

type TypingLevelPageProps = { params: Promise<{ level: string }> };

export function generateStaticParams() {
  return TYPING_LEVEL_IDS.map((level) => ({ level }));
}

export async function generateMetadata({ params }: TypingLevelPageProps): Promise<Metadata> {
  const { level: levelId } = await params;
  const level = getTypingLevel(levelId);
  return level ? {
    title: `Luyện gõ ${level.label}`,
    description: `Chọn một trong ${level.lessonCount} bài ${level.label} để luyện gõ pinyin.`,
  } : { title: "Không tìm thấy cấp độ luyện gõ" };
}

export default async function TypingLevelPage({ params }: TypingLevelPageProps) {
  const { level: levelId } = await params;
  const level = getTypingLevel(levelId);
  if (!level) notFound();

  return <main className="learner-dashboard typing-lesson-page">
    <nav aria-label="Điều hướng luyện gõ" className="typing-breadcrumbs">
      <Link href="/typing"><ArrowLeft aria-hidden="true" size={16} /> Các cấp độ</Link>
      <span aria-hidden="true">/</span><strong>{level.label}</strong>
    </nav>

    <header className="typing-lesson-hero">
      <div>
        <span>{level.label} · {level.lessonCount} bài học</span>
        <h1>Chọn bài để bắt đầu luyện gõ</h1>
        <p>Từng bài bám đúng kho từ và câu nguồn, kèm phát âm thường và chậm.</p>
      </div>
      <div aria-label={`Một số từ trong cấp độ: ${level.previewHanzi.join(", ")}`} className="typing-lesson-character-strip" lang="zh-CN">
        {level.previewHanzi.map((character, index) => <span key={`${character}-${index}`}>{character}</span>)}
      </div>
    </header>

    <section aria-label="Danh sách bài luyện gõ" className="typing-lesson-list-section">
      <div className="typing-lesson-grid">
        {level.lessons.map((lesson) => (
          <article className="typing-lesson-card" key={lesson.id}>
            <div className="typing-lesson-card-topline">
              <strong>Bài {String(lesson.number).padStart(2, "0")}</strong>
              <span><Keyboard aria-hidden="true" size={15} /> {lesson.wordCount} từ</span>
            </div>
            <div aria-label={`Từ đầu bài: ${lesson.previewHanzi.join(", ")}`} className="typing-lesson-preview" lang="zh-CN">
              {lesson.previewHanzi.slice(0, 4).map((character, index) => <span key={`${character}-${index}`}>{character}</span>)}
            </div>
            <h2>{lesson.titleVi}</h2>
            <p className="typing-lesson-card-description">
              {lesson.titleZh !== lesson.titleVi ? <strong lang="zh-CN">{lesson.titleZh}</strong> : null}
              <span>Luyện {lesson.wordCount} từ/cụm từ và {lesson.sentenceCount} câu với audio thường, audio chậm.</span>
            </p>
            <div className="typing-lesson-card-footer">
              <span><MessageSquareText aria-hidden="true" size={15} /> {lesson.wordCount + lesson.sentenceCount} mục</span>
              <Link href={`/typing/${level.id}/${lesson.id}`} prefetch={false}>Chọn phần luyện <ArrowRight aria-hidden="true" size={17} /></Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  </main>;
}
