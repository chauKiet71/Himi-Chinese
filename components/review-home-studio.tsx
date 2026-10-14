"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpenText,
  BriefcaseBusiness,
  Check,
  GraduationCap,
  type LucideIcon,
  MessageCircleMore,
  Plane,
  Soup,
  UsersRound,
} from "lucide-react";
import { HomeVipWelcomeOffer, type HomeVipWelcomeOfferPlan } from "@/components/home-vip-welcome-offer";
import {
  readRecentLearningHistory,
  RECENT_LEARNING_HISTORY_CHANGED_EVENT,
  RECENT_LEARNING_HISTORY_KEY,
  type RecentLearningHistoryEntry,
} from "@/lib/recent-learning-history";

type ReviewHomeStudioProps = {
  verified?: boolean;
  welcomeOffer?: HomeVipWelcomeOfferPlan | null;
};

type Topic = {
  title: string;
  lessons: number;
  href: string;
  icon: LucideIcon;
  tone: string;
};

const FEATURES = [
  { title: "Giáo trình HSK", titleLead: "Giáo trình", titleAccent: "HSK", description: "Học theo giáo trình chuẩn, chinh phục từng cấp độ.", action: "Khám phá giáo trình", href: "/courses?view=hsk", image: "/assets/home/features/feature-icon-hsk.webp", tone: "hsk" },
  { title: "Luyện viết", titleLead: "Luyện", titleAccent: "viết", description: "Tập viết Hán tự đúng nét, nhớ lâu hơn.", action: "Bắt đầu luyện viết", href: "/writing", image: "/assets/home/features/feature-icon-writing.webp", tone: "writing" },
  { title: "Luyện nghe", titleLead: "Luyện", titleAccent: "nghe", description: "Nghe hội thoại thực tế, làm quen phát âm chuẩn.", action: "Bắt đầu luyện nghe", href: "/listening", image: "/assets/home/features/feature-icon-listening.webp", tone: "listening" },
  { title: "Luyện gõ", titleLead: "Luyện", titleAccent: "gõ", description: "Gõ pinyin nhanh và chính xác theo ngữ cảnh.", action: "Bắt đầu luyện gõ", href: "/typing", image: "/assets/home/features/feature-icon-typing.webp", tone: "typing" },
] as const;

const TOPICS: Topic[] = [
  { title: "Giao tiếp hằng ngày", lessons: 32, href: "/courses/tieng-trung-tan-suat-cao", icon: MessageCircleMore, tone: "coral" },
  { title: "Ẩm thực", lessons: 28, href: "/courses/nha-hang-dich-vu", icon: Soup, tone: "orange" },
  { title: "Du lịch", lessons: 24, href: "/courses/tieng-trung-tan-suat-cao", icon: Plane, tone: "blue" },
  { title: "Công việc", lessons: 20, href: "/courses/giao-tiep-cong-so", icon: BriefcaseBusiness, tone: "amber" },
  { title: "Gia đình", lessons: 18, href: "/courses/tieng-trung-tan-suat-cao", icon: UsersRound, tone: "green" },
  { title: "Học tập", lessons: 25, href: "/courses?view=hsk", icon: GraduationCap, tone: "indigo" },
];

const RECENT_LESSON_LIMIT = 4;

