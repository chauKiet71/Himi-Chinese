"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckSquare2,
  ChevronRight,
  CircleCheck,
  Clock3,
  Crown,
  Lightbulb,
  LockKeyhole,
} from "lucide-react";
import type { CourseRoadmap as CourseRoadmapModel, RoadmapLesson, RoadmapModule } from "@/lib/course-roadmap";
import type { Course } from "@/lib/content-types";
import { getCourseModuleVisual } from "@/lib/course-visuals";
import { VipUpgradeDialog, type VipUpgradeTarget } from "@/components/vip-upgrade-prompt";

function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (!hours) return `${remainder} phút`;
  if (!remainder) return `${hours} giờ`;
  return `${hours} giờ ${remainder} phút`;
}

function RoadmapLessonRow({
  lesson,
  lessonNumber,
  onVipLocked,
}: {
  lesson: RoadmapLesson;
  lessonNumber: number;
  onVipLocked: (target: VipUpgradeTarget) => void;
}) {
  const inProgress = lesson.started && lesson.completionPercent < 100;
  const visualState = lesson.status === "completed"
    ? "completed"
    : lesson.vipLocked
      ? "vip-locked"
      : inProgress ? "in-progress" : "available";
  const copy = <>
    <span className="roadmap-lesson-copy">
      <span>Bài {String(lessonNumber).padStart(2, "0")}</span>
      <i aria-hidden="true">·</i>
      <strong>{lesson.title}</strong>
    </span>
    <span className="roadmap-lesson-minutes">{lesson.estimatedMinutes} phút</span>
  </>;

  if (lesson.vipLocked) {
    return <button className="roadmap-lesson-row is-vip-locked" onClick={() => onVipLocked({ kind: "Bài học", title: lesson.title })} type="button">
      {copy}
      <span aria-label="Bài học VIP" className="roadmap-lesson-vip"><Crown aria-hidden="true" size={21} /></span>
    </button>;
  }

  if (lesson.href) {
    return <a className={`roadmap-lesson-row is-${visualState}`} href={lesson.href}>
      {copy}
      {lesson.status === "completed" ? <span className="roadmap-lesson-status is-completed"><CircleCheck aria-hidden="true" size={17} /> Đã hoàn thành</span> : inProgress ? <span
        aria-label={`${lesson.completionPercent}% đã học`}
        className="roadmap-circular-progress"
        style={{ "--roadmap-progress": `${Math.max(lesson.completionPercent * 3.6, 2)}deg` } as CSSProperties}
      ><strong>{lesson.completionPercent}%</strong></span> : <span className="roadmap-lesson-status is-available">Chưa bắt đầu <ChevronRight aria-hidden="true" size={19} /></span>}
    </a>;
  }

  return <div aria-disabled="true" className={`roadmap-lesson-row is-${visualState}`}>
    {copy}
  </div>;
}

function StageStatus({ module }: { module: RoadmapModule }) {
  if (module.vipLocked) return <span className="roadmap-stage-status is-vip"><Crown aria-hidden="true" size={14} /> Cần VIP</span>;
  if (module.status === "completed") return <span className="roadmap-stage-status is-completed"><Check aria-hidden="true" size={14} /> Đã hoàn thành</span>;
  if (module.status === "active") {
    const blocked = module.lessons.some((lesson) => lesson.status === "vip_locked");
    return blocked
      ? <span className="roadmap-stage-status is-vip"><Crown aria-hidden="true" size={14} /> Cần VIP</span>
      : <span className="roadmap-stage-status is-active">Đang học</span>;
  }
  if (module.status === "available") return <span className="roadmap-stage-status is-available">Sẵn sàng</span>;
  return <span className="roadmap-stage-status is-locked"><LockKeyhole aria-hidden="true" size={14} /> Khóa</span>;
}

function StageMarker({ module, index }: { module: RoadmapModule; index: number }) {
  return <span className={`roadmap-stage-marker is-${module.status}`}>
    {module.status === "completed" ? <Check aria-hidden="true" size={22} strokeWidth={2.6} /> : index + 1}
  </span>;
}

function formatRoadmapBreadcrumbTitle(title: string) {
  return title
    .split(" & ")
    .map((segment) => `${segment.charAt(0).toLocaleUpperCase("vi-VN")}${segment.slice(1)}`)
    .join(" & ");
}

