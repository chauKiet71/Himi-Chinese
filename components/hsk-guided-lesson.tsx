"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type HanziWriter from "hanzi-writer";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  GraduationCap,
  Headphones,
  Lightbulb,
  LockKeyhole,
  LoaderCircle,
  PenLine,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  Volume2,
  X,
} from "lucide-react";
import type { HskExercise, HskLessonContent, HskVocabularyAudio, HskVocabularyItem } from "@/lib/hsk-lesson-content";
import { cancelHskPronunciation, playHskPronunciation } from "@/lib/hsk-audio";
import { VipUpgradeInlineForm } from "@/components/vip-upgrade-prompt";
import { buildHskGuidedExercises, buildHskGuidedLessonSteps, buildHskGuidedNavigationSections, buildHskGuidedSections, type HskGuidedStepKind } from "@/lib/hsk-guided-lesson";
import {
  EMPTY_HSK_LESSON_PROGRESS,
  getHskLessonProgressStorageKey,
  parseHskLessonProgress,
  type HskLessonProgress,
} from "@/lib/hsk-lesson-progress";
import { trySaveHskVocabularyWord } from "@/lib/saved-vocabulary-client";

type SpeechRate = 0.75 | 1 | 1.25;
type WritingMode = "watch" | "trace" | "quiz";
type VocabularySaveStatus = "idle" | "saving" | "saved" | "error";
type GuidedSpeak = (text: string, audio?: HskVocabularyAudio) => void;

const SECTION_ICONS = {
  introduction: BookOpen,
  vocabulary: Sparkles,
  grammar: GraduationCap,
  writing: PenLine,
  practice: Target,
  complete: Trophy,
} satisfies Record<HskGuidedStepKind, typeof BookOpen>;

function saveProgress(lessonId: string, progress: HskLessonProgress) {
  try {
    window.localStorage.setItem(getHskLessonProgressStorageKey(lessonId), JSON.stringify(progress));
  } catch {
    // The guided lesson stays usable when browser storage is unavailable.
  }
}

function GuidedIntroduction({ lesson, exerciseCount }: { lesson: HskLessonContent; exerciseCount: number }) {
  const stats = [
    lesson.vocabulary.length ? { icon: BookOpen, value: lesson.vocabulary.length, label: "từ vựng" } : null,
    lesson.grammar.length ? { icon: GraduationCap, value: lesson.grammar.length, label: "ngữ pháp" } : null,
    exerciseCount ? { icon: Target, value: exerciseCount, label: "bài tập" } : null,
    { icon: Target, value: `~${lesson.minutes}`, label: "phút học" },
  ].filter((item): item is NonNullable<typeof item> => item !== null);
  return <section className="hsk-guided-introduction">
    <span className="hsk-guided-kicker">Bài {lesson.lessonNumber} · {lesson.levelLabel}</span>
    <div className="hsk-guided-hero-character" lang="zh-CN">{lesson.greeting}</div>
    <h1>{lesson.title}</h1>
    <p>{lesson.summary}</p>
    <div className="hsk-guided-stats">
      {stats.map((stat) => { const Icon = stat.icon; return <div key={stat.label}><Icon aria-hidden="true" size={20} /><strong>{stat.value}</strong><span>{stat.label}</span></div>; })}
    </div>
    <p className="hsk-guided-tip"><Sparkles aria-hidden="true" size={16} /> Dùng phím mũi tên để chuyển nhanh giữa các bước.</p>
  </section>;
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

function VocabularyStrokeOrder({ hanzi, onStrokeCount }: { hanzi: string; onStrokeCount: (count: number | null) => void }) {
  const stageRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    let canceled = false;
    const character = Array.from(hanzi)[0];
    const targets = stageRefs.current.slice(0, 5);
    targets.forEach((target) => target?.replaceChildren());
    if (!character) return;

    void import("hanzi-writer").then(async ({ default: HanziWriterClass }) => {
      const characterData = await HanziWriterClass.loadCharacterData(character);
      if (canceled || !characterData) return;
      const totalStrokes = characterData.strokes.length;
      onStrokeCount(totalStrokes);

      targets.forEach((target, index) => {
        if (!target) return;
        const isComplete = index === targets.length - 1;
        const visibleStrokes = Math.max(1, Math.min(totalStrokes - 1, Math.round(totalStrokes * ((index + 1) / targets.length))));
        const writer = HanziWriterClass.create(target, character, {
          width: 88,
          height: 88,
          padding: 13,
          renderer: "canvas",
          showCharacter: isComplete,
          showOutline: false,
          strokeColor: isComplete ? "#ff4f35" : "#91a1bc",
          charDataLoader: (_requestedCharacter, onComplete) => onComplete(characterData),
        });
        if (!isComplete && totalStrokes > 1) {
          void writer.quiz({
            quizStartStrokeNum: visibleStrokes,
            showHintAfterMisses: false,
            highlightOnComplete: false,
          });
        }
      });
    }).catch(() => onStrokeCount(null));

    return () => {
      canceled = true;
      targets.forEach((target) => target?.replaceChildren());
    };
  }, [hanzi, onStrokeCount]);

  return <div aria-label={`Thứ tự các nét viết chữ ${hanzi}`} className="hsk-guided-stroke-strip" role="img">
    {Array.from({ length: 5 }, (_, index) => <div aria-hidden="true" key={index} ref={(node) => { stageRefs.current[index] = node; }} />)}
  </div>;
}

