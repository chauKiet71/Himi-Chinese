"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, AudioLines, BrainCircuit, Check, Mic2, Play } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

type ReviewHomeStudioProps = {
  verified?: boolean;
};

const HOME_DIALOGUE = [
  { speaker: "man", hanzi: "你今天怎么样？", pinyin: "nǐ jīntiān zěnmeyàng?", translation: "Hôm nay bạn thế nào?" },
  { speaker: "woman", hanzi: "很好，谢谢！", pinyin: "hěn hǎo, xièxie!", translation: "Rất tốt, cảm ơn!" },
  { speaker: "man", hanzi: "一起练习中文吧。", pinyin: "yìqǐ liànxí zhōngwén ba.", translation: "Cùng luyện tiếng Trung nhé." },
  { speaker: "woman", hanzi: "好，我们开始吧！", pinyin: "hǎo, wǒmen kāishǐ ba!", translation: "Được, bắt đầu thôi!" },
] as const;

const subscribeToHydration = () => () => undefined;

function useHydrated() {
  return useSyncExternalStore(subscribeToHydration, () => true, () => false);
}

export function ReviewHomeStudio({ verified = false }: ReviewHomeStudioProps) {
  const reduceMotion = usePrefersReducedMotion();
  const hydrated = useHydrated();
  const [activeDialogue, setActiveDialogue] = useState(0);
  const [pageVisible, setPageVisible] = useState(true);
  const motionEnabled = hydrated && !reduceMotion && pageVisible;
  const dialogue = HOME_DIALOGUE[activeDialogue];

  useEffect(() => {
    const syncVisibility = () => setPageVisible(document.visibilityState === "visible");
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  useEffect(() => {
    if (!motionEnabled) return;
    const timer = window.setInterval(() => {
      setActiveDialogue((current) => (current + 1) % HOME_DIALOGUE.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [motionEnabled]);

  return (
    <main className="learner-dashboard home-portal-dashboard">
      <section className={`home-portal-hero${motionEnabled ? " is-motion-active" : " is-motion-paused"}`} aria-labelledby="home-portal-title">
        <div aria-hidden="true" className="home-portal-art">
          <Image
            alt=""
            fill
            priority
            sizes="(max-width: 720px) 100vw, calc(100vw - 88px)"
            src="/assets/home/himi-language-portal-clean-1536.webp"
          />
        </div>

        <div aria-hidden="true" className="home-portal-conversation">
            <div
              className={`home-portal-dialogue is-${dialogue.speaker}`}
              key={`${dialogue.speaker}-${activeDialogue}`}
            >
              <span>{dialogue.pinyin}</span>
              <strong>{dialogue.hanzi}</strong>
              <small>{dialogue.translation}</small>
              <i className="home-portal-dialogue-wave"><b /><b /><b /></i>
            </div>
        </div>

        <div
          aria-hidden="true"
          className="home-portal-himi-stage"
        >
          <span className="home-portal-himi-image" />
        </div>

        {verified ? (
          <p className="home-portal-success" role="status">
            <Check aria-hidden="true" size={17} /> Email đã xác minh. Chào mừng bạn đến Himi Chinese.
          </p>
        ) : null}

        <div
          className="home-portal-copy"
        >
          <h1 id="home-portal-title">
            <span>Mỗi ngày một tí,</span>
            <span>tự tin cùng <em>Himi</em>.</span>
          </h1>
          <p>Tình huống thật. Phản xạ tự nhiên.</p>

          <div className="home-portal-actions">
            <Link className="home-portal-primary" href="/listening?mode=scenario" prefetch={false}>
              Bắt đầu luyện nói <ArrowRight aria-hidden="true" size={23} />
            </Link>
            <Link className="home-portal-secondary" href="/courses" prefetch={false}>
              <span aria-hidden="true"><Play size={18} fill="currentColor" /></span>
              Xem lộ trình
            </Link>
          </div>

          <nav aria-label="Bắt đầu luyện nhanh" className="home-portal-quick-dock">
            <Link className="home-portal-quick-action is-primary" href="/listening?mode=scenario" prefetch={false}>
              <Mic2 aria-hidden="true" size={26} strokeWidth={2.15} />
              <strong>Luyện nói</strong>
              <small>Tình huống</small>
            </Link>
            <Link className="home-portal-quick-action" href="/listening" prefetch={false}>
              <AudioLines aria-hidden="true" size={27} strokeWidth={2.05} />
              <strong>Nghe phản xạ</strong>
              <small>3 phút</small>
            </Link>
            <Link className="home-portal-quick-action" href="/hsk/1/hsk1-bai-01-chao-anh/flashcard" prefetch={false}>
              <BrainCircuit aria-hidden="true" size={27} strokeWidth={2.05} />
              <strong>Ôn từ</strong>
              <small>5 từ yếu</small>
            </Link>
          </nav>
        </div>
      </section>
    </main>
  );
}
