"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Eye,
  Gauge,
  Headphones,
  Keyboard,
  RotateCcw,
  Snail,
  Sparkles,
  Trophy,
  Volume2,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MutableRefObject,
} from "react";
import { getTypingPinyinProgress, isTypingPinyinCorrect } from "@/lib/typing-answer";
import type {
  TypingLessonPayload,
  TypingLessonSummary,
  TypingLevel,
  TypingPracticeItem,
  TypingPracticeMode,
  TypingPracticeStage,
} from "@/lib/typing-practice";

type AnswerState = {
  value: string;
  segmentValues: string[];
  correct: boolean;
  revealed: boolean;
  skipped: boolean;
  usedAnswer: boolean;
};

const EMPTY_ANSWER: AnswerState = {
  value: "",
  segmentValues: [],
  correct: false,
  revealed: false,
  skipped: false,
  usedAnswer: false,
};
const SAVED_STORAGE_KEY = "himi:typing:saved:v1";
const CELEBRATION_DURATION_MS = 1400;
const CONFETTI_PARTICLE_COUNT = 18;

function playCorrectChime() {
  const AudioContextConstructor = window.AudioContext
    ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextConstructor) return;

  try {
    const context = new AudioContextConstructor();
    const startedAt = context.currentTime;
    const output = context.createGain();
    output.gain.setValueAtTime(0.0001, startedAt);
    output.gain.exponentialRampToValueAtTime(0.16, startedAt + 0.012);
    output.gain.exponentialRampToValueAtTime(0.0001, startedAt + 0.48);
    output.connect(context.destination);

    [
      { frequency: 1046.5, gain: 0.76, offset: 0, duration: 0.44 },
      { frequency: 1567.98, gain: 0.32, offset: 0.035, duration: 0.34 },
    ].forEach(({ frequency, gain: level, offset, duration }) => {
      const oscillator = context.createOscillator();
      const oscillatorGain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, startedAt + offset);
      oscillatorGain.gain.setValueAtTime(level, startedAt + offset);
      oscillatorGain.gain.exponentialRampToValueAtTime(0.0001, startedAt + offset + duration);
      oscillator.connect(oscillatorGain);
      oscillatorGain.connect(output);
      oscillator.start(startedAt + offset);
      oscillator.stop(startedAt + offset + duration);
    });

    void context.resume().catch(() => undefined);
    window.setTimeout(() => void context.close().catch(() => undefined), 600);
  } catch {
    // Correct-answer feedback remains visual when Web Audio is unavailable.
  }
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function answerStateFor(answers: Record<string, AnswerState>, id: string): AnswerState {
  return answers[id] ?? EMPTY_ANSWER;
}

function SentenceInputs({
  answer,
  item,
  activeSegment,
  inputRefs,
  onChange,
}: {
  answer: AnswerState;
  item: TypingPracticeItem;
  activeSegment: number;
  inputRefs: MutableRefObject<Array<HTMLInputElement | null>>;
  onChange: (segmentIndex: number, value: string) => void;
}) {
  const segments = item.segments.length ? item.segments : [{
    text: item.hanzi,
    pinyin: item.pinyin,
    meaning: item.meaning,
  }];

  return <div className="typing-segment-inputs">
    {segments.map((segment, segmentIndex) => {
      const value = answer.segmentValues[segmentIndex] ?? "";
      const segmentProgress = getTypingPinyinProgress(value, segment.pinyin);
      const segmentCorrect = answer.correct || answer.revealed || isTypingPinyinCorrect(value, segment.pinyin);
      const segmentWrong = segmentProgress.hasInput && !segmentProgress.isValidPrefix && !segmentCorrect;
      if (segmentCorrect) {
        return <div className="typing-word-answer typing-segment-answer" key={`${segment.text}-${segmentIndex}`}>
          <strong lang="zh-CN">{segment.text}</strong>
          <span>{segment.pinyin}</span>
        </div>;
      }
      return <label className={`typing-segment-field${segmentWrong ? " is-wrong" : ""}`} key={`${segment.text}-${segmentIndex}`}>
        <span className="sr-only">Cụm pinyin {segmentIndex + 1}</span>
        <input
          aria-invalid={segmentWrong}
          autoComplete="off"
          disabled={segmentIndex !== activeSegment}
          inputMode="text"
          onChange={(event) => onChange(segmentIndex, event.target.value)}
          placeholder={segmentIndex === activeSegment ? "Gõ pinyin" : ""}
          ref={(node) => { inputRefs.current[segmentIndex] = node; }}
          spellCheck={false}
          value={value}
        />
        <span
          aria-label={`Tiến trình gõ đúng ${segmentProgress.matched} trên ${segmentProgress.total} ký tự`}
          aria-valuemax={segmentProgress.total}
          aria-valuemin={0}
          aria-valuenow={segmentProgress.matched}
          className="typing-segment-progress"
          role="progressbar"
        ><span style={{ width: `${segmentProgress.percent}%` }} /></span>
      </label>;
    })}
  </div>;
}

