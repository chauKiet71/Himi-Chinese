"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark, Check, Lightbulb, Volume2 } from "lucide-react";
import { LessonSpeedMenu, type LessonPlaybackRate } from "@/components/lesson-speed-menu";
import type { DialogueLine, UsageNote, Vocabulary } from "@/lib/content-types";
import { speakMandarin } from "@/lib/client-mandarin-audio";

type MoveDirection = "back" | "forward";
type Phrase = { id: string; hanzi: string; pinyin?: string; translation: string };

const phraseGlossary: Record<string, string> = {
  "截止日期": "hạn chót",
  "什么时候": "khi nào",
  "请问": "xin hỏi",
  "明白": "đã hiểu",
  "以后": "sau khi",
  "之前": "trước khi",
  "需要": "cần",
  "可以": "có thể",
  "是": "là",
  "有": "có",
  "在": "ở",
};

const phraseSplitExpression = new RegExp(`(${Object.keys(phraseGlossary).sort((left, right) => right.length - left.length).join("|")}|[，。！？、,.!?])`, "g");

function splitPhraseForStudy(hanzi: string) {
  const parts = hanzi.split(phraseSplitExpression).filter((part) => part && !/^[，。！？、,.!?]+$/u.test(part));
  return parts.length > 1 ? parts : [hanzi];
}

function buildPhrases(words: Vocabulary[], dialogue: DialogueLine[], notes: UsageNote[]) {
  const phrases: Phrase[] = [
    ...dialogue.map((line, index) => ({ id: `dialogue-${index}-${line.hanzi}`, hanzi: line.hanzi, pinyin: line.pinyin, translation: line.translation })),
    ...notes.map((note, index) => ({ id: `note-${index}-${note.pattern}`, hanzi: note.pattern, translation: note.explanation })),
    ...words.filter((word) => word.example.trim()).slice(0, 3).map((word) => ({ id: `word-${word.slug}`, hanzi: word.example, translation: word.translation })),
  ];
  return phrases.filter((phrase, index) => phrases.findIndex((item) => item.hanzi === phrase.hanzi) === index);
}

