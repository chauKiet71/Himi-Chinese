"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import type HanziWriter from "hanzi-writer";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  Flame,
  Headphones,
  Lightbulb,
  LockKeyhole,
  LoaderCircle,
  List,
  MessageCircle,
  PenLine,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  Volume2,
  X,
} from "lucide-react";
import type { HskExercise, HskLessonContent, HskVocabularyAudio, HskVocabularyItem } from "@/lib/hsk-lesson-content";
import { getHskCurriculumHref } from "@/lib/hsk-routing";
import { cancelHskPronunciation, playHskPronunciation } from "@/lib/hsk-audio";
import { VipContentGate, VipUpgradeDialog, type VipUpgradeTarget } from "@/components/vip-upgrade-prompt";
import { buildHskGuidedExercises, buildHskGuidedLessonSteps, buildHskGuidedNavigationSections, type HskGuidedStepKind } from "@/lib/hsk-guided-lesson";
import {
  EMPTY_HSK_LESSON_PROGRESS,
  getHskLessonProgressStorageKey,
  parseHskLessonProgress,
  type HskLessonProgress,
} from "@/lib/hsk-lesson-progress";
import { recordRecentHskLesson } from "@/lib/recent-hsk-learning";
import { trySaveHskVocabularyWord } from "@/lib/saved-vocabulary-client";

type WritingMode = "watch" | "trace" | "quiz";
type VocabularySaveStatus = "idle" | "saving" | "saved" | "error";
type GuidedSpeak = (text: string, audio?: HskVocabularyAudio) => void;

function AutoFitHanzi({ children }: { children: string }) {
  const textRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const text = textRef.current;
    const container = text?.parentElement;
    if (!text || !container) return;

    const fitText = () => {
      text.style.removeProperty("font-size");
      const maximumSize = Number.parseFloat(window.getComputedStyle(text).fontSize);
      const minimumSize = Number.parseFloat(window.getComputedStyle(text).getPropertyValue("--hsk-guided-hanzi-min-size")) || 24;
      const availableWidth = container.clientWidth;
      const naturalWidth = text.scrollWidth;
      if (!availableWidth || !naturalWidth) return;
      text.style.fontSize = `${Math.max(minimumSize, Math.min(maximumSize, Math.floor(maximumSize * availableWidth / naturalWidth)))}px`;
    };

    fitText();
    const observer = new ResizeObserver(fitText);
    observer.observe(container);
    void document.fonts?.ready.then(fitText);
    return () => observer.disconnect();
  }, [children]);

  return <strong className="hsk-guided-hanzi-autofit" lang="zh-CN" ref={textRef}>{children}</strong>;
}

const SECTION_ICONS = {
  vocabulary: Sparkles,
  writing: PenLine,
  practice: Target,
} satisfies Record<HskGuidedStepKind, typeof BookOpen>;

function saveProgress(lesson: HskLessonContent, progress: HskLessonProgress) {
  try {
    window.localStorage.setItem(getHskLessonProgressStorageKey(lesson.id), JSON.stringify(progress));
    recordRecentHskLesson(lesson, progress);
  } catch {
    // The guided lesson stays usable when browser storage is unavailable.
  }
}

function GuidedUnavailableSection({ kind }: { kind: "vocabulary" | "writing" }) {
  const copy = {
    vocabulary: {
      kicker: "Từ vựng",
      title: "Ôn từ trong nội dung bài",
      description: "Nguồn workbook không có danh sách từ mới kèm nghĩa tiếng Việt như giáo trình HSK 1. Các từ vẫn xuất hiện trong câu luyện đọc và ngân hàng lựa chọn.",
    },
    writing: {
      kicker: "Luyện viết",
      title: "Luyện chữ Hán",
      description: "Phần chữ Hán chưa có ký tự đủ rõ để mở bàn luyện viết tương tác.",
    },
  }[kind];

  return <section className="hsk-guided-unavailable">
    <span className="hsk-guided-kicker">{copy.kicker}</span>
    <div><BookOpen aria-hidden="true" size={30} /></div>
    <h1>{copy.title}</h1>
    <p>{copy.description}</p>
  </section>;
}

