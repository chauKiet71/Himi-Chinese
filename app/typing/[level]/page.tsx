import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronLeft, Keyboard, LockKeyhole, MessageSquareText } from "lucide-react";
import { getTypingLevel, TYPING_LEVEL_IDS } from "@/lib/typing-practice";

import { getCurrentUser } from "@/lib/auth-session";
import { getTypingAccessStates } from "@/lib/typing-content-repository";
import { typingLessonTargets } from "@/lib/typing-content-access";

export const dynamic = "force-dynamic";

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
  const user = await getCurrentUser();
  const accessStates = await getTypingAccessStates(level.lessons.map((lesson) => typingLessonTargets(level.id, lesson.id)), user?.id ?? null);

  return <main className="learner-dashboard typing-lesson-page">
    <nav aria-label="Quay lại trang Luyện gõ" className="typing-level-back">
      <Link href="/typing" prefetch={false}><ChevronLeft aria-hidden="true" size={17} strokeWidth={2.3} /> Về trang Luyện gõ</Link>
    </nav>

    <section aria-label="Danh sách bài luyện gõ" className="typing-lesson-list-section">
      <div className="typing-lesson-grid">
        {level.lessons.map((lesson, lessonIndex) => (
          <article className="typing-lesson-card" key={lesson.id}>
            <div className="typing-lesson-card-topline">
              <strong>Bài {String(lesson.number).padStart(2, "0")}</strong>
              <span><Keyboard aria-hidden="true" size={15} /> {lesson.wordCount} từ</span>
            </div>
            <div aria-label="Luyện gõ pinyin" className="typing-lesson-preview" lang="zh-CN">
              {["拼", "音", "练", "习"].map((character, index) => <span key={`${character}-${index}`}>{character}</span>)}
            </div>
            <h2>{lesson.titleVi} {accessStates[lessonIndex].source === "vip_required" ? <span className="typing-vip-badge"><LockKeyhole aria-hidden="true" size={14} /> VIP</span> : null}</h2>
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
