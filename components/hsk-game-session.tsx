"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { createContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createHskGameRound, HSK_GAME_ROUND_SIZE, type HskGameId } from "@/lib/hsk-game-round";
import { SLICE_HSK_COURSES, type SliceHskLevel, type SliceVocabulary } from "@/lib/slice-game";

export const HskGameCourseContext = createContext<{ label: string; onChangeCourse: () => void } | null>(null);

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
      if (!response.ok) throw new Error("Không thể tải từ vựng.");
      const data = await response.json() as { words: SliceVocabulary[] };
      const words = createHskGameRound(data.words, gameId);
      if (!controller.signal.aborted) {
        setSession({ level, vocabulary: data.words, words, run: 0 });
        window.scrollTo(0, 0);
      }
    } catch {
      if (!controller.signal.aborted) setError("Chưa tải được từ vựng. Bạn hãy chọn lại khóa để thử lại nhé.");
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

  return <main className="learner-dashboard writing-game-dashboard game-immersive-dashboard">
    <div className="writing-course-shell">
      <button className="writing-course-back" onClick={onExit} type="button"><ArrowLeft size={18} /> Tất cả trò chơi</button>
      <span className="writing-course-kicker">{title}</span>
      <h1>Chọn khóa HSK để chơi</h1>
      <p>Từ vựng từ các bài học trong khóa. Mỗi lần chọn khóa hoặc chơi lại sẽ có một bộ từ ngẫu nhiên mới.</p>
      <div className="writing-course-grid" aria-label="Các khóa HSK">
        {SLICE_HSK_COURSES.map((course, index) => <button className="writing-course-card" key={course.id} onClick={() => void selectCourse(course.id)} type="button" aria-busy={loading === course.id}>
          <span className="writing-course-number" aria-hidden="true">{index + 1}</span>
          <strong>{course.label}</strong>
          <span>{course.description}</span>
          <small>{loading === course.id ? "Đang tải từ vựng…" : "Chơi ngay"}<ArrowRight size={16} /></small>
        </button>)}
      </div>
      <p className="writing-course-status" role={error ? "alert" : "status"}>{error || (loading ? "Đang chuẩn bị từ vựng cho lượt chơi…" : `${HSK_GAME_ROUND_SIZE[gameId]} từ mỗi lượt · Có thể đổi khóa sau mỗi lượt chơi`)}</p>
    </div>
  </main>;
}