type VocabularyDetail = {
  frequency: string;
  description: string;
  totalStrokes?: number;
  radicals: Array<{ glyph: string; name: string; pronunciation: string }>;
  memory: string;
  exampleTranslation?: string;
  collocations: Array<{ hanzi: string; pinyin: string; translation: string }>;
};

const VOCABULARY_DETAILS: Record<string, VocabularyDetail> = {
  "你": {
    frequency: "Phổ biến",
    description: "Dùng để chỉ ngôi thứ hai số ít trong giao tiếp thông thường, đối xứng với “ngã” (tôi - 我).",
    totalStrokes: 7,
    radicals: [
      { glyph: "亻", name: "Bộ Nhân Đứng", pronunciation: "rén (người)" },
      { glyph: "尔", name: "Bộ / Chữ Nhĩ", pronunciation: "ěr (bạn, người)" },
    ],
    memory: "Quan sát cấu trúc chữ 你 trước khi luyện viết: Một người (亻) đối diện nói chuyện với bạn (尔).",
    exampleTranslation: "Chào bạn! / Chào anh!",
    collocations: [
      { hanzi: "你们", pinyin: "nǐmen", translation: "các bạn" },
      { hanzi: "你好吗", pinyin: "nǐ hǎo ma", translation: "bạn khỏe không" },
    ],
  },
};

function getVocabularyDetail(word: HskVocabularyItem): VocabularyDetail {
  const curated = VOCABULARY_DETAILS[word.hanzi];
  if (curated) return curated;
  const firstCharacter = Array.from(word.hanzi)[0] ?? word.hanzi;
  const radicals = word.radicals?.length
    ? word.radicals.slice(0, 2).map((radical) => ({ glyph: radical.glyph, name: radical.name, pronunciation: radical.note }))
    : [{ glyph: firstCharacter, name: "Thành phần gợi nhớ", pronunciation: word.pinyin }];
  return {
    frequency: "Từ trọng tâm",
    description: `“${word.hanzi}” được dùng với nghĩa “${word.meaning}”. Hãy ghi nhớ từ qua câu ví dụ và ngữ cảnh của bài học.`,
    radicals,
    memory: `Quan sát cấu trúc chữ ${firstCharacter} trước khi chuyển sang phần luyện viết.`,
    collocations: [{ hanzi: word.example, pinyin: word.examplePinyin, translation: word.translation }],
  };
}

