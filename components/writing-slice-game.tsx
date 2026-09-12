/* eslint-disable @next/next/no-img-element */
"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Heart,
  Keyboard,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import { speakChinese, type GameWord } from "@/lib/game-content";
import { useLearningData } from "@/components/learning-data-provider";
import { createSliceDeck, normalizeSliceAnswer as normalizeAnswer, SLICE_HSK_COURSES, type SliceHskLevel } from "@/lib/slice-game";
import { hasCompletedGameCourse, type GameCourseCompletionKey } from "@/lib/activity-progress";

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP);

type GameMode = "ready" | "playing" | "paused" | "slicing" | "complete" | "gameover";

type StrikeMotion = {
  x: number;
  y: number;
  approachX: number;
  approachY: number;
  impactX: number;
  impactY: number;
  exitX: number;
  exitY: number;
};

const TARGET_ROUNDS = 12;

function GameOverlay({
  mode,
  score,
  onStart,
  completionAction,
}: {
  mode: GameMode;
  score: number;
  onStart: () => void;
  completionAction?: ReactNode;
}) {
  if (!(["ready", "complete", "gameover"] as GameMode[]).includes(mode)) return null;

  const complete = mode === "complete";
  const gameover = mode === "gameover";
  return (
    <div className="writing-game-overlay">
      <span className="writing-overlay-mark" aria-hidden="true">
        {complete ? <Check size={28} /> : gameover ? <RotateCcw size={26} /> : <Keyboard size={28} />}
      </span>
      <span className="writing-overlay-kicker">
        {complete ? "Lượt luyện hoàn tất" : gameover ? "Himi cần nghỉ một nhịp" : "Phản xạ pinyin"}
      </span>
      <h2>{complete ? `${score} điểm — rất gọn!` : gameover ? "Mình thử lại chậm hơn nhé." : "Gõ đúng. Himi chém gọn."}</h2>
      <p>
        {complete
          ? "Bạn đã xử lý đủ 12 từ của lượt hôm nay."
          : gameover
            ? "Ba từ đã chạm đất. Lượt mới sẽ bắt đầu lại từ đầu."
            : "Nhìn Hán tự đang rơi, gõ pinyin không dấu hoặc có dấu. Đúng từ là Himi sẽ lao lên cắt ngay."}
      </p>
      <button className="writing-primary-action" onClick={onStart} type="button">
        <Play fill="currentColor" size={16} /> {mode === "ready" ? "Bắt đầu chém từ" : "Chơi lại"}
      </button>
      {complete ? completionAction : null}
      {mode === "ready" ? <small>Enter để chốt · Không cần gõ dấu thanh</small> : null}
    </div>
  );
}

type WritingSliceGameProps = {
  onExit?: () => void;
  onComplete?: (score: number, level: SliceHskLevel) => void;
  completedCourses?: readonly GameCourseCompletionKey[];
  completionAction?: ReactNode;
  exitLabel?: string;
};

