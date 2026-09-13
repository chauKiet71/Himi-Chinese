"use client";

/* eslint-disable @next/next/no-img-element */
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Check,
  CircleHelp,
  Footprints,
  Headphones,
  Keyboard,
  Layers3,
  Link2,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  Timer,
  Trophy,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import {
  useCallback,
  createContext,
  useEffect,
  useContext,
  lazy,
  useMemo,
  useRef,
  useState,
  Suspense,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  gameCourseCompletionKey,
  isGameId,
  isGameCourseCompletionKey,
  xpForGameScore,
  type GameId,
  type GameProgressSnapshot,
} from "@/lib/activity-progress";
import { speakChinese } from "@/lib/game-content";
import { HskGameSession, HskGameCourseContext } from "@/components/hsk-game-session";
import { GameResultCelebration } from "@/components/game-result-celebration";
import { shuffleGameItems, hskMeaningOptions, type HskGameId } from "@/lib/hsk-game-round";
import type { SliceHskLevel, SliceVocabulary } from "@/lib/slice-game";
import { trySaveHskGameVocabularyWord } from "@/lib/saved-vocabulary-client";
import { VocabularySavedToast, type VocabularySavedNotice } from "@/components/vocabulary-saved-toast";

type HskRoundProps = {
  words: SliceVocabulary[];
  onRestart: () => void;
  onExit: () => void;
  onComplete: (score: number) => void;
};

const WritingSliceGame = lazy(() => import("@/components/writing-slice-game").then((module) => ({
  default: module.WritingSliceGame,
})));

type GameSyncState = "idle" | "saving" | "saved" | "error";

const DailyGameFlowContext = createContext<{
  enabled: boolean;
  syncState: GameSyncState;
}>({ enabled: false, syncState: "idle" });

type CatalogGame = {
  id: GameId;
  title: string;
  description: string;
  duration: string;
  skill: string;
  image: string;
  imageAlt: string;
  tone: "teal" | "coral" | "blue" | "gold" | "violet" | "rose";
  icon: typeof BrainCircuit;
};

const STORAGE_KEY = "hanziwork.games.record.v1";

function parseStoredProgress(value: string): GameProgressSnapshot | null {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") return null;
    const data = parsed as Record<string, unknown>;
    const completed = Array.isArray(data.completed) ? data.completed.filter(isGameId) : [];
    const completedCourses = Array.isArray(data.completedCourses)
      ? data.completedCourses.filter(isGameCourseCompletionKey)
      : [];
    return {
      completed,
      completedCourses,
      totalXp: typeof data.totalXp === "number" && Number.isFinite(data.totalXp) ? Math.max(0, data.totalXp) : 0,
      bestScore: typeof data.bestScore === "number" && Number.isFinite(data.bestScore) ? Math.max(0, data.bestScore) : 0,
      attemptCount: typeof data.attemptCount === "number" && Number.isFinite(data.attemptCount)
        ? Math.max(0, Math.round(data.attemptCount))
        : completed.length,
    };
  } catch {
    return null;
  }
}

const catalogGames: CatalogGame[] = [
  { id: "memory", title: "Ghép cặp siêu tốc", description: "Lật và ghép Hán tự với nghĩa tiếng Việt trước khi hết lượt.", duration: "3 phút", skill: "Trí nhớ", image: "/assets/games/himi-v2-memory.webp", imageAlt: "Himi mới đang chơi ghép cặp thẻ", tone: "coral", icon: Layers3 },
  { id: "connect", title: "Nối nhanh chữ – âm", description: "Nối Hán tự với pinyin tương ứng theo đúng nhịp của video mẫu.", duration: "2 phút", skill: "Liên kết", image: "/assets/games/himi-v2-connect.webp", imageAlt: "Himi mới nối thẻ chữ với thẻ âm thanh", tone: "blue", icon: Link2 },
  { id: "listen", title: "Nghe và chọn đúng", description: "Nghe giọng Trung rồi chọn nghĩa chính xác trong bốn đáp án.", duration: "4 phút", skill: "Nghe hiểu", image: "/assets/games/himi-v2-listen.webp", imageAlt: "Himi mới đeo tai nghe và chọn đáp án", tone: "gold", icon: Headphones },
  { id: "write", title: "Viết chữ theo nghĩa", description: "Nhìn nghĩa tiếng Việt và nhập đúng Hán tự cần dùng.", duration: "4 phút", skill: "Gợi nhớ", image: "/assets/games/himi-v2-write.webp", imageAlt: "Himi mới tập viết bằng bút trên bảng", tone: "violet", icon: Keyboard },
  { id: "flash", title: "Flashcard 3D", description: "Lật thẻ, nghe phát âm và tự chấm mức độ ghi nhớ của bạn.", duration: "3 phút", skill: "Ôn nhanh", image: "/assets/games/himi-v2-flashcard.webp", imageAlt: "Himi mới đang lật bộ flashcard nhiều màu", tone: "rose", icon: BrainCircuit },
  { id: "quiz", title: "Thử thách tổng hợp", description: "Trộn chữ, pinyin và nghĩa thành một lượt kiểm tra ngắn.", duration: "5 phút", skill: "Tổng hợp", image: "/assets/games/himi-v2-quiz.webp", imageAlt: "Himi mới tham gia thử thách chọn đáp án", tone: "teal", icon: CircleHelp },
];