function GuidedVocabulary({ lesson, itemIndex, showPinyin, speak, onShowWriting, authenticated, saveStatus, onSave }: {
  lesson: HskLessonContent;
  itemIndex: number;
  showPinyin: boolean;
  speak: GuidedSpeak;
  onShowWriting: () => void;
  authenticated: boolean;
  saveStatus: VocabularySaveStatus;
  onSave: (word: HskVocabularyItem) => void;
}) {
  const word = lesson.vocabulary[itemIndex];
  const details = getVocabularyDetail(word);
  const [strokeCount, setStrokeCount] = useState<number | null>(details.totalStrokes ?? null);
  if (word.locked) return <section className="hsk-guided-practice is-locked">
    <span className="hsk-guided-kicker">Từ vựng VIP · {String(itemIndex + 1).padStart(2, "0")}/{lesson.vocabulary.length}</span>
    <LockKeyhole aria-hidden="true" size={42} />
    <h1>Từ vựng này dành cho thành viên VIP</h1>
    <p>Nội dung từ, pinyin, nghĩa và ví dụ chưa được gửi tới trình duyệt.</p>
    <VipUpgradeInlineForm />
  </section>;
  return <section className="hsk-guided-vocabulary">
    <span className="hsk-guided-kicker">Từ mới · {String(itemIndex + 1).padStart(2, "0")} / {lesson.vocabulary.length}</span>
    <div className="hsk-guided-word-heading">
      <div className="hsk-guided-word-glyph">
        <strong lang="zh-CN">{word.hanzi}</strong>
        {showPinyin ? <span>{word.pinyin}</span> : null}
      </div>
      <button aria-label={`Phát âm ${word.hanzi}`} className="hsk-guided-audio" onClick={() => speak(word.hanzi, word.audio)} type="button"><Volume2 aria-hidden="true" size={31} /></button>
    </div>
    <div className="hsk-guided-word-meta">
      <span className="hsk-guided-word-class">{word.wordClass}</span>
      {authenticated
        ? <button aria-pressed={saveStatus === "saved"} className={`hsk-guided-save-word is-${saveStatus}`} disabled={saveStatus === "saving" || saveStatus === "saved"} onClick={() => onSave(word)} type="button">
          {saveStatus === "saving" ? <LoaderCircle aria-hidden="true" className="hsk-guided-save-spinner" size={17} /> : saveStatus === "saved" ? <Check aria-hidden="true" size={17} /> : <Bookmark aria-hidden="true" size={17} />}
          {saveStatus === "saving" ? "Đang lưu…" : saveStatus === "saved" ? "Đã lưu" : saveStatus === "error" ? "Thử lưu lại" : "Lưu từ"}
        </button>
        : <Link aria-label={`Đăng nhập để lưu từ ${word.hanzi}`} className="hsk-guided-save-word is-idle" href={`/login?returnTo=${encodeURIComponent(`/hsk/${lesson.levelId.replace(/^hsk-/, "")}/${lesson.id}/play`)}`}><Bookmark aria-hidden="true" size={17} /> Lưu từ</Link>}
    </div>
    {saveStatus === "error" ? <p className="hsk-guided-save-error" role="alert">Chưa thể lưu từ. Hãy thử lại.</p> : null}

    <div className="hsk-guided-word-grid">
      <div className="hsk-guided-word-column">
        <article className="hsk-guided-meaning-card">
          <div className="hsk-guided-card-title"><small>Nghĩa của từ</small><span>{details.frequency}</span></div>
          <h2>{word.meaning}</h2>
          <p>{details.description}</p>
        </article>
        <article className="hsk-guided-example-card">
          <div className="hsk-guided-card-title"><small>Ví dụ ngữ cảnh</small><button aria-label="Phát âm câu ví dụ" onClick={() => speak(word.example)} type="button"><Volume2 aria-hidden="true" size={18} /></button></div>
          <div className="hsk-guided-example">
            <strong lang="zh-CN">{word.example}</strong>
            {showPinyin ? <b>{word.examplePinyin}</b> : null}
            <p>{details.exampleTranslation ?? word.translation}</p>
          </div>
          <div className="hsk-guided-collocations"><small>Cụm hay gặp:</small><div>{details.collocations.map((item) => <span key={`${word.id}-${item.hanzi}`}><strong lang="zh-CN">{item.hanzi}</strong> ({item.pinyin} - {item.translation})</span>)}</div></div>
        </article>
      </div>
      <aside className="hsk-guided-structure-card">
        <div className="hsk-guided-structure-heading"><small>Bộ thủ &amp; cấu tạo Hán tự</small><span>{strokeCount ? `Tổng ${strokeCount} nét` : "Cấu tạo chữ"}</span></div>
        <div className="hsk-guided-radicals">
          {details.radicals.map((radical) => <div className="hsk-guided-radical" key={`${word.id}-${radical.glyph}`}>
            <strong lang="zh-CN">{radical.glyph}</strong>
            <div><b>{radical.name}</b><span>{radical.pronunciation}</span></div>
          </div>)}
        </div>
        <div className="hsk-guided-memory-tip"><span><Lightbulb aria-hidden="true" size={22} /></span><div><div><b>Mẹo ghi nhớ siêu tốc</b><small>1 nét liên kết</small></div><p>{details.memory}</p></div></div>
        <div className="hsk-guided-stroke-heading"><small>Thứ tự các nét viết</small><button onClick={onShowWriting} type="button">Xem hoạt họa nét</button></div>
        <VocabularyStrokeOrder hanzi={word.hanzi} onStrokeCount={setStrokeCount} />
        <div className="hsk-guided-structure-footer"><span>Sẵn sàng cho phần Luyện Viết</span><b>{lesson.levelLabel}</b></div>
      </aside>
    </div>
  </section>;
}

