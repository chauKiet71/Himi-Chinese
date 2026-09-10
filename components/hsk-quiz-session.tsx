"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  Gauge,
  LockKeyhole,
  RotateCcw,
  Trophy,
  Volume2,
  X,
} from "lucide-react";
import { VipUpgradeInlineForm } from "@/components/vip-upgrade-prompt";
import { speakChinese } from "@/lib/game-content";
import type { HskExercise, HskLessonContent } from "@/lib/hsk-lesson-content";
import {
  getHskLessonProgressStorageKey,
  parseHskLessonProgress,
} from "@/lib/hsk-lesson-progress";

const SPEEDS = [0.75, 1, 1.25] as const;

function saveQuizProgress(lesson: HskLessonContent, exerciseId: string, scorePercent: number): void {
  try {
    const storageKey = getHskLessonProgressStorageKey(lesson.id);
    const progress = parseHskLessonProgress(window.localStorage.getItem(storageKey));
    const reviewedExercises = progress.reviewedExercises.includes(exerciseId)
      ? progress.reviewedExercises
      : [...progress.reviewedExercises, exerciseId];

    window.localStorage.setItem(storageKey, JSON.stringify({
      ...progress,
      exerciseBestPercent: Math.max(progress.exerciseBestPercent, scorePercent),
      reviewedExercises,
    }));
  } catch {
    // The quiz remains fully usable when browser storage is unavailable.
  }
}

function optionState(exercise: HskExercise, option: string, selected: string | null): string {
  if (!selected || exercise.answer === null) return "";
  if (option === exercise.answer) return " is-correct";
  if (option === selected) return " is-wrong";
  return " is-muted";
}

