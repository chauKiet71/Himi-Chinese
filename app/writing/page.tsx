import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, PenLine } from "lucide-react";
import { getWritingLevels } from "@/lib/writing-content";

export const metadata: Metadata = {
  title: "Luyện viết",
  description: "Chọn chủ đề HSK 1–6 và luyện viết Hán tự theo từng bài cùng Himi Chinese.",
};

export default function WritingPage() {
  const levels = getWritingLevels();

  return <main className="learner-dashboard writing-catalog-page">
    <section className="writing-topic-section" aria-labelledby="writing-topic-heading">
      <div className="writing-topic-heading">
        <div>
          <h2 id="writing-topic-heading">Bài luyện viết theo HSK</h2>
        </div>
      </div>

      <div className="writing-topic-grid">
        {levels.map((level, index) => (
          <article className={`writing-topic-card is-level-${index + 1}`} key={level.id}>
            <div className="writing-topic-card-topline">
              <span>{level.label}</span>
              <small><BookOpen aria-hidden="true" size={14} /> {level.lessonCount} bài học</small>
            </div>
            <div aria-label={`Một số chữ trong cấp độ: ${level.previewCharacters.join(", ")}`} className="writing-topic-characters" lang="zh-CN">
              {level.previewCharacters.map((character) => <span key={character}>{character}</span>)}
            </div>
            <h3>Luyện viết {level.label}</h3>
            <p>{level.description}</p>
            <div className="writing-topic-card-footer">
              <span><PenLine aria-hidden="true" size={15} /> {level.characterCount} chữ</span>
              <Link href={`/writing/${level.id}`} prefetch={false}>Xem bài học <ArrowRight aria-hidden="true" size={17} /></Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  </main>;
}
