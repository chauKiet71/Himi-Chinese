"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Footprints,
  LockKeyhole,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  Volume2,
  X,
} from "lucide-react";
import { speakChinese } from "@/lib/game-content";
import type { HskLessonContent } from "@/lib/hsk-lesson-content";
import { VipUpgradeInlineForm } from "@/components/vip-upgrade-prompt";
import {
  getHskLessonProgressStorageKey,
  parseHskLessonProgress,
} from "@/lib/hsk-lesson-progress";
import { trySaveHskVocabularyWord } from "@/lib/saved-vocabulary-client";
import { GameResultCelebration } from "@/components/game-result-celebration";
import { VocabularySavedToast, type VocabularySavedNotice } from "@/components/vocabulary-saved-toast";

function saveRememberedWord(lessonId: string, wordId: string): void {
  try {
    const storageKey = getHskLessonProgressStorageKey(lessonId);
    const progress = parseHskLessonProgress(window.localStorage.getItem(storageKey));
    if (progress.vocabulary.includes(wordId)) return;
    window.localStorage.setItem(storageKey, JSON.stringify({
      ...progress,
      vocabulary: [...progress.vocabulary, wordId],
    }));
  } catch {
    // The flashcard session remains usable when browser storage is unavailable.
  }
}

export function HskFlashcardSession({ lesson, backHref, authenticated = false }: {
  lesson: HskLessonContent;
  backHref: string;
  authenticated?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [reviewSaveState, setReviewSaveState] = useState<"idle" | "saving" | "error" | "auth-required">("idle");
  const [savedNotice, setSavedNotice] = useState<VocabularySavedNotice | null>(null);
  const [rememberedIds, setRememberedIds] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const word = lesson.vocabulary[index];
  const accessibleWordCount = lesson.vocabulary.filter((item) => !item.locked).length;
  const score = rememberedIds.length * 160;

  const advance = () => {
    if (index === lesson.vocabulary.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((current) => current + 1);
    setFlipped(false);
    setRevealed(false);
    setReviewSaveState("idle");
  };

  const rate = async (remembered: boolean) => {
    if (!revealed || reviewSaveState === "saving") return;

    if (!remembered) {
      if (!authenticated) {
        setReviewSaveState("auth-required");
        return;
      }
      setReviewSaveState("saving");
      const saved = await trySaveHskVocabularyWord(lesson, word);
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

    if (remembered) {
      saveRememberedWord(lesson.id, word.id);
      setRememberedIds((current) => current.includes(word.id) ? current : [...current, word.id]);
    }

    advance();
  };

  const restart = () => {
    setIndex(0);
    setFlipped(false);
    setRevealed(false);
    setReviewSaveState("idle");
    setSavedNotice(null);
    setRememberedIds([]);
    setFinished(false);
  };

  return <main className="learner-dashboard game-center-dashboard game-session-dashboard game-immersive-dashboard hsk-flashcard-session">
    <div className="game-center-shell game-session-shell">
      <section aria-label={`Flashcard ${lesson.levelLabel}: ${lesson.title}`} className="game-session-world is-flash">
        <div className="game-session-sr-copy">
          <h1>Flashcard {lesson.levelLabel}</h1>
          <p>Lật thẻ để xem nghĩa, nghe phát âm rồi tự đánh giá mức nhớ.</p>
        </div>

        <div className="game-session-hud">
          <Link aria-label="Quay lại bài học" className="game-back-button" href={backHref}>
            <ArrowLeft aria-hidden="true" size={17} />
            <span>Quay lại bài học</span>
          </Link>
          <div aria-label="Tiến độ học flashcard" className="game-session-metrics">
            <span><Target aria-hidden="true" size={22} /><span><small>TIẾN ĐỘ</small><strong>{Math.min(index + 1, lesson.vocabulary.length)} / {lesson.vocabulary.length}</strong></span></span>
            <span><Star aria-hidden="true" size={22} /><span><small>ĐIỂM</small><strong>{score}</strong></span></span>
            <span><Footprints aria-hidden="true" size={22} /><span><small>NHỚ</small><strong>{rememberedIds.length}</strong></span></span>
          </div>
        </div>

        <Image
          alt="Himi mới đang lật bộ flashcard nhiều màu"
          className="game-session-mascot"
          height={640}
          priority
          src="/assets/games/himi-v2-flashcard.webp"
          width={960}
        />

        <section className="game-play-card flash-game-stage">
          {finished ? <GameResultCelebration
            actions={<>
              <button onClick={restart} type="button"><RotateCcw aria-hidden="true" size={16} /> Học lại</button>
              <Link href={backHref}>Về bài học <ArrowRight aria-hidden="true" size={16} /></Link>
            </>}
            eyebrow="HOÀN THÀNH BỘ FLASHCARD"
            label={`Bạn nhớ chắc ${rememberedIds.length}/${accessibleWordCount} từ có thể học.`}
            score={score}
          /> : word.locked ? <div className="game-result flashcard-vip-lock">
            <span><LockKeyhole aria-hidden="true" size={28} /></span>
            <small>TỪ VỰNG VIP · {index + 1}/{lesson.vocabulary.length}</small>
            <h2>Từ này cần tài khoản VIP</h2>
            <p>Nội dung từ, pinyin, nghĩa và ví dụ chưa được gửi tới trình duyệt.</p>
            <div><VipUpgradeInlineForm /><button onClick={advance} type="button">{index === lesson.vocabulary.length - 1 ? "Hoàn thành" : "Từ tiếp theo"}<ArrowRight aria-hidden="true" size={16} /></button></div>
          </div> : <>
            <button
              aria-label={flipped ? "Xem mặt Hán tự" : "Lật thẻ xem nghĩa"}
              className={`flashcard-3d${flipped ? " is-flipped" : ""}`}
              onClick={() => { setFlipped((current) => !current); setRevealed(true); setReviewSaveState("idle"); }}
              type="button"
            >
              <span className="flashcard-3d-inner">
                <span className="flashcard-face flashcard-front">
                  <small>HÁN TỰ</small>
                  <strong lang="zh-CN">{word.hanzi}</strong>
                  <em>Bấm để lật thẻ</em>
                </span>
                <span className="flashcard-face flashcard-back">
                  <small>NGHĨA &amp; PHIÊN ÂM</small>
                  <strong>{word.meaning}</strong>
                  <b>{word.pinyin}</b>
                  <em lang="zh-CN">{word.example}</em>
                </span>
              </span>
            </button>

            <div className="flash-audio-row">
              <button onClick={() => speakChinese(word.hanzi)} type="button"><Volume2 aria-hidden="true" size={18} /> Nghe phát âm</button>
              <span><Sparkles aria-hidden="true" size={15} /> Lật thẻ trước khi tự chấm</span>
            </div>
            {revealed ? <div className="flash-rating-actions">
              <button aria-busy={reviewSaveState === "saving"} disabled={reviewSaveState === "saving"} onClick={() => void rate(false)} type="button"><X aria-hidden="true" size={17} /> {reviewSaveState === "saving" ? "Đang thêm vào kho…" : "Cần ôn lại"}</button>
              <button disabled={reviewSaveState === "saving"} onClick={() => void rate(true)} type="button"><Check aria-hidden="true" size={17} /> Đã nhớ</button>
            </div> : null}
            {reviewSaveState === "auth-required" ? <p className="flash-save-status" role="alert">Đăng nhập để thêm từ này vào Kho từ vựng.</p> : reviewSaveState === "error" ? <p className="flash-save-status" role="alert">Chưa thêm được vào Kho từ vựng. Bạn hãy thử lại nhé.</p> : null}
          </>}
        </section>

        {savedNotice ? <VocabularySavedToast key={savedNotice.id} notice={savedNotice} onDismiss={() => setSavedNotice(null)} /> : null}

      </section>
    </div>
  </main>;
}
