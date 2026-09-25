"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Award, CheckCircle2, Gamepad2, Headphones, RotateCcw, X } from "lucide-react";
import { GameResultCelebration } from "@/components/game-result-celebration";
import { LessonChallengePanel } from "@/components/lesson-challenge";
import { LessonPhrasebook } from "@/components/lesson-phrasebook";
import { LessonPronunciationCoach, type LessonPronunciationSummary } from "@/components/lesson-pronunciation-coach";
import { LessonVocabularyDeck } from "@/components/lesson-vocabulary-deck";
import { VipContentGate } from "@/components/vip-upgrade-prompt";
import { VideoLearningPlayer } from "@/components/video-learning-player";
import type { Course, LessonAccess, LessonDetail, LessonProgressState, LessonSummary } from "@/lib/content-types";
import { withDailySessionFlow, type DailyRecommendation } from "@/lib/daily-session";
import { getLessonScenarioVideo } from "@/lib/video-library";

type LessonTab = "Tình huống" | "Từ vựng" | "Cụm từ" | "Nghe & nói" | "Kiểm tra";
type LessonCompletionView = LessonPronunciationSummary & { bestScore: number; attemptCount: number };

export function LessonWorkspace({
  course,
  lessons,
  lesson,
  access,
  progress,
  authenticated,
  dailyFlow,
  dailyNextStep,
}: {
  course: Course;
  lessons: LessonSummary[];
  lesson: LessonDetail;
  access: LessonAccess;
  progress: LessonProgressState | null;
  authenticated: boolean;
  dailyFlow: boolean;
  dailyNextStep: DailyRecommendation | null;
}) {
  const scenarioVideo = getLessonScenarioVideo(course.slug, lesson.slug);
  const practiceLines = lesson.phrases?.length ? lesson.phrases : lesson.dialogue;
  const learningTabs: LessonTab[] = [
    "Từ vựng",
    "Cụm từ",
    "Nghe & nói",
  ];
  const baseTabs: LessonTab[] = scenarioVideo ? ["Tình huống", ...learningTabs] : learningTabs;
  const [tab, setTab] = useState<LessonTab>(scenarioVideo ? "Tình huống" : "Từ vựng");
  const [tabDirection, setTabDirection] = useState<"back" | "forward">("forward");
  const [challengePassed, setChallengePassed] = useState(!lesson.challenge);
  const [studyAttempt, setStudyAttempt] = useState(0);
  const [completionSummary, setCompletionSummary] = useState<LessonCompletionView | null>(null);
  const [pendingSummary, setPendingSummary] = useState<LessonPronunciationSummary | null>(null);
  const tabs = lesson.challenge ? [...baseTabs, "Kiểm tra" as const] : baseTabs;
  const lessonNumber = lesson.order + 1;
  const tabIndex = tabs.indexOf(tab);
  const completed = progress?.completionPercent === 100;
  const lessonHref = `/learn/${course.slug}?lesson=${lesson.slug}`;
  const returnTo = dailyFlow ? withDailySessionFlow(lessonHref) : lessonHref;
  const completionReturnTo = dailyFlow ? `${returnTo}#daily-next` : returnTo;
  const dailyNextKind = dailyNextStep?.href.startsWith("/practice")
    ? "practice"
    : dailyNextStep?.href.startsWith("/games")
      ? "game"
      : "summary";
  const DailyNextIcon = dailyNextKind === "practice" ? Headphones : dailyNextKind === "game" ? Gamepad2 : Award;
  const continueToPhrases = useCallback(() => {
    setTabDirection("forward");
    setTab("Cụm từ");
  }, []);
  const continueToPronunciation = useCallback(() => {
    setTabDirection("forward");
    setTab("Nghe & nói");
  }, []);
  const stageTab = tab === "Từ vựng" || tab === "Cụm từ" || tab === "Nghe & nói";
  const completionFormId = `lesson-completion-${lesson.slug}`;
  const completionLoginId = `lesson-completion-login-${lesson.slug}`;
  const nextLesson = lessons.find((item) => item.order === lesson.order + 1);
  const nextLessonHref = nextLesson ? `/learn/${course.slug}?lesson=${nextLesson.slug}` : `/courses/${course.slug}`;

  const saveCompletion = useCallback(() => {
    if (!authenticated || completed) return;
    const body = new FormData();
    body.set("courseSlug", course.slug);
    body.set("lessonSlug", lesson.slug);
    body.set("returnTo", returnTo);
    void fetch("/api/progress/lesson/complete", { method: "POST", body, redirect: "manual" });
  }, [authenticated, completed, course.slug, lesson.slug, returnTo]);

  const showCompletion = useCallback((summary: LessonPronunciationSummary) => {
    if (!authenticated) {
      document.getElementById(completionLoginId)?.click();
      return;
    }
    saveCompletion();
    const storageKey = `himi:lesson-attempts:${course.slug}:${lesson.slug}`;
    let scores: number[] = [];
    try {
      const savedScores = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as unknown;
      if (Array.isArray(savedScores)) scores = savedScores.filter((score): score is number => typeof score === "number" && Number.isFinite(score));
      scores = [...scores, summary.score].slice(-20);
      window.localStorage.setItem(storageKey, JSON.stringify(scores));
    } catch {
      scores = [summary.score];
    }
    setCompletionSummary({ ...summary, bestScore: Math.max(...scores), attemptCount: scores.length });
  }, [authenticated, completionLoginId, course.slug, lesson.slug, saveCompletion]);

  const finishLesson = useCallback((summary: LessonPronunciationSummary) => {
    setPendingSummary(summary);
    if (lesson.challenge && !challengePassed) {
      setTabDirection("forward");
      setTab("Kiểm tra");
      return;
    }
    showCompletion(summary);
  }, [challengePassed, lesson.challenge, showCompletion]);

  const replayLesson = useCallback(() => {
    setCompletionSummary(null);
    setPendingSummary(null);
    setChallengePassed(!lesson.challenge);
    setStudyAttempt((attempt) => attempt + 1);
    setTabDirection("back");
    setTab(scenarioVideo ? "Tình huống" : "Từ vựng");
  }, [lesson.challenge, scenarioVideo]);

  useEffect(() => {
    if (!authenticated || !access.allowed) return;
    const timer = window.setTimeout(() => {
      void fetch("/api/progress/lesson/open", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ courseSlug: course.slug, lessonSlug: lesson.slug }),
        keepalive: true,
      });
    }, 600);
    return () => window.clearTimeout(timer);
  }, [access.allowed, authenticated, course.slug, lesson.slug]);

  return <section className="lesson-main lesson-stage-workspace" data-active-tab={tab}>
      {access.allowed ? <div className="lesson-header-card">
        <div className="lesson-tabs" role="tablist" aria-label="Nội dung bài học">{tabs.map((item, index) => <button
          aria-controls={`lesson-panel-${index}`}
          aria-selected={tab === item}
          className={`lesson-tab ${tab === item ? "active" : ""}`}
          id={`lesson-tab-${index}`}
          key={item}
          onClick={() => {
            setTabDirection(index < tabIndex ? "back" : "forward");
            setTab(item);
          }}
          role="tab"
          type="button"
        >
          <span>{item}</span>
          {tab === item ? <span className="lesson-tab-indicator" /> : null}
        </button>)}</div>
      </div> : null}

      {!access.allowed ? <VipContentGate
        className="lesson-content-card"
        description="Mở khóa từ vựng, cụm từ, luyện nghe và luyện nói trong phần này."
        title="Mở khóa phần học này"
      /> : <div className={`lesson-content-card${stageTab ? " lesson-content-card-stage" : ""}${tab === "Từ vựng" || tab === "Cụm từ" ? " lesson-content-card-vocabulary" : ""}${tab === "Tình huống" ? " lesson-content-card-video" : ""}`}>
        <div className="lesson-tab-panel-viewport">
          <div
              aria-labelledby={`lesson-tab-${tabIndex}`}
              className={`lesson-tab-panel tab-${tabDirection}`}
              id={`lesson-panel-${tabIndex}`}
              key={tab}
              role="tabpanel"
            >
              {tab === "Tình huống" && scenarioVideo ? <section className="lesson-scenario-video">
                <div className="lesson-scenario-video-heading"><div><span className="section-kicker">Tình huống mở đầu</span><h2>{scenarioVideo.title}</h2><p>{scenarioVideo.summary}</p></div></div>
                <VideoLearningPlayer compact video={scenarioVideo} />
              </section> : null}
              {tab === "Từ vựng" ? <LessonVocabularyDeck authenticated={authenticated} onFinished={continueToPhrases} words={lesson.vocabulary} /> : null}
              {tab === "Cụm từ" ? <LessonPhrasebook dialogue={practiceLines} notes={lesson.notes} onFinished={continueToPronunciation} words={lesson.vocabulary} /> : null}
              {tab === "Nghe & nói" ? <LessonPronunciationCoach dialogue={practiceLines} key={`pronunciation-${studyAttempt}`} onFinished={finishLesson} words={lesson.vocabulary} /> : null}
              {tab === "Kiểm tra" && lesson.challenge ? <LessonChallengePanel challenge={lesson.challenge} onComplete={() => pendingSummary && showCompletion(pendingSummary)} onPassed={setChallengePassed} /> : null}
            </div>
        </div>

        {authenticated && !completed ? <form action="/api/progress/lesson/complete" hidden id={completionFormId} method="post">
          <input name="courseSlug" type="hidden" value={course.slug} /><input name="lessonSlug" type="hidden" value={lesson.slug} /><input name="returnTo" type="hidden" value={completionReturnTo} />
        </form> : null}
        {!authenticated ? <Link hidden href={`/login?returnTo=${encodeURIComponent(returnTo)}`} id={completionLoginId}>Đăng nhập để hoàn thành</Link> : null}
        {completionSummary ? <div aria-labelledby="lesson-completion-title" aria-modal="true" className="lesson-completion-dialog" role="dialog">
          <button aria-label="Đóng form chúc mừng" className="lesson-completion-close" onClick={() => setCompletionSummary(null)} type="button"><X size={22} /></button>
          <div className="lesson-completion-celebration game-session-world">
            <GameResultCelebration
              actions={<><button onClick={replayLesson} type="button"><RotateCcw size={17} /> Học lại</button><Link href={nextLessonHref} prefetch={false}>{nextLesson ? "Bài tiếp theo" : "Về lộ trình"} <ArrowRight size={17} /></Link></>}
              details={<p>Bạn đã luyện đủ {completionSummary.completed}/{completionSummary.total} câu. Điểm cao nhất: <strong>{completionSummary.bestScore}/100</strong> · {completionSummary.attemptCount} lượt học được lưu trên thiết bị này.</p>}
              eyebrow="HOÀN THÀNH BÀI HỌC"
              label={`Chúc mừng! Bạn đã hoàn thành bài ${lessonNumber}`}
              score={completionSummary.score}
              titleId="lesson-completion-title"
            />
          </div>
        </div> : null}
        {completed && dailyFlow && dailyNextStep ? <section className="daily-flow-next-step" id="daily-next" aria-label="Bước tiếp theo trong phiên 10 phút">
          <span className="daily-flow-next-mark"><CheckCircle2 size={20} /></span>
          <div>
            <small>02/04 · Bài học đã xong</small>
            <strong>{dailyNextKind === "practice"
              ? "Tiếp tục với một ca nghe 3 phút"
              : dailyNextKind === "game"
                ? "Bước còn lại: phản xạ 1 phút"
                : "Bạn đã hoàn tất đủ bốn bước"}</strong>
            <p>{dailyNextStep.title}</p>
          </div>
          <Link className="button button-primary" href={withDailySessionFlow(dailyNextStep.href)} prefetch={false}>
            <DailyNextIcon size={18} /> {dailyNextKind === "practice"
              ? "Luyện ca tiếp theo"
              : dailyNextKind === "game"
                ? "Chơi lượt phản xạ"
                : "Xem tổng kết 4/4"} <ArrowRight size={17} />
          </Link>
        </section> : null}
      </div>}
  </section>;
}
