"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  Clock3,
  Crown,
  FileText,
  Globe2,
  GraduationCap,
  Heart,
  LockKeyhole,
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
  parseHskLessonProgress,
} from "@/lib/hsk-lesson-progress";
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

function LessonMeta({ lesson }: { lesson: HskCurriculumLesson }) {
  return <span className="hsk-lesson-meta">
    {lesson.vocabulary ? <span><BookOpen aria-hidden="true" size={14} /> {lesson.vocabulary} từ vựng</span> : null}
    {lesson.grammar ? <span><GraduationCap aria-hidden="true" size={14} /> {lesson.grammar} ngữ pháp</span> : null}
    {lesson.dialogues ? <span><MessageCircle aria-hidden="true" size={14} /> {lesson.dialogues} hội thoại</span> : null}
    {lesson.exercises ? <span><FileText aria-hidden="true" size={14} /> {lesson.exercises} bài tập</span> : null}
    <span><Clock3 aria-hidden="true" size={14} /> {lesson.minutes} phút</span>
  </span>;
}

export function HskCurriculumExplorer({
  catalogHref = "#course-catalog",
  curriculum,
}: {
  catalogHref?: string;
  curriculum: HskCurriculumLevel[];
}) {
  const visibleCurriculum = curriculum.filter((level) => level.id !== "hsk-7-9");
  const [activeLevelId, setActiveLevelId] = useState(curriculum[0].id);
  const activeLevel = curriculum.find((level) => level.id === activeLevelId) ?? curriculum[0];
  const [activeTopicId, setActiveTopicId] = useState(activeLevel.topics[0].id);
  const activeTopic = activeLevel.topics.find((topic) => topic.id === activeTopicId) ?? activeLevel.topics[0];
  const [activeLessonId, setActiveLessonId] = useState(activeTopic.lessons[0].id);
  const [lessonProgress, setLessonProgress] = useState<Record<string, number>>({});
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
      for (const topic of activeLevel.topics) {
        for (const lesson of topic.lessons) {
          if (!lesson.available) continue;
          try {
            const stored = window.localStorage.getItem(getHskLessonProgressStorageKey(lesson.id));
            next[lesson.id] = calculateHskLessonProgressFromCounts({
              vocabulary: lesson.vocabulary,
              pronunciation: lesson.vocabulary,
              exercises: lesson.exercises ?? 0,
              scoredExercises: lesson.scoredExercises ?? lesson.kind !== "workbook",
              writing: lesson.writing,
              guidedSteps: lesson.guidedSteps,
            }, parseHskLessonProgress(stored));
          } catch {
            next[lesson.id] = 0;
          }
        }
      }
      setLessonProgress(next);
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
    setActiveLessonId(nextLevel.topics[0].lessons[0].id);
  };

  const selectTopic = (topicId: string) => {
    const nextTopic = activeLevel.topics.find((topic) => topic.id === topicId);
    if (!nextTopic) return;
    setActiveTopicId(nextTopic.id);
    setActiveLessonId(nextTopic.lessons[0].id);
  };

  return <section className="section-shell hsk-curriculum" aria-labelledby="hsk-curriculum-title">
    <header className="hsk-curriculum-heading">
      <div className="hsk-curriculum-heading-copy">
        <span>Himi Modern Curriculum Desk</span>
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
          src="/assets/brand/himi-mascot-icon-transparent.png"
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

        {activeLevel.access && !activeLevel.access.allowed ? <button className="hsk-industry-link hsk-vip-trigger" onClick={() => setUpgradeTarget({ kind: "Lộ trình", title: activeLevel.label })} type="button"><Crown aria-hidden="true" size={17} /> Cần nâng cấp</button> : null}
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
                const lessonSelected = lesson.id === activeLessonId;
                const accessAllowed = lesson.access?.allowed ?? true;
                const lessonAvailable = lesson.available && accessAllowed;
                const lessonHref = `/hsk/${activeLevel.id.replace(/^hsk-/, "")}/${lesson.id}`;
                const savedPercent = lessonProgress[lesson.id] ?? 0;
                return <article className={`hsk-lesson-row${lessonSelected ? " is-active" : ""}${!accessAllowed ? " is-vip-locked" : ""}`} key={lesson.id}>
                  {lessonAvailable ? <Link aria-label={`Bài ${lesson.lessonNumber}: ${lesson.title}`} className="hsk-lesson-select" href={lessonHref} prefetch>
                    <span className="hsk-lesson-index">{lessonSelected ? <Play aria-hidden="true" fill="currentColor" size={20} /> : lesson.lessonNumber}</span>
                    <span className="hsk-lesson-copy">
                  <strong>Bài {lesson.lessonNumber}: {lesson.title}</strong>
                      <LessonMeta lesson={lesson} />
                    </span>
                  </Link> : <button
                    aria-label={`Bài ${lesson.lessonNumber}: ${lesson.title}`}
                    aria-pressed={lessonSelected}
                    className="hsk-lesson-select"
                    onClick={() => accessAllowed
                      ? setActiveLessonId(lesson.id)
                      : setUpgradeTarget({ kind: "Bài học", title: lesson.title })}
                    type="button"
                  >
                    <span className="hsk-lesson-index">{accessAllowed ? lesson.lessonNumber : <LockKeyhole aria-hidden="true" size={17} />}</span>
                    <span className="hsk-lesson-copy">
                      <strong>Bài {lesson.lessonNumber}: {lesson.title}</strong>
                      <LessonMeta lesson={lesson} />
                    </span>
                  </button>}

                  {lessonSelected && lessonAvailable ? <Link className="hsk-lesson-start" href={lessonHref} prefetch>
                    <span>{savedPercent > 0 ? `${savedPercent}% đã học` : "Sẵn sàng"}</span>
                    <strong>{savedPercent > 0 ? "Tiếp tục học" : "Bắt đầu học"}</strong>
                    <ArrowRight aria-hidden="true" size={18} />
                  </Link> : !accessAllowed ? <button className="hsk-lesson-start hsk-vip-trigger" onClick={() => setUpgradeTarget({ kind: "Bài học", title: lesson.title })} type="button"><span>Quyền truy cập</span><strong>VIP</strong><Crown aria-hidden="true" size={16} /></button> : <span className="hsk-lesson-duration">{lessonAvailable ? "Mở bài" : "Sắp ra mắt"} <ChevronRight aria-hidden="true" size={19} /></span>}

                  {lessonSelected && lessonAvailable ? <div className="hsk-lesson-coach-note">
                    <span className="hsk-lesson-coach-avatar">
                      <Image alt="" aria-hidden="true" height={40} src="/assets/brand/himi-mascot-icon-transparent.png" unoptimized width={40} />
                    </span>
                    <span className="hsk-lesson-coach-copy">
                      <strong>Himi nhắc bạn:</strong>
                      <small>Chỉ cần học thêm một chút mỗi ngày, bạn sẽ tiến bộ hơn rất nhiều!</small>
                    </span>
                    <span className="hsk-lesson-coach-boost"><Heart aria-hidden="true" fill="currentColor" size={13} /> Cố lên nhé!</span>
                  </div> : null}
                </article>;
              })}
            </div> : null}
          </section>;
        })}
      </div>
    </div>
    <VipUpgradeDialog onClose={() => setUpgradeTarget(null)} open={upgradeTarget !== null} target={upgradeTarget} />
  </section>;
}
