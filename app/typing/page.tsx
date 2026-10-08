import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, LockKeyhole, MessageSquareText } from "lucide-react";
import { getTypingCatalog } from "@/lib/typing-practice";

import { getCurrentUser } from "@/lib/auth-session";
import { getTypingAccessStates } from "@/lib/typing-content-repository";
import { typingLevelTarget } from "@/lib/content-access-types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Luyện gõ pinyin",
  description: "Luyện nhớ từ và câu HSK 1–6 bằng cách gõ pinyin theo nghĩa hoặc âm thanh.",
};

export default async function TypingPage() {
  const levels = getTypingCatalog();
  const user = await getCurrentUser();
  const accessStates = await getTypingAccessStates(levels.map((level) => [typingLevelTarget(level.id)]), user?.id ?? null);

  return <main className="learner-dashboard typing-catalog-page">
    <section aria-labelledby="typing-level-heading" className="typing-catalog-section">
      <div className="typing-section-heading">
        <div>
          <h2 id="typing-level-heading">Bài luyện gõ HSK</h2>
        </div>
      </div>

      <div className="typing-level-grid">
        {levels.map((level, levelIndex) => (
          <article className={`typing-level-card is-level-${level.level}`} key={level.id}>
            <div className="typing-level-card-topline">
              <strong>{level.label}</strong>
              <span><BookOpen aria-hidden="true" size={14} /> {level.lessonCount} bài</span>
            </div>
            <div aria-label="Luyện gõ pinyin" className="typing-hanzi-preview" lang="zh-CN">
              {["拼", "音", "练", "习"].map((character, index) => <span key={`${character}-${index}`}>{character}</span>)}
            </div>
            <h3>Luyện gõ {level.label} {accessStates[levelIndex].source === "vip_required" ? <span className="typing-vip-badge"><LockKeyhole aria-hidden="true" size={14} /> VIP</span> : null}</h3>
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
