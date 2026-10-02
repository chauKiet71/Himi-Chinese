"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Clock3,
  Crown,
  FileText,
  Globe2,
  LockKeyhole,
  LogIn,
  MapPin,
  MessageCircle,
  Play,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import {
  type HskCurriculumLesson,
  type HskCurriculumLevel,
  type HskTopicIcon,
} from "@/lib/hsk-curriculum";
import {
  calculateHskLessonProgressFromCounts,
  getHskLessonProgressStorageKey,
  hasHskLessonProgress,
  parseHskLessonProgress,
} from "@/lib/hsk-lesson-progress";
import { getHskCurriculumHref } from "@/lib/hsk-lesson-content";
import { VipUpgradeDialog, type VipUpgradeTarget } from "@/components/vip-upgrade-prompt";

const topicIcons: Record<HskTopicIcon, LucideIcon> = {
  message: MessageCircle,
  people: Users,
  clock: Clock3,
  food: UtensilsCrossed,
  travel: MapPin,
  work: BriefcaseBusiness,
  book: BookOpen,
  globe: Globe2,
};

const topicDescriptions: Record<HskTopicIcon, string> = {
  message: "Giao tiếp tự nhiên trong các tình huống quen thuộc.",
  people: "Kết nối, giới thiệu và trò chuyện cùng mọi người.",
  clock: "Sinh hoạt, di chuyển và sắp xếp kế hoạch hằng ngày.",
  food: "Ăn uống, mua sắm và những nhu cầu thiết thực.",
  travel: "Du lịch, phương hướng và trải nghiệm ở nơi mới.",
  work: "Giao tiếp rõ ràng trong môi trường công việc.",
  book: "Mở rộng kiến thức qua bài đọc và chủ đề học thuật.",
  globe: "Vận dụng tiếng Trung trong bối cảnh rộng hơn.",
};

export function getHskCurriculumLessonDestination(levelId: string, lessonId: string) {
  const lessonHref = `/hsk/${levelId.replace(/^hsk-/, "")}/${lessonId}`;
  return `${lessonHref}/play`;
}

function LessonMeta({ lesson }: { lesson: HskCurriculumLesson }) {
  return <span className="hsk-lesson-meta">
    {lesson.vocabulary ? <span><BookOpen aria-hidden="true" size={14} /> {lesson.vocabulary} từ vựng</span> : null}
    {lesson.dialogues ? <span><MessageCircle aria-hidden="true" size={14} /> {lesson.dialogues} hội thoại</span> : null}
    {lesson.exercises ? <span><FileText aria-hidden="true" size={14} /> {lesson.exercises} bài tập</span> : null}
    <span><Clock3 aria-hidden="true" size={14} /> {lesson.minutes} phút</span>
  </span>;
}