function GuidedGrammar({ lesson, itemIndex, showPinyin, speak }: {
  lesson: HskLessonContent;
  itemIndex: number;
  showPinyin: boolean;
  speak: GuidedSpeak;
}) {
  const point = lesson.grammar[itemIndex];
  return <section className="hsk-guided-grammar">
    <span className="hsk-guided-kicker">Điểm ngữ pháp · {itemIndex + 1}/{lesson.grammar.length}</span>
    <h1>{point.title}</h1>
    <code>{point.formula}</code>
    <p>{point.explanation}</p>
    <div className="hsk-guided-grammar-examples">
      {point.examples.map((example) => <article key={example.hanzi}>
        <button aria-label={`Phát âm ${example.hanzi}`} onClick={() => speak(example.hanzi)} type="button"><Volume2 aria-hidden="true" size={19} /></button>
        <strong lang="zh-CN">{example.hanzi}</strong>
        {showPinyin ? <span>{example.pinyin}</span> : null}
        <p>{example.translation}</p>
      </article>)}
    </div>
  </section>;
}

function GuidedWriting({ lesson, speak, onComplete }: {
  lesson: HskLessonContent;
  speak: GuidedSpeak;
  onComplete: (writingId: string) => void;
}) {
  const boardRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<WritingMode>("watch");
  const [version, setVersion] = useState(0);
  const [status, setStatus] = useState("Quan sát thứ tự từng nét.");
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
    setIndex(next);
    setMode("watch");
    setVersion((current) => current + 1);
  };

  return <section className="hsk-guided-writing">
    <span className="hsk-guided-kicker">Luyện viết</span>
    <h1>Luyện viết chữ Hán</h1>
    <div className="hsk-guided-writing-picker" aria-label="Chọn từ luyện viết">{lesson.writingCharacters.map((item, itemIndex) => <button aria-label={item.locked ? `Chữ ${itemIndex + 1} yêu cầu VIP` : undefined} aria-pressed={itemIndex === index} className={item.locked ? "is-locked" : ""} key={item.id} onClick={() => chooseCharacter(itemIndex)} type="button">{item.locked ? <LockKeyhole aria-hidden="true" size={20} /> : <span lang="zh-CN">{item.hanzi}</span>}<small>{itemIndex + 1}/{lesson.writingCharacters.length}</small></button>)}</div>
    {character.locked ? <div className="hsk-guided-writing-locked hsk-guided-practice is-locked">
      <LockKeyhole aria-hidden="true" size={42} />
      <h2>Chữ Hán này dành cho thành viên VIP</h2>
      <p>Nội dung chữ, pinyin và dữ liệu luyện nét chưa được gửi tới trình duyệt.</p>
      <VipUpgradeInlineForm />
    </div> : <div className="hsk-guided-writing-layout">
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

function GuidedPractice({ exercise, showPinyin, speak }: { exercise: HskExercise; showPinyin: boolean; speak: GuidedSpeak }) {
  const [selected, setSelected] = useState<string | null>(null);
  if (exercise.locked) return <section className="hsk-guided-practice is-locked">
    <span className="hsk-guided-kicker">Luyện tập VIP</span>
    <LockKeyhole aria-hidden="true" size={42} />
    <h1>Câu hỏi này dành cho thành viên VIP</h1>
    <p>Nội dung, lựa chọn và đáp án không được gửi xuống trình duyệt khi tài khoản chưa có quyền.</p>
    <VipUpgradeInlineForm />
  </section>;
  const scored = exercise.answer !== null;
  const correct = scored && selected === exercise.answer;
  return <section className="hsk-guided-practice">
    <span className="hsk-guided-kicker">Luyện tập nhanh</span>
    <h1>{exercise.instruction}</h1>
    {exercise.type === "listening" ? <button className="hsk-guided-listen" onClick={() => speak(exercise.speakText ?? exercise.answer ?? "")} type="button"><Headphones aria-hidden="true" size={32} /><span>Nghe lại</span></button> : <><div className={`hsk-guided-practice-prompt${exercise.pinyin ? " has-pinyin" : ""}`} lang="zh-CN">{exercise.prompt}</div>{showPinyin && exercise.pinyin ? <p>{exercise.pinyin}</p> : null}</>}
    <div className="hsk-guided-practice-options">{exercise.options.map((option, index) => {
      const state = scored && selected ? option === exercise.answer ? " is-correct" : option === selected ? " is-wrong" : "" : selected === option ? " is-selected" : "";
      return <button className={state} key={option} onClick={() => setSelected(option)} type="button"><b>{String.fromCharCode(65 + index)}</b><span>{option}</span>{state === " is-correct" ? <Check aria-hidden="true" size={18} /> : null}</button>;
    })}</div>
    {selected && scored ? <p className={`hsk-guided-practice-feedback ${correct ? "is-correct" : "is-wrong"}`} role="status">{correct ? "Chính xác! Bạn đã nắm được từ này." : `Chưa đúng. Đáp án là “${exercise.answer}”.`}</p> : null}
    {!scored ? <p className="hsk-guided-practice-note">Tự chọn phương án phù hợp. Nguồn hiện không có đáp án nên hệ thống không chấm đúng sai.</p> : null}
  </section>;
}

function GuidedCompletion({ lesson, exerciseCount }: { lesson: HskLessonContent; exerciseCount: number }) {
  const baseHref = `/hsk/${lesson.levelId.replace(/^hsk-/, "")}/${lesson.id}`;
  return <section className="hsk-guided-completion">
    <span><Trophy aria-hidden="true" size={34} /></span>
    <small>Hoàn thành</small>
    <h1>Hoàn thành bài học!</h1>
    <p>Bạn vừa học xong <strong>Bài {lesson.lessonNumber}: {lesson.title}</strong>.</p>
    <div>{lesson.vocabulary.length ? <article><strong>{lesson.vocabulary.length}</strong><span>từ vựng</span></article> : null}{lesson.grammar.length ? <article><strong>{lesson.grammar.length}</strong><span>điểm ngữ pháp</span></article> : null}{exerciseCount ? <article><strong>{exerciseCount}</strong><span>bài tập</span></article> : null}{lesson.writingCharacters.length ? <article><strong>{lesson.writingCharacters.length}</strong><span>từ luyện viết</span></article> : null}</div>
    <nav><Link href="/courses?view=hsk">Danh sách bài học</Link>{lesson.vocabulary.length ? <Link href={`${baseHref}/flashcard`}>Ôn tập Flashcard</Link> : <Link href={baseHref}>Xem lại bài học</Link>}</nav>
  </section>;
}

export function HskGuidedLesson({ lesson, authenticated = false }: { lesson: HskLessonContent; authenticated?: boolean }) {
  const exercises = useMemo(() => buildHskGuidedExercises(lesson), [lesson]);
  const steps = useMemo(() => buildHskGuidedLessonSteps(lesson), [lesson]);
  const sections = useMemo(() => buildHskGuidedSections(lesson), [lesson]);
  const navigationSections = useMemo(() => buildHskGuidedNavigationSections(lesson), [lesson]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPinyin, setShowPinyin] = useState(true);
  const [rate, setRate] = useState<SpeechRate>(1);
  const [wordSaveStatuses, setWordSaveStatuses] = useState<Record<string, VocabularySaveStatus>>({});
  const [, setProgress] = useState<HskLessonProgress>(EMPTY_HSK_LESSON_PROGRESS);
  const step = steps[currentStep];

  useEffect(() => {
    const handle = window.setTimeout(() => {
      try {
        const saved = parseHskLessonProgress(window.localStorage.getItem(getHskLessonProgressStorageKey(lesson.id)));
        setProgress(saved);
        if (saved.guidedStep >= 0) setCurrentStep(Math.min(saved.guidedStep, steps.length - 1));
      } catch {
        setProgress(EMPTY_HSK_LESSON_PROGRESS);
      }
    }, 0);
    return () => window.clearTimeout(handle);
  }, [lesson.id, steps.length]);

  const commit = useCallback((updates: Partial<HskLessonProgress> | ((current: HskLessonProgress) => Partial<HskLessonProgress>)) => {
    setProgress((current) => {
      const patch = typeof updates === "function" ? updates(current) : updates;
      const next = { ...current, ...patch };
      saveProgress(lesson.id, next);
      return next;
    });
  }, [lesson.id]);

  const goToStep = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, next));
    setCurrentStep(clamped);
    commit((current) => ({ guidedStep: clamped, guidedCompleted: clamped === steps.length - 1 || current.guidedCompleted }));
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [commit, steps.length]);

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
    void playHskPronunciation({ audio, rate, text });
  }, [rate]);

  const completeWriting = useCallback((writingId: string) => {
    commit((current) => ({ writing: current.writing.includes(writingId) ? current.writing : [...current.writing, writingId] }));
  }, [commit]);

  const saveVocabularyWord = useCallback(async (word: HskVocabularyItem) => {
    if (!authenticated || ["saving", "saved"].includes(wordSaveStatuses[word.id] ?? "idle")) return;
    setWordSaveStatuses((current) => ({ ...current, [word.id]: "saving" }));
    const saved = await trySaveHskVocabularyWord(lesson, word);
    setWordSaveStatuses((current) => ({ ...current, [word.id]: saved ? "saved" : "error" }));
  }, [authenticated, lesson, wordSaveStatuses]);

  let content = <GuidedIntroduction exerciseCount={exercises.length} lesson={lesson} />;
  if (step.kind === "vocabulary") content = lesson.vocabulary.length
    ? <GuidedVocabulary authenticated={authenticated} itemIndex={step.itemIndex ?? 0} key={lesson.vocabulary[step.itemIndex ?? 0]?.id} lesson={lesson} onSave={saveVocabularyWord} onShowWriting={() => goToStep(sections.find((section) => section.id === "writing")?.start ?? currentStep)} saveStatus={wordSaveStatuses[lesson.vocabulary[step.itemIndex ?? 0]?.id] ?? "idle"} showPinyin={showPinyin} speak={speak} />
    : <GuidedUnavailableSection kind="vocabulary" />;
  if (step.kind === "grammar") content = <GuidedGrammar itemIndex={step.itemIndex ?? 0} lesson={lesson} showPinyin={showPinyin} speak={speak} />;
  if (step.kind === "writing") content = lesson.writingCharacters.length
    ? <GuidedWriting lesson={lesson} onComplete={completeWriting} speak={speak} />
    : <GuidedUnavailableSection kind="writing" />;
  if (step.kind === "practice") {
    const exercise = exercises[step.itemIndex ?? 0];
    content = <GuidedPractice exercise={exercise} key={exercise.id} showPinyin={showPinyin} speak={speak} />;
  }
  if (step.kind === "complete") content = <GuidedCompletion exerciseCount={exercises.length} lesson={lesson} />;

  return <div className="hsk-guided-page">
    <header className="hsk-guided-header">
      <div className="hsk-guided-toolbar">
        <Link aria-label="Thoát bài học" href="/courses?view=hsk"><X aria-hidden="true" size={22} /></Link>
        <div aria-label={`Bước ${currentStep + 1} trên ${steps.length}`} aria-valuemax={steps.length} aria-valuemin={1} aria-valuenow={currentStep + 1} className="hsk-guided-progress" role="progressbar"><span style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} /></div>
        <strong>{currentStep + 1} / {steps.length}</strong>
        <button aria-label={showPinyin ? "Ẩn pinyin" : "Hiện pinyin"} aria-pressed={showPinyin} className="hsk-guided-pinyin" onClick={() => setShowPinyin((current) => !current)} type="button"><b aria-hidden="true">pīn</b></button>
        <div aria-label="Tốc độ phát" className="hsk-guided-speed" role="group">{([0.75, 1, 1.25] as SpeechRate[]).map((value) => <button aria-pressed={rate === value} key={value} onClick={() => setRate(value)} type="button">{value}×</button>)}</div>
      </div>
      <nav aria-label="Các chặng trong bài học" className="hsk-guided-sections">
        {navigationSections.map((section) => {
            const Icon = SECTION_ICONS[section.id];
            return <button aria-current={step.kind === section.id ? "step" : undefined} className={step.kind === section.id ? "is-active" : ""} key={section.id} onClick={() => goToStep(section.start)} type="button"><Icon aria-hidden="true" size={17} /><span>{section.label}</span>{section.count ? <b>{section.count}</b> : null}</button>;
          })}
      </nav>
    </header>

    <main className={`hsk-guided-main is-${step.kind}`}>{content}</main>

    {step.kind !== "complete" ? <footer className="hsk-guided-footer">
      <button disabled={currentStep === 0} onClick={() => goToStep(currentStep - 1)} type="button"><ArrowLeft aria-hidden="true" size={19} /><span>Trước</span></button>
      <span><strong>Bước {currentStep + 1} / {steps.length}</strong><small>Nhấn <kbd>Enter ↵</kbd> để tiếp tục</small></span>
      <button className="is-primary" onClick={() => goToStep(currentStep + 1)} type="button"><span><span>Tiếp</span><span> tục</span></span><ArrowRight aria-hidden="true" size={19} /></button>
    </footer> : null}
  </div>;
}
