"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, AudioLines, BookOpenText, Bookmark, Check, ChevronDown, Lightbulb, LoaderCircle, PenLine, Play, Volume2 } from "lucide-react";
import type { Vocabulary } from "@/lib/content-types";

type MoveDirection = "back" | "forward";

export function LessonVocabularyDeck({ words, authenticated, onFinished }: { words: Vocabulary[]; authenticated: boolean; onFinished: () => void }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<MoveDirection>("forward");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioMessage, setAudioMessage] = useState("");
  const [savePending, setSavePending] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [savedSlugs, setSavedSlugs] = useState<Set<string>>(() => new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentWord = words[index];
  const atStart = index === 0;
  const atEnd = index === words.length - 1;
  const saved = currentWord ? savedSlugs.has(currentWord.slug) : false;

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const moveTo = useCallback((nextIndex: number, nextDirection: MoveDirection) => {
    if (nextIndex < 0 || nextIndex >= words.length) return;
    stopAudio();
    setDirection(nextDirection);
    setIndex(nextIndex);
    setAudioMessage("");
    setSaveMessage("");
  }, [stopAudio, words.length]);

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
    if (audioRef.current) audioRef.current.pause();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const playPronunciation = async () => {
    if (!currentWord || isSpeaking) return;
    stopAudio();
    setAudioMessage("Đang phát âm…");
    setIsSpeaking(true);

    if (currentWord.audioUrl) {
      try {
        const audio = new Audio(currentWord.audioUrl);
        audioRef.current = audio;
        audio.addEventListener("ended", () => {
          audioRef.current = null;
          setIsSpeaking(false);
          setAudioMessage("Đã phát âm xong.");
        }, { once: true });
        audio.addEventListener("error", () => {
          audioRef.current = null;
          setIsSpeaking(false);
          setAudioMessage("Không thể phát tệp âm thanh này.");
        }, { once: true });
        await audio.play();
        return;
      } catch {
        audioRef.current = null;
      }
    }

    if (!("speechSynthesis" in window)) {
      setIsSpeaking(false);
      setAudioMessage("Trình duyệt chưa hỗ trợ phát âm.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(currentWord.hanzi);
    utterance.lang = "zh-CN";
    utterance.rate = 0.82;
    utterance.pitch = 1;
    utterance.onend = () => {
      setIsSpeaking(false);
      setAudioMessage("Đã phát âm xong.");
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setAudioMessage("Không thể phát âm trên thiết bị này.");
    };
    window.speechSynthesis.speak(utterance);
  };

  const saveForReview = async () => {
    if (!currentWord || saved || savePending) return;
    setSavePending(true);
    setSaveMessage("");
    try {
      if (authenticated) {
        const response = await fetch("/api/progress/review", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ vocabularySlug: currentWord.slug, remembered: false }),
        });
        if (!response.ok) throw new Error("save_failed");
      }
      setSavedSlugs((current) => new Set(current).add(currentWord.slug));
      setSaveMessage(authenticated ? "Đã thêm vào lịch ôn." : "Đã đánh dấu trong phiên học này.");
    } catch {
      setSaveMessage("Chưa thể lưu từ. Hãy thử lại.");
    } finally {
      setSavePending(false);
    }
  };

  if (!currentWord) return <div className="lesson-vocab-empty"><h2>Bài này chưa có từ vựng</h2><p>Hãy chuyển sang Cụm từ hoặc Nghe & nói để tiếp tục học.</p></div>;

  return <section aria-label="Bộ thẻ từ vựng" className={`lesson-vocab-deck lesson-live-stage${isSpeaking ? " is-speaking" : ""}`} data-testid="lesson-vocabulary-deck">
    <div className="lesson-stage-layout">
      <article aria-label={`Từ ${index + 1} trên ${words.length}: ${currentWord.hanzi}`} className={`lesson-study-panel lesson-vocab-card move-${direction}`} data-word-index={index + 1} key={currentWord.slug} tabIndex={0}>
        <div className="lesson-study-surface">
        <div aria-label={`Tiến độ từ ${index + 1} trên ${words.length}`} aria-valuemax={words.length} aria-valuemin={1} aria-valuenow={index + 1} className="lesson-vocab-progress lesson-stage-progress" role="progressbar">
          <span>Từ {String(index + 1).padStart(2, "0")} / {String(words.length).padStart(2, "0")}</span>
          <div aria-hidden="true" className="lesson-vocab-progress-segments">{words.map((word, wordIndex) => <i className={wordIndex <= index ? "filled" : ""} key={word.slug} />)}</div>
        </div>

        <div className="lesson-study-content lesson-vocabulary-content">
          <div className="lesson-word-heading">
            <strong className="lesson-vocab-hanzi" lang="zh-CN">{currentWord.hanzi}</strong>
            <button aria-label={`Nghe nhanh từ ${currentWord.hanzi}`} className="lesson-inline-sound" onClick={playPronunciation} type="button"><Volume2 size={24} /></button>
          </div>
          <div className="lesson-vocab-meta">
            <div><span className="lesson-vocab-pinyin">{currentWord.pinyin}</span><span className="lesson-vocab-meaning">{currentWord.meaning}</span></div>
            <span className="lesson-word-type">Danh từ</span>
          </div>

          <button aria-label={`Phát âm từ ${currentWord.hanzi}`} aria-pressed={isSpeaking} className={`lesson-audio-bar${isSpeaking ? " playing" : ""}`} onClick={playPronunciation} type="button">
            <span className="lesson-audio-icon"><Play fill="currentColor" size={22} /></span>
            <span><strong>{isSpeaking ? "Đang phát âm…" : "Nghe phát âm"}</strong></span>
            <AudioLines aria-hidden="true" size={46} strokeWidth={1.6} />
          </button>

          {currentWord.example ? <div className="lesson-example-card">
            <small>Ví dụ</small>
            <strong lang="zh-CN">{currentWord.example}</strong>
            <p>{currentWord.translation}</p>
          </div> : null}

          <div className="lesson-study-tools">
            <details className="lesson-disclosure">
              <summary><PenLine size={17} /> Xem cách viết <ChevronDown size={17} /></summary>
              <div className="lesson-disclosure-body">
                <div aria-label="Các chữ Hán trong từ" className="lesson-character-list">{Array.from(currentWord.hanzi).map((character, characterIndex) => <span lang="zh-CN" key={`${character}-${characterIndex}`}>{character}</span>)}</div>
                <p>Quan sát từng chữ, đọc thành tiếng rồi viết lại theo đúng thứ tự nét đã học.</p>
              </div>
            </details>
            <details className="lesson-disclosure is-secondary">
              <summary><BookOpenText size={17} /> Xem thêm ví dụ <ChevronDown size={17} /></summary>
              <div className="lesson-disclosure-body"><p>Đổi chủ ngữ hoặc thời gian trong câu mẫu, sau đó đọc lại cả câu thành tiếng.</p></div>
            </details>
            <button aria-label={saved ? "Từ đã được lưu" : "Lưu từ để ôn tập"} aria-pressed={saved} className={`lesson-save-button lesson-save-button-icon${saved ? " saved" : ""}`} disabled={savePending || saved} onClick={saveForReview} title={saved ? "Đã lưu" : "Lưu từ"} type="button">
              {savePending ? <LoaderCircle className="lesson-vocab-spinner" size={17} /> : saved ? <Check size={17} /> : <Bookmark size={17} />}{saved ? "Đã lưu" : "Lưu từ"}
            </button>
          </div>
        </div>
        </div>

        <nav aria-label="Điều hướng từ vựng" className="lesson-stage-nav">
          <button aria-label="Từ trước" className="lesson-stage-nav-button is-back" disabled={atStart} onClick={moveBack} type="button"><ArrowLeft size={19} /> <span>Trước</span></button>
          <span>{index + 1} / {words.length}</span>
          <button aria-label={atEnd ? "Chuyển sang Cụm từ" : "Từ tiếp theo"} className="lesson-stage-nav-button is-next" onClick={moveForward} type="button"><span>{atEnd ? "Cụm từ" : "Đã hiểu · Tiếp tục"}</span> <ArrowRight size={19} /></button>
        </nav>
      </article>

      <aside className="lesson-coach-rail is-vocabulary" aria-label="Mẹo ghi nhớ cùng Himi">
        <div className="lesson-coach-tip"><Lightbulb aria-hidden="true" size={28} /><p><strong>Nhớ bằng ngữ cảnh</strong><span>Gắn từ với một tình huống.</span></p></div>
        {/* Static local asset keeps this client component compatible with the SSR lesson tests. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="Himi cầm bút hướng dẫn từ mới" className="lesson-coach-mascot" height={320} src="/assets/mascot/himi-v2/himi-writing.webp" width={320} />
      </aside>
    </div>
    <p aria-live="polite" className="sr-only">{audioMessage} {saveMessage}</p>
  </section>;
}
