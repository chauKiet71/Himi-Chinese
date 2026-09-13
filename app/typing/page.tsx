import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, MessageSquareText } from "lucide-react";
import { HimiSectionBanner } from "@/components/himi-section-banner";
import { getTypingCatalog } from "@/lib/typing-practice";

export const metadata: Metadata = {
  title: "Luyện gõ pinyin",
  description: "Luyện nhớ từ và câu HSK 1–6 bằng cách gõ pinyin theo nghĩa hoặc âm thanh.",
};

export default function TypingPage() {
  const levels = getTypingCatalog();
  const lessonCount = levels.reduce((total, level) => total + level.lessonCount, 0);
  const itemCount = levels.reduce((total, level) => total + level.wordCount + level.sentenceCount, 0);

  return <main className="learner-dashboard typing-catalog-page">
    <HimiSectionBanner
      className="typing-catalog-banner"
      description={`${lessonCount} bài học và ${itemCount.toLocaleString("vi-VN")} lượt gõ từ HSK 1–6. Nhìn nghĩa hoặc nghe âm thanh, rồi tự nhớ lại pinyin.`}
      titleId="typing-catalog-title"
      titleLines={["Nghe thật kỹ.", "Gõ pinyin thật chắc."]}
      variant="practice"
    />

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