function JourneyTraveler({ targetGameId }: { targetGameId: GameId | null }) {
  const travelerRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const traveler = travelerRef.current;
    const stage = traveler?.closest<HTMLElement>(".game-journey-stage");
    const source = stage?.querySelector<HTMLElement>(".game-journey-guide");
    const target = targetGameId ? stage?.querySelector<HTMLElement>(`[data-game-id="${targetGameId}"]`) : null;
    if (!traveler || !stage || !source || !target) return;

    const stageRect = stage.getBoundingClientRect();
    const sourceRect = source.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const travelerRect = traveler.getBoundingClientRect();
    const startX = sourceRect.left - stageRect.left + sourceRect.width * .52 - travelerRect.width / 2;
    const startY = sourceRect.top - stageRect.top + sourceRect.height * .45 - travelerRect.height / 2;
    const endX = targetRect.left - stageRect.left + targetRect.width / 2 - travelerRect.width / 2;
    const endY = targetRect.top - stageRect.top + targetRect.height * .42 - travelerRect.height / 2;
    const translate = (x: number, y: number, rotation: number, scale: number) => (
      `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) scale(${scale})`
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      traveler.style.opacity = "1";
      traveler.style.transform = translate(endX, endY, 0, .72);
      return () => {
        traveler.style.opacity = "";
        traveler.style.transform = "";
      };
    }

    const horizontalDistance = endX - startX;
    const verticalDistance = endY - startY;
    const animation = traveler.animate([
      { opacity: 0, transform: translate(startX, startY, -5, .7), offset: 0 },
      { opacity: 1, transform: translate(startX, startY, -3, .76), offset: .12 },
      { opacity: 1, transform: translate(startX + horizontalDistance * .34, startY + verticalDistance * .2 - 34, 1, .72), offset: .42 },
      { opacity: 1, transform: translate(startX + horizontalDistance * .72, startY + verticalDistance * .72 + 18, 4, .68), offset: .74 },
      { opacity: 1, transform: translate(endX, endY - 8, -2, .76), offset: .9 },
      { opacity: 1, transform: translate(endX, endY, 0, .72), offset: 1 },
    ], {
      delay: 280,
      duration: 1_640,
      easing: "cubic-bezier(.22, 1, .36, 1)",
      fill: "forwards",
    });

    return () => animation.cancel();
  }, [targetGameId]);

  if (!targetGameId) return null;
  return <img alt="" aria-hidden="true" className="game-journey-traveler" height={1016} ref={travelerRef} src="/assets/games/himi-v2-slice.webp" width={966} />;
}

function GameRuntimeLoading() {
  return <section aria-live="polite" className="game-runtime-loading" role="status">
    <span aria-hidden="true" />
    <strong>Himi đang chuẩn bị trò chơi…</strong>
  </section>;
}

function GameFrame({
  gameId,
  title,
  description,
  progress,
  score,
  roundLabel = "lượt",
  roundValue = 0,
  mascotSrc,
  mascotAlt,
  onExit,
  children,
}: {
  gameId: Exclude<GameId, "slice">;
  title: string;
  description: string;
  progress: string;
  score: number;
  roundLabel?: string;
  roundValue?: number;
  mascotSrc: string;
  mascotAlt: string;
  onExit: () => void;
  children: ReactNode;
}) {
  const course = useContext(HskGameCourseContext);
  const exitLabel = course?.exitLabel ?? "Tất cả trò chơi";
  const backAction = course?.onChangeCourse ?? onExit;
  const backLabel = course
    ? "Quay lại chọn khóa HSK"
    : exitLabel === "Trở lại" ? "Trở về trang trước" : "Quay lại tất cả trò chơi";
  const backText = course ? "Chọn khóa HSK" : exitLabel;
  return (
    <main className="learner-dashboard game-center-dashboard game-session-dashboard game-immersive-dashboard">
      <div className="game-center-shell game-session-shell">
        <section aria-label={title} className={`game-session-world is-${gameId}`} data-session-game={gameId}>
          <div className="game-session-sr-copy">
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <div className="game-session-hud">
            <button aria-label={backLabel} className="game-back-button" onClick={backAction} type="button"><ArrowLeft size={17} /><span>{backText}</span></button>
            <div className="game-session-metrics" aria-label="Tiến độ trò chơi">
              <span><Target aria-hidden="true" size={22} /><span><small>TIẾN ĐỘ</small><strong>{progress}</strong></span></span>
              <span><Star aria-hidden="true" size={22} /><span><small>ĐIỂM</small><strong>{score}</strong></span></span>
              <span><Footprints aria-hidden="true" size={22} /><span><small>{roundLabel.toLocaleUpperCase("vi-VN")}</small><strong>{roundValue}</strong></span></span>
            </div>
          </div>
          <img alt={mascotAlt} className="game-session-mascot" height={640} src={mascotSrc} width={960} />
          {children}
        </section>
      </div>
    </main>
  );
}

