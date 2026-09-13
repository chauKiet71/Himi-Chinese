"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { PronunciationEvaluator } from "@/components/pronunciation-evaluator";
import type { DialogueLine, Vocabulary } from "@/lib/content-types";

type PracticeTarget = {
  id: string;
  hanzi: string;
  pinyin: string;
  translation: string;
};

export function LessonPronunciationCoach({ words, dialogue }: { words: Vocabulary[]; dialogue: DialogueLine[] }) {
  const targets = useMemo<PracticeTarget[]>(() => {
    const candidates = [
      ...dialogue.map((line, index) => ({ id: `dialogue-${index}`, hanzi: line.hanzi, pinyin: line.pinyin, translation: line.translation })),
      ...words.filter((word) => word.example.trim()).map((word) => ({ id: `word-${word.slug}`, hanzi: word.example, pinyin: word.pinyin, translation: word.translation })),
    ];
    return candidates.filter((item, index) => candidates.findIndex((candidate) => candidate.hanzi === item.hanzi) === index);
  }, [dialogue, words]);
  const [index, setIndex] = useState(0);
  const [passed, setPassed] = useState<Set<string>>(() => new Set());
  const current = targets[index];
  const atStart = index === 0;
  const atEnd = index === targets.length - 1;

  if (!current) return <div className="lesson-vocab-empty"><h2>Bài này chưa có câu luyện nghe</h2><p>Hãy chuyển sang Từ vựng hoặc Cụm từ để tiếp tục học.</p></div>;

  return <section className="lesson-pronunciation-coach lesson-pronunciation-live-stage" aria-labelledby="lesson-pronunciation-title">
    <h2 className="sr-only" id="lesson-pronunciation-title">Luyện nghe và phát âm với iFlytek</h2>

    <nav className="pronunciation-target-list" aria-label="Danh sách câu luyện phát âm">{targets.map((target, targetIndex) => <button
        aria-current={targetIndex === index ? "step" : undefined}
        className={targetIndex === index ? "is-active" : ""}
        key={target.id}
        onClick={() => setIndex(targetIndex)}
        type="button"
      >
        <span>{String(targetIndex + 1).padStart(2, "0")}</span>
        <small>{target.hanzi}</small>
        {passed.has(target.id) ? <CheckCircle2 size={16} /> : null}
      </button>)}</nav>

    <div className="pronunciation-practice-layout pronunciation-live-grid">
      <button aria-label="Câu trước" className="lesson-vocab-nav lesson-vocab-nav-prev" disabled={atStart} onClick={() => setIndex((currentIndex) => Math.max(0, currentIndex - 1))} type="button">
        <span><ChevronLeft size={24} /></span><small>Trước</small>
      </button>

      <article className="pronunciation-practice-card pronunciation-live-content">
        <span className="pronunciation-step-label">Câu {index + 1} / {targets.length}</span>
        <strong lang="zh-CN">{current.hanzi}</strong>
        <small>{current.pinyin}</small>
        <p>{current.translation}</p>
        <PronunciationEvaluator
          key={current.id}
          onEvaluated={(result) => {
            if (result.totalScore < 70) return;
            setPassed((items) => new Set(items).add(current.id));
          }}
          targetText={current.hanzi}
        />
        <div className="pronunciation-next-row">
          <span>{passed.has(current.id) ? <><CheckCircle2 size={16} /> Đã đạt câu này</> : "Mục tiêu: từ 70 điểm"}</span>
          <button disabled={atEnd} onClick={() => setIndex((currentIndex) => Math.min(targets.length - 1, currentIndex + 1))} type="button">Câu tiếp theo <ChevronRight size={16} /></button>
        </div>
      </article>

      <aside className="lesson-live-coach pronunciation-live-coach" aria-label="Himi đồng hành luyện phát âm">
        <span aria-hidden="true" className="lesson-live-coach-decor"><Sparkles size={25} /></span>
        <p><strong>Mình đang nghe đây!</strong><span>Đọc trọn câu, giữ nhịp đều và nhấn rõ cụm quan trọng.</span></p>
        <span aria-label="Himi đeo tai nghe đồng hành luyện phát âm" className="lesson-live-coach-mascot is-listening" role="img" />
        <small>Nghe thật kỹ · Nói thật tự tin</small>
      </aside>

      <button aria-label="Câu tiếp theo" className="lesson-vocab-nav lesson-vocab-nav-next" disabled={atEnd} onClick={() => setIndex((currentIndex) => Math.min(targets.length - 1, currentIndex + 1))} type="button">
        <span><ChevronRight size={24} /></span><small>Tiếp theo</small>
      </button>
    </div>
  </section>;
}