export function LessonPhrasebook({ words, dialogue, notes, onFinished }: { words: Vocabulary[]; dialogue: DialogueLine[]; notes: UsageNote[]; onFinished: () => void }) {
  const phrases = useMemo(() => buildPhrases(words, dialogue, notes), [dialogue, notes, words]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<MoveDirection>("forward");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<LessonPlaybackRate>(1);
  const [audioMessage, setAudioMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());

  const currentPhrase = phrases[index];
  const atStart = index === 0;
  const atEnd = index === phrases.length - 1;
  const saved = currentPhrase ? savedIds.has(currentPhrase.id) : false;
  const studySegments = currentPhrase ? splitPhraseForStudy(currentPhrase.hanzi) : [];

  const stopAudio = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const moveTo = useCallback((nextIndex: number, nextDirection: MoveDirection) => {
    if (nextIndex < 0 || nextIndex >= phrases.length) return;
    stopAudio();
    setDirection(nextDirection);
    setIndex(nextIndex);
    setAudioMessage("");
    setSaveMessage("");
  }, [phrases.length, stopAudio]);

  const moveForward = useCallback(() => {
    if (atEnd) return onFinished();
    moveTo(index + 1, "forward");
  }, [atEnd, index, moveTo, onFinished]);

  const moveBack = useCallback(() => moveTo(index - 1, "back"), [index, moveTo]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("button, a, input, textarea, select, summary, [contenteditable='true']")) return;
      if (event.key === "ArrowLeft" && !atStart) {
        event.preventDefault();
        moveBack();
      }
      if (event.key === "ArrowRight" || event.key === "Enter") {
        event.preventDefault();
        moveForward();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [atStart, moveBack, moveForward]);

  useEffect(() => () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const playPronunciation = () => {
    if (!currentPhrase || isSpeaking) return;
    stopAudio();
    setIsSpeaking(true);
    setAudioMessage("Đang phát âm…");
    const started = speakMandarin(currentPhrase.hanzi, () => {
      setIsSpeaking(false);
      setAudioMessage("Đã phát âm xong.");
    }, playbackRate);
    if (!started) {
      setIsSpeaking(false);
      setAudioMessage("Trình duyệt chưa hỗ trợ phát âm.");
    }
  };

  const saveForReview = () => {
    if (!currentPhrase || saved) return;
    setSavedIds((current) => new Set(current).add(currentPhrase.id));
    setSaveMessage("Đã lưu cụm trong phiên học này.");
  };

  if (!currentPhrase) return <div className="lesson-vocab-empty"><h2>Bài này chưa có cụm từ</h2><p>Hãy chuyển sang Từ vựng hoặc Nghe & nói để tiếp tục học.</p></div>;

  return <section aria-label="Bộ thẻ cụm từ" className={`lesson-vocab-deck lesson-phrase-deck lesson-reading-deck lesson-reference-deck lesson-live-stage${isSpeaking ? " is-speaking" : ""}`} data-testid="lesson-phrase-deck">
    <div className="lesson-stage-layout">
      <article aria-label={`Cụm ${index + 1} trên ${phrases.length}: ${currentPhrase.hanzi}`} className={`lesson-study-panel lesson-vocab-card lesson-phrase-study-card move-${direction}`} data-phrase-index={index + 1} key={currentPhrase.id} tabIndex={0}>
        <div className="lesson-study-surface">
        <button aria-label="Cụm trước" className="lesson-card-edge-nav is-back" disabled={atStart} onClick={moveBack} type="button"><ArrowLeft size={20} /></button>
        <button aria-label={atEnd ? "Chuyển sang Nghe và nói" : "Cụm tiếp theo"} className="lesson-card-edge-nav is-next" onClick={moveForward} type="button"><ArrowRight size={20} /></button>
        <div aria-label={`Tiến độ cụm ${index + 1} trên ${phrases.length}`} aria-valuemax={phrases.length} aria-valuemin={1} aria-valuenow={index + 1} className="lesson-vocab-progress lesson-stage-progress" role="progressbar">
          <span>Cụm {String(index + 1).padStart(2, "0")} / {String(phrases.length).padStart(2, "0")}</span>
          <div aria-hidden="true" className="lesson-vocab-progress-segments">{phrases.map((phrase, phraseIndex) => <i className={phraseIndex <= index ? "filled" : ""} key={phrase.id} />)}</div>
        </div>

        <div className="lesson-study-content lesson-phrase-content">
          <div className="lesson-phrase-heading-row">
            <strong className="lesson-phrase-hanzi" lang="zh-CN">{currentPhrase.hanzi}</strong>
          </div>
          {currentPhrase.pinyin ? <span className="lesson-vocab-pinyin lesson-phrase-pinyin">{currentPhrase.pinyin}</span> : null}
          <p className="lesson-phrase-meaning">{currentPhrase.translation}</p>

          <div aria-label="Cấu trúc cụm từ" className="lesson-phrase-structure" role="group">{studySegments.map((segment, segmentIndex) => <span className="lesson-phrase-structure-part" key={`${segment}-${segmentIndex}`}>
            {segmentIndex > 0 ? <i aria-hidden="true">+</i> : null}<b lang="zh-CN">{segment}</b>
          </span>)}</div>

          <div className="lesson-audio-actions">
            <button aria-label={`Phát âm cụm ${currentPhrase.hanzi}`} aria-pressed={isSpeaking} className={`lesson-audio-bar${isSpeaking ? " playing" : ""}`} onClick={playPronunciation} type="button">
              <span className="lesson-audio-icon"><Volume2 size={18} /></span>
              <span><strong>{isSpeaking ? "Đang phát âm…" : "Nghe cụm từ"}</strong></span>
            </button>
            <LessonSpeedMenu onChange={setPlaybackRate} rate={playbackRate} />
            <button aria-label={saved ? "Cụm đã được lưu" : "Lưu cụm để ôn tập"} aria-pressed={saved} className={`lesson-save-button lesson-save-button-icon${saved ? " saved" : ""}`} disabled={saved} onClick={saveForReview} title={saved ? "Đã lưu" : "Lưu cụm"} type="button">{saved ? <Check size={17} /> : <Bookmark size={17} />}{saved ? "Đã lưu" : "Lưu cụm"}</button>
          </div>
        </div>
        </div>

      </article>

      <aside className="lesson-coach-rail is-phrase" aria-label="Himi hướng dẫn cấu trúc câu">
        <div className="lesson-coach-tip"><Lightbulb aria-hidden="true" size={28} /><p><strong>Nghe theo từng nhịp</strong><span>Mỗi nhịp là một cụm ý.</span></p></div>
        {/* Static local asset keeps this client component compatible with the SSR lesson tests. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="Himi vẫy tay hướng dẫn cụm từ" className="lesson-coach-mascot" height={320} src="/assets/mascot/himi-v2/himi-wave.webp" width={320} />
      </aside>
    </div>
    <p aria-live="polite" className="sr-only">{audioMessage} {saveMessage}</p>
  </section>;
}
