"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BarChart3, BookOpen, Bookmark, Check, Headphones, List, PenLine, Play, Target, Trophy, Volume2, X } from "lucide-react";
import { LessonSpeedMenu, type LessonPlaybackRate } from "@/components/lesson-speed-menu";
import { PronunciationEvaluator, type PronunciationRecording, type PronunciationResult } from "@/components/pronunciation-evaluator";
import { VipContentGate } from "@/components/vip-upgrade-prompt";
import { speakMandarin } from "@/lib/client-mandarin-audio";
import type { Course, DialogueLine, LessonAccess, LessonDetail, LessonProgressState, LessonSummary } from "@/lib/content-types";
import { recordRecentIndustryLesson } from "@/lib/recent-industry-learning";

type GuidedSection = "vocabulary" | "phrases" | "listening";
type GuidedPhrase = DialogueLine & { id: string };

const SECTION_LABELS: Record<GuidedSection, string> = {
  vocabulary: "Từ vựng",
  phrases: "Cụm từ",
  listening: "Nghe & Nói",
};

function splitPhraseClause(hanzi: string) {
  const punctuationIndex = hanzi.search(/[，,：:]/u);
  if (punctuationIndex > 0) return [hanzi.slice(0, punctuationIndex + 1), hanzi.slice(punctuationIndex + 1).trim()] as const;
  const characters = Array.from(hanzi);
  const leadLength = Math.min(3, Math.max(1, Math.floor(characters.length / 3)));
  return [characters.slice(0, leadLength).join(""), characters.slice(leadLength).join("")] as const;
}

function renderScoredHanzi(hanzi: string, result: PronunciationResult | null) {
  let hanziIndex = 0;
  return Array.from(hanzi).map((character, characterIndex) => {
    const state = /\p{Script=Han}/u.test(character)
      ? result?.characterFeedback[hanziIndex++] ?? "unscored"
      : "unscored";
    return <span className={`industry-listening-character is-${state}`} key={`${character}-${characterIndex}`}>{character}</span>;
  });
}