export function TypingPracticeStudio({
  initialMode,
  initialStage,
  lesson: lessonSummary,
  lessonDataUrl,
  level,
}: {
  initialMode: TypingPracticeMode;
  initialStage: TypingPracticeStage;
  lesson: TypingLessonSummary;
  lessonDataUrl: string;
  level: TypingLevel;
}) {
  const [lesson, setLesson] = useState<TypingLessonPayload | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [mode, setMode] = useState<TypingPracticeMode>(initialMode);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [activeSegment, setActiveSegment] = useState(0);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const [audioError, setAudioError] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [complete, setComplete] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [celebratingItemId, setCelebratingItemId] = useState<string | null>(null);
  const [celebrationKey, setCelebrationKey] = useState(0);
  const startedAtRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wordInputRef = useRef<HTMLInputElement>(null);
  const segmentInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const celebrationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playNextAudioRef = useRef(false);
  const stage = initialStage;

  useEffect(() => {
    let active = true;
    void fetch(lessonDataUrl)
      .then((response) => {
        if (!response.ok) throw new Error("Typing lesson fetch failed");
        return response.json() as Promise<TypingLessonPayload>;
      })
      .then((payload) => {
        if (active) {
          startedAtRef.current = Date.now();
          setLesson(payload);
        }
      })
      .catch(() => {
        if (active) setLoadError(true);
      });
    return () => { active = false; };
  }, [lessonDataUrl]);

  useEffect(() => {
    let storageTimer: ReturnType<typeof setTimeout> | null = null;
    try {
      const stored = window.localStorage.getItem(SAVED_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as unknown;
        if (Array.isArray(parsed)) {
          const storedIds = parsed.filter((value): value is string => typeof value === "string");
          storageTimer = setTimeout(() => setSavedIds(storedIds), 0);
        }
      }
    } catch {
      // Saving remains available for the current session.
    }
    return () => {
      if (storageTimer) clearTimeout(storageTimer);
    };
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.onplay = null;
      audio.onended = null;
      audio.onerror = null;
      audioRef.current = null;
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
    };
  }, []);

  const items = useMemo(() => {
    if (!lesson) return [];
    return stage === "word" ? lesson.words : lesson.sentences;
  }, [lesson, stage]);
  const currentItem = items[index];
  const currentAnswer = currentItem ? answerStateFor(answers, currentItem.id) : EMPTY_ANSWER;
  const progress = items.length ? ((index + 1) / items.length) * 100 : 0;
  const saved = currentItem ? savedIds.includes(currentItem.id) : false;

  const playAudio = useCallback(async (url: string, reportFailure = true) => {
    setAudioError(false);
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.src = url;
    audio.onplay = () => setAudioPlaying(true);
    audio.onended = () => setAudioPlaying(false);
    audio.onerror = () => {
      setAudioPlaying(false);
      if (reportFailure) setAudioError(true);
    };
    try {
      await audio.play();
    } catch {
      setAudioPlaying(false);
      if (reportFailure) setAudioError(true);
    }
  }, []);

  useEffect(() => {
    if (!currentItem || complete) return;
    const focusHandle = window.requestAnimationFrame(() => {
      if (stage === "sentence") segmentInputRefs.current[activeSegment]?.focus({ preventScroll: true });
      else wordInputRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(focusHandle);
  }, [activeSegment, complete, currentItem, index, stage]);

  useEffect(() => {
    if (!currentItem || complete) return;
    const shouldAutoplay = mode === "listening" || playNextAudioRef.current;
    playNextAudioRef.current = false;
    if (!shouldAutoplay) return;
    const autoplayTimer = setTimeout(() => {
      void playAudio(currentItem.audio.normal, false);
    }, 0);
    return () => clearTimeout(autoplayTimer);
  }, [complete, currentItem, index, mode, playAudio]);

  const advanceCorrectAnswer = useEffectEvent((event: globalThis.KeyboardEvent) => {
    if (event.key !== "Enter" || event.isComposing || !currentAnswer.correct || complete) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest("button, a")) return;
    event.preventDefault();
    goNext();
  });

  useEffect(() => {
    if (!currentAnswer.correct || complete) return;
    window.addEventListener("keydown", advanceCorrectAnswer);
    return () => window.removeEventListener("keydown", advanceCorrectAnswer);
  }, [complete, currentAnswer.correct]);

  function showToast(message: string) {
    setToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(""), 2200);
  }

  function updateCurrentAnswer(update: (current: AnswerState) => AnswerState) {
    if (!currentItem) return;
    setAnswers((current) => ({
      ...current,
      [currentItem.id]: update(answerStateFor(current, currentItem.id)),
    }));
  }

  function celebrateCorrect(itemId: string) {
    setCelebratingItemId(itemId);
    setCelebrationKey((current) => current + 1);
    if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
    celebrationTimerRef.current = setTimeout(() => {
      setCelebratingItemId((current) => current === itemId ? null : current);
    }, CELEBRATION_DURATION_MS);
    playCorrectChime();
  }

  function handleWordChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    const correct = currentItem ? isTypingPinyinCorrect(value, currentItem.pinyin) : false;
    updateCurrentAnswer((current) => ({
      ...current,
      value,
      correct,
      revealed: current.revealed || correct,
      skipped: correct ? false : current.skipped,
    }));
    if (correct && !currentAnswer.correct && currentItem) celebrateCorrect(currentItem.id);
  }

  function handleSegmentChange(segmentIndex: number, value: string) {
    if (!currentItem) return;
    const segments = currentItem.segments.length ? currentItem.segments : currentItem.words;
    const target = segments[segmentIndex];
    if (!target) return;
    const segmentCorrect = isTypingPinyinCorrect(value, target.pinyin);
    const nextValues = [...currentAnswer.segmentValues];
    nextValues[segmentIndex] = value;
    const allCorrect = segments.every((segment, indexToCheck) => (
      isTypingPinyinCorrect(nextValues[indexToCheck] ?? "", segment.pinyin)
    ));
    updateCurrentAnswer((current) => ({
      ...current,
      segmentValues: nextValues,
      correct: allCorrect,
      revealed: current.revealed || allCorrect,
      skipped: allCorrect ? false : current.skipped,
    }));
    if (allCorrect && !currentAnswer.correct) celebrateCorrect(currentItem.id);
    if (segmentCorrect && !allCorrect) {
      const nextSegment = Math.min(segmentIndex + 1, segments.length - 1);
      setActiveSegment(nextSegment);
      window.requestAnimationFrame(() => segmentInputRefs.current[nextSegment]?.focus({ preventScroll: true }));
    }
  }

  function revealAnswer() {
    updateCurrentAnswer((current) => ({ ...current, revealed: true, usedAnswer: true }));
    showToast("Đã mở đáp án. Nhấn Tiếp khi bạn sẵn sàng.");
  }

  function toggleSaved() {
    if (!currentItem) return;
    setSavedIds((current) => {
      const next = current.includes(currentItem.id)
        ? current.filter((id) => id !== currentItem.id)
        : [...current, currentItem.id];
      try {
        window.localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Keep the in-memory state when storage is unavailable.
      }
      return next;
    });
    showToast(saved ? "Đã bỏ khỏi danh sách đã lưu." : "Đã lưu nội dung để ôn lại.");
  }

  function finishSession() {
    const startedAt = startedAtRef.current ?? Date.now();
    setDurationSeconds(Math.max(1, Math.round((Date.now() - startedAt) / 1000)));
    setComplete(true);
    setCelebratingItemId(null);
    playNextAudioRef.current = false;
    audioRef.current?.pause();
  }

  function moveTo(nextIndex: number) {
    const nextItem = items[nextIndex];
    if (!nextItem) return;
    const nextAnswer = answerStateFor(answers, nextItem.id);
    const segments = nextItem.segments.length ? nextItem.segments : nextItem.words;
    const firstIncomplete = stage === "sentence"
      ? segments.findIndex((segment, segmentIndex) => (
        !isTypingPinyinCorrect(nextAnswer.segmentValues[segmentIndex] ?? "", segment.pinyin)
      ))
      : 0;
    setActiveSegment(Math.max(0, firstIncomplete));
    setCelebratingItemId(null);
    setIndex(nextIndex);
  }

  function goNext() {
    if (!currentItem) return;
    if (!currentAnswer.correct) {
      updateCurrentAnswer((current) => ({ ...current, skipped: true }));
    }
    if (index >= items.length - 1) {
      finishSession();
      return;
    }
    playNextAudioRef.current = true;
    moveTo(index + 1);
  }

  function goPrevious() {
    const previousIndex = index - 1;
    const previousItem = items[previousIndex];
    if (!previousItem) return;

    setAnswers((current) => {
      const nextAnswers = { ...current };
      delete nextAnswers[previousItem.id];
      return nextAnswers;
    });
    setActiveSegment(0);
    setAudioError(false);
    setToast("");
    setCelebratingItemId(null);
    playNextAudioRef.current = false;
    audioRef.current?.pause();
    setAudioPlaying(false);
    setIndex(previousIndex);
  }

  function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (currentAnswer.correct) goNext();
  }

  function restartSession() {
    setAnswers({});
    setIndex(0);
    setComplete(false);
    setDurationSeconds(0);
    setCelebratingItemId(null);
    playNextAudioRef.current = false;
    startedAtRef.current = Date.now();
  }

  function changeMode(nextMode: TypingPracticeMode) {
    setMode(nextMode);
  }

  if (loadError) {
    return <section className="typing-load-state" role="alert">
      <CircleHelp aria-hidden="true" size={30} />
      <h1>Chưa tải được dữ liệu bài luyện</h1>
      <p>Hãy kiểm tra lại kết nối rồi thử tải trang một lần nữa.</p>
      <button onClick={() => window.location.reload()} type="button"><RotateCcw aria-hidden="true" size={17} /> Tải lại</button>
    </section>;
  }

  if (!lesson || !currentItem) {
    return <section aria-live="polite" className="typing-load-state">
      <span className="typing-loading-icon"><Keyboard aria-hidden="true" size={28} /></span>
      <h1>Đang chuẩn bị bài luyện gõ…</h1>
      <p>Himi đang mở đúng từ, câu và audio của bài học.</p>
    </section>;
  }

  const correctCount = Object.values(answers).filter((answer) => answer.correct && !answer.usedAnswer).length;
  const assistedCount = Object.values(answers).filter((answer) => answer.usedAnswer).length;
  const skippedCount = Object.values(answers).filter((answer) => answer.skipped && !answer.correct && !answer.usedAnswer).length;
  const lessonIndex = level.lessons.findIndex((item) => item.id === lessonSummary.id);
  const nextLesson = level.lessons[lessonIndex + 1];

  if (complete) {
    return <section className="typing-complete-card" aria-labelledby="typing-complete-title">
      <span className="typing-complete-icon"><Trophy aria-hidden="true" size={34} /></span>
      <small>{level.label} · Bài {lessonSummary.number} đã hoàn thành</small>
      <h1 id="typing-complete-title">Một lượt gõ rất tập trung!</h1>
      <p>Bạn đã đi hết {items.length} {stage === "word" ? "từ và cụm từ" : "câu"} trong phiên này.</p>
      <div className="typing-complete-stats">
        <div><CheckCircle2 aria-hidden="true" size={21} /><span><strong>{correctCount}</strong><small>Tự gõ đúng</small></span></div>
        <div><Eye aria-hidden="true" size={21} /><span><strong>{assistedCount}</strong><small>Có xem đáp án</small></span></div>
        <div><ChevronRight aria-hidden="true" size={21} /><span><strong>{skippedCount}</strong><small>Đã bỏ qua</small></span></div>
        <div><Clock3 aria-hidden="true" size={21} /><span><strong>{formatDuration(durationSeconds)}</strong><small>Thời gian</small></span></div>
      </div>
      <div className="typing-complete-actions">
        <button onClick={restartSession} type="button"><RotateCcw aria-hidden="true" size={17} /> Luyện lại</button>
        <Link href={nextLesson ? `/typing/${level.id}/${nextLesson.id}` : `/typing/${level.id}`}>
          {nextLesson ? "Bài tiếp theo" : `Về ${level.label}`} <ArrowRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </section>;
  }

  const wordProgress = getTypingPinyinProgress(currentAnswer.value, currentItem.pinyin);
  const wordWrong = wordProgress.hasInput && !wordProgress.isValidPrefix && !currentAnswer.correct;
  const answerVisible = currentAnswer.revealed || currentAnswer.correct;

  return <section className="typing-studio" aria-label="Phiên luyện gõ pinyin">
    <header className="typing-session-header">
      <Link aria-label="Đóng phiên luyện" href={`/typing/${level.id}/${lessonSummary.id}`}><X aria-hidden="true" size={18} /></Link>
      <div aria-label={`Tiến độ ${index + 1} trên ${items.length}`} aria-valuemax={items.length} aria-valuemin={1} aria-valuenow={index + 1} className="typing-session-progress" role="progressbar">
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="typing-mode-tabs" role="tablist" aria-label="Cách luyện gõ">
        <button aria-selected={mode === "meaning"} className={mode === "meaning" ? "is-active" : ""} onClick={() => changeMode("meaning")} role="tab" type="button">Việt → Trung</button>
        <button aria-selected={mode === "listening"} className={mode === "listening" ? "is-active" : ""} onClick={() => changeMode("listening")} role="tab" type="button">Nghe viết</button>
      </div>
    </header>

    <div className="typing-session-titlebar">
      <div><small>{level.label} · Bài {lessonSummary.number}</small><h1>{lessonSummary.titleVi} · {stage === "word" ? "Từ vựng" : "Câu"}</h1></div>
      <strong>{index + 1}/{items.length}</strong>
    </div>

    <div className="typing-practice-grid">
      <form className="typing-question-card" onSubmit={submitAnswer}>
        <span className="typing-question-kind">{stage === "word" ? "Từ vựng" : "Câu"}</span>
        <p className="typing-question-instruction">{mode === "meaning" ? "Nhìn tiếng Việt, gõ pinyin không dấu." : "Nghe tiếng Trung, gõ pinyin không dấu."}</p>
        {mode === "meaning"
          ? <h2>{currentItem.meaning}</h2>
          : <button aria-label="Phát lại audio" className={`typing-listening-prompt${audioPlaying ? " is-playing" : ""}`} onClick={() => void playAudio(currentItem.audio.normal)} type="button"><Headphones aria-hidden="true" size={31} /><span>Nghe</span></button>}

        <div className={`typing-answer-stage is-${stage}`}>
          {celebratingItemId === currentItem.id && currentAnswer.correct ? <span
            aria-hidden="true"
            className="typing-answer-confetti"
            key={`${currentItem.id}-${celebrationKey}`}
          >
            <Image alt="" fill sizes="560px" src="/assets/quiz/correct-confetti.gif" unoptimized />
            <span className="typing-answer-confetti-particles">
              {Array.from({ length: CONFETTI_PARTICLE_COUNT }, (_, particleIndex) => <i key={particleIndex} />)}
            </span>
          </span> : null}
          {stage === "word" ? (
            answerVisible ? <div className="typing-word-answer">
              <strong lang="zh-CN">{currentItem.hanzi}</strong><span>{currentItem.pinyin}</span>
            </div> : <label className={`typing-word-input${wordWrong ? " is-wrong" : ""}`}>
              <span className="sr-only">Nhập pinyin không dấu</span>
              <span className="typing-word-input-control">
                <input
                  aria-invalid={wordWrong}
                  autoComplete="off"
                  onChange={handleWordChange}
                  placeholder="Gõ pinyin không dấu"
                  ref={wordInputRef}
                  spellCheck={false}
                  value={currentAnswer.value}
                />
                {wordProgress.matched > 0 ? <span
                  aria-label={`Tiến trình gõ đúng ${wordProgress.matched} trên ${wordProgress.total} ký tự`}
                  aria-valuemax={wordProgress.total}
                  aria-valuemin={0}
                  aria-valuenow={wordProgress.matched}
                  className="typing-character-progress"
                  role="progressbar"
                ><span style={{ width: `${wordProgress.percent}%` }} /></span> : null}
              </span>
              {wordProgress.matched > 0 ? <span aria-hidden="true" className="typing-character-progress-count">{wordProgress.matched}/{wordProgress.total}</span> : null}
            </label>
          ) : <SentenceInputs
            activeSegment={activeSegment}
            answer={currentAnswer}
            inputRefs={segmentInputRefs}
            item={currentItem}
            onChange={handleSegmentChange}
          />}
        </div>

        {currentAnswer.correct ? <div className="typing-correct-burst" role="status"><Sparkles aria-hidden="true" size={22} /><strong>Chính xác!</strong><Sparkles aria-hidden="true" size={18} /></div> : null}
        <button className="sr-only" type="submit">Sang câu tiếp theo</button>
      </form>

      <aside className={`typing-memory-card${answerVisible ? " is-revealed" : ""}`} aria-live="polite">
        <span>Nội dung cần nhớ</span>
        {answerVisible ? <>
          <strong className="typing-memory-hanzi" lang="zh-CN">{currentItem.hanzi}</strong>
          <b>{currentItem.pinyin}</b>
          <p>{currentItem.meaning}</p>
          {currentItem.partOfSpeech ? <small>{currentItem.partOfSpeech}</small> : null}
        </> : <div className="typing-memory-hidden"><CircleHelp aria-hidden="true" size={34} /><strong>Đáp án đang được ẩn</strong><p>Trả lời đúng hoặc mở đáp án để ghi nhớ sâu hơn.</p></div>}
      </aside>

      <footer className="typing-action-bar">
        <button disabled={index === 0} onClick={goPrevious} type="button"><ChevronLeft aria-hidden="true" size={17} /> Trước</button>
        <button className={audioPlaying ? "is-playing" : ""} onClick={() => void playAudio(currentItem.audio.normal)} type="button"><Volume2 aria-hidden="true" size={17} /> Nghe</button>
        <button onClick={() => void playAudio(currentItem.audio.slow)} type="button"><Snail aria-hidden="true" size={17} /> Nghe chậm</button>
        <button className={saved ? "is-saved" : ""} onClick={toggleSaved} type="button">{saved ? <BookmarkCheck aria-hidden="true" size={17} /> : <Bookmark aria-hidden="true" size={17} />} {saved ? "Đã lưu" : "Lưu"}</button>
        <button onClick={revealAnswer} type="button"><Eye aria-hidden="true" size={17} /> Đáp án</button>
        <button className="is-next" onClick={goNext} type="button">Tiếp <ChevronRight aria-hidden="true" size={17} /></button>
      </footer>
    </div>

    {audioError ? <p className="typing-audio-error" role="alert">Chưa phát được audio này. Bạn có thể thử lại bằng nút Nghe.</p> : null}
    {toast ? <div className="typing-toast" role="status"><CheckCircle2 aria-hidden="true" size={18} /> {toast}</div> : null}
    <span className="typing-keyboard-hint"><Gauge aria-hidden="true" size={14} /> Gõ đúng rồi nhấn Enter để đi tiếp</span>
  </section>;
}