function GuidedVocabulary({ lesson, itemIndex, showPinyin, speak, authenticated, saveStatus, onSave, onExit }: {
  lesson: HskLessonContent;
  itemIndex: number;
  showPinyin: boolean;
  speak: GuidedSpeak;
  authenticated: boolean;
  saveStatus: VocabularySaveStatus;
  onSave: (word: HskVocabularyItem) => void;
  onExit: () => void;
}) {
  const word = lesson.vocabulary[itemIndex];
  const details = getVocabularyDetail(word);
  if (word.locked) return <VipContentGate
    onExit={onExit}
    closeHref={getHskCurriculumHref(lesson.levelId)}
    key={word.id}
    title="Mở khóa từ vựng này"
  />;
  return <section className="hsk-guided-vocabulary">
    <span className="hsk-guided-kicker">Từ mới · {String(itemIndex + 1).padStart(2, "0")} / {lesson.vocabulary.length}</span>
    <div className="hsk-guided-vocabulary-grid">
      <article className="hsk-guided-character-card">
        <div className="hsk-guided-word-glyph">
          <AutoFitHanzi>{word.hanzi}</AutoFitHanzi>
          {showPinyin ? <span>{word.pinyin}</span> : null}
        </div>
        <button aria-label={`Phát âm ${word.hanzi}`} className="hsk-guided-audio" onClick={() => speak(word.hanzi, word.audio)} type="button"><Volume2 aria-hidden="true" size={35} /></button>
      </article>

      <article className="hsk-guided-meaning-card">
        <div className="hsk-guided-card-title">
          <span className="hsk-guided-card-heading"><BookOpen aria-hidden="true" size={30} /><small>Nghĩa của từ</small></span>
          <span className="hsk-guided-frequency"><Flame aria-hidden="true" size={22} />{details.frequency}</span>
        </div>
        <h2>{word.meaning}</h2>
        <div className="hsk-guided-word-actions">
          <span className="hsk-guided-word-class"><BookOpen aria-hidden="true" size={22} />{word.wordClass}</span>
          {authenticated
            ? <button aria-pressed={saveStatus === "saved"} className={`hsk-guided-save-word is-${saveStatus}`} disabled={saveStatus === "saving" || saveStatus === "saved"} onClick={() => onSave(word)} type="button">
              {saveStatus === "saving" ? <LoaderCircle aria-hidden="true" className="hsk-guided-save-spinner" size={22} /> : saveStatus === "saved" ? <Check aria-hidden="true" size={22} /> : <Bookmark aria-hidden="true" size={22} />}
              {saveStatus === "saving" ? "Đang lưu…" : saveStatus === "saved" ? "Đã lưu" : saveStatus === "error" ? "Thử lưu lại" : "Lưu từ"}
            </button>
            : <Link aria-label={`Đăng nhập để lưu từ ${word.hanzi}`} className="hsk-guided-save-word is-idle" href={`/login?returnTo=${encodeURIComponent(`/hsk/${lesson.levelId.replace(/^hsk-/, "")}/${lesson.id}/play`)}`}><Bookmark aria-hidden="true" size={22} /> Lưu từ</Link>}
        </div>
        {saveStatus === "error" ? <p className="hsk-guided-save-error" role="alert">Chưa thể lưu từ. Hãy thử lại.</p> : null}
      </article>

      <article className="hsk-guided-example-card">
        <div className="hsk-guided-card-title">
          <span className="hsk-guided-card-heading"><MessageCircle aria-hidden="true" size={27} /><small>Ví dụ ngữ cảnh</small></span>
          <button aria-label="Phát âm câu ví dụ" onClick={() => speak(word.example)} type="button"><Volume2 aria-hidden="true" size={21} /></button>
        </div>
        <div className="hsk-guided-example">
          <strong lang="zh-CN">{word.example}</strong>
          {showPinyin ? <b>{word.examplePinyin}</b> : null}
          <p>{details.exampleTranslation ?? word.translation}</p>
        </div>
        <div className="hsk-guided-collocations"><small><Lightbulb aria-hidden="true" size={24} />Cụm hay gặp:</small><div>{details.collocations.map((item) => <span key={`${word.id}-${item.hanzi}`}><strong lang="zh-CN">{item.hanzi}</strong> ({item.pinyin} - {item.translation})</span>)}</div></div>
      </article>
    </div>
  </section>;
}

