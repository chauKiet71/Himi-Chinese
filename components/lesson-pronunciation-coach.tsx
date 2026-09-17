"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BarChart3, CheckCircle2, ChevronRight, Lightbulb, Volume2 } from "lucide-react";
import { PronunciationEvaluator } from "@/components/pronunciation-evaluator";
import { speakMandarin } from "@/lib/client-mandarin-audio";
import type { DialogueLine, Vocabulary } from "@/lib/content-types";

type PracticeTarget = { id: string; hanzi: string; pinyin: string; translation: string };

const PRACTICE_TARGET_LIMIT = 10;

export function LessonPronunciationCoach({ words, dialogue, onFinished = () => undefined }: { words: Vocabulary[]; dialogue: DialogueLine[]; onFinished?: () => void }) {
  const targets = useMemo<PracticeTarget[]>(() => {
    const candidates = [
      ...dialogue.map((line, index) => ({ id: `dialogue-${index}`, hanzi: line.hanzi, pinyin: line.pinyin, translation: line.translation })).sort((left, right) => right.hanzi.length - left.hanzi.length),
      ...words.filter((word) => word.example.trim()).map((word) => ({ id: `word-${word.slug}`, hanzi: word.example, pinyin: word.pinyin, translation: word.translation })),
      ...words.map((word) => ({ id: `term-${word.slug}`, hanzi: word.hanzi, pinyin: word.pinyin, translation: word.meaning })),
    ];
    return candidates
      .filter((item, index) => candidates.findIndex((candidate) => candidate.hanzi === item.hanzi) === index)
      .slice(0, PRACTICE_TARGET_LIMIT);
  }, [dialogue, words]);
  const [index, setIndex] = useState(0);
  const [passed, setPassed] = useState<Set<string>>(() => new Set());
  const current = targets[index];
  const atStart = index === 0;
  const atEnd = index === targets.length - 1;

  const moveTo = (nextIndex: number) => {
    setIndex(Math.max(0, Math.min(targets.length - 1, nextIndex)));
  };

  if (!current) return <div className="lesson-vocab-empty"><h2>Bài này chưa có câu luyện nghe</h2><p>Hãy chuyển sang Từ vựng hoặc Cụm từ để tiếp tục học.</p></div>;

  return <section className="lesson-pronunciation-coach lesson-reference-deck lesson-pronunciation-live-stage" aria-labelledby="lesson-pronunciation-title">
    <h2 className="sr-only" id="lesson-pronunciation-title">Luyện nghe và phát âm với iFlytek</h2>
    <div className="lesson-stage-layout">
      <article className="lesson-study-panel pronunciation-practice-card">
        <div className="lesson-study-surface">
        <button aria-label="Câu trước" className="lesson-card-edge-nav is-back" disabled={atStart} onClick={() => moveTo(index - 1)} type="button"><ArrowLeft size={20} /></button>
        <button aria-label={atEnd ? "Đã đến câu cuối" : "Câu tiếp theo"} className="lesson-card-edge-nav is-next" disabled={atEnd} onClick={() => moveTo(index + 1)} type="button"><ArrowRight size={20} /></button>
        <div aria-label={`Tiến độ câu ${index + 1} trên ${targets.length}`} aria-valuemax={targets.length} aria-valuemin={1} aria-valuenow={index + 1} className="lesson-vocab-progress lesson-stage-progress" role="progressbar">
          <span>Câu {String(index + 1).padStart(2, "0")} / {String(targets.length).padStart(2, "0")}</span>
        </div>

        <div className="lesson-study-content pronunciation-study-content">
          <div className="pronunciation-heading-row"><strong lang="zh-CN">{current.hanzi}</strong><button aria-label={`Nghe nhanh câu ${current.hanzi}`} className="lesson-inline-sound" onClick={() => speakMandarin(current.hanzi)} type="button"><Volume2 size={24} /></button></div>
          <small className="pronunciation-pinyin">{current.pinyin}</small>
          <p>{current.translation}</p>

          <div className="lesson-pronunciation-action">
            <PronunciationEvaluator compact key={current.id} onEvaluated={(result) => {
              if (result.totalScore < 70) return;
              setPassed((items) => new Set(items).add(current.id));
            }} targetText={current.hanzi} />
          </div>

          <div className="pronunciation-status-row"><span><BarChart3 size={22} />{passed.has(current.id) ? <><CheckCircle2 size={16} /> Đã đạt câu này</> : "Chưa có kết quả"}</span><button type="button">Xem phản hồi <ChevronRight size={17} /></button></div>
        </div>
        {atEnd ? <div className="lesson-pronunciation-completion"><button aria-label="Hoàn thành phần Nghe và nói" className="lesson-stage-nav-button is-next" onClick={onFinished} type="button"><span>Hoàn thành</span> <ArrowRight size={19} /></button></div> : null}
        </div>
      </article>

      <aside className="lesson-coach-rail is-pronunciation" aria-label="Himi đồng hành luyện phát âm">
        <div className="lesson-coach-tip"><Lightbulb aria-hidden="true" size={28} /><p><strong>Đọc trọn câu</strong><span>Giữ nhịp đều.</span></p></div>
        {/* Static local asset keeps this client component compatible with the SSR lesson tests. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="Himi đeo tai nghe đồng hành luyện phát âm" className="lesson-coach-mascot" height={320} src="/assets/mascot/himi-v2/himi-listen.webp" width={320} />
      </aside>
    </div>
  </section>;
}
