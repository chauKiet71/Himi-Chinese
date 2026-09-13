"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  AudioLines,
  Check,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleCheck,
  Headphones,
  Languages,
  LoaderCircle,
  Mic2,
  Pause,
  Play,
  Search,
  SkipBack,
  SkipForward,
  Volume2,
  X,
} from "lucide-react";
import {
  LISTENING_CATALOG_INDEX_URL,
  LISTENING_CATALOG_PROGRESS_KEY,
  formatListeningDuration,
  isListeningCatalogIndex,
  isListeningCatalogLesson,
  listeningSentenceAtTime,
  type ListeningCatalogGroup,
  type ListeningCatalogIndex,
  type ListeningCatalogLesson,
  type ListeningCatalogLessonSummary,
  type ListeningCatalogSentence,
  type ListeningCatalogTopic,
  type ListeningCatalogTrack,
} from "@/lib/listening-catalog";

function normalizeSearch(value: string): string {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase().trim();
}

function firstSelection(catalog: ListeningCatalogIndex, initialGroupId?: string) {
  const track = catalog.tracks.find((candidate) => candidate.groups.some((group) => group.id === initialGroupId))
    ?? catalog.tracks[0];
  const group = track.groups.find((candidate) => candidate.id === initialGroupId) ?? track.groups[0];
  return { track, group, topic: group.topics[0] };
}

async function fetchCatalogLesson(lessonId: string, signal?: AbortSignal): Promise<ListeningCatalogLesson> {
  const response = await fetch(`/listening-catalog/lessons/${encodeURIComponent(lessonId)}.json`, { cache: "force-cache", signal });
  if (!response.ok) throw new Error(`Lesson request failed with ${response.status}`);
  const value = await response.json() as unknown;
  if (!isListeningCatalogLesson(value)) throw new Error("Invalid listening lesson.");
  return value;
}