export function HskQuizSession({ lesson }: { lesson: HskLessonContent }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showPinyin, setShowPinyin] = useState(true);
  const [speechRate, setSpeechRate] = useState<(typeof SPEEDS)[number]>(1.25);
  const [celebrating, setCelebrating] = useState(false);
  const celebrationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const exercise = lesson.exercises[index];
  const accessibleQuestionCount = lesson.exercises.filter((item) => !item.locked).length;
  const level = lesson.levelId.replace(/^hsk-/u, "");
  const lessonHref = `/hsk/${level}/${lesson.id}`;
  const currentIsCorrect = selected !== null && selected === exercise?.answer;
  const progressPercent = finished ? 100 : ((index + 1) / lesson.exercises.length) * 100;
  const finalPercent = accessibleQuestionCount
    ? Math.round((correctCount / accessibleQuestionCount) * 100)
    : 0;

  useEffect(() => () => {
    if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
  }, []);

  function celebrateCorrectAnswer() {
    if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
    setCelebrating(true);
    celebrationTimerRef.current = setTimeout(() => {
      setCelebrating(false);
      celebrationTimerRef.current = null;
    }, 2400);
  }

  function stopCelebration() {
    if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
    celebrationTimerRef.current = null;
    setCelebrating(false);
  }

  function choose(option: string) {
    if (!exercise || exercise.locked || selected !== null) return;
    const nextCorrectCount = correctCount + (option === exercise.answer ? 1 : 0);
    const scorePercent = accessibleQuestionCount
      ? Math.round((nextCorrectCount / accessibleQuestionCount) * 100)
      : 0;

    setSelected(option);
    if (option === exercise.answer) {
      setCorrectCount(nextCorrectCount);
      celebrateCorrectAnswer();
    }
    saveQuizProgress(lesson, exercise.id, scorePercent);
  }

  function next() {
    stopCelebration();
    if (index === lesson.exercises.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((current) => current + 1);
    setSelected(null);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setFinished(false);
    stopCelebration();
  }

  function playPrompt() {
    if (!exercise || exercise.locked) return;
    speakChinese(exercise.speakText ?? exercise.prompt, speechRate);
  }

  return <main className="hsk-quiz-session game-immersive-dashboard">
    <header className="hsk-quiz-header">
      <div className="hsk-quiz-toolbar">
        <Link className="hsk-quiz-exit" href={lessonHref}>
          <ChevronLeft aria-hidden="true" size={21} strokeWidth={2.2} />
          <span>Thoát</span>
        </Link>

        <div
          aria-label={`Tiến độ câu hỏi: ${Math.min(index + 1, lesson.exercises.length)} trên ${lesson.exercises.length}`}
          aria-valuemax={lesson.exercises.length}
          aria-valuemin={0}
          aria-valuenow={finished ? lesson.exercises.length : index + 1}
          className="hsk-quiz-progress"
          role="progressbar"
        >
          <span style={{ width: `${progressPercent}%` }} />
        </div>

        <strong className="hsk-quiz-counter">
          {Math.min(index + 1, lesson.exercises.length)} / {lesson.exercises.length}
        </strong>

        <button
          aria-label={showPinyin ? "Ẩn pinyin" : "Hiện pinyin"}
          aria-pressed={showPinyin}
          className="hsk-quiz-pinyin"
          onClick={() => setShowPinyin((current) => !current)}
          type="button"
        >
          pīn
        </button>

        <div aria-label="Tốc độ phát âm" className="hsk-quiz-speed" role="group">
          <Gauge aria-hidden="true" size={16} strokeWidth={1.8} />
          {SPEEDS.map((speed) => <button
            aria-pressed={speechRate === speed}
            key={speed}
            onClick={() => setSpeechRate(speed)}
            type="button"
          >
            {speed}×
          </button>)}
        </div>
      </div>
    </header>

    <section aria-label={`Quiz ${lesson.levelLabel}: ${lesson.title}`} className="hsk-quiz-stage">
      {finished ? <article className="hsk-quiz-card hsk-quiz-result" role="status">
        <span className="hsk-quiz-result-icon"><Trophy aria-hidden="true" size={34} /></span>
        <small>HOÀN THÀNH QUIZ</small>
        <h1>{finalPercent >= 80 ? "Làm rất tốt!" : "Thêm một lượt nữa nhé!"}</h1>
        <p>Bạn trả lời đúng <strong>{correctCount}/{accessibleQuestionCount}</strong> câu.</p>
        <div className="hsk-quiz-result-score">{finalPercent}%</div>
        <div className="hsk-quiz-result-actions">
          <button onClick={restart} type="button"><RotateCcw aria-hidden="true" size={17} /> Học lại</button>
          <Link href={lessonHref}>Về bài học</Link>
        </div>
      </article> : exercise.locked ? <article className="hsk-quiz-card hsk-quiz-locked">
        <span className="hsk-quiz-result-icon"><LockKeyhole aria-hidden="true" size={31} /></span>
        <small>CÂU HỎI VIP · {index + 1}/{lesson.exercises.length}</small>
        <h1>Câu hỏi này cần tài khoản VIP</h1>
        <p>Nội dung và đáp án chưa được gửi tới trình duyệt.</p>
        <div className="hsk-quiz-result-actions">
          <VipUpgradeInlineForm />
          <button onClick={next} type="button">{index === lesson.exercises.length - 1 ? "Hoàn thành" : "Câu tiếp theo"}</button>
        </div>
      </article> : <article className="hsk-quiz-card">
        {celebrating && currentIsCorrect ? <span aria-hidden="true" className="hsk-quiz-confetti">
          <Image
            alt=""
            fill
            sizes="800px"
            src="/assets/quiz/correct-confetti.gif"
            unoptimized
          />
        </span> : null}

        <div className="hsk-quiz-question-heading">
          <span className="hsk-quiz-kicker">{exercise.instruction}</span>
          {(exercise.speakText || exercise.type === "listening") ? <button aria-label="Nghe câu hỏi" onClick={playPrompt} type="button">
            <Volume2 aria-hidden="true" size={19} />
          </button> : null}
        </div>

        <h1 className="hsk-quiz-prompt" lang="zh-CN">{exercise.prompt}</h1>
        {showPinyin && exercise.pinyin ? <p className="hsk-quiz-prompt-pinyin">{exercise.pinyin}</p> : null}
        {exercise.note ? <p className="hsk-quiz-note">{exercise.note}</p> : null}

        <div aria-label="Các lựa chọn" className="hsk-quiz-options" role="group">
          {exercise.options.map((option) => <button
            aria-pressed={selected === option}
            className={optionState(exercise, option, selected)}
            disabled={selected !== null}
            key={option}
            onClick={() => choose(option)}
            type="button"
          >
            {option}
          </button>)}
        </div>

        <div aria-live="polite" className={`hsk-quiz-feedback-slot${selected ? " has-feedback" : ""}`}>
          {selected ? <div className={`hsk-quiz-feedback${currentIsCorrect ? " is-correct" : " is-wrong"}`}>
            <span className="hsk-quiz-feedback-icon">
              {currentIsCorrect ? <Check aria-hidden="true" size={22} strokeWidth={2.4} /> : <X aria-hidden="true" size={22} strokeWidth={2.4} />}
            </span>
            <div>
              <strong>{currentIsCorrect ? "Chính xác!" : "Chưa chính xác"}</strong>
              {!currentIsCorrect && exercise.answer ? <small>Đáp án đúng: {exercise.answer}</small> : null}
            </div>
            <button className="hsk-quiz-next" onClick={next} type="button">TIẾP</button>
          </div> : null}
        </div>
      </article>}
    </section>
  </main>;
}