function GuidedWriting({ lesson, speak, onComplete, onExit }: {
  lesson: HskLessonContent;
  speak: GuidedSpeak;
  onComplete: (writingId: string) => void;
  onExit: () => void;
}) {
  const boardRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<WritingMode>("watch");
  const [version, setVersion] = useState(0);
  const [status, setStatus] = useState("Quan sát thứ tự từng nét.");
  const [upgradeTarget, setUpgradeTarget] = useState<VipUpgradeTarget | null>(null);
  const character = lesson.writingCharacters[index];

  useEffect(() => {
    let canceled = false;
    const board = boardRef.current;
    if (!board) return;
    board.replaceChildren();
    if (character.locked) {
      return;
    }
    const size = Math.max(250, Math.min(360, Math.floor(board.clientWidth || 330)));

    void import("hanzi-writer").then(({ default: HanziWriterClass }) => {
      if (canceled || !boardRef.current) return;
      const writer = HanziWriterClass.create(boardRef.current, character.hanzi, {
        width: size,
        height: size,
        padding: Math.round(size * .09),
        showCharacter: false,
        showOutline: mode !== "quiz",
        strokeColor: "#153f38",
        radicalColor: "#ff6d55",
        outlineColor: mode === "trace" ? "#efc9c3" : "#d8e4df",
        highlightColor: "#ff6d55",
        drawingColor: "#ff6d55",
        drawingWidth: 8,
      });
      writerRef.current = writer;
      if (mode === "watch") {
        setStatus("Quan sát thứ tự từng nét.");
        void writer.animateCharacter();
      } else {
        setStatus(mode === "trace" ? "Tô theo nét mờ để ghi nhớ bút thuận." : "Tự viết từ trí nhớ; hệ thống sẽ gợi ý khi cần.");
        void writer.quiz({
          leniency: mode === "trace" ? 1.35 : .95,
          showHintAfterMisses: mode === "trace" ? 1 : 3,
          onCorrectStroke: ({ strokesRemaining }) => setStatus(strokesRemaining ? `Đúng rồi, còn ${strokesRemaining} nét.` : "Hoàn thành chữ!"),
          onMistake: () => setStatus("Nét này chưa đúng, thử lại từ điểm bắt đầu nhé."),
          onComplete: () => {
            setStatus("Hoàn thành! Chữ này đã được lưu vào tiến độ.");
            onComplete(character.id);
          },
        });
      }
    }).catch(() => setStatus("Chưa thể tải bàn viết. Hãy thử lại sau."));

    return () => {
      canceled = true;
      writerRef.current?.cancelQuiz();
      writerRef.current?.pauseAnimation();
      writerRef.current = null;
      board.replaceChildren();
    };
  }, [character.hanzi, character.id, character.locked, mode, onComplete, version]);

  const chooseCharacter = (next: number) => {
    const nextCharacter = lesson.writingCharacters[next];
    if (nextCharacter?.locked) {
      setUpgradeTarget({ kind: "Chữ Hán", title: nextCharacter.word || `Chữ ${next + 1}` });
      return;
    }
    setIndex(next);
    setMode("watch");
    setVersion((current) => current + 1);
  };

  return <section className="hsk-guided-writing">
    <span className="hsk-guided-kicker">Luyện viết</span>
    <h1>Luyện viết chữ Hán</h1>
    <div className="hsk-guided-writing-picker" aria-label="Chọn từ luyện viết">{lesson.writingCharacters.map((item, itemIndex) => <button aria-label={item.locked ? `Chữ ${itemIndex + 1} yêu cầu VIP` : undefined} aria-pressed={itemIndex === index} className={item.locked ? "is-locked" : ""} key={item.id} onClick={() => chooseCharacter(itemIndex)} type="button">{item.locked ? <LockKeyhole aria-hidden="true" size={20} /> : <span lang="zh-CN">{item.hanzi}</span>}<small>{itemIndex + 1}/{lesson.writingCharacters.length}</small></button>)}</div>
    <VipUpgradeDialog closeHref={getHskCurriculumHref(lesson.levelId)} onExit={onExit} onClose={() => setUpgradeTarget(null)} open={upgradeTarget !== null} target={upgradeTarget} />
    {character.locked ? <VipContentGate
      onExit={onExit}
      closeHref={getHskCurriculumHref(lesson.levelId)}
      key={character.id}
      title="Mở khóa chữ Hán này"
    /> : <div className="hsk-guided-writing-layout">
      <div>
        <div aria-label="Chế độ luyện viết" className="hsk-guided-writing-modes" role="group">
          {([ ["watch", "Xem"], ["trace", "Tô lại"], ["quiz", "Kiểm tra"] ] as Array<[WritingMode, string]>).map(([value, label]) => <button aria-pressed={mode === value} key={value} onClick={() => { setMode(value); setVersion((current) => current + 1); }} type="button">{label}</button>)}
        </div>
        <div className="hsk-guided-writing-board"><span aria-hidden="true" /><span aria-hidden="true" /><div aria-label={`Khu vực viết chữ ${character.hanzi}`} ref={boardRef} role="img" /></div>
        <p aria-live="polite">{status}</p>
      </div>
      <aside><strong lang="zh-CN">{character.hanzi}</strong><div><b>{character.pinyin}</b><button aria-label={`Phát âm ${character.hanzi}`} onClick={() => speak(character.hanzi)} type="button"><Volume2 aria-hidden="true" size={19} /></button></div><p>Từ “{character.word}” · {character.meaning}</p><button onClick={() => setVersion((current) => current + 1)} type="button"><RotateCcw aria-hidden="true" size={17} /> {mode === "watch" ? "Phát lại" : "Viết lại"}</button></aside>
    </div>}
  </section>;
}