export function WritingSliceGame(props: WritingSliceGameProps = {}) {
  const learningData = useLearningData();
  const [session, setSession] = useState<{ level: SliceHskLevel; words: GameWord[] } | null>(null);
  const [loading, setLoading] = useState<SliceHskLevel | null>(null);
  const [error, setError] = useState("");
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => () => requestRef.current?.abort(), []);

  const selectCourse = async (level: SliceHskLevel) => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(level);
    setError("");
    try {
      const response = await learningData.get(`/api/games/slice?level=${level}`, { signal: controller.signal });
      if (!response.ok) {
        const problem = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(problem?.error ?? "Không thể tải từ vựng.");
      }
      const data = await response.json();
      if (!Array.isArray(data.words) || data.words.length < TARGET_ROUNDS) throw new Error("Chưa đủ từ vựng.");
      if (!controller.signal.aborted) setSession({ level, words: createSliceDeck(data.words) });
    } catch (problem) {
      if (!controller.signal.aborted) setError(problem instanceof Error ? problem.message : "Chưa tải được từ vựng. Bạn hãy chọn lại khóa để thử lại nhé.");
    } finally {
      if (!controller.signal.aborted) setLoading(null);
    }
  };

  if (session) {
    return <SliceSession {...props} initialWords={session.words} level={session.level} onChangeCourse={() => setSession(null)} />;
  }

  return (
    <main className="learner-dashboard writing-game-dashboard game-immersive-dashboard writing-course-selection-page">
      <div className="writing-course-shell writing-course-shell--split">
        <section className="writing-course-intro" aria-labelledby="writing-course-title">
          {props.onExit ? (
            <button className="writing-course-back" onClick={props.onExit} type="button">
              <ArrowLeft size={19} /> {props.exitLabel ?? "Tất cả trò chơi"}
            </button>
          ) : null}

          <div className="writing-course-copy">
            <span className="writing-course-kicker">Luyện chém từ</span>
            <h1 id="writing-course-title">Chọn khóa HSK để chơi</h1>
          </div>

          <img
            alt="Himi đội nón tre, sẵn sàng luyện chém từ"
            className="writing-course-mascot"
            height="1016"
            src="/assets/games/himi-v2-slice.webp"
            width="966"
          />

          <div className="writing-course-facts" aria-label="Thể lệ mỗi lượt chơi">
            <span><BookOpen aria-hidden="true" size={25} /><strong>12 từ</strong></span>
            <span><Heart aria-hidden="true" size={25} /><strong>3 lượt bỏ lỡ</strong></span>
            <span><Keyboard aria-hidden="true" size={25} /><strong>Gõ pinyin</strong></span>
          </div>
        </section>

        <section className="writing-course-picker" aria-label="Chọn cấp độ HSK">
          <div className="writing-course-grid">
            {SLICE_HSK_COURSES.map((course, index) => {
              const featured = index === 0;
              const isLoading = loading === course.id;
              const completed = hasCompletedGameCourse(props.completedCourses ?? [], "slice", course.id);

              return (
                <button
                  aria-busy={isLoading}
                  aria-label={`${course.label}: ${course.description}${completed ? ", đã hoàn thành một lượt" : ""}`}
                  className={`writing-course-card${featured ? " is-featured" : ""}${completed ? " is-complete" : ""}${isLoading ? " is-loading" : ""}`}
                  key={course.id}
                  onClick={() => void selectCourse(course.id)}
                  type="button"
                >
                  {completed
                    ? <span className="writing-course-done"><Check aria-hidden="true" size={15} strokeWidth={3} /> DONE</span>
                    : featured ? <span className="writing-course-recommended"><Sparkles aria-hidden="true" size={14} /> Đề xuất</span> : null}
                  <span className="writing-course-card-heading">
                    <span className="writing-course-number" aria-hidden="true">{index + 1}</span>
                    <strong>{course.label}</strong>
                  </span>
                  <span className="writing-course-description">{course.description}</span>
                  <small className="writing-course-action">
                    {isLoading ? "Đang tải…" : completed ? "Chơi lại" : featured ? "Chơi ngay" : "Chọn khóa"}
                    <ArrowRight aria-hidden="true" size={featured ? 19 : 21} />
                  </small>
                </button>
              );
            })}
          </div>
          <p className="writing-course-status" role={error ? "alert" : "status"}>
            {error || (loading ? "Đang chuẩn bị từ vựng cho lượt chơi…" : "Chém đúng 12 từ · 3 lượt bỏ lỡ · Gõ pinyin có dấu hoặc không dấu")}
          </p>
        </section>
      </div>
    </main>
  );
}