function GameResult({ score, label, onRestart, onExit }: { score: number; label: string; onRestart: () => void; onExit: () => void }) {
  const course = useContext(HskGameCourseContext);
  const returnsToPreviousPage = course?.exitLabel === "Trở lại";
  return (
    <GameResultCelebration
      actions={<>
        <button onClick={onRestart} type="button"><RotateCcw size={16} /> Chơi lại</button>
        <button onClick={onExit} type="button">
          {returnsToPreviousPage ? <><ArrowLeft size={16} /> Trở lại</> : <>Chọn trò khác <ArrowRight size={16} /></>}
        </button>
        <DailyGameCompletionAction />
      </>}
      label={label}
      score={score}
    />
  );
}

function DailyGameCompletionAction() {
  const { enabled, syncState } = useContext(DailyGameFlowContext);
  if (!enabled) return null;
  if (syncState === "idle" || syncState === "saving") {
    return <button className="daily-game-flow-action" disabled type="button">Đang lưu kết quả…</button>;
  }
  return <NextLink
    className={`daily-game-flow-action${syncState === "error" ? " is-secondary" : ""}`}
    href="/?session=today#today-summary"
    prefetch={false}
  >
    {syncState === "error" ? "Về phiên hôm nay" : "Xem tổng kết 4/4"} <ArrowRight size={16} />
  </NextLink>;
}

