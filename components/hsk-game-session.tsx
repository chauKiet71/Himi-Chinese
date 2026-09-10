"use client";

import { ArrowLeft, ArrowRight, BookOpen, Sparkles, Target } from "lucide-react";
import Image from "next/image";
import { createContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createHskGameRound, HSK_GAME_ROUND_SIZE, type HskGameId } from "@/lib/hsk-game-round";
import { SLICE_HSK_COURSES, type SliceHskLevel, type SliceVocabulary } from "@/lib/slice-game";

export const HskGameCourseContext = createContext<{ label: string; onChangeCourse: () => void } | null>(null);

const GAME_PICKER_DETAILS: Record<HskGameId, { image: string; imageAlt: string; skill: string }> = {
  memory: {
    image: "/assets/games/himi-v2-memory.webp",
    imageAlt: "Himi đang chuẩn bị bộ thẻ ghép cặp",
    skill: "Ghép cặp",
  },
  connect: {
    image: "/assets/games/himi-v2-connect.webp",
    imageAlt: "Himi đang nối Hán tự với pinyin",
    skill: "Nối chữ – âm",
  },
  listen: {
    image: "/assets/games/himi-v2-listen.webp",
    imageAlt: "Himi đang luyện nghe và chọn đáp án",
    skill: "Nghe hiểu",
  },
  write: {
    image: "/assets/games/himi-v2-write.webp",
    imageAlt: "Himi đang luyện viết chữ theo nghĩa",
    skill: "Gõ Hán tự",
  },
  flash: {
    image: "/assets/games/himi-v2-flashcard.webp",
    imageAlt: "Himi đang ôn tập bằng flashcard",
    skill: "Ôn nhanh",
  },
  quiz: {
    image: "/assets/games/himi-v2-quiz.webp",
    imageAlt: "Himi đang tham gia thử thách tổng hợp",
    skill: "Tổng hợp",
  },
};

export function HskGameSession({ gameId, title, onExit, children }: {
  gameId: HskGameId;
  title: string;
  onExit: () => void;
  children: (words: SliceVocabulary[], onRestart: () => void) => ReactNode;
}) {
  const [session, setSession] = useState<{ level: SliceHskLevel; vocabulary: SliceVocabulary[]; words: SliceVocabulary[]; run: number } | null>(null);
  const [loading, setLoading] = useState<SliceHskLevel | null>(null);
  const [error, setError] = useState("");
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => () => {
    requestRef.current?.abort();
    window.speechSynthesis?.cancel();
  }, []);

  const selectCourse = async (level: SliceHskLevel) => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(level);
    setError("");
    try {
      const response = await fetch(`/api/games/vocabulary?level=${level}`, { signal: controller.signal });
      if (!response.ok) {
        const problem = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(problem?.error ?? "Không thể tải từ vựng.");
      }
      const data = await response.json() as { words: SliceVocabulary[] };
      const words = createHskGameRound(data.words, gameId);
      if (!controller.signal.aborted) {
        setSession({ level, vocabulary: data.words, words, run: 0 });
        window.scrollTo(0, 0);
      }
    } catch (problem) {
      if (!controller.signal.aborted) setError(problem instanceof Error ? problem.message : "Chưa tải được từ vựng. Bạn hãy chọn lại khóa để thử lại nhé.");
    } finally {
      if (!controller.signal.aborted) setLoading(null);
    }
  };

  const changeCourse = () => {
    window.speechSynthesis?.cancel();
    setSession(null);
    window.scrollTo(0, 0);
  };

  const restart = () => {
    if (!session) return;
    window.speechSynthesis?.cancel();
    setSession({ ...session, words: createHskGameRound(session.vocabulary, gameId, session.words), run: session.run + 1 });
  };

  if (session) {
    const label = SLICE_HSK_COURSES.find((course) => course.id === session.level)!.label;
    return <HskGameCourseContext.Provider key={`${session.level}-${session.run}`} value={{ label, onChangeCourse: changeCourse }}>
      {children(session.words, restart)}
    </HskGameCourseContext.Provider>;
  }

  const details = GAME_PICKER_DETAILS[gameId];
  const pickerTitleId = `${gameId}-course-picker-title`;

  return <main className={`learner-dashboard writing-game-dashboard game-immersive-dashboard writing-course-selection-page game-course-selection-${gameId}`}>
    <div className="writing-course-shell writing-course-shell--split">
      <section className="writing-course-intro" aria-labelledby={pickerTitleId}>
        <button className="writing-course-back" onClick={onExit} type="button"><ArrowLeft size={19} /> Tất cả trò chơi</button>

        <div className="writing-course-copy">
          <span className="writing-course-kicker">{title}</span>
          <h1 id={pickerTitleId}>Chọn khóa HSK để chơi</h1>
        </div>

        <Image
          alt={details.imageAlt}
          className="writing-course-mascot"
          height="640"
          src={details.image}
          width="960"
        />

        <div className="writing-course-facts" aria-label={`Thể lệ ${title}`}>
          <span><BookOpen aria-hidden="true" size={25} /><strong>{HSK_GAME_ROUND_SIZE[gameId]} từ</strong></span>
          <span><Target aria-hidden="true" size={25} /><strong>{details.skill}</strong></span>
          <span><Sparkles aria-hidden="true" size={25} /><strong>Bộ từ mới</strong></span>
        </div>
      </section>

      <section className="writing-course-picker" aria-label="Chọn cấp độ HSK">
        <div className="writing-course-grid">
          {SLICE_HSK_COURSES.map((course, index) => {
            const featured = index === 0;
            const isLoading = loading === course.id;

            return <button
              aria-busy={isLoading}
              aria-label={`${course.label}: ${course.description}`}
              className={`writing-course-card${featured ? " is-featured" : ""}${isLoading ? " is-loading" : ""}`}
              key={course.id}
              onClick={() => void selectCourse(course.id)}
              type="button"
            >
              {featured ? <span className="writing-course-recommended"><Sparkles aria-hidden="true" size={14} /> Đề xuất</span> : null}
              <span className="writing-course-card-heading">
                <span className="writing-course-number" aria-hidden="true">{index + 1}</span>
                <strong>{course.label}</strong>
              </span>
              <span className="writing-course-description">{course.description}</span>
              <small className="writing-course-action">
                {isLoading ? "Đang tải…" : featured ? "Chơi ngay" : "Chọn khóa"}
                <ArrowRight aria-hidden="true" size={featured ? 19 : 21} />
              </small>
            </button>;
          })}
        </div>
        <p className="writing-course-status" role={error ? "alert" : "status"}>
          {error || (loading ? "Đang chuẩn bị từ vựng cho lượt chơi…" : `${HSK_GAME_ROUND_SIZE[gameId]} từ mỗi lượt · Có thể đổi khóa sau mỗi lượt chơi`)}
        </p>
      </section>
    </div>
  </main>;
}