function RoadmapStage({
  course,
  index,
  module,
  onVipLocked,
}: {
  course: Course;
  index: number;
  module: RoadmapModule;
  onVipLocked: (target: VipUpgradeTarget) => void;
}) {
  const visual = getCourseModuleVisual(course.slug, module.slug);
  const summary = <div className="roadmap-stage-summary">
    <div className="roadmap-stage-image">
      <Image
        alt={visual.alt}
        fill
        sizes="176px"
        src={visual.src}
        style={{ objectPosition: visual.position }}
        unoptimized
      />
    </div>
    <div className="roadmap-stage-copy">
      <h2>{module.title}</h2>
      <p>{module.completedLessons} / {module.lessons.length} bài đã hoàn thành</p>
    </div>
    <StageStatus module={module} />
  </div>;

  return <div className={`roadmap-stage is-${module.status}${module.vipLocked ? " is-vip-locked" : ""}`}>
    <div aria-hidden="true" className="roadmap-stage-rail"><StageMarker index={index} module={module} /></div>
    {module.status === "locked" && !module.vipLocked ? <article className="roadmap-stage-card">{summary}</article> : <details className="roadmap-stage-card" open={module.status === "active"}>
      <summary>{summary}<ChevronRight aria-hidden="true" className="roadmap-stage-expand" size={20} /></summary>
      <div className="roadmap-lesson-list">
        {module.lessons.map((lesson) => <RoadmapLessonRow
          key={lesson.slug}
          lesson={lesson}
          lessonNumber={lesson.order + 1}
          onVipLocked={onVipLocked}
        />)}
      </div>
    </details>}
  </div>;
}

export function CourseRoadmap({
  authenticated,
  course,
  roadmap,
}: {
  authenticated: boolean;
  course: Course;
  roadmap: CourseRoadmapModel;
}) {
  const [upgradeTarget, setUpgradeTarget] = useState<VipUpgradeTarget | null>(null);
  const breadcrumbTitle = formatRoadmapBreadcrumbTitle(course.title);
  const complete = roadmap.completedLessons === roadmap.totalLessons && roadmap.totalLessons > 0;
  const coachCopy = complete
    ? "Bạn đã hoàn thành toàn bộ lộ trình. Hãy quay lại ôn những bài cần củng cố."
    : roadmap.blockedByVip
      ? "Mở khóa VIP để tiếp tục chặng chuyên sâu và lưu trọn tiến độ học."
      : "Bạn có thể chọn bất kỳ bài học đang mở để học theo nhu cầu của mình.";

  return <main aria-label={`Chi tiết lộ trình ${course.title}`} className="course-roadmap-page">
    <div className="section-shell course-roadmap-shell">
      <header className="course-roadmap-header">
        <div>
          <Link className="course-roadmap-back" href="/courses">
            <span className="course-roadmap-back-action"><ArrowLeft aria-hidden="true" size={16} /> Về trang Lộ trình</span>
            <span aria-hidden="true" className="course-roadmap-back-separator">/</span>
            <span className="course-roadmap-back-context">{breadcrumbTitle}</span>
          </Link>
          <h1 className="sr-only">Lộ trình {course.title}</h1>
        </div>
      </header>

      <div className="course-roadmap-layout">
        <section aria-label="Các chặng trong lộ trình" className="course-roadmap-stages">
          {roadmap.modules.map((module, index) => <RoadmapStage
            course={course}
            index={index}
            key={module.slug}
            module={module}
            onVipLocked={setUpgradeTarget}
          />)}
        </section>

        <aside className="course-roadmap-aside">
          <section className="course-roadmap-overview">
            <h2>Tổng quan lộ trình</h2>
            <div className="roadmap-overview-stat">
              <span><Clock3 aria-hidden="true" size={27} /></span>
              <p>Tổng thời gian ước tính<strong>{formatMinutes(roadmap.totalMinutes)}</strong></p>
            </div>
            <div className="roadmap-overview-stat">
              <span><CheckSquare2 aria-hidden="true" size={27} /></span>
              <p>Đã hoàn thành<strong>{roadmap.completedModules} / {roadmap.modules.length} chặng</strong></p>
            </div>
            <div className="roadmap-overview-stat">
              <span><BookOpen aria-hidden="true" size={28} /></span>
              <p>Tiến độ tổng<strong>{roadmap.completedLessons} / {roadmap.totalLessons} bài</strong></p>
            </div>
            {!authenticated ? <Link className="roadmap-signin-note" href={`/login?returnTo=/courses/${course.slug}`}>
              Đăng nhập để lưu nhịp học <ChevronRight aria-hidden="true" size={16} />
            </Link> : null}
          </section>

          <section className={`course-roadmap-coach${roadmap.blockedByVip ? " is-vip" : ""}`}>
            <Image
              alt="Himi nhắc bạn về mục tiêu tiếp theo"
              className="course-roadmap-coach-image"
              height={190}
              src="/assets/mascot/himi-v2/himi-wave.webp"
              unoptimized
              width={190}
            />
            <div className="course-roadmap-coach-bubble">
              <Lightbulb aria-hidden="true" size={23} />
              <p>{coachCopy}</p>
              {roadmap.blockedByVip ? <Link href="/vip">Xem quyền lợi VIP <ChevronRight aria-hidden="true" size={15} /></Link> : null}
            </div>
          </section>
        </aside>
      </div>
    </div>
    <VipUpgradeDialog authenticated={authenticated} onClose={() => setUpgradeTarget(null)} open={upgradeTarget !== null} returnTo={`/courses/${course.slug}`} target={upgradeTarget} />
  </main>;
}
