import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Headphones, Keyboard, MessageSquareText, Volume2 } from "lucide-react";
import { getCurrentUser } from "@/lib/auth-session";
import { learnerLoginPath } from "@/lib/learner-auth";
import { getTypingLesson, getTypingLessonParams } from "@/lib/typing-practice";

type TypingLessonPageProps = { params: Promise<{ level: string; lesson: string }> };

export function generateStaticParams() {
  return getTypingLessonParams();
}

export async function generateMetadata({ params }: TypingLessonPageProps): Promise<Metadata> {
  const { level, lesson } = await params;
  const selection = getTypingLesson(level, lesson);
  return selection ? {
    title: `Luyện gõ · ${selection.lesson.titleVi}`,
    description: `Luyện gõ từ và câu trong ${selection.lesson.titleVi}.`,
  } : { title: "Không tìm thấy bài luyện gõ" };
}

export default async function TypingLessonPage({ params }: TypingLessonPageProps) {
  const [{ level: levelId, lesson: lessonId }, user] = await Promise.all([params, getCurrentUser()]);
  const selection = getTypingLesson(levelId, lessonId);
  if (!selection) notFound();
  const { level, lesson } = selection;
  const wordPracticeHref = `/typing/${level.id}/${lesson.id}/practice?stage=word`;
  const sentencePracticeHref = `/typing/${level.id}/${lesson.id}/practice?stage=sentence`;

  return <main className="learner-dashboard typing-choice-page">
    <nav aria-label="Điều hướng bài luyện gõ" className="typing-breadcrumbs">
      <Link href={`/typing/${level.id}`}><ArrowLeft aria-hidden="true" size={16} /> {level.label}</Link>
      <span aria-hidden="true">/</span><strong>Bài {lesson.number}</strong>
    </nav>

    <header className="typing-choice-hero">
      <div>
        <span>{level.label} · Bài {String(lesson.number).padStart(2, "0")}</span>
        <h1>{lesson.titleVi}</h1>
        <p lang="zh-CN">{lesson.titleZh}</p>
      </div>
      <div className="typing-choice-audio-note"><Headphones aria-hidden="true" size={24} /><span><strong>Hai cách luyện</strong><small>Việt → Trung hoặc nghe viết</small></span></div>
    </header>

    <section aria-label="Chọn nội dung luyện" className="typing-choice-grid">
      <article className="typing-choice-card is-word">
        <span className="typing-choice-icon"><Keyboard aria-hidden="true" size={25} /></span>
        <div><small>Từ vựng và cụm từ</small><h2>Gõ từng từ thật chắc</h2><p>Nhìn nghĩa hoặc nghe phát âm rồi nhập pinyin không dấu.</p></div>
        <strong>{lesson.wordCount} mục</strong>
        {lesson.wordCount ? <Link href={user ? wordPracticeHref : learnerLoginPath(wordPracticeHref)} prefetch={false}>{user ? "Bắt đầu luyện" : "Đăng nhập để luyện"} <ArrowRight aria-hidden="true" size={17} /></Link> : <span className="typing-choice-empty">Bài này chưa có từ</span>}
      </article>
      <article className="typing-choice-card is-sentence">
        <span className="typing-choice-icon"><MessageSquareText aria-hidden="true" size={25} /></span>
        <div><small>Câu</small><h2>Ghép pinyin theo từng cụm</h2><p>Hoàn thành lần lượt từng cụm để nhớ cấu trúc cả câu.</p></div>
        <strong>{lesson.sentenceCount} mục</strong>
        {lesson.sentenceCount ? <Link href={user ? sentencePracticeHref : learnerLoginPath(sentencePracticeHref)} prefetch={false}>{user ? "Bắt đầu luyện" : "Đăng nhập để luyện"} <ArrowRight aria-hidden="true" size={17} /></Link> : <span className="typing-choice-empty">Bài này chưa có câu</span>}
      </article>
    </section>

    <aside className="typing-choice-tip"><Volume2 aria-hidden="true" size={20} /><p><strong>Mẹo nhỏ:</strong> chế độ Nghe viết sẽ tự phát âm khi chuyển sang mục mới; bạn luôn có thể nghe lại ở tốc độ thường hoặc chậm.</p></aside>
  </main>;
}
