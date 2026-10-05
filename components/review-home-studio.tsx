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
  { title: "Luyện viết", description: "Tập viết Hán tự đúng nét, nhớ lâu hơn.", action: "Bắt đầu luyện viết", href: "/writing", image: "/assets/home/features/feature-himi-writing.png", tone: "rose" },
  { title: "Luyện nghe", description: "Nghe hội thoại thực tế, làm quen phát âm chuẩn.", action: "Bắt đầu luyện nghe", href: "/listening", image: "/assets/home/features/feature-himi-listening.png", tone: "apricot" },
  { title: "Luyện gõ", description: "Gõ pinyin nhanh và chính xác theo ngữ cảnh.", action: "Bắt đầu luyện gõ", href: "/typing", image: "/assets/home/features/feature-himi-typing.png", tone: "blue" },
  { title: "Giáo trình HSK", description: "Học theo giáo trình chuẩn, chinh phục từng cấp độ.", action: "Khám phá giáo trình", href: "/courses?view=hsk", image: "/assets/home/features/feature-himi-hsk.png", tone: "lilac" },
] as const;

const TOPICS: Topic[] = [
  { title: "Giao tiếp hằng ngày", lessons: 32, href: "/courses/tieng-trung-tan-suat-cao", icon: MessageCircleMore, tone: "coral" },
  { title: "Ẩm thực", lessons: 28, href: "/courses/nha-hang-dich-vu", icon: Soup, tone: "orange" },
  { title: "Du lịch", lessons: 24, href: "/courses/tieng-trung-tan-suat-cao", icon: Plane, tone: "blue" },
  { title: "Công việc", lessons: 20, href: "/courses/giao-tiep-cong-so", icon: BriefcaseBusiness, tone: "amber" },
  { title: "Gia đình", lessons: 18, href: "/courses/tieng-trung-tan-suat-cao", icon: UsersRound, tone: "green" },
  { title: "Học tập", lessons: 25, href: "/courses?view=hsk", icon: GraduationCap, tone: "indigo" },
];

export function ReviewHomeStudio({ verified = false, welcomeOffer = null }: ReviewHomeStudioProps) {
  const [recentLessons, setRecentLessons] = useState<RecentLearningHistoryEntry[]>([]);
  const [recentLessonsLoaded, setRecentLessonsLoaded] = useState(false);

  useEffect(() => {
    const refreshRecentLessons = () => {
      setRecentLessons(readRecentLearningHistory().slice(0, 3));
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

      <section className="home-redesign-hero" aria-labelledby="home-redesign-title">
        <div className="home-redesign-hero-copy">
          <span className="home-redesign-greeting home-redesign-desktop-only">Nǐ hǎo!</span>
          <span className="home-redesign-mobile-kicker">HIMI CHINESE</span>
          <h1 id="home-redesign-title">
            <span className="home-redesign-desktop-title">Chào mừng bạn đến với <em>Himi Chinese!</em></span>
            <span className="home-redesign-mobile-title">Học tiếng Trung thật <em>dễ dàng, thú vị và hiệu quả!</em></span>
          </h1>
          <p>
            <span className="home-redesign-desktop-copy">Học tiếng Trung thật dễ dàng, thú vị và hiệu quả cùng Himi.</span>
            <span className="home-redesign-mobile-copy">Cùng Himi chinh phục tiếng Trung mỗi ngày với những bài học sinh động và thực tế.</span>
          </p>
          <Link className="home-redesign-primary" href="/hsk/1/hsk1-bai-01-chao-anh" prefetch={false}>
            Tiếp tục học <ArrowRight aria-hidden="true" size={21} strokeWidth={2.5} />
          </Link>
        </div>

        <div aria-hidden="true" className="home-redesign-landscape">
          <Image
            alt=""
            className="home-redesign-cover-image"
            fill
            priority
            sizes="(min-width: 721px) calc(100vw - 240px), 100vw"
            src="/assets/home/home-hero-cover-desktop.png"
          />
          <span className="home-redesign-sun" />
          <span className="home-redesign-cloud home-redesign-cloud-one" />
          <span className="home-redesign-cloud home-redesign-cloud-two" />
          <span className="home-redesign-hill home-redesign-hill-one" />
          <span className="home-redesign-hill home-redesign-hill-two" />
          <span className="home-redesign-pagoda">亭</span>
        </div>

        <div aria-hidden="true" className="home-redesign-mascot-wrap">
          <Image alt="" className="home-redesign-mascot is-desktop" height={640} priority src="/assets/mascot/himi-v2/himi-wave.webp" width={640} />
          <Image alt="" className="home-redesign-mascot is-mobile" height={1024} priority src="/assets/home/mobile/home-mobile-hero-penguin-cutout.png" width={1536} />
          <span className="home-redesign-spark is-one" />
          <span className="home-redesign-spark is-two" />
        </div>

        <div aria-hidden="true" className="home-redesign-bubble">Học là vui!</div>
      </section>

      <section className="home-redesign-section" aria-labelledby="home-feature-title">
        <div className="home-redesign-heading-row">
          <h2 id="home-feature-title">Tính năng học tập</h2>
        </div>
        <div className="home-study-feature-grid">
          {FEATURES.map((feature) => (
            <Link className={`home-study-feature is-${feature.tone}`} href={feature.href} key={feature.title} prefetch={false}>
              <span className="home-study-feature-copy">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </span>
              <span aria-hidden="true" className="home-study-feature-action"><span>{feature.action}</span><ArrowRight size={18} strokeWidth={2.5} /></span>
              <Image alt="" className="home-study-feature-art" height={700} sizes="(max-width: 900px) 50vw, 25vw" src={feature.image} width={700} />
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
            <Image alt="" aria-hidden="true" className="home-study-topic-landscape" height={768} sizes="(max-width: 1180px) 100vw, 55vw" src="/assets/home/himi-topics-landscape.png" width={2048} />
          </div>
        </section>

        <section className="home-redesign-section home-study-recent" aria-labelledby="home-recent-title">
          <div className="home-redesign-heading-row">
            <h2 id="home-recent-title">Bài học gần đây</h2>
          </div>
          {recentLessonsLoaded && recentLessons.length === 0 ? (
            <div className="home-study-recent-empty">
              <Image alt="" className="home-study-recent-art" height={500} src="/assets/home/himi-recent-reading.png" width={700} />
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
              {recentLessons.length === 1 ? <Image alt="" className="home-study-recent-list-art" height={500} src="/assets/home/himi-recent-reading.png" width={700} /> : null}
            </div>
          )}
        </section>
      </div>

      {welcomeOffer ? <HomeVipWelcomeOffer plan={welcomeOffer} /> : null}
    </main>
  );
}