export function ListeningCatalogStudio({
  initialGroupId,
  initialLessonId,
  modeSwitcher,
}: {
  initialGroupId?: string;
  initialLessonId?: string;
  modeSwitcher?: ReactNode;
}) {
  const [catalog, setCatalog] = useState<ListeningCatalogIndex | null>(null);
  const [catalogError, setCatalogError] = useState("");
  const [activeTrackId, setActiveTrackId] = useState("");
  const [activeGroupId, setActiveGroupId] = useState("");
  const [activeTopicId, setActiveTopicId] = useState("");
  const [query, setQuery] = useState("");
  const [previewLessonId, setPreviewLessonId] = useState("");
  const [lesson, setLesson] = useState<ListeningCatalogLesson | null>(null);
  const [lessonLoadingId, setLessonLoadingId] = useState("");
  const [lessonError, setLessonError] = useState("");
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [speedPickerOpen, setSpeedPickerOpen] = useState(false);
  const [activeSentenceId, setActiveSentenceId] = useState("");
  const [showChinese, setShowChinese] = useState(true);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [audioError, setAudioError] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const sentenceAudioRef = useRef<HTMLAudioElement>(null);
  const clipEndRef = useRef<number | null>(null);
  const browserSectionRef = useRef<HTMLElement>(null);
  const transcriptRef = useRef<HTMLElement>(null);
  const lessonBarRef = useRef<HTMLElement>(null);
  const playerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (lesson) window.scrollTo({ top: 0, behavior: "instant" });
  }, [lesson]);

  useEffect(() => {
    const transcript = transcriptRef.current;
    const list = transcript?.querySelector("ol");
    if (!lesson || !transcript || !list) return;
    const activeIndex = lesson.sentences.findIndex((sentence) => sentence.id === activeSentenceId);
    if (activeIndex < 0) return;

    function followActiveSentence() {
      if (!list || !transcript) return;
      const rows = Array.from(list.children) as HTMLElement[];
      const activeRow = rows[activeIndex];
      const anchorRow = rows[Math.min(2, rows.length - 1)];
      const lastRow = rows.at(-1);
      if (!activeRow || !anchorRow || !lastRow) return;

      // Follow the third-row slot until the end of the transcript reaches
      // the player; the final sentences stay in place without an empty tail.
      const naturalAnchor = anchorRow.getBoundingClientRect().top + window.scrollY;
      const headerBottom = (lessonBarRef.current?.offsetHeight ?? 0) + 14;
      const playerTop = playerRef.current?.getBoundingClientRect().top ?? window.innerHeight;
      const anchor = Math.max(headerBottom, Math.min(naturalAnchor, playerTop - activeRow.offsetHeight - 16));
      transcript.style.removeProperty("padding-bottom");
      transcript.closest("main")?.style.setProperty("--listening-player-clearance", `${window.innerHeight - playerTop + 16}px`);

      const endOfTranscript = Math.max(0, lastRow.getBoundingClientRect().bottom + window.scrollY - playerTop + 16);
      const top = activeIndex < 2 ? 0 : Math.min(endOfTranscript, Math.max(0, activeRow.getBoundingClientRect().top + window.scrollY - anchor));
      if (Math.abs(window.scrollY - top) < 1) return;
      window.scrollTo({
        top,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      });
    }

    followActiveSentence();
    const observer = new ResizeObserver(followActiveSentence);
    observer.observe(list);
    if (playerRef.current) observer.observe(playerRef.current);
    window.addEventListener("resize", followActiveSentence);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", followActiveSentence);
    };
  }, [activeSentenceId, lesson, showChinese, showPinyin, showTranslation]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(LISTENING_CATALOG_INDEX_URL, { cache: "force-cache", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Catalog request failed with ${response.status}`);
        return response.json() as Promise<unknown>;
      })
      .then((value) => {
        if (!isListeningCatalogIndex(value)) throw new Error("Invalid listening catalog.");
        const selected = firstSelection(value, initialGroupId);
        setCatalog(value);
        setActiveTrackId(selected.track.id);
        setActiveGroupId(selected.group.id);
        setActiveTopicId(selected.topic.id);
        if (initialLessonId) {
          const initialLesson = value.tracks
            .flatMap((track) => track.groups)
            .flatMap((group) => group.topics)
            .flatMap((topic) => topic.lessons)
            .find((item) => item.id === initialLessonId);
          if (initialLesson) {
            setLessonLoadingId(initialLesson.id);
            void fetchCatalogLesson(initialLesson.id, controller.signal)
              .then((detail) => {
                setDuration(detail.durationSeconds);
                setActiveSentenceId(detail.sentences[0]?.id ?? "");
                setLesson(detail);
              })
              .catch((error: unknown) => {
                if (error instanceof DOMException && error.name === "AbortError") return;
                setLessonError("Chưa mở được bài nghe này. Hãy thử lại sau ít phút.");
              })
              .finally(() => setLessonLoadingId(""));
          }
        }
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setCatalogError("Chưa tải được kho bài nghe. Hãy tải lại trang để thử lại.");
      });
    return () => controller.abort();
  }, [initialGroupId, initialLessonId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const value = JSON.parse(window.localStorage.getItem(LISTENING_CATALOG_PROGRESS_KEY) ?? "[]") as unknown;
        if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
          setCompletedLessonIds(new Set(value));
        }
      } catch {
        setCompletedLessonIds(new Set());
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const activeTrack = catalog?.tracks.find((track) => track.id === activeTrackId) ?? catalog?.tracks[0];
  const activeGroup = activeTrack?.groups.find((group) => group.id === activeGroupId) ?? activeTrack?.groups[0];
  const activeTopic = activeGroup?.topics.find((topic) => topic.id === activeTopicId) ?? activeGroup?.topics[0];

  const visibleLessons = useMemo(() => {
    if (!activeTrack || !activeGroup || !activeTopic) return [];
    const normalizedQuery = normalizeSearch(query);
    if (!normalizedQuery) return activeTopic.lessons;
    return activeTrack.groups
      .flatMap((group) => group.topics)
      .flatMap((topic) => topic.lessons)
      .filter((item) => normalizeSearch(`${item.titleVi} ${item.titleZh} ${item.speaker}`).includes(normalizedQuery));
  }, [activeGroup, activeTopic, activeTrack, query]);

  const previewLesson = visibleLessons.find((item) => item.id === previewLessonId) ?? visibleLessons[0];

  function selectTrack(track: ListeningCatalogTrack) {
    const group = track.groups[0];
    setActiveTrackId(track.id);
    setActiveGroupId(group.id);
    setActiveTopicId(group.topics[0]?.id ?? "");
    setQuery("");
    setPreviewLessonId("");
  }

  function selectGroup(group: ListeningCatalogGroup) {
    setActiveGroupId(group.id);
    setActiveTopicId(group.topics[0]?.id ?? "");
    setQuery("");
    setPreviewLessonId("");
  }

  function selectTopic(topic: ListeningCatalogTopic) {
    setActiveTopicId(topic.id);
    setQuery("");
    setPreviewLessonId("");
  }

  async function openLesson(summary: ListeningCatalogLessonSummary) {
    setLessonLoadingId(summary.id);
    setLessonError("");
    try {
      const value = await fetchCatalogLesson(summary.id);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(value.durationSeconds);
      setActiveSentenceId(value.sentences[0]?.id ?? "");
      setAudioError("");
      clipEndRef.current = null;
      setLesson(value);
    } catch {
      setLessonError("Chưa mở được bài nghe này. Hãy thử lại sau ít phút.");
    } finally {
      setLessonLoadingId("");
    }
  }

  function rememberCompletion(lessonId: string) {
    setCompletedLessonIds((current) => {
      const next = new Set(current).add(lessonId);
      try {
        window.localStorage.setItem(LISTENING_CATALOG_PROGRESS_KEY, JSON.stringify([...next]));
      } catch {
        // Completion still remains available for the current session.
      }
      return next;
    });
  }

  function playAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    setAudioError("");
    audio.playbackRate = playbackRate;
    audio.play().catch(() => setAudioError("Trình duyệt chưa thể phát audio. Hãy bấm phát lại."));
  }

  function toggleFullAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    if (sentenceAudioRef.current && !sentenceAudioRef.current.paused) {
      sentenceAudioRef.current.pause();
      return;
    }
    sentenceAudioRef.current?.pause();
    clipEndRef.current = null;
    if (audio.paused) playAudio();
    else audio.pause();
  }

  function playSentence(sentence: ListeningCatalogSentence) {
    const audio = audioRef.current;
    if (!audio) return;
    sentenceAudioRef.current?.pause();
    if (sentence.audioUrl) {
      audio.pause();
      clipEndRef.current = null;
      setActiveSentenceId(sentence.id);
      setCurrentTime(sentence.start);
      setAudioError("");
      const sentenceAudio = sentenceAudioRef.current;
      if (!sentenceAudio) return;
      sentenceAudio.src = sentence.audioUrl;
      sentenceAudio.playbackRate = playbackRate;
      sentenceAudio.play().catch(() => setAudioError("Không phát được audio của câu này."));
      return;
    }
    clipEndRef.current = sentence.end;
    audio.currentTime = sentence.start;
    setCurrentTime(sentence.start);
    setActiveSentenceId(sentence.id);
    playAudio();
  }

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (!audio || !lesson) return;
    const time = audio.currentTime;
    const clipEnd = clipEndRef.current;
    if (clipEnd !== null && time >= clipEnd - 0.04) {
      clipEndRef.current = null;
      audio.pause();
      const boundedTime = Math.max(0, clipEnd - 0.04);
      if (Math.abs(audio.currentTime - boundedTime) > 0.01) audio.currentTime = boundedTime;
      setCurrentTime(boundedTime);
      return;
    }
    setCurrentTime(time);
    const sentence = listeningSentenceAtTime(lesson.sentences, time);
    if (sentence) setActiveSentenceId(sentence.id);
  }

  function seekAudio(value: number) {
    const audio = audioRef.current;
    if (!audio) return;
    sentenceAudioRef.current?.pause();
    clipEndRef.current = null;
    audio.currentTime = value;
    setCurrentTime(value);
    const sentence = lesson ? listeningSentenceAtTime(lesson.sentences, value) : undefined;
    if (sentence) setActiveSentenceId(sentence.id);
  }

  function handleSentenceTimeUpdate() {
    const audio = sentenceAudioRef.current;
    const sentence = lesson?.sentences.find((item) => item.id === activeSentenceId);
    if (!audio || !sentence) return;
    setCurrentTime(Math.min(sentence.end, sentence.start + audio.currentTime));
  }

  function skipSentence(direction: -1 | 1) {
    if (!lesson) return;
    const index = lesson.sentences.findIndex((sentence) => sentence.id === activeSentenceId);
    const nextIndex = Math.max(0, Math.min(lesson.sentences.length - 1, index + direction));
    const sentence = lesson.sentences[nextIndex];
    if (sentence) seekAudio(sentence.start);
  }

  function changePlaybackRate(value: number) {
    setPlaybackRate(value);
    if (audioRef.current) audioRef.current.playbackRate = value;
    if (sentenceAudioRef.current) sentenceAudioRef.current.playbackRate = value;
  }

  function closeLesson() {
    audioRef.current?.pause();
    sentenceAudioRef.current?.pause();
    clipEndRef.current = null;
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveSentenceId("");
    setLesson(null);
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.delete("lesson");
    window.history.replaceState(window.history.state, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
    window.setTimeout(() => browserSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  if (lesson) {
    const safeDuration = duration || lesson.durationSeconds;
    const visibleTranscriptLines = Number(showChinese) + Number(showPinyin) + Number(showTranslation);
    return (
      <main className="learner-dashboard listening-studio listening-catalog-studio listening-catalog-detail-page">
        <section className="listening-catalog-detail" aria-labelledby="listening-catalog-detail-title">
          <h1 className="sr-only" id="listening-catalog-detail-title">{lesson.titleVi}</h1>
          <header className="listening-focus-lesson-bar" ref={lessonBarRef}>
            <button aria-label="Đóng bài học" onClick={closeLesson} type="button"><X aria-hidden="true" size={20} strokeWidth={2} /></button>
            <progress aria-label="Tiến trình bài nghe" className="listening-focus-lesson-progress" max={Math.max(safeDuration, 1)} value={Math.min(currentTime, safeDuration)} />
          </header>

          <section className="listening-focus-player" aria-label="Trình phát bài nghe" ref={playerRef}>
            <audio
              onEnded={(event) => {
                setIsPlaying(false);
                setCurrentTime(event.currentTarget.currentTime);
                setActiveSentenceId(lesson.sentences.at(-1)?.id ?? "");
                rememberCompletion(lesson.id);
              }}
              onError={() => setAudioError("Không tải được tệp audio của bài này.")}
              onLoadedMetadata={(event) => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : lesson.durationSeconds)}
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onTimeUpdate={handleTimeUpdate}
              preload="metadata"
              ref={audioRef}
              src={lesson.mainAudioUrl}
            />
            <audio onEnded={() => setIsPlaying(false)} onError={() => setAudioError("Không tải được audio của câu này.")} onPause={() => setIsPlaying(false)} onPlay={() => setIsPlaying(true)} onTimeUpdate={handleSentenceTimeUpdate} preload="none" ref={sentenceAudioRef} />
            <span className="listening-focus-player-logo" aria-hidden="true">
              <Image alt="" height={128} src="/assets/mascot/himi-v2/himi-wave.webp" width={128} />
            </span>
            <AudioLines className="listening-focus-player-decoration" aria-hidden="true" size={64} />
            <div className="listening-focus-player-controls">
              <span>{formatListeningDuration(currentTime)}</span>
              <input aria-label="Vị trí phát audio" max={Math.max(safeDuration, 1)} min={0} onChange={(event) => seekAudio(Number(event.target.value))} step="0.1" type="range" value={Math.min(currentTime, safeDuration)} />
              <span>{formatListeningDuration(safeDuration)}</span>
            </div>
            <div className="listening-focus-player-toolbar">
            <div className={`listening-focus-speed ${speedPickerOpen ? "is-expanded" : "is-collapsed"}`} aria-label="Tốc độ phát" role="group">
              {speedPickerOpen ? <>
                <span className="listening-focus-speed-label">Tốc độ</span>
                {[0.75, 1, 1.25].map((rate) => <button aria-pressed={playbackRate === rate} key={rate} onClick={() => changePlaybackRate(rate)} type="button">{rate}x</button>)}
                <button aria-label="Thu gọn chọn tốc độ" className="listening-focus-speed-toggle" onClick={() => setSpeedPickerOpen(false)} type="button"><ChevronsLeft aria-hidden="true" size={24} strokeWidth={3} /></button>
              </> : <button aria-expanded="false" className="listening-focus-speed-toggle" onClick={() => setSpeedPickerOpen(true)} type="button">
                <span>Tốc độ</span><ChevronsRight aria-hidden="true" size={24} strokeWidth={3} />
              </button>}
            </div>
            <div className="listening-focus-transport" aria-label="Điều khiển phát">
              <button aria-label="Câu trước" disabled={activeSentenceId === lesson.sentences[0]?.id} onClick={() => skipSentence(-1)} type="button"><SkipBack aria-hidden="true" fill="currentColor" size={23} /></button>
              <button aria-label={isPlaying ? "Tạm dừng bài nghe" : "Phát toàn bộ bài nghe"} className="listening-focus-play" onClick={toggleFullAudio} type="button">
                {isPlaying ? <Pause aria-hidden="true" fill="currentColor" size={29} /> : <Play aria-hidden="true" fill="currentColor" size={29} />}
              </button>
              <button aria-label="Câu tiếp theo" disabled={activeSentenceId === lesson.sentences.at(-1)?.id} onClick={() => skipSentence(1)} type="button"><SkipForward aria-hidden="true" fill="currentColor" size={23} /></button>
            </div>
            <nav className="listening-focus-language-tools" aria-label="Hiển thị nội dung">
              <button aria-pressed={showTranslation} onClick={() => setShowTranslation((value) => !value)} type="button"><Languages aria-hidden="true" size={18} /> Tiếng Việt</button>
              <button aria-pressed={showChinese} onClick={() => setShowChinese((value) => !value)} type="button"><Check aria-hidden="true" size={18} /> 中文</button>
              <button aria-pressed={showPinyin} onClick={() => setShowPinyin((value) => !value)} type="button"><Check aria-hidden="true" size={18} /> Pinyin</button>
            </nav>
            </div>
          </section>

          {audioError ? <p className="listening-catalog-error" role="alert">{audioError}</p> : null}

          <section
            className="listening-focus-transcript"
            aria-label="Lời audio"
            data-visible-lines={visibleTranscriptLines}
            ref={transcriptRef}
          >
            <ol>
              {lesson.sentences.map((sentence) => <li aria-current={activeSentenceId === sentence.id ? "true" : undefined} key={sentence.id}>
                <button aria-label={`Phát câu ${sentence.order}`} className="listening-focus-transcript-row" onClick={() => playSentence(sentence)} type="button">
                  <span className="listening-focus-number">{String(sentence.order).padStart(2, "0")}</span>
                  <span className="listening-focus-sentence">
                    {showChinese ? <strong lang="zh-CN">{sentence.zh}</strong> : null}
                    {showPinyin ? <span>{sentence.pinyin}</span> : null}
                    {showTranslation ? <span className="listening-focus-translation">{sentence.vi}</span> : null}
                  </span>
                  <time>{formatListeningDuration(Math.max(0, sentence.end - sentence.start))}</time>
                  <span className="listening-focus-audio-icon" aria-hidden="true"><Volume2 size={25} /></span>
                </button>
              </li>)}
            </ol>
          </section>

        </section>
      </main>
    );
  }

  return (
    <main className="learner-dashboard listening-studio listening-catalog-studio" data-initial-group={initialGroupId}>
      <section className="listening-redesign-hero" aria-labelledby="listening-title">
        <div className="listening-redesign-hero-copy">
          <span className="listening-redesign-eyebrow">LISTENING PRACTICE</span>
          <h1 id="listening-title">Nghe để nói<br />tự nhiên hơn</h1>
          <p>Luyện nghe từng bước, bắt đúng nhịp hội thoại và tự tin dùng tiếng Trung trong đời sống.</p>
          <div className="listening-redesign-hero-actions">
            <button disabled={!previewLesson || Boolean(lessonLoadingId)} onClick={() => previewLesson && void openLesson(previewLesson)} type="button">
              {lessonLoadingId === previewLesson?.id ? <LoaderCircle aria-hidden="true" className="is-spinning" size={17} /> : null}
              {lessonLoadingId === previewLesson?.id ? "Đang mở…" : "Tiếp tục học"} <ArrowRight aria-hidden="true" size={18} />
            </button>
          </div>
        </div>

        <div className="listening-redesign-now-playing" aria-label="Bài nghe đang chọn">
          <div className="listening-redesign-player-heading">
            <span>Bài đang chọn · {previewLesson ? `Bài ${Math.max(1, visibleLessons.indexOf(previewLesson) + 1)}` : "Đang tải"}</span>
            <b>{previewLesson && completedLessonIds.has(previewLesson.id) ? "Đã học" : "Sẵn sàng"}</b>
          </div>
          <strong>{previewLesson?.titleVi ?? "Đang chuẩn bị kho bài nghe…"}</strong>
          <div className="listening-redesign-wave-row">
            <button aria-label="Mở bài nghe đang chọn" disabled={!previewLesson || Boolean(lessonLoadingId)} onClick={() => previewLesson && void openLesson(previewLesson)} type="button"><Play aria-hidden="true" fill="currentColor" size={25} /></button>
            <AudioLines aria-hidden="true" className="listening-redesign-wave-icon" size={210} strokeWidth={1.7} />
          </div>
          <div className="listening-redesign-player-time"><span>0:00</span><span>{previewLesson ? formatListeningDuration(previewLesson.durationSeconds) : "0:00"}</span></div>
          <progress aria-label="Tiến độ bài đang chọn" max={100} value={previewLesson && completedLessonIds.has(previewLesson.id) ? 100 : 0} />
          <div className="listening-redesign-player-footer"><span>{activeGroup?.labelVi ?? "Kho luyện nghe"} · {activeTopic?.labelVi ?? "Chọn chủ đề"}</span><span>{previewLesson && completedLessonIds.has(previewLesson.id) ? "100% đã hoàn thành" : "Chưa bắt đầu"}</span></div>
        </div>
      </section>

      {catalog ? <section className="listening-redesign-stats" aria-label="Thống kê kho bài nghe">
        {catalog.tracks.map((track) => <article key={track.id}>
          <span>{track.id === "dialogue" ? <Headphones aria-hidden="true" size={21} /> : <Mic2 aria-hidden="true" size={21} />}</span>
          <div><strong>{track.lessonCount}</strong><small>{track.id === "dialogue" ? "bài đối thoại" : "bài độc thoại"}</small></div>
        </article>)}
        <article>
          <span><CircleCheck aria-hidden="true" size={21} /></span>
          <div><strong>{completedLessonIds.size}</strong><small>bài đã hoàn thành</small></div>
        </article>
      </section> : null}

      <section className="listening-catalog-browser" aria-labelledby="listening-catalog-title" ref={browserSectionRef}>
        <div className="listening-redesign-heading">
          <div><span className="listening-section-kicker">BÀI HỌC HÔM NAY</span><h2 id="listening-catalog-title">Chọn bài nghe</h2></div>
          {catalog && activeTrack ? <div className="listening-catalog-track-tabs" role="tablist" aria-label="Loại bài nghe">
            {catalog.tracks.map((track) => <button aria-selected={track.id === activeTrack.id} key={track.id} onClick={() => selectTrack(track)} role="tab" type="button">{track.id === "dialogue" ? "Đối thoại" : "Độc thoại"}</button>)}
          </div> : null}
        </div>

        {catalogError ? <div className="listening-catalog-empty" role="alert"><Headphones aria-hidden="true" size={28} /><strong>{catalogError}</strong></div> : null}
        {!catalog && !catalogError ? <div className="listening-catalog-loading" role="status"><LoaderCircle aria-hidden="true" size={24} /> Đang tải kho bài nghe…</div> : null}

        {catalog && activeTrack && activeGroup && activeTopic ? <>
          <div className="listening-redesign-filter-surface">
          {activeTrack.groups.length > 1 ? <div className="listening-catalog-group-picker" aria-label="Cấp độ bài nghe">
            {activeTrack.groups.map((group) => <button aria-pressed={group.id === activeGroup.id} key={group.id} onClick={() => selectGroup(group)} type="button"><strong>{group.labelVi}</strong><span lang="zh-CN">{group.labelZh}</span></button>)}
          </div> : null}

          <div className="listening-catalog-topic-bar">
            <div className="listening-catalog-topics" aria-label="Chủ đề bài nghe">
              {activeGroup.topics.map((topic) => <button aria-pressed={topic.id === activeTopic.id} key={topic.id} onClick={() => selectTopic(topic)} type="button">{topic.labelVi}</button>)}
            </div>
            <label className="listening-catalog-search"><Search aria-hidden="true" size={18} /><span className="sr-only">Tìm bài nghe</span><input onChange={(event) => { setQuery(event.target.value); setPreviewLessonId(""); }} placeholder="Tìm bài nghe…" type="search" value={query} /></label>
          </div>
          </div>

          {lessonError ? <p className="listening-catalog-error" role="alert">{lessonError}</p> : null}
          {visibleLessons.length ? <div className="listening-redesign-lesson-layout">
            <section className="listening-redesign-lesson-list" aria-label={`Danh sách bài ${activeTrack.labelVi}`}>
              <header><div><strong>{activeTrack.id === "dialogue" ? "Đối thoại" : "Độc thoại"}</strong><span>{activeGroup.labelVi} · {activeTopic.labelVi}</span></div><b>{visibleLessons.length} bài</b></header>
              <ol>
                {visibleLessons.map((summary, index) => {
                  const completed = completedLessonIds.has(summary.id);
                  const selected = previewLesson?.id === summary.id;
                  return <li className={selected ? "is-selected" : ""} key={summary.id}>
                    <button aria-busy={lessonLoadingId === summary.id} aria-current={selected ? "true" : undefined} aria-label={`Mở bài nghe ${summary.titleVi}`} disabled={Boolean(lessonLoadingId)} onClick={() => { setPreviewLessonId(summary.id); void openLesson(summary); }} type="button">
                      <span className="listening-redesign-lesson-order">{String(index + 1).padStart(2, "0")}</span>
                      <span className={`listening-redesign-lesson-status ${completed ? "is-complete" : selected ? "is-active" : ""}`.trim()}>
                        {lessonLoadingId === summary.id ? <LoaderCircle aria-hidden="true" className="is-spinning" size={16} /> : completed ? <Check aria-hidden="true" size={16} /> : selected ? <Play aria-hidden="true" fill="currentColor" size={15} /> : <Headphones aria-hidden="true" size={16} />}
                      </span>
                      <span className="listening-redesign-lesson-copy">
                        <strong>{summary.titleVi}</strong>
                        {selected ? <small>{completed ? "Đã hoàn thành bài học" : "Tiếp tục bài học"}</small> : <progress aria-label={`Tiến độ ${summary.titleVi}`} max={100} value={completed ? 100 : 0} />}
                      </span>
                      <time>{formatListeningDuration(summary.durationSeconds).padStart(5, "0")}</time>
                      {!selected ? <span className="listening-redesign-lesson-trailing"><b>{completed ? 100 : 0}%</b><ChevronRight aria-hidden="true" size={19} /></span> : null}
                    </button>
                  </li>;
                })}
              </ol>
            </section>

          </div> : <div className="listening-catalog-empty"><Search aria-hidden="true" size={28} /><strong>Không tìm thấy bài nghe phù hợp.</strong><span>Thử tìm bằng tên tiếng Việt hoặc tiếng Trung.</span></div>}
        </> : null}
      </section>

      {modeSwitcher ? <div className="listening-mode-shell listening-redesign-more-mode">{modeSwitcher}</div> : null}
    </main>
  );
}