function SliceSession({
  onExit,
  onComplete,
  completionAction,
  exitLabel,
  initialWords,
  level,
  onChangeCourse,
}: WritingSliceGameProps & { initialWords: GameWord[]; level: SliceHskLevel; onChangeCourse: () => void }) {
  const [words, setWords] = useState(initialWords);
  const [mode, setMode] = useState<GameMode>("playing");
  const [wordIndex, setWordIndex] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [missed, setMissed] = useState(false);
  const [strikePoint, setStrikePoint] = useState<StrikeMotion>({
    x: 50,
    y: 44,
    approachX: 120,
    approachY: -110,
    impactX: 150,
    impactY: -180,
    exitX: 270,
    exitY: -300,
  });
  const arenaRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const penguinRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextTimerRef = useRef<number | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);
  const fallTweenRef = useRef<gsap.core.Tween | null>(null);
  const strikeTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const pendingStrikeRef = useRef<{ finalScore: number; nextCompleted: number } | null>(null);

  const word = words[wordIndex];
  const normalizedTarget = useMemo(() => normalizeAnswer(word.pinyin), [word.pinyin]);
  const gameStyle = {
    "--word-lane": `${word.lane}%`,
    "--fall-duration": `${word.duration}s`,
    "--strike-x": `${strikePoint.x}%`,
    "--strike-y": `${strikePoint.y}%`,
    "--strike-approach-x": `${strikePoint.approachX}px`,
    "--strike-approach-y": `${strikePoint.approachY}px`,
    "--strike-impact-x": `${strikePoint.impactX}px`,
    "--strike-impact-y": `${strikePoint.impactY}px`,
    "--strike-exit-x": `${strikePoint.exitX}px`,
    "--strike-exit-y": `${strikePoint.exitY}px`,
  } as CSSProperties;

  useEffect(() => () => {
    if (nextTimerRef.current) window.clearTimeout(nextTimerRef.current);
    if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
    fallTweenRef.current?.kill();
    strikeTimelineRef.current?.kill();
    window.speechSynthesis?.cancel();
  }, []);

  useEffect(() => {
    if (mode === "playing") inputRef.current?.focus({ preventScroll: true });
  }, [mode, runKey]);

  const clearNextTimer = () => {
    if (!nextTimerRef.current) return;
    window.clearTimeout(nextTimerRef.current);
    nextTimerRef.current = null;
  };

  const startGame = () => {
    clearNextTimer();
    if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
    window.speechSynthesis?.cancel();
    fallTweenRef.current?.kill();
    strikeTimelineRef.current?.kill();
    pendingStrikeRef.current = null;
    setWords(createSliceDeck(initialWords));
    setMode("playing");
    setWordIndex(0);
    setRunKey((value) => value + 1);
    setAnswer("");
    setScore(0);
    setCombo(0);
    setCompleted(0);
    setHearts(3);
    setMissed(false);
  };

  const advanceWord = (nextMode: GameMode = "playing") => {
    if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
    setWordIndex((value) => (value + 1) % words.length);
    setRunKey((value) => value + 1);
    setAnswer("");
    setMissed(false);
    setMode(nextMode);
  };

  const measureStrikePoint = (): StrikeMotion | null => {
    const arena = arenaRef.current?.getBoundingClientRect();
    const target = wordRef.current?.getBoundingClientRect();
    const penguin = penguinRef.current?.getBoundingClientRect();
    if (!arena || !target || !penguin) return null;
    const targetX = target.left + target.width / 2;
    const targetY = target.top + target.height / 2;
    // Align the upper tip of the penguin's diagonal bamboo staff with the word.
    const impactLeft = targetX - penguin.width * 0.86;
    const impactTop = targetY - penguin.height * 0.16;
    const impactX = impactLeft - penguin.left;
    const impactY = impactTop - penguin.top;
    const nextStrikePoint = {
      x: Math.max(12, Math.min(88, ((targetX - arena.left) / arena.width) * 100)),
      y: Math.max(18, Math.min(78, ((targetY - arena.top) / arena.height) * 100)),
      approachX: impactX * 0.68 - 16,
      approachY: impactY * 0.62 + 28,
      impactX,
      impactY,
      exitX: impactX + Math.max(100, arena.width * 0.12),
      exitY: impactY - Math.max(110, arena.height * 0.2),
    };
    setStrikePoint(nextStrikePoint);
    return nextStrikePoint;
  };

  const handleCorrect = () => {
    if (mode !== "playing") return;
    fallTweenRef.current?.pause();
    const measuredStrike = measureStrikePoint();
    if (!measuredStrike) {
      fallTweenRef.current?.resume();
      return;
    }
    window.speechSynthesis?.cancel();
    const nextCombo = combo + 1;
    const nextCompleted = completed + 1;
    const earnedScore = 100 + Math.min(nextCombo - 1, 5) * 20;
    const finalScore = score + earnedScore;
    setCombo(nextCombo);
    setCompleted(nextCompleted);
    setScore(finalScore);
    pendingStrikeRef.current = { finalScore, nextCompleted };
    setMode("slicing");
    clearNextTimer();
  };

  const handleMiss = () => {
    if (mode !== "playing") return;
    const nextHearts = hearts - 1;
    setHearts(nextHearts);
    setCombo(0);
    setMissed(true);
    setMode(nextHearts <= 0 ? "gameover" : "paused");
    if (nextHearts <= 0) return;
    clearNextTimer();
    nextTimerRef.current = window.setTimeout(() => advanceWord(), 700);
  };

  const updateAnswer = (value: string) => {
    setAnswer(value);
    if (mode === "playing" && normalizeAnswer(value) === normalizedTarget) handleCorrect();
  };

  const submitAnswer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (normalizeAnswer(answer) === normalizedTarget) handleCorrect();
    else if (answer.trim()) {
      setMissed(true);
      if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = window.setTimeout(() => setMissed(false), 560);
    }
  };

  const speakWord = () => {
    speakChinese(word.hanzi);
  };

  const togglePause = () => {
    if (mode === "playing") {
      fallTweenRef.current?.pause();
      setMode("paused");
    } else if (mode === "paused" && !missed) {
      fallTweenRef.current?.resume();
      setMode("playing");
    }
  };

  useGSAP(() => {
    if (mode !== "playing") return;
    const arena = arenaRef.current;
    const fallingWord = wordRef.current;
    const penguin = penguinRef.current;
    if (!arena || !fallingWord) return;

    if (penguin) {
      const cape = penguin.querySelector<HTMLElement>(".writing-penguin-cape");
      gsap.set(penguin, {
        autoAlpha: 0,
        rotation: -4,
        scale: 1,
        x: 0,
        y: 0,
      });
      gsap.to(penguin, { autoAlpha: 1, duration: .18, ease: "power1.out" });
      if (cape) gsap.set(cape, { autoAlpha: 0, rotation: 3, scaleX: .34, skewY: -2 });
    }

    const fallDistance = Math.max(220, arena.clientHeight - 176);
    gsap.set(fallingWord, { autoAlpha: 1, xPercent: -50, y: 0 });
    const tween = gsap.to(fallingWord, {
      duration: word.duration,
      ease: "none",
      onComplete: handleMiss,
      y: fallDistance,
    });
    fallTweenRef.current = tween;

    return () => {
      tween.kill();
      if (fallTweenRef.current === tween) fallTweenRef.current = null;
    };
  }, { dependencies: [runKey], scope: arenaRef, revertOnUpdate: true });

  useGSAP(() => {
    if (mode !== "slicing") return;
    const arena = arenaRef.current;
    const fallingWord = wordRef.current;
    const penguin = penguinRef.current;
    if (!arena || !fallingWord || !penguin) return;

    fallTweenRef.current?.kill();
    fallTweenRef.current = null;

    const face = fallingWord.querySelector<HTMLElement>(".writing-word-face");
    const leftHalf = fallingWord.querySelector<HTMLElement>(".writing-word-half.is-left");
    const rightHalf = fallingWord.querySelector<HTMLElement>(".writing-word-half.is-right");
    const cape = penguin.querySelector<HTMLElement>(".writing-penguin-cape");
    const impact = arena.querySelector<HTMLElement>(".writing-slice-impact");
    const hitScore = arena.querySelector<HTMLElement>(".writing-hit-score");
    if (!face || !leftHalf || !rightHalf || !cape || !impact || !hitScore) return;

    const finishStrike = () => {
      const pending = pendingStrikeRef.current;
      pendingStrikeRef.current = null;
      if (!pending) return;
      if (pending.nextCompleted >= TARGET_ROUNDS) {
        setMode("complete");
        setAnswer("");
        onComplete?.(pending.finalScore, level);
      } else {
        advanceWord();
      }
    };

    gsap.set(face, { autoAlpha: 1 });
    gsap.set([leftHalf, rightHalf], { autoAlpha: 0, display: "grid", rotation: 0, x: 0, y: 0 });
    gsap.set(penguin, { autoAlpha: 1, rotation: -4, scale: 1, x: 0, y: 0 });
    gsap.set(cape, { autoAlpha: 0, rotation: 3, scaleX: .34, skewY: -2 });
    gsap.set(impact, { autoAlpha: 0, rotation: -7, scale: .42, xPercent: -50, yPercent: -50 });
    gsap.set(hitScore, { autoAlpha: 0, rotation: 0, scale: .84, x: 32, y: -4 });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeline = gsap.timeline({ onComplete: finishStrike });
    strikeTimelineRef.current = timeline;

    if (reducedMotion) {
      timeline
        // Keep the timed falling target, but replace decorative flight with a fade.
        .set(hitScore, { scale: 1, x: 38, y: -18 })
        .to(face, { autoAlpha: 0, duration: .16 }, 0)
        .to(hitScore, { autoAlpha: 1, duration: .16 }, 0)
        .to(hitScore, { autoAlpha: 0, duration: .16 }, .64);
    } else {
      timeline
        .to(penguin, { duration: .16, ease: "power2.out", rotation: -8, scale: 1.02, x: -12, y: 8 }, 0)
        .to(cape, { autoAlpha: .72, duration: .16, ease: "power2.out", rotation: 4, scaleX: .72, skewY: -3 }, .04)
        .to(penguin, { duration: .42, ease: "power2.in", rotation: 9, scale: .94, x: strikePoint.impactX, y: strikePoint.impactY }, .16)
        .to(cape, { autoAlpha: 1, duration: .42, ease: "sine.inOut", rotation: -3, scaleX: 1.04, skewY: 3 }, .16)
        .addLabel("impact", .58)
        .set(face, { autoAlpha: 0 }, "impact")
        .set([leftHalf, rightHalf], { autoAlpha: 1 }, "impact")
        .to(impact, { autoAlpha: 1, duration: .16, ease: "power3.out", rotation: -1, scale: .96 }, "impact")
        .to(leftHalf, { autoAlpha: 0, duration: .68, ease: "power2.in", rotation: -18, x: -46, y: 78 }, "impact")
        .to(rightHalf, { autoAlpha: 0, duration: .68, ease: "power2.in", rotation: 17, x: 48, y: 70 }, "impact")
        .to(hitScore, { autoAlpha: 1, duration: .17, ease: "power3.out", scale: 1.04, x: 38, y: -18 }, "impact")
        .to(hitScore, { autoAlpha: 1, duration: .38, ease: "none", x: 39, y: -22 }, "impact+=.17")
        .to(hitScore, { autoAlpha: 0, duration: .24, ease: "power1.in", scale: .98, x: 41, y: -42 }, "impact+=.55")
        .to(impact, { autoAlpha: 0, duration: .38, ease: "power1.out", rotation: 3, scale: 1.18 }, "impact+=.16")
        .to(penguin, { autoAlpha: 0, duration: .36, ease: "power2.out", rotation: 15, scale: .84, x: strikePoint.exitX, y: strikePoint.exitY }, "impact")
        .to(cape, { autoAlpha: 0, duration: .36, ease: "sine.out", rotation: -4, scaleX: .86, skewY: 3 }, "impact");
    }

    return () => {
      timeline.kill();
      if (strikeTimelineRef.current === timeline) strikeTimelineRef.current = null;
    };
  }, { dependencies: [mode], scope: arenaRef, revertOnUpdate: true });

  return (
    <main className="learner-dashboard writing-game-dashboard game-immersive-dashboard">
      <div className="writing-page-shell">
        <h1 className="writing-page-title">Luyện chém từ cùng Himi</h1>
        <div className="writing-game-layout">
          <section className="writing-arena-column" aria-label="Sân chơi chém từ">
            <div className={`writing-arena writing-gsap-motion is-${mode}`} ref={arenaRef} style={gameStyle}>
              <img
                alt=""
                aria-hidden="true"
                className="writing-arena-background"
                height="1080"
                src="/assets/writing/bamboo-landscape.webp"
                width="1920"
              />

              {onExit ? (
                <button aria-label={exitLabel === "Trở lại" ? "Trở về trang trước" : "Quay lại tất cả trò chơi"} className="writing-game-back" onClick={onExit} type="button">
                  <ArrowLeft size={18} />
                  <span>{exitLabel ?? "Tất cả trò chơi"}</span>
                </button>
              ) : null}

              <div className="writing-arena-metrics" aria-label="Tiến độ lượt luyện">
                <span>
                  <strong>{completed}<em> / {TARGET_ROUNDS}</em></strong>
                  <small>ĐÃ CHÉM</small>
                </span>
                <span>
                  <strong>{score}</strong>
                  <small>ĐIỂM</small>
                </span>
              </div>

              <div className="writing-arena-topline">
                <div className="writing-arena-controls">
                  <button aria-label={mode === "paused" ? "Tiếp tục" : "Tạm dừng"} disabled={mode === "ready" || mode === "slicing" || mode === "complete" || mode === "gameover"} onClick={togglePause} type="button">
                    {mode === "paused" ? <Play fill="currentColor" size={15} /> : <Pause fill="currentColor" size={15} />}
                  </button>
                </div>
                <span>LƯỢT {Math.min(completed + 1, TARGET_ROUNDS)} / {TARGET_ROUNDS}</span>
                <span className="writing-hearts" aria-label={`${hearts} lượt còn lại`}>
                  {[0, 1, 2].map((index) => <Heart fill={index < hearts ? "currentColor" : "none"} key={index} size={17} />)}
                </span>
              </div>

              <div className="writing-target-ribbon">
                <span>Từ cần gõ</span>
                <strong lang="zh-CN">{word.hanzi}</strong>
                <small>{word.meaning}</small>
              </div>

              <div
                className={`writing-falling-word ${mode === "slicing" ? "is-sliced" : ""}`}
                key={runKey}
                ref={wordRef}
              >
                <span className="writing-word-face">
                  <span className="writing-word-whole" lang="zh-CN">{word.hanzi}</span>
                  <small lang="zh-Latn">{word.pinyin}</small>
                </span>
                <span aria-hidden="true" className="writing-word-half is-left" lang="zh-CN">{word.hanzi}</span>
                <span aria-hidden="true" className="writing-word-half is-right" lang="zh-CN">{word.hanzi}</span>
              </div>

              <div className="writing-penguin" ref={penguinRef}>
                <img
                  alt=""
                  aria-hidden="true"
                  className="writing-penguin-cape"
                  height="1016"
                  src="/assets/games/himi-v2-slice.webp"
                  width="966"
                />
                <img
                  alt="Himi mới đội nón tre và cầm gậy tre"
                  className="writing-penguin-body"
                  height="1016"
                  src="/assets/games/himi-v2-slice.webp"
                  width="966"
                />
              </div>

              <img
                alt=""
                aria-hidden="true"
                className="writing-slice-impact"
                height="1254"
                src="/assets/writing/bamboo-slice-burst.png"
                width="1254"
              />
              <span aria-live="polite" className="writing-hit-score" role="status">
                {mode === "slicing" ? <>
                  <strong>+{100 + Math.min(Math.max(combo - 1, 0), 5) * 20}</strong>
                  <small>{word.meaning}</small>
                </> : null}
              </span>

              <div className="writing-combo" aria-live="polite">
                {combo >= 2 && mode !== "ready" ? <><Sparkles size={15} /> Combo x{combo}</> : null}
              </div>

              <GameOverlay completionAction={completionAction} mode={mode} onStart={startGame} score={score} />
              {mode === "paused" && !missed ? (
                <button className="writing-pause-overlay" onClick={togglePause} type="button"><Play fill="currentColor" size={18} /> Tiếp tục</button>
              ) : null}
            </div>

            <form className={`writing-answer-bar ${missed ? "has-error" : ""}`} onSubmit={submitAnswer}>
              <label htmlFor="writing-answer">Gõ pinyin của từ đang rơi</label>
              <div>
                <Keyboard aria-hidden="true" size={20} />
                <input
                  autoComplete="off"
                  disabled={mode !== "playing"}
                  id="writing-answer"
                  onChange={(event) => updateAnswer(event.target.value)}
                  placeholder={mode === "playing" ? "Ví dụ: ni hao" : "Bấm bắt đầu để luyện"}
                  ref={inputRef}
                  spellCheck={false}
                  value={answer}
                />
                <button aria-label="Chốt đáp án" disabled={mode !== "playing" || !answer.trim()} type="submit"><ArrowRight size={19} /></button>
              </div>
              <span aria-live="polite">
                {missed ? <><X size={14} /> Chưa khớp — thử lại trước khi chữ chạm đất.</> : "Có thể gõ không dấu và dùng phím cách giữa các âm."}
              </span>
            </form>
          </section>

          <aside className="writing-session-aside" aria-label="Thông tin lượt chơi">
            <div className="writing-course-current">
              <strong>{SLICE_HSK_COURSES.find((course) => course.id === level)?.label} · {words.length} từ vựng</strong>
              <span>Ngẫu nhiên từ các bài học trong khóa</span>
              <button className="writing-course-back" onClick={onChangeCourse} type="button"><ArrowLeft size={16} /> Đổi khóa HSK</button>
            </div>
            <details className="writing-session-details">
              <summary className="writing-session-summary">
                <span aria-hidden="true" className="writing-session-summary-icon">
                  <Sparkles size={18} />
                </span>
                <span className="writing-session-summary-copy">
                  <small>Thông tin lượt chơi</small>
                  <strong><span lang="zh-CN">{word.hanzi}</span> · {word.pinyin}</strong>
                </span>
                <span className="writing-session-summary-action">
                  Chi tiết <ChevronDown aria-hidden="true" size={17} />
                </span>
              </summary>

              <div className="writing-session-details-content">
                <section className="writing-current-word">
                  <span>TỪ HIỆN TẠI</span>
                  <div>
                    <strong lang="zh-CN">{word.hanzi}</strong>
                    <button aria-label="Nghe phát âm" onClick={speakWord} type="button"><Volume2 size={18} /></button>
                  </div>
                  <b>{word.pinyin}</b>
                  <p>{word.example}</p>
                </section>

                <section className="writing-howto">
                  <span>NHỊP CHƠI</span>
                  <ol>
                    <li><b>01</b><span>Nhìn Hán tự và nghĩa gợi ý.</span></li>
                    <li><b>02</b><span>Gõ pinyin trước khi từ chạm đất.</span></li>
                    <li><b>03</b><span>Đúng từ để Himi chém và giữ combo.</span></li>
                  </ol>
                </section>

                <section className="writing-session-note">
                  <span><Sparkles size={16} /> Mẹo lượt này</span>
                  <p>Ưu tiên đúng âm trước. Dấu thanh sẽ được luyện lại ở lượt nâng cao.</p>
                </section>
              </div>
            </details>
          </aside>
        </div>
      </div>
    </main>
  );
}