function GuidedPractice({ closeHref, exercise, showPinyin, speak, onExit }: { closeHref: string; exercise: HskExercise; showPinyin: boolean; speak: GuidedSpeak; onExit: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const correctAudioRef = useRef<HTMLAudioElement>(null);
  if (exercise.locked) return <VipContentGate
    onExit={onExit}
    closeHref={closeHref}
    key={exercise.id}
    title="Mở khóa câu hỏi này"
  />;
  const scored = exercise.answer !== null;
  const correct = scored && selected === exercise.answer;
  const selectAnswer = (option: string) => {
    if (selected !== null) return;
    setSelected(option);
    if (scored && option === exercise.answer) {
      const audio = correctAudioRef.current;
      if (audio) {
        audio.currentTime = 0;
        void audio.play().catch(() => undefined);
      }
    }
  };
  return <section className="hsk-guided-practice">
    <audio ref={correctAudioRef} src="/audio/feedback/typing-correct-trimmed.mp3" preload="auto" />
    <span className="hsk-guided-kicker">Luyện tập nhanh</span>
    <h1>{exercise.instruction}</h1>
    {exercise.type === "listening" ? <button className="hsk-guided-listen" onClick={() => speak(exercise.speakText ?? exercise.answer ?? "")} type="button"><Headphones aria-hidden="true" size={32} /><span>Nghe lại</span></button> : <><div className={`hsk-guided-practice-prompt${exercise.pinyin ? " has-pinyin" : ""}`}><span lang="zh-CN">{exercise.prompt}</span><button aria-label={`Phát âm ${exercise.prompt}`} onClick={() => speak(exercise.speakText ?? exercise.prompt)} type="button"><Volume2 aria-hidden="true" size={25} /></button></div>{showPinyin && exercise.pinyin ? <p className="hsk-guided-practice-pinyin">{exercise.pinyin}</p> : null}</>}
    <div className="hsk-guided-practice-options">{exercise.options.map((option, index) => {
      const state = scored && selected ? option === exercise.answer ? " is-correct" : option === selected ? " is-wrong" : "" : selected === option ? " is-selected" : "";
      return <button className={state} disabled={selected !== null} key={option} onClick={() => selectAnswer(option)} type="button"><span className="hsk-guided-practice-letter">{String.fromCharCode(65 + index)}</span><span className="hsk-guided-practice-answer">{option}</span>{state === " is-correct" ? <Check aria-hidden="true" size={18} /> : null}</button>;
    })}</div>
    {selected && scored ? <p className={`hsk-guided-practice-feedback ${correct ? "is-correct" : "is-wrong"}`} role="status">{correct ? "Chính xác! Bạn đã nắm được từ này." : `Chưa đúng. Đáp án là “${exercise.answer}”.`}</p> : null}
    {!scored ? <p className="hsk-guided-practice-note">Tự chọn phương án phù hợp. Nguồn hiện không có đáp án nên hệ thống không chấm đúng sai.</p> : null}
  </section>;
}

function GuidedCompletion({ lesson, exerciseCount, nextLessonHref }: { lesson: HskLessonContent; exerciseCount: number; nextLessonHref: string | null }) {
  const completionAudioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const audio = completionAudioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
    return () => { audio.pause(); };
  }, []);
  const courseHref = getHskCurriculumHref(lesson.levelId);
  const continueHref = nextLessonHref ? `${nextLessonHref}?from=completion` : courseHref;
  const followCompletionLink = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    window.location.assign(href);
  };

  return <section className="hsk-guided-completion">
    <audio ref={completionAudioRef} src="/audio/feedback/lesson-complete-trimmed.mp3" preload="auto" />
    <Link aria-label="Đóng thông báo hoàn thành" className="hsk-guided-completion-close" href={courseHref}><X aria-hidden="true" size={30} /></Link>
    <Image alt="Cúp hoàn thành bài học" className="hsk-guided-completion-trophy" height={300} priority src="/assets/hsk/hsk-completion-trophy.png" unoptimized width={300} />
    <span className="hsk-guided-completion-badge"><Trophy aria-hidden="true" size={20} /> Hoàn thành</span>
    <h1>Hoàn thành <em>bài học!</em></h1>
    <p>Bạn vừa học xong <strong>Bài {lesson.lessonNumber}: {lesson.title}</strong>! <Sparkles aria-hidden="true" size={18} /></p>
    <div className="hsk-guided-completion-stats">
      <article><span><BookOpen aria-hidden="true" size={31} /></span><strong>{lesson.vocabulary.length}</strong><small>từ vựng</small></article>
      <article><span><Target aria-hidden="true" size={31} /></span><strong>{exerciseCount}</strong><small>bài tập</small></article>
      <article><span><PenLine aria-hidden="true" size={31} /></span><strong>{lesson.writingCharacters.length}</strong><small>từ luyện viết</small></article>
    </div>
    <nav><Link href={courseHref} onClick={(event) => followCompletionLink(event, courseHref)}><List aria-hidden="true" size={22} />Danh sách bài học</Link><Link href={continueHref} onClick={(event) => followCompletionLink(event, continueHref)}>{nextLessonHref ? "Bài tiếp theo" : "Về lộ trình"}<ArrowRight aria-hidden="true" size={23} /></Link></nav>
  </section>;
}

