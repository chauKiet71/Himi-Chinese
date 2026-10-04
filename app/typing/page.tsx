import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, MessageSquareText } from "lucide-react";
import { getTypingCatalog } from "@/lib/typing-practice";

export const metadata: Metadata = {
  title: "Luyện gõ pinyin",
  description: "Luyện nhớ từ và câu HSK 1–6 bằng cách gõ pinyin theo nghĩa hoặc âm thanh.",
};

export default function TypingPage() {
  const levels = getTypingCatalog();

  return <main className="learner-dashboard typing-catalog-page">
    <section aria-labelledby="typing-level-heading" className="typing-catalog-section">
      <div className="typing-section-heading">
        <div>
          <h2 id="typing-level-heading">Bài luyện gõ HSK</h2>
        </div>
      </div>

      <div className="typing-level-grid">
        {levels.map((level) => (
          <article className={`typing-level-card is-level-${level.level}`} key={level.id}>
            <div className="typing-level-card-topline">
              <strong>{level.label}</strong>
              <span><BookOpen aria-hidden="true" size={14} /> {level.lessonCount} bài</span>
            </div>
            <div aria-label={`Một số từ: ${level.previewHanzi.join(", ")}`} className="typing-hanzi-preview" lang="zh-CN">
              {level.previewHanzi.slice(0, 4).map((character, index) => <span key={`${character}-${index}`}>{character}</span>)}
            </div>
            <h3>Luyện gõ {level.label}</h3>
            <p>{level.wordCount.toLocaleString("vi-VN")} từ và {level.sentenceCount.toLocaleString("vi-VN")} câu có audio thường, audio chậm.</p>
            <div className="typing-level-card-footer">
              <span><MessageSquareText aria-hidden="true" size={15} /> {level.wordCount + level.sentenceCount} mục</span>
              <Link href={`/typing/${level.id}`} prefetch={false}>Xem bài học <ArrowRight aria-hidden="true" size={17} /></Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  </main>;
}