function MemoryGame({ words, onRestart, onExit, onComplete }: HskRoundProps) {
  const matchTimerRef = useRef<number | null>(null);
  useEffect(() => () => {
    if (matchTimerRef.current !== null) window.clearTimeout(matchTimerRef.current);
  }, []);
  const tiles = useMemo(() => {
    const paired = words.flatMap((word) => [
      { id: `${word.id}-hanzi`, wordId: word.id, kind: "hanzi" as const, label: word.hanzi },
      { id: `${word.id}-meaning`, wordId: word.id, kind: "meaning" as const, label: word.meaning },
    ]);
    return shuffleGameItems(paired);
  }, [words]);
  const [selected, setSelected] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [finished, setFinished] = useState(false);

  const score = Math.max(240, 1000 - Math.max(0, moves - 4) * 70);

  const chooseTile = (tile: (typeof tiles)[number]) => {
    if (selected.length >= 2 || selected.includes(tile.id) || matched.includes(tile.wordId)) return;
    if (selected.length === 0) {
      setSelected([tile.id]);
      return;
    }

    const first = tiles.find((item) => item.id === selected[0]);
    setMoves((value) => value + 1);
    setSelected([selected[0], tile.id]);
    if (first?.wordId === tile.wordId && first.kind !== tile.kind) {
      matchTimerRef.current = window.setTimeout(() => {
        const nextMatched = [...matched, tile.wordId];
        setMatched(nextMatched);
        setSelected([]);
        if (nextMatched.length === words.length) {
          const finalScore = Math.max(240, 1000 - Math.max(0, moves + 1 - 4) * 70);
          matchTimerRef.current = window.setTimeout(() => {
            setFinished(true);
            onComplete(finalScore);
          }, 280);
        }
      }, 460);
    } else {
      matchTimerRef.current = window.setTimeout(() => setSelected([]), 900);
    }
  };

  return (
    <GameFrame description="Lật từng thẻ và tìm đúng cặp Hán tự – nghĩa Việt." gameId="memory" mascotAlt="Himi mới cổ vũ trò ghép cặp" mascotSrc="/assets/games/himi-v2-memory.webp" onExit={onExit} progress={`${matched.length} / ${words.length}`} roundValue={moves} score={score} title="Ghép cặp siêu tốc">
      <section className="game-play-card memory-game-stage">
        {finished ? <GameResult label="Bạn đã tìm đủ bốn cặp!" onExit={onExit} onRestart={onRestart} score={score} /> : (
          <>
            <div className="game-instruction"><Layers3 size={18} /><span>Hai thẻ đúng sẽ được giữ sáng. Càng ít lượt lật, điểm càng cao.</span><b>{moves} lượt</b></div>
            <div className="memory-grid" aria-label="Bàn ghép cặp">
              {tiles.map((tile) => {
                const revealed = selected.includes(tile.id) || matched.includes(tile.wordId);
                return (
                  <button aria-label={revealed ? `${tile.kind === "hanzi" ? "Hán tự" : "Nghĩa"}: ${tile.label}` : "Lật thẻ ghi nhớ"} aria-pressed={revealed} className={`${revealed ? "is-revealed" : ""} ${matched.includes(tile.wordId) ? "is-matched" : ""}`.trim()} data-tile-id={tile.id} disabled={matched.includes(tile.wordId)} key={tile.id} onClick={() => chooseTile(tile)} type="button">
                    <span className="memory-tile-inner">
                      <span aria-hidden="true" className="memory-tile-face memory-tile-cover">?</span>
                      <span aria-hidden={!revealed} className="memory-tile-face memory-tile-answer">
                        <span lang={tile.kind === "hanzi" ? "zh-CN" : undefined}>{tile.label}</span>
                        {matched.includes(tile.wordId) ? <Check size={16} /> : null}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </section>
    </GameFrame>
  );
}

function ConnectGame({ words, onRestart, onExit, onComplete }: HskRoundProps) {
  const mistakeTimerRef = useRef<number | null>(null);
  useEffect(() => () => {
    if (mistakeTimerRef.current !== null) window.clearTimeout(mistakeTimerRef.current);
  }, []);
  const rightWords = useMemo(() => shuffleGameItems(words), [words]);
  const [left, setLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const score = Math.max(300, 1000 - mistakes * 100);

  const chooseRight = (word: SliceVocabulary) => {
    if (!left || matched.includes(left) || matched.includes(word.id) || wrong) return;
    if (left === word.id) {
      const nextMatched = [...matched, word.id];
      setMatched(nextMatched);
      setLeft(null);
      if (nextMatched.length === words.length) {
        mistakeTimerRef.current = window.setTimeout(() => {
          setFinished(true);
          onComplete(score);
        }, 280);
      }
      return;
    }
    setMistakes((value) => value + 1);
    setWrong(word.id);
    mistakeTimerRef.current = window.setTimeout(() => {
      setWrong(null);
      setLeft(null);
    }, 460);
  };

  return (
    <GameFrame description="Chọn một Hán tự bên trái, sau đó nối với pinyin đúng bên phải." gameId="connect" mascotAlt="Himi mới đang nối chữ với âm" mascotSrc="/assets/games/himi-v2-connect.webp" onExit={onExit} progress={`${matched.length} / ${words.length}`} roundLabel="lỗi" roundValue={mistakes} score={score} title="Nối nhanh chữ – âm">
      <section className="game-play-card connect-game-stage">
        {finished ? <GameResult label="Các liên kết đã khớp hoàn toàn!" onExit={onExit} onRestart={onRestart} score={score} /> : (
          <>
            <div className="game-instruction"><Link2 size={18} /><span>Mỗi cặp đúng sẽ khóa lại. Chọn sai trừ 100 điểm.</span><b>{mistakes} lỗi</b></div>
            <div className="connect-board">
              <div>
                <span className="connect-column-label">HÁN TỰ</span>
                {words.map((word) => <button aria-label={`Chọn Hán tự ${word.hanzi}`} aria-pressed={left === word.id} className={`${left === word.id ? "is-selected" : ""} ${matched.includes(word.id) ? "is-matched" : ""}`.trim()} disabled={matched.includes(word.id)} key={word.id} onClick={() => setLeft(word.id)} type="button"><strong lang="zh-CN">{word.hanzi}</strong>{matched.includes(word.id) ? <Check size={16} /> : null}</button>)}
              </div>
              <div className="connect-line-column" aria-hidden="true"><Link2 size={22} /></div>
              <div>
                <span className="connect-column-label">PINYIN</span>
                {rightWords.map((word) => <button aria-label={`Chọn pinyin ${word.pinyin}`} className={`${matched.includes(word.id) ? "is-matched" : ""} ${wrong === word.id ? "is-wrong" : ""}`.trim()} disabled={matched.includes(word.id)} key={word.id} onClick={() => chooseRight(word)} type="button"><span>{word.pinyin}</span>{wrong === word.id ? <X size={16} /> : matched.includes(word.id) ? <Check size={16} /> : null}</button>)}
              </div>
            </div>
          </>
        )}
      </section>
    </GameFrame>
  );
}

// A new round gets fresh animation nodes; retain a useful keyboard focus target.
function useGameRoundFocus(index: number) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (index > 0) ref.current?.querySelector<HTMLElement>("input, button")?.focus({ preventScroll: true });
  }, [index]);
  return ref;
}

function ListenGame({ words, onRestart, onExit, onComplete }: HskRoundProps) {
  const [index, setIndex] = useState(0);
  const roundRef = useGameRoundFocus(index);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const word = words[index];
  const options = useMemo(() => hskMeaningOptions(words, index), [words, index]);
  const score = correct * 200;

  const choose = (option: string) => {
    if (selected) return;
    setSelected(option);
    if (option === word.meaning) setCorrect((value) => value + 1);
  };

  const next = () => {
    if (!selected) return;
    if (index === words.length - 1) {
      const finalScore = correct * 200;
      setFinished(true);
      onComplete(finalScore);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  };

  return (
    <GameFrame description="Nghe từ tiếng Trung, sau đó chọn nghĩa tiếng Việt chính xác." gameId="listen" mascotAlt="Himi mới luyện nghe" mascotSrc="/assets/games/himi-v2-listen.webp" onExit={onExit} progress={`${index + 1} / ${words.length}`} roundLabel="đúng" roundValue={correct} score={score} title="Nghe và chọn đúng">
      <section className="game-play-card listen-game-stage" key={index} ref={roundRef}>
        {finished ? <GameResult label={`Bạn nghe đúng ${correct}/${words.length} từ.`} onExit={onExit} onRestart={onRestart} score={correct * 200} /> : (
          <>
            <div className="listen-prompt">
              <span>NGHE TỪ SỐ {String(index + 1).padStart(2, "0")}</span>
              <button aria-label="Phát âm từ tiếng Trung" onClick={() => speakChinese(word.hanzi)} type="button"><Volume2 size={28} /></button>
              <h2>Bấm để nghe</h2>
              <p>Có thể nghe lại nhiều lần trước khi chọn.</p>
            </div>
            <div className="listen-options">
              {options.map((option, optionIndex) => {
                const state = selected ? option === word.meaning ? "is-correct" : selected === option ? "is-wrong" : "" : "";
                return <button className={state} key={option} onClick={() => choose(option)} type="button"><span>{String.fromCharCode(65 + optionIndex)}</span>{option}{state === "is-correct" ? <Check size={17} /> : state === "is-wrong" ? <X size={17} /> : null}</button>;
              })}
            </div>
            <button className="game-next-button" disabled={!selected} onClick={next} type="button">{index === words.length - 1 ? "Xem kết quả" : "Câu tiếp theo"}<ArrowRight size={17} /></button>
          </>
        )}
      </section>
    </GameFrame>
  );
}

function WriteGame({ words, onRestart, onExit, onComplete }: HskRoundProps) {
  const [index, setIndex] = useState(0);
  const roundRef = useGameRoundFocus(index);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const word = words[index];
  const score = correct * 200;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!answer.trim() || status === "correct") return;
    if (answer.trim() === word.hanzi) {
      setStatus("correct");
      setCorrect((value) => value + 1);
    } else {
      setStatus("wrong");
    }
  };

  const next = () => {
    if (status !== "correct") return;
    if (index === words.length - 1) {
      const finalScore = correct * 200;
      setFinished(true);
      onComplete(finalScore);
      return;
    }
    setIndex((value) => value + 1);
    setAnswer("");
    setStatus("idle");
  };

  return (
    <GameFrame description="Nhìn nghĩa tiếng Việt và nhập đúng Hán tự tương ứng." gameId="write" mascotAlt="Himi mới tập viết Hán tự" mascotSrc="/assets/games/himi-v2-write.webp" onExit={onExit} progress={`${index + 1} / ${words.length}`} roundLabel="đúng" roundValue={correct} score={score} title="Viết chữ theo nghĩa">
      <section className="game-play-card write-game-stage" key={index} ref={roundRef}>
        {finished ? <GameResult label="Bạn đã gọi lại đủ năm từ!" onExit={onExit} onRestart={onRestart} score={correct * 200} /> : (
          <>
            <div className="write-prompt">
              <span>NGHĨA TIẾNG VIỆT</span>
              <h2>{word.meaning}</h2>
              <p>Gợi ý pinyin: <b>{word.pinyin.replace(/[a-zà-ỹ]/giu, "•")}</b></p>
            </div>
            <form className={`write-answer-form is-${status}`} onSubmit={submit}>
              <label htmlFor="game-hanzi-answer">Nhập Hán tự tại đây</label>
              <div>
                <input autoComplete="off" id="game-hanzi-answer" lang="zh-CN" onChange={(event) => { setAnswer(event.target.value); if (status === "wrong") setStatus("idle"); }} placeholder="Ví dụ: 谢谢" spellCheck={false} value={answer} />
                <button disabled={!answer.trim()} type="submit">Kiểm tra <Check size={17} /></button>
              </div>
              <span aria-live="polite">{status === "correct" ? <><Check size={15} /> Chính xác: {word.hanzi} · {word.pinyin}</> : status === "wrong" ? <><X size={15} /> Chưa đúng, thử nhìn lại nghĩa và pinyin.</> : "Bạn có thể dùng bộ gõ tiếng Trung của thiết bị."}</span>
            </form>
            <button className="game-next-button" disabled={status !== "correct"} onClick={next} type="button">{index === words.length - 1 ? "Hoàn thành" : "Từ tiếp theo"}<ArrowRight size={17} /></button>
          </>
        )}
      </section>
    </GameFrame>
  );
}

function FlashcardGame({ words, onRestart, onExit, onComplete }: HskRoundProps) {
  const course = useContext(HskGameCourseContext);
  const [index, setIndex] = useState(0);
  const roundRef = useGameRoundFocus(index);
  const [flipped, setFlipped] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [reviewSaveState, setReviewSaveState] = useState<"idle" | "saving" | "error" | "auth-required">("idle");
  const [savedNotice, setSavedNotice] = useState<VocabularySavedNotice | null>(null);
  const [known, setKnown] = useState(0);
  const [finished, setFinished] = useState(false);
  const word = words[index];
  const score = known * 160;

  const advance = (remembered: boolean) => {
    const nextKnown = known + (remembered ? 1 : 0);
    if (index === words.length - 1) {
      const finalScore = nextKnown * 160;
      setKnown(nextKnown);
      setFinished(true);
      onComplete(finalScore);
      return;
    }
    setKnown(nextKnown);
    setIndex((value) => value + 1);
    setFlipped(false);
    setRevealed(false);
    setReviewSaveState("idle");
  };

  const rate = async (remembered: boolean) => {
    if (!revealed || reviewSaveState === "saving") return;
    if (!remembered) {
      if (!course?.authenticated) {
        setReviewSaveState("auth-required");
        return;
      }
      setReviewSaveState("saving");
      const saved = await trySaveHskGameVocabularyWord(course.level, word);
      if (!saved) {
        setReviewSaveState("error");
        return;
      }
      setSavedNotice({
        hanzi: word.hanzi,
        id: `${word.id}-${Date.now()}`,
        meaning: word.meaning,
      });
    }
    advance(remembered);
  };

  return (
    <GameFrame description="Lật thẻ để xem nghĩa, nghe phát âm rồi tự đánh giá mức nhớ." gameId="flash" mascotAlt="Himi mới ôn tập cùng flashcard" mascotSrc="/assets/games/himi-v2-flashcard.webp" onExit={onExit} progress={`${index + 1} / ${words.length}`} roundLabel="nhớ" roundValue={known} score={score} title="Flashcard 3D">
      <section className="game-play-card flash-game-stage" key={index} ref={roundRef}>
        {finished ? <GameResult label={`Bạn nhớ chắc ${known}/${words.length} từ.`} onExit={onExit} onRestart={onRestart} score={known * 160} /> : (
          <>
            <button aria-label={flipped ? "Xem mặt Hán tự" : "Lật thẻ xem nghĩa"} className={`flashcard-3d ${flipped ? "is-flipped" : ""}`} onClick={() => { setFlipped((value) => !value); setRevealed(true); setReviewSaveState("idle"); }} type="button">
              <span className="flashcard-3d-inner">
                <span className="flashcard-face flashcard-front"><small>HÁN TỰ</small><strong lang="zh-CN">{word.hanzi}</strong><em>Bấm để lật thẻ</em></span>
                <span className="flashcard-face flashcard-back"><small>NGHĨA & PHIÊN ÂM</small><strong>{word.meaning}</strong><b>{word.pinyin}</b><em lang="zh-CN">{word.example}</em></span>
              </span>
            </button>
            <div className="flash-audio-row"><button onClick={() => speakChinese(word.hanzi)} type="button"><Volume2 size={18} /> Nghe phát âm</button><span><Sparkles size={15} /> Lật thẻ trước khi tự chấm</span></div>
            {revealed ? <div className="flash-rating-actions">
              <button aria-busy={reviewSaveState === "saving"} disabled={reviewSaveState === "saving"} onClick={() => void rate(false)} type="button"><X size={17} /> {reviewSaveState === "saving" ? "Đang thêm vào kho…" : "Cần ôn lại"}</button>
              <button disabled={reviewSaveState === "saving"} onClick={() => void rate(true)} type="button"><Check size={17} /> Đã nhớ</button>
            </div> : null}
            {reviewSaveState === "auth-required" ? <p className="flash-save-status" role="alert">Đăng nhập để thêm từ này vào Kho từ vựng.</p> : reviewSaveState === "error" ? <p className="flash-save-status" role="alert">Chưa thêm được vào Kho từ vựng. Bạn hãy thử lại nhé.</p> : null}
          </>
        )}
      </section>
      {savedNotice ? <VocabularySavedToast key={savedNotice.id} notice={savedNotice} onDismiss={() => setSavedNotice(null)} /> : null}
    </GameFrame>
  );
}

function QuizGame({ words, onRestart, onExit, onComplete }: HskRoundProps) {
  const [index, setIndex] = useState(0);
  const roundRef = useGameRoundFocus(index);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const word = words[index];
  const options = useMemo(() => hskMeaningOptions(words, index), [words, index]);
  const score = correct * 200;

  const choose = (option: string) => {
    if (selected) return;
    setSelected(option);
    if (option === word.meaning) setCorrect((value) => value + 1);
  };

  const next = () => {
    if (!selected) return;
    if (index === words.length - 1) {
      const finalScore = correct * 200;
      setFinished(true);
      onComplete(finalScore);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  };

  return (
    <GameFrame description="Một lượt kiểm tra ngắn kết hợp nhận diện chữ, nghĩa và phát âm." gameId="quiz" mascotAlt="Himi mới tham gia thử thách tổng hợp" mascotSrc="/assets/games/himi-v2-quiz.webp" onExit={onExit} progress={`${index + 1} / ${words.length}`} roundLabel="đúng" roundValue={correct} score={score} title="Thử thách tổng hợp">
      <section className="game-play-card quiz-game-stage" key={index} ref={roundRef}>
        {finished ? <GameResult label={`Bạn trả lời đúng ${correct}/${words.length} câu.`} onExit={onExit} onRestart={onRestart} score={correct * 200} /> : (
          <>
            <div className="quiz-question"><span>CÂU {String(index + 1).padStart(2, "0")}</span><small>Chọn nghĩa đúng của từ</small><h2 lang="zh-CN">{word.hanzi}</h2><button aria-label="Nghe phát âm" onClick={() => speakChinese(word.hanzi)} type="button"><Volume2 size={18} /></button></div>
            <div className="quiz-options">
              {options.map((option, optionIndex) => {
                const state = selected ? option === word.meaning ? "is-correct" : selected === option ? "is-wrong" : "" : "";
                return <button className={state} key={option} onClick={() => choose(option)} type="button"><b>{String.fromCharCode(65 + optionIndex)}</b><span>{option}</span>{state === "is-correct" ? <Check size={17} /> : state === "is-wrong" ? <X size={17} /> : null}</button>;
              })}
            </div>
            <button className="game-next-button" disabled={!selected} onClick={next} type="button">{index === words.length - 1 ? "Xem kết quả" : "Câu tiếp theo"}<ArrowRight size={17} /></button>
          </>
        )}
      </section>
    </GameFrame>
  );
}

const hskGameComponents = {
  memory: MemoryGame,
  connect: ConnectGame,
  listen: ListenGame,
  write: WriteGame,
  flash: FlashcardGame,
  quiz: QuizGame,
};

export function GameCenter({
  authenticated,
  dailyFlow,
  initialGameId,
  initialProgress,
}: {
  authenticated: boolean;
  dailyFlow: boolean;
  initialGameId: GameId | null;
  initialProgress: GameProgressSnapshot;
}) {
  const router = useRouter();
  const [activeGame, setActiveGame] = useState<GameId | null>(initialGameId);
  const [record, setRecord] = useState<GameProgressSnapshot>(initialProgress);
  const [syncState, setSyncState] = useState<GameSyncState>("idle");
  const recommendedGameId = record.completed.includes("slice")
    ? catalogGames.find((game) => !record.completed.includes(game.id))?.id ?? null
    : null;
  const exitLabel = initialGameId ? "Trở lại" : "Tất cả trò chơi";

  useEffect(() => {
    if (authenticated) return;
    const handle = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        const parsed = saved ? parseStoredProgress(saved) : null;
        if (parsed) setRecord(parsed);
      } catch {
        // The game center still works when private browsing blocks local storage.
      }
    }, 0);
    return () => window.clearTimeout(handle);
  }, [authenticated]);

  useEffect(() => {
    // The game catalog is tall on mobile. Start every selected game at its
    // heading instead of inheriting the catalog's previous scroll position.
    window.scrollTo(0, 0);
  }, [activeGame]);

  const completeGame = useCallback((id: GameId, score: number, hskLevel?: SliceHskLevel) => {
    setRecord((current) => {
      const completedCourse = hskLevel ? gameCourseCompletionKey(id, hskLevel) : null;
      const next = {
        completed: current.completed.includes(id) ? current.completed : [...current.completed, id],
        completedCourses: completedCourse && !current.completedCourses.includes(completedCourse)
          ? [...current.completedCourses, completedCourse]
          : current.completedCourses,
        totalXp: current.totalXp + xpForGameScore(score),
        bestScore: Math.max(current.bestScore, score),
        attemptCount: current.attemptCount + 1,
      };
      if (!authenticated) {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Keep the in-memory result when storage is unavailable.
        }
      }
      return next;
    });

    if (!authenticated) {
      setSyncState("saved");
      return;
    }

    setSyncState("saving");
    void fetch("/api/progress/game", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ gameId: id, hskLevel, score }),
      keepalive: true,
    }).then(async (response) => {
      if (!response.ok) throw new Error("Game attempt save failed");
      const payload = await response.json() as { progress?: GameProgressSnapshot };
      if (payload.progress) setRecord(payload.progress);
      setSyncState("saved");
    }).catch(() => setSyncState("error"));
  }, [authenticated]);

  const exitGame = useCallback(() => {
    if (initialGameId) {
      if (window.history.length > 1) router.back();
      else router.replace("/games");
      return;
    }
    setActiveGame(null);
  }, [initialGameId, router]);

  let activeGameView: ReactNode = null;
  if (activeGame === "slice") activeGameView = <Suspense fallback={<GameRuntimeLoading />}>
    <WritingSliceGame completedCourses={record.completedCourses} completionAction={<DailyGameCompletionAction />} exitLabel={exitLabel} onComplete={(score, level) => completeGame("slice", score, level)} onExit={exitGame} />
  </Suspense>;
  if (activeGame && activeGame !== "slice") {
    const game = catalogGames.find((item) => item.id === activeGame)!;
    const gameId: HskGameId = activeGame;
    const Game = hskGameComponents[gameId];
    activeGameView = <HskGameSession authenticated={authenticated} completedCourses={record.completedCourses} exitLabel={exitLabel} gameId={gameId} key={gameId} onExit={exitGame} title={game.title}>
      {(words, onRestart, level) => <Game words={words} onRestart={onRestart} onComplete={(score) => completeGame(gameId, score, level)} onExit={exitGame} />}
    </HskGameSession>;
  }
  if (activeGameView) return <DailyGameFlowContext.Provider value={{ enabled: dailyFlow, syncState }}>
    {activeGameView}
  </DailyGameFlowContext.Provider>;

  return (
    <main className="learner-dashboard game-center-dashboard">
      <h1 className="sr-only">Trung tâm trò chơi Himi</h1>
      <div className="game-center-shell game-journey-shell">
        <section className="game-journey-stage" aria-label="Hành trình trò chơi">
          <picture className="game-journey-background">
            <source media="(max-width: 960px)" srcSet="/assets/games/journey-map-mobile-long.webp" />
            <img alt="" height={1067} src="/assets/games/journey-map-desktop.webp" width={1600} />
          </picture>

          <JourneyTraveler targetGameId={recommendedGameId} />

          <div className="game-journey-status">
            <div className="game-journey-progress" aria-label={`${record.completed.length} trên 7 trò đã hoàn thành`}>
              <Sparkles size={16} />
              <strong>{record.completed.length} / 7</strong>
              <span>trò chơi</span>
            </div>
            <small className={`game-progress-sync is-${syncState}`} role="status">
              {syncState === "saving" ? "Đang đồng bộ kết quả…"
                : syncState === "error" ? "Chưa đồng bộ được kết quả gần nhất"
                  : authenticated ? `${record.totalXp} XP · đồng bộ tài khoản` : `${record.totalXp} XP · lưu trên thiết bị`}
            </small>
          </div>

          <section className={`game-journey-featured ${record.completed.includes("slice") ? "is-complete" : ""}`.trim()} aria-label="Trạm hiện tại: Luyện chém từ">
            <div className="game-journey-featured-card">
              <span className="game-journey-featured-number">01</span>
              {record.completed.includes("slice") ? <span className="game-journey-done"><Check size={13} /> Đã hoàn thành</span> : null}
              <small>PHẢN XẠ PINYIN · HIMI MODE</small>
              <h2>Luyện chém từ</h2>
              <p>Nhìn chữ đang rơi, gõ pinyin trước khi chạm đất. Himi sẽ lao lên chém gọn đáp án đúng và giữ combo cho bạn.</p>
              <div className="game-journey-featured-meta">
                <span><Timer size={14} /> 4 phút</span>
                <span><Zap size={14} /> 12 từ</span>
              </div>
              <button onClick={() => setActiveGame("slice")} type="button">
                <Play fill="currentColor" size={17} /> Tiếp tục chơi
              </button>
            </div>
            <img alt="Himi mới cầm gậy tre chỉ về thử thách tiếp theo" className="game-journey-guide" height={1016} src="/assets/games/himi-v2-slice.webp" width={966} />
          </section>

          <div className="game-journey-stations" aria-label="Các trạm trò chơi">
            {catalogGames.map((game, index) => {
              const Icon = game.icon;
              const completed = record.completed.includes(game.id);
              const stationNumber = index + 2;
              return (
                <button
                  aria-label={`Trạm ${stationNumber}: Chơi ${game.title}`}
                  className={`game-journey-station station-${stationNumber} ${completed ? "is-complete" : ""}`.trim()}
                  data-game-id={game.id}
                  key={game.id}
                  onClick={() => setActiveGame(game.id)}
                  type="button"
                >
                  <span className="game-journey-station-number">{String(stationNumber).padStart(2, "0")}</span>
                  <span className="game-journey-station-visual">
                    <img alt={game.imageAlt} height={640} loading="lazy" src={game.image} width={960} />
                    <span className={`game-journey-station-icon tone-${game.tone}`}><Icon size={18} /></span>
                  </span>
                  <span className="game-journey-station-copy">
                    <strong>{game.title}</strong>
                  </span>
                  {completed ? <span className="game-journey-station-complete"><Check size={13} /> Đã chơi</span> : null}
                </button>
              );
            })}
          </div>

          <aside className="game-journey-skills" aria-label="Kỹ năng bạn đang rèn">
            <strong><Sparkles size={14} /> Kỹ năng bạn đang rèn</strong>
            <div>
              <span><Zap size={17} /><small>Phản xạ</small></span>
              <span><Trophy size={17} /><small>Chính xác</small></span>
              <span><BrainCircuit size={17} /><small>Ghi nhớ</small></span>
            </div>
          </aside>
        </section>

        <footer className="game-center-footer-note"><Sparkles size={17} /><span><strong>Ôn từ vựng HSK qua trò chơi.</strong> Chọn HSK1–HSK6 để luyện từ các bài học trong khóa. Mỗi lượt chơi là một bộ từ mới.</span></footer>
      </div>
    </main>
  );
}