export function HskGuidedLesson({ lesson, nextLessonHref = null, authenticated = false }: { lesson: HskLessonContent; nextLessonHref?: string | null; authenticated?: boolean }) {
  const exercises = useMemo(() => buildHskGuidedExercises(lesson), [lesson]);
  const steps = useMemo(() => buildHskGuidedLessonSteps(lesson), [lesson]);
  const navigationSections = useMemo(() => buildHskGuidedNavigationSections(lesson), [lesson]);
  const [currentStep, setCurrentStep] = useState(0);
  const [completionOpen, setCompletionOpen] = useState(false);
  const [wordSaveStatuses, setWordSaveStatuses] = useState<Record<string, VocabularySaveStatus>>({});
  const [, setProgress] = useState<HskLessonProgress>(EMPTY_HSK_LESSON_PROGRESS);
  const progressRef = useRef<HskLessonProgress>(EMPTY_HSK_LESSON_PROGRESS);
  const step = steps[currentStep];
  const courseHref = getHskCurriculumHref(lesson.levelId);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      try {
        const saved = parseHskLessonProgress(window.localStorage.getItem(getHskLessonProgressStorageKey(lesson.id)), lesson);
        progressRef.current = saved;
        setProgress(saved);
        recordRecentHskLesson(lesson, saved);
        if (saved.guidedStep >= 0) setCurrentStep(Math.min(saved.guidedStep, steps.length - 1));
      } catch {
        progressRef.current = EMPTY_HSK_LESSON_PROGRESS;
        setProgress(EMPTY_HSK_LESSON_PROGRESS);
      }
    }, 0);
    return () => window.clearTimeout(handle);
  }, [lesson, steps.length]);

  const commit = useCallback((updates: Partial<HskLessonProgress> | ((current: HskLessonProgress) => Partial<HskLessonProgress>)) => {
    const current = progressRef.current;
    const patch = typeof updates === "function" ? updates(current) : updates;
    const next = { ...current, ...patch };
    progressRef.current = next;
    setProgress(next);
    return next;
  }, []);

  const goToStep = useCallback((next: number) => {
    if (next >= steps.length && currentStep === steps.length - 1 && step.kind === "practice") {
      const nextProgress = commit({ guidedStep: currentStep, guidedCompleted: true });
      saveProgress(lesson, nextProgress);
      setCompletionOpen(true);
      window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      return;
    }
    const clamped = Math.max(0, Math.min(steps.length - 1, next));
    setCompletionOpen(false);
    setCurrentStep(clamped);
    commit({ guidedStep: clamped });
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [commit, currentStep, lesson, step.kind, steps.length]);

  const persistCurrentProgress = useCallback(() => {
    const nextProgress = commit((current) => ({
      guidedStep: currentStep,
      guidedCompleted: current.guidedCompleted,
    }));
    saveProgress(lesson, nextProgress);
  }, [commit, currentStep, lesson]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("button, a, input, textarea, select")) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); goToStep(currentStep - 1); }
      if (event.key === "ArrowRight") { event.preventDefault(); goToStep(currentStep + 1); }
      if (event.key === "Enter") { event.preventDefault(); goToStep(currentStep + 1); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentStep, goToStep]);

  useEffect(() => () => cancelHskPronunciation(), []);

  const speak = useCallback((text: string, audio?: HskVocabularyAudio) => {
    void playHskPronunciation({ audio, rate: 1, text });
  }, []);

  const completeWriting = useCallback((writingId: string) => {
    commit((current) => ({ writing: current.writing.includes(writingId) ? current.writing : [...current.writing, writingId] }));
  }, [commit]);

  const saveVocabularyWord = useCallback(async (word: HskVocabularyItem) => {
    if (!authenticated || ["saving", "saved"].includes(wordSaveStatuses[word.id] ?? "idle")) return;
    setWordSaveStatuses((current) => ({ ...current, [word.id]: "saving" }));
    const saved = await trySaveHskVocabularyWord(lesson, word);
    setWordSaveStatuses((current) => ({ ...current, [word.id]: saved ? "saved" : "error" }));
  }, [authenticated, lesson, wordSaveStatuses]);

  let content = null;
  if (step.kind === "vocabulary") content = lesson.vocabulary.length
    ? <GuidedVocabulary authenticated={authenticated} itemIndex={step.itemIndex ?? 0} key={lesson.vocabulary[step.itemIndex ?? 0]?.id} lesson={lesson} onExit={persistCurrentProgress} onSave={saveVocabularyWord} saveStatus={wordSaveStatuses[lesson.vocabulary[step.itemIndex ?? 0]?.id] ?? "idle"} showPinyin speak={speak} />
    : <GuidedUnavailableSection kind="vocabulary" />;
  if (step.kind === "writing") content = lesson.writingCharacters.length
    ? <GuidedWriting lesson={lesson} onComplete={completeWriting} onExit={persistCurrentProgress} speak={speak} />
    : <GuidedUnavailableSection kind="writing" />;
  if (completionOpen) {
    content = <GuidedCompletion exerciseCount={exercises.length} lesson={lesson} nextLessonHref={nextLessonHref} />;
  } else if (step.kind === "practice") {
    const exercise = exercises[step.itemIndex ?? 0];
    content = <GuidedPractice closeHref={courseHref} exercise={exercise} key={exercise.id} onExit={persistCurrentProgress} showPinyin speak={speak} />;
  }

  return <div className={`hsk-guided-page${completionOpen ? " is-complete" : ""}`}>
    {!completionOpen ? <header className="hsk-guided-header">
      <div className="hsk-guided-toolbar">
        <Link aria-label="Thoát bài học" href={courseHref} onClick={persistCurrentProgress}><X aria-hidden="true" size={22} /></Link>
        <div aria-label={`Bước ${currentStep + 1} trên ${steps.length}`} aria-valuemax={steps.length} aria-valuemin={1} aria-valuenow={currentStep + 1} className="hsk-guided-progress" role="progressbar"><span style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} /></div>
        <strong>{currentStep + 1} / {steps.length}</strong>
      </div>
      <nav aria-label="Các chặng trong bài học" className="hsk-guided-sections">
        {navigationSections.map((section) => {
            const Icon = SECTION_ICONS[section.id];
            return <button aria-current={step.kind === section.id ? "step" : undefined} className={step.kind === section.id ? "is-active" : ""} key={section.id} onClick={() => goToStep(section.start)} type="button"><Icon aria-hidden="true" size={17} /><span>{section.label}</span>{section.count ? <b>{section.count}</b> : null}</button>;
          })}
      </nav>
    </header> : null}

    <main className={`hsk-guided-main is-${completionOpen ? "complete" : step.kind}`}>{content}</main>

    {!completionOpen ? <footer className="hsk-guided-footer">
      <button disabled={currentStep === 0} onClick={() => goToStep(currentStep - 1)} type="button"><ArrowLeft aria-hidden="true" size={19} /><span>Trước</span></button>
      <span><strong>Bước {currentStep + 1} / {steps.length}</strong><small>Nhấn <kbd>Enter ↵</kbd> để tiếp tục</small></span>
      <button className="is-primary" onClick={() => goToStep(currentStep + 1)} type="button"><span><span>Tiếp</span><span> tục</span></span><ArrowRight aria-hidden="true" size={19} /></button>
    </footer> : null}
  </div>;
}