export function IndustryGuidedLesson({ course, lessons, lesson, access, progress, authenticated }: {
  course: Course;
  lessons: LessonSummary[];
  lesson: LessonDetail;
  access: LessonAccess;
  progress: LessonProgressState | null;
  authenticated: boolean;
}) {
  const phrases = useMemo<GuidedPhrase[]>(() => {
    const source = lesson.phrases?.length ? lesson.phrases : lesson.dialogue;
    return source.map((line, index) => ({ ...line, id: `phrase-${index}-${line.hanzi}` }));
  }, [lesson.dialogue, lesson.phrases]);
  const listeningItems = useMemo<GuidedPhrase[]>(() => {
    const source = lesson.dialogue.length ? lesson.dialogue : phrases;
    if (source.length) return source.map((line, index) => ({ ...line, id: `listen-${index}-${line.hanzi}` }));
    return lesson.vocabulary.map((word, index) => ({
      id: `listen-word-${index}-${word.slug}`,
      speaker: "",
      hanzi: word.example || word.hanzi,
      pinyin: word.pinyin,
      translation: word.translation || word.meaning,
    }));
  }, [lesson.dialogue, lesson.vocabulary, phrases]);
  const sectionItems = useMemo(() => ({ vocabulary: lesson.vocabulary, phrases, listening: listeningItems }), [lesson.vocabulary, listeningItems, phrases]);
  const availableSections = useMemo(() => (Object.keys(SECTION_LABELS) as GuidedSection[]).filter((item) => sectionItems[item].length > 0), [sectionItems]);
  const [section, setSection] = useState<GuidedSection>(() => availableSections[0] ?? "vocabulary");
  const [itemIndex, setItemIndex] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<LessonPlaybackRate>(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [savedSlugs, setSavedSlugs] = useState<Set<string>>(() => new Set());
  const [pronunciationResults, setPronunciationResults] = useState<Record<string, PronunciationResult>>({});
  const [recordingUrls, setRecordingUrls] = useState<Record<string, string>>({});
  const [playingRecordingId, setPlayingRecordingId] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingUrlsRef = useRef<Record<string, string>>({});
  const router = useRouter();

  const totalSteps = availableSections.reduce((total, item) => total + sectionItems[item].length, 0);
  const sectionOffset = availableSections.slice(0, Math.max(0, availableSections.indexOf(section))).reduce((total, item) => total + sectionItems[item].length, 0);
  const currentStep = Math.min(totalSteps, sectionOffset + itemIndex + 1);
  const currentWord = section === "vocabulary" ? lesson.vocabulary[itemIndex] : null;
  const currentPhrase = section === "phrases" ? phrases[itemIndex] : section === "listening" ? listeningItems[itemIndex] : null;
  const nextLesson = lessons.find((item) => item.order === lesson.order + 1);
  const closeHref = `/courses/${course.slug}`;
  const nextLessonHref = nextLesson ? `/learn/${course.slug}?lesson=${nextLesson.slug}` : closeHref;

  useEffect(() => {
    if (!access.allowed) return;
    const liveProgress = completed || progress?.completionPercent === 100
      ? 100
      : totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;
    recordRecentIndustryLesson(course, lesson, liveProgress);
  }, [access.allowed, completed, course, currentStep, lesson, progress?.completionPercent, totalSteps]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setPlayingRecordingId(null);
  }, []);

  useEffect(() => () => {
    stopAudio();
    Object.values(recordingUrlsRef.current).forEach((url) => URL.revokeObjectURL(url));
  }, [stopAudio]);

  useEffect(() => {
    if (!authenticated || !access.allowed) return;
    void fetch("/api/progress/lesson/open", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ courseSlug: course.slug, lessonSlug: lesson.slug }),
      keepalive: true,
    });
  }, [access.allowed, authenticated, course.slug, lesson.slug]);

  const selectSection = (nextSection: GuidedSection) => {
    if (!sectionItems[nextSection].length) return;
    stopAudio();
    setSection(nextSection);
    setItemIndex(0);
  };

  const playCurrent = async () => {
    const text = currentWord?.hanzi ?? currentPhrase?.hanzi;
    if (!text || isSpeaking) return;
    stopAudio();
    setIsSpeaking(true);
    if (currentWord?.audioUrl) {
      try {
        const audio = new Audio(currentWord.audioUrl);
        audio.playbackRate = playbackRate;
        audioRef.current = audio;
        const finish = () => { audioRef.current = null; setIsSpeaking(false); };
        audio.addEventListener("ended", finish, { once: true });
        audio.addEventListener("error", finish, { once: true });
        await audio.play();
        return;
      } catch {
        audioRef.current = null;
      }
    }
    const started = speakMandarin(text, () => setIsSpeaking(false), playbackRate);
    if (!started) setIsSpeaking(false);
  };

  const saveWord = async () => {
    if (!currentWord) return;
    const isSaved = savedSlugs.has(currentWord.slug);
    setSavedSlugs((items) => {
      const next = new Set(items);
      if (isSaved) next.delete(currentWord.slug);
      else next.add(currentWord.slug);
      return next;
    });
    if (!authenticated) return;
    await fetch("/api/progress/review", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ vocabularySlug: currentWord.slug, saved: !isSaved }),
    }).catch(() => undefined);
  };

  const receivePronunciation = useCallback((phraseId: string, result: PronunciationResult, recording: PronunciationRecording) => {
    const recordingUrl = URL.createObjectURL(recording.blob);
    const previousUrl = recordingUrlsRef.current[phraseId];
    if (previousUrl) URL.revokeObjectURL(previousUrl);
    recordingUrlsRef.current = { ...recordingUrlsRef.current, [phraseId]: recordingUrl };
    setRecordingUrls((items) => ({ ...items, [phraseId]: recordingUrl }));
    setPronunciationResults((items) => ({ ...items, [phraseId]: result }));
  }, []);

  const playUserRecording = useCallback(async () => {
    if (!currentPhrase) return;
    const recordingUrl = recordingUrlsRef.current[currentPhrase.id];
    if (!recordingUrl) return;
    if (playingRecordingId === currentPhrase.id) {
      stopAudio();
      return;
    }

    stopAudio();
    const audio = new Audio(recordingUrl);
    audioRef.current = audio;
    setPlayingRecordingId(currentPhrase.id);
    const finish = () => {
      if (audioRef.current === audio) audioRef.current = null;
      setPlayingRecordingId((activeId) => activeId === currentPhrase.id ? null : activeId);
    };
    audio.addEventListener("ended", finish, { once: true });
    audio.addEventListener("error", finish, { once: true });
    try {
      await audio.play();
    } catch {
      finish();
    }
  }, [currentPhrase, playingRecordingId, stopAudio]);

  const finishLesson = useCallback(() => {
    if (!authenticated) {
      router.push(`/login?returnTo=${encodeURIComponent(`/learn/${course.slug}?lesson=${lesson.slug}`)}`);
      return;
    }
    if (progress?.completionPercent !== 100) {
      const body = new FormData();
      body.set("courseSlug", course.slug);
      body.set("lessonSlug", lesson.slug);
      body.set("returnTo", `/learn/${course.slug}?lesson=${lesson.slug}`);
      void fetch("/api/progress/lesson/complete", { method: "POST", body, redirect: "manual" });
    }
    setCompleted(true);
  }, [authenticated, course.slug, lesson.slug, progress?.completionPercent, router]);

  const move = useCallback((direction: -1 | 1) => {
    stopAudio();
    const items = sectionItems[section];
    const nextIndex = itemIndex + direction;
    if (nextIndex >= 0 && nextIndex < items.length) {
      setItemIndex(nextIndex);
      return;
    }
    const sectionIndex = availableSections.indexOf(section);
    const nextSection = availableSections[sectionIndex + direction];
    if (nextSection) {
      setSection(nextSection);
      setItemIndex(direction > 0 ? 0 : sectionItems[nextSection].length - 1);
      return;
    }
    if (direction > 0) finishLesson();
  }, [availableSections, finishLesson, itemIndex, section, sectionItems, stopAudio]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest("button, a, input, textarea, select, summary")) return;
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight" || event.key === "Enter") move(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [move]);

  if (!access.allowed) return <main className="industry-guided-lesson is-gated"><VipContentGate closeHref={closeHref} title="Mở khóa phần học này" /></main>;

  if (completed) return <main className="industry-guided-lesson industry-guided-complete">
    <section aria-labelledby="industry-complete-title" className="industry-complete-card">
      <Link aria-label="Đóng" className="industry-complete-close" href={closeHref}><X size={22} /></Link>
      <Image alt="" aria-hidden="true" className="industry-complete-trophy" height={160} priority src="/assets/hsk/hsk-completion-trophy.png" width={160} />
      <span className="industry-complete-badge"><Trophy aria-hidden="true" size={14} /> HOÀN THÀNH</span>
      <h1 id="industry-complete-title">Hoàn thành <em>bài học!</em></h1>
      <p>Bạn vừa học xong <strong>{lesson.title}</strong>. <span aria-hidden="true">🎉</span></p>
      <dl aria-label="Thống kê bài học" className="industry-complete-stats">
        <div><dt><span><BookOpen aria-hidden="true" size={22} /></span><strong>{lesson.vocabulary.length}</strong></dt><dd>từ vựng</dd></div>
        <div><dt><span><Target aria-hidden="true" size={22} /></span><strong>{phrases.length}</strong></dt><dd>bài tập</dd></div>
        <div><dt><span><PenLine aria-hidden="true" size={22} /></span><strong>{lesson.vocabulary.length}</strong></dt><dd>từ luyện viết</dd></div>
      </dl>
      <div className="industry-complete-actions"><Link href={closeHref}><List aria-hidden="true" size={18} />Danh sách bài học</Link><Link className="primary" href={nextLessonHref}>{nextLesson ? "Bài tiếp theo" : "Về lộ trình"}<ArrowRight aria-hidden="true" size={18} /></Link></div>
    </section>
  </main>;

  const saved = currentWord ? savedSlugs.has(currentWord.slug) : false;
  const atStart = currentStep <= 1;
  const phraseParts = currentPhrase ? splitPhraseClause(currentPhrase.hanzi) : ["", ""];
  const pronunciationResult = currentPhrase ? pronunciationResults[currentPhrase.id] : null;

  return <main className="industry-guided-lesson" data-section={section}>
    <header className="industry-guided-header">
      <div className="industry-guided-header-inner">
        <Link aria-label="Đóng bài học và về lộ trình" className="industry-guided-close" href={closeHref}><X size={20} /></Link>
        <div aria-label={`Bước ${currentStep} trên ${totalSteps}`} aria-valuemax={totalSteps} aria-valuemin={1} aria-valuenow={currentStep} className="industry-guided-progress" role="progressbar"><span style={{ width: `${totalSteps ? (currentStep / totalSteps) * 100 : 0}%` }} /></div>
        <nav aria-label="Các phần bài học" className="industry-guided-tabs">{(Object.keys(SECTION_LABELS) as GuidedSection[]).map((item) => <button aria-current={section === item ? "step" : undefined} className={section === item ? "active" : ""} disabled={!sectionItems[item].length} key={item} onClick={() => selectSection(item)} type="button">{SECTION_LABELS[item]}</button>)}</nav>
      </div>
    </header>

    <section className="industry-guided-stage">
      <div className="industry-guided-stage-inner">
        {currentWord ? <article className="industry-word-card" key={currentWord.slug}>
        <div className="industry-word-hanzi" lang="zh-CN">{currentWord.hanzi}</div><div className="industry-word-pinyin">{currentWord.pinyin}</div><h1>{currentWord.meaning}</h1>
        <div className="industry-word-actions"><button aria-pressed={isSpeaking} className="industry-audio-button" onClick={playCurrent} type="button"><Play fill="currentColor" size={18} />{isSpeaking ? "Đang phát âm…" : "Nghe mẫu"}</button><LessonSpeedMenu onChange={setPlaybackRate} rate={playbackRate} /><button aria-label={saved ? "Bỏ lưu từ" : "Lưu từ"} aria-pressed={saved} className="industry-save-button" onClick={saveWord} type="button">{saved ? <Check size={18} /> : <Bookmark size={18} />}</button></div>
      </article> : currentPhrase && section === "phrases" ? <article className="industry-phrase-card" key={currentPhrase.id}>
        <div className="industry-phrase-surface"><div className="industry-phrase-hanzi" lang="zh-CN">{currentPhrase.hanzi}</div></div>
        <div className="industry-phrase-pinyin">{currentPhrase.pinyin}</div>
        <h1>{currentPhrase.translation}</h1>
        <div aria-label="Cấu trúc cụm từ" className="industry-phrase-structure"><strong lang="zh-CN">{phraseParts[0]}</strong><span>+</span><b lang="zh-CN">{phraseParts[1]}</b></div>
        <div className="industry-word-actions"><button aria-pressed={isSpeaking} className="industry-audio-button" onClick={playCurrent} type="button"><Volume2 size={19} />{isSpeaking ? "Đang phát…" : "Nghe cụm từ"}</button><LessonSpeedMenu onChange={setPlaybackRate} rate={playbackRate} /><button aria-label="Lưu cụm từ" className="industry-save-button" type="button"><Bookmark size={18} /></button></div>
      </article> : currentPhrase ? <article className="industry-listening-card" key={currentPhrase.id}>
        <div className="industry-listening-copy">
          <div className="industry-listening-hanzi" lang="zh-CN"><span className="industry-listening-text">{renderScoredHanzi(currentPhrase.hanzi, pronunciationResult)}</span><button aria-label="Nghe câu mẫu" onClick={playCurrent} type="button"><Volume2 size={19} /></button></div>
          <div className="industry-listening-pinyin">{currentPhrase.pinyin}</div>
          <h1>{currentPhrase.translation}</h1>
        </div>
        <div className="industry-pronunciation-shell">
          <div className={`industry-pronunciation-dock${pronunciationResult ? " has-result" : " is-pending"}`}>
            {pronunciationResult ? <div className="industry-pronunciation-score"><span><BarChart3 size={15} />Điểm phát âm</span><strong>{pronunciationResult.totalScore}<small>/ 100</small></strong></div> : null}
            <div className="industry-pronunciation-control"><PronunciationEvaluator compact key={currentPhrase.id} onEvaluated={(result, recording) => receivePronunciation(currentPhrase.id, result, recording)} onRecordingStart={stopAudio} playToggleSound showListen={false} targetText={currentPhrase.hanzi} /></div>
            {pronunciationResult && recordingUrls[currentPhrase.id] ? <button aria-label={playingRecordingId === currentPhrase.id ? "Dừng phát bản ghi âm" : "Phát lại bản ghi âm của bạn"} aria-pressed={playingRecordingId === currentPhrase.id} className="industry-listen-sample" onClick={playUserRecording} type="button"><Headphones size={20} /><span>{playingRecordingId === currentPhrase.id ? "Đang phát" : "Nghe lại"}</span></button> : null}
          </div>
        </div>
        </article> : <article className="industry-empty-card"><h1>Bài học đang được cập nhật</h1><p>Hãy chọn phần học khác để tiếp tục.</p></article>}
      </div>
    </section>

    <footer className="industry-guided-footer"><div className="industry-guided-footer-inner"><button disabled={atStart} onClick={() => move(-1)} type="button"><ArrowLeft size={17} /> Trước</button><div><strong>Bước {currentStep} / {totalSteps}</strong><span>Nhấn <kbd>Enter ↵</kbd> để tiếp tục</span></div><button className="next" onClick={() => move(1)} type="button">Tiếp tục <ArrowRight size={18} /></button></div></footer>
  </main>;
}