export function HskCurriculumExplorer({
  authenticated,
  catalogHref = "#course-catalog",
  curriculum,
  initialLevelId,
}: {
  authenticated: boolean;
  catalogHref?: string;
  curriculum: HskCurriculumLevel[];
  initialLevelId?: string;
}) {
  const visibleCurriculum = curriculum.filter((level) => level.id !== "hsk-7-9");
  const initialLevel = visibleCurriculum.find((level) => level.id === initialLevelId) ?? visibleCurriculum[0];
  const [activeLevelId, setActiveLevelId] = useState(initialLevel.id);
  const activeLevel = curriculum.find((level) => level.id === activeLevelId) ?? curriculum[0];
  const [activeTopicId, setActiveTopicId] = useState(activeLevel.topics[0].id);
  const activeTopic = activeLevel.topics.find((topic) => topic.id === activeTopicId) ?? activeLevel.topics[0];
  const [lessonProgress, setLessonProgress] = useState<Record<string, number>>({});
  const [openedLessonIds, setOpenedLessonIds] = useState<Set<string>>(new Set());
  const [upgradeTarget, setUpgradeTarget] = useState<VipUpgradeTarget | null>(null);
  const levelLessons = activeLevel.topics.flatMap((topic) => topic.lessons);
  const totalLessons = levelLessons.length;
  const completedLevelLessons = levelLessons.filter((lesson) => lessonProgress[lesson.id] === 100).length;
  const levelProgress = totalLessons
    ? Math.round(levelLessons.reduce((sum, lesson) => sum + (lessonProgress[lesson.id] ?? 0), 0) / totalLessons)
    : 0;

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const next: Record<string, number> = {};
      const opened = new Set<string>();
      for (const topic of activeLevel.topics) {
        for (const lesson of topic.lessons) {
          if (!lesson.available) continue;
          try {
            const stored = window.localStorage.getItem(getHskLessonProgressStorageKey(lesson.id));
            const progress = parseHskLessonProgress(stored);
            if (hasHskLessonProgress(progress)) opened.add(lesson.id);
            next[lesson.id] = calculateHskLessonProgressFromCounts({
              vocabulary: lesson.vocabulary,
              pronunciation: lesson.vocabulary,
              exercises: lesson.exercises ?? 0,
              scoredExercises: lesson.scoredExercises ?? lesson.kind !== "workbook",
              writing: lesson.writing,
              guidedSteps: lesson.guidedSteps,
            }, progress);
          } catch {
            next[lesson.id] = 0;
          }
        }
      }
      setLessonProgress(next);
      setOpenedLessonIds(opened);
      const nextLesson = activeLevel.topics
        .flatMap((topic) => topic.lessons.map((lesson) => ({ lesson, topicId: topic.id })))
        .find(({ lesson }) => (next[lesson.id] ?? 0) < 100);
      if (nextLesson) setActiveTopicId(nextLesson.topicId);
    }, 0);
    return () => window.clearTimeout(handle);
  }, [activeLevel]);

  const selectLevel = (levelId: string) => {
    const nextLevel = curriculum.find((level) => level.id === levelId);
    if (!nextLevel) return;
    if (nextLevel.access && !nextLevel.access.allowed) {
      setUpgradeTarget({ kind: "Lộ trình", title: nextLevel.label });
      return;
    }
    setActiveLevelId(nextLevel.id);
    setActiveTopicId(nextLevel.topics[0].id);
  };

  const selectTopic = (topicId: string) => {
    const nextTopic = activeLevel.topics.find((topic) => topic.id === topicId);
    if (!nextTopic) return;
    setActiveTopicId(nextTopic.id);
  };

  return <section className="section-shell hsk-curriculum" aria-labelledby="hsk-curriculum-title">
    <header className="hsk-curriculum-heading">
      <div className="hsk-curriculum-heading-copy">
        <span>Himi Chinese</span>
        <h1 id="hsk-curriculum-title">Lộ trình bài học {activeLevel.label}</h1>
        <p>{activeLevel.description}</p>
      </div>

      <aside className="hsk-curriculum-coach" aria-label="Lời nhắn từ Himi">
        <p>Kiên trì<br />mỗi ngày<br />bạn nhé!</p>
        <Image
          alt="Himi cổ vũ bạn học mỗi ngày"
          className="hsk-curriculum-coach-image"
          height={170}
          priority
          src="/assets/brand/himi-mascot-icon-transparent.webp"
          unoptimized
          width={170}
        />
      </aside>

      <div className="hsk-curriculum-controls">
        <div aria-label="Chọn cấp độ HSK" className="hsk-level-tabs" role="group">
          {visibleCurriculum.map((level) => <button
            aria-pressed={activeLevel.id === level.id}
            className={`${activeLevel.id === level.id ? "is-active" : ""}${level.access && !level.access.allowed ? " is-vip-locked" : ""}`}
            key={level.id}
            onClick={() => selectLevel(level.id)}
            type="button"
          ><span lang="zh-CN">{level.symbol}</span><strong>{level.label}</strong></button>)}
        </div>

        <div className="hsk-level-progress" aria-label={`Đã hoàn thành ${completedLevelLessons} trên ${totalLessons} bài`}>
          <div><span><strong>{completedLevelLessons}/{totalLessons}</strong> bài hoàn thành</span><strong>{levelProgress}%</strong></div>
          <span className="hsk-level-progress-track"><i style={{ width: `${levelProgress}%` }} /></span>
        </div>

        <Link className="hsk-industry-link" href={catalogHref}>Lộ trình theo ngành <ArrowRight aria-hidden="true" size={17} /></Link>

        {activeLevel.access && !activeLevel.access.allowed ? <button className="hsk-industry-link hsk-vip-trigger" onClick={() => setUpgradeTarget({ kind: "Lộ trình", title: activeLevel.label })} type="button">{activeLevel.access.source === "login_required" ? <><LogIn aria-hidden="true" size={17} /> Cần đăng nhập</> : <><Crown aria-hidden="true" size={17} /> Cần nâng cấp</>}</button> : null}
      </div>
    </header>

    <div className="hsk-curriculum-layout">
      <div className="hsk-syllabus" aria-live="polite">
        {activeLevel.topics.map((topic, topicIndex) => {
          const Icon = topicIcons[topic.icon];
          const selected = topic.id === activeTopic.id;
          const completedLessons = topic.lessons.filter((lesson) => lessonProgress[lesson.id] === 100).length;
          return <section className={`hsk-topic-section${selected ? " is-active" : ""}`} key={topic.id}>
            <button
              aria-expanded={selected}
              className="hsk-topic-heading"
              onClick={() => selectTopic(topic.id)}
              type="button"
            >
              <span className="hsk-topic-icon"><Icon aria-hidden="true" size={23} /></span>
              <span className="hsk-topic-copy">
                <strong>Chủ đề {topicIndex + 1}: <b>{topic.title}</b></strong>
                <small>{topic.lessons.length} bài học <i aria-hidden="true" /> {topicDescriptions[topic.icon]}</small>
              </span>
              <span className="hsk-topic-progress">{completedLessons}/{topic.lessons.length}</span>
              <ChevronDown aria-hidden="true" className="hsk-topic-chevron" size={22} />
            </button>

            {selected ? <div className="hsk-lesson-list">
              {topic.lessons.map((lesson) => {
                const lessonCompleted = lessonProgress[lesson.id] === 100;
                const lessonShowsProgress = openedLessonIds.has(lesson.id);
                const accessAllowed = lesson.access?.allowed ?? true;
                const loginLocked = lesson.access?.source === "login_required";
                const lessonAvailable = lesson.available && accessAllowed;
                const lessonHref = `/hsk/${activeLevel.id.replace(/^hsk-/, "")}/${lesson.id}`;
                const lessonDestination = getHskCurriculumLessonDestination(activeLevel.id, lesson.id);
                const savedPercent = lessonProgress[lesson.id] ?? 0;
                return <article className={`hsk-lesson-row${lessonShowsProgress && !lessonCompleted ? " is-active" : ""}${!accessAllowed ? ` is-vip-locked${loginLocked ? " is-login-locked" : ""}` : ""}${lessonCompleted ? " is-completed" : ""}`} key={lesson.id}>
                  {lessonAvailable ? <Link aria-label={`Bài ${lesson.lessonNumber}: ${lesson.title}`} className="hsk-lesson-select" href={lessonDestination} prefetch={false}>
                    <span className="hsk-lesson-index">{lessonCompleted ? <CircleCheck aria-hidden="true" size={20} /> : lessonShowsProgress ? <Play aria-hidden="true" fill="currentColor" size={20} /> : lesson.lessonNumber}</span>
                    <span className="hsk-lesson-copy">
                  <strong>Bài {lesson.lessonNumber}: {lesson.title}</strong>
                      <LessonMeta lesson={lesson} />
                    </span>
                  </Link> : <button
                    aria-label={`Bài ${lesson.lessonNumber}: ${lesson.title}`}
                    aria-pressed={lessonShowsProgress}
                    className="hsk-lesson-select"
                    onClick={() => !accessAllowed && setUpgradeTarget({ kind: "Bài học", title: lesson.title })}
                    type="button"
                  >
                    <span className="hsk-lesson-index">{!accessAllowed ? <LockKeyhole aria-hidden="true" size={17} /> : lesson.lessonNumber}</span>
                    <span className="hsk-lesson-copy">
                      <strong>Bài {lesson.lessonNumber}: {lesson.title}</strong>
                      <LessonMeta lesson={lesson} />
                    </span>
                  </button>}

                  {lessonShowsProgress && !lessonCompleted && lessonAvailable ? <Link aria-label={`${savedPercent}% đã học, tiếp tục bài ${lesson.lessonNumber}`} className="hsk-lesson-start hsk-progress-link" href={`${lessonHref}/play`} prefetch={false}>
                    <span
                      className="hsk-circular-progress"
                      style={{ "--hsk-progress": `${Math.max(savedPercent * 3.6, 2)}deg` } as CSSProperties}
                    >
                      <strong>{savedPercent}%</strong>
                    </span>
                  </Link> : !accessAllowed ? <button aria-label={loginLocked ? `Đăng nhập để học bài ${lesson.lessonNumber}` : `Mở quyền lợi VIP cho bài ${lesson.lessonNumber}`} className="hsk-lesson-start hsk-vip-trigger" onClick={() => setUpgradeTarget({ kind: "Bài học", title: lesson.title })} type="button">{loginLocked ? <LogIn aria-hidden="true" size={21} /> : <Crown aria-hidden="true" size={21} />}</button> : <span className="hsk-lesson-duration">{lessonCompleted ? <><CircleCheck aria-hidden="true" size={17} /> Đã hoàn thành</> : <>{lessonAvailable ? "Mở bài" : lesson.availabilityLabel ?? "Sắp ra mắt"} <ChevronRight aria-hidden="true" size={19} /></>}</span>}

                </article>;
              })}
            </div> : null}
          </section>;
        })}
      </div>
    </div>
    <VipUpgradeDialog authenticated={authenticated} onClose={() => setUpgradeTarget(null)} open={upgradeTarget !== null} returnTo={getHskCurriculumHref(activeLevel.id)} target={upgradeTarget} />
  </section>;
}