export function ReviewHomeStudio({ verified = false, welcomeOffer = null }: ReviewHomeStudioProps) {
  const [recentLessons, setRecentLessons] = useState<RecentLearningHistoryEntry[]>([]);
  const [recentLessonsLoaded, setRecentLessonsLoaded] = useState(false);

  useEffect(() => {
    const refreshRecentLessons = () => {
      setRecentLessons(readRecentLearningHistory().slice(0, RECENT_LESSON_LIMIT));
      setRecentLessonsLoaded(true);
    };
    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === RECENT_LEARNING_HISTORY_KEY) refreshRecentLessons();
    };

    refreshRecentLessons();
    window.addEventListener("pageshow", refreshRecentLessons);
    window.addEventListener("storage", handleStorage);
    window.addEventListener(RECENT_LEARNING_HISTORY_CHANGED_EVENT, refreshRecentLessons);
    return () => {
      window.removeEventListener("pageshow", refreshRecentLessons);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(RECENT_LEARNING_HISTORY_CHANGED_EVENT, refreshRecentLessons);
    };
  }, []);

  return (
    <main className="learner-dashboard home-portal-dashboard home-redesign">
      {verified ? (
        <p className="home-redesign-success" role="status">
          <Check aria-hidden="true" size={17} /> Email đã xác minh. Chào mừng bạn đến Himi Chinese.
        </p>
      ) : null}

      <section className="home-redesign-hero home-compact-hero" aria-labelledby="home-redesign-title">
        <picture className="home-compact-hero-media">
          <source media="(max-width: 720px)" srcSet="/assets/home/home-hero-compact-mobile-v2.webp" />
          <Image
            alt=""
            className="home-compact-hero-art"
            fill
            fetchPriority="high"
            loading="eager"
            sizes="(max-width: 720px) 100vw, calc(100vw - 240px)"
            src="/assets/home/home-hero-compact-v2.webp"
            unoptimized
          />
        </picture>
        <Image
          alt=""
          aria-hidden="true"
          className="home-compact-hero-bubble"
          height={197}
          loading="eager"
          src="/assets/home/home-hero-speech-bubble.webp"
          unoptimized
          width={360}
        />
        <div className="home-redesign-hero-copy">
          <h1 id="home-redesign-title">
            Mỗi ngày một chút,<br /><em>tiếng Trung thêm vui</em>
          </h1>
          <Link className="home-redesign-primary" href="/hsk/1/hsk1-bai-01-chao-anh" prefetch={false}>
            Tiếp tục học <ArrowRight aria-hidden="true" size={21} strokeWidth={2.5} />
          </Link>
        </div>
      </section>

      <section className="home-redesign-section" aria-labelledby="home-feature-title">
        <div className="home-redesign-heading-row">
          <h2 id="home-feature-title">Tính năng học tập</h2>
        </div>
        <div className="home-study-feature-grid">
          {FEATURES.map((feature) => (
            <Link aria-label={`${feature.title}. ${feature.action}`} className={`home-study-feature is-${feature.tone}`} href={feature.href} key={feature.title} prefetch={false}>
              <Image alt="" aria-hidden="true" className="home-study-feature-art" height={700} loading="eager" sizes="(max-width: 720px) 45vw, (max-width: 900px) 40vw, 25vw" src={feature.image} unoptimized width={700} />
              <span className="home-study-feature-copy">
                <h3>{feature.titleLead} <em>{feature.titleAccent}</em></h3>
                <p>{feature.description}</p>
              </span>
              <span aria-hidden="true" className="home-study-feature-action"><ArrowRight size={22} strokeWidth={2.4} /></span>
            </Link>
          ))}
        </div>
      </section>

      <div className="home-redesign-lower-grid">
        <section className="home-redesign-section home-redesign-topics" aria-labelledby="home-topic-title">
          <div className="home-redesign-heading-row">
            <h2 id="home-topic-title">Chủ đề phổ biến</h2>
            <Link href="/courses/tieng-trung-tan-suat-cao" prefetch={false}>Xem tất cả <ArrowRight aria-hidden="true" size={18} /></Link>
          </div>
          <div className="home-study-topic-scene">
            <div className="home-study-topic-grid">
              {TOPICS.map((topic) => {
                const Icon = topic.icon;
                return (
                  <Link className="home-study-topic" href={topic.href} key={topic.title} prefetch={false}>
                    <span className={`home-study-topic-icon is-${topic.tone}`}><Icon aria-hidden="true" size={29} strokeWidth={2.1} /></span>
                    <span className="home-study-topic-copy"><strong>{topic.title}</strong><small>{topic.lessons} bài học</small></span>
                    <ArrowRight aria-hidden="true" className="home-study-topic-arrow" size={18} />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="home-redesign-section home-study-recent" aria-labelledby="home-recent-title">
          <div className="home-redesign-heading-row">
            <h2 id="home-recent-title">Bài học gần đây</h2>
          </div>
          {recentLessonsLoaded && recentLessons.length === 0 ? (
            <div className="home-study-recent-empty">
              <Image alt="" className="home-study-recent-art" height={500} src="/assets/home/himi-recent-reading.webp" unoptimized width={700} />
              <div className="home-study-recent-empty-copy">
                <h3>Bạn chưa học bài nào</h3>
                <p>Hãy mở một bài học để bắt đầu nhé!</p>
                <Link href="/courses" prefetch={false}>Khám phá bài học <ArrowRight aria-hidden="true" size={17} /></Link>
              </div>
            </div>
          ) : (
            <div className="home-study-recent-list" aria-live="polite">
              {recentLessons.map((lesson) => {
                const RecentIcon = lesson.kind === "industry" ? BriefcaseBusiness : BookOpenText;
                return (
                  <Link className="home-study-recent-item" href={lesson.href} key={lesson.id} prefetch={false}>
                    <span className={`home-study-lesson-icon is-${lesson.kind === "industry" ? "amber" : "coral"}`}><RecentIcon aria-hidden="true" size={23} strokeWidth={2.2} /></span>
                    <span className="home-study-lesson-copy"><strong>{lesson.title}</strong><small>{lesson.subtitle}</small></span>
                    <span className="home-study-progress" aria-label={`Tiến độ ${lesson.progress}%`}>
                      <i><b style={{ width: `${lesson.progress}%` }} /></i><small>{lesson.progress}%</small>
                    </span>
                    <ArrowRight aria-hidden="true" className="home-redesign-lesson-arrow" size={18} />
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {welcomeOffer ? <HomeVipWelcomeOffer plan={welcomeOffer} /> : null}
    </main>
  );
}
