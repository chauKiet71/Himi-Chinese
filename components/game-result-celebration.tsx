"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

export function GameResultCelebration({
  actions,
  eyebrow = "HOÀN THÀNH LƯỢT CHƠI",
  label,
  score,
}: {
  actions: ReactNode;
  eyebrow?: string;
  label: string;
  score: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const scoreNode = scoreRef.current;
    if (!scoreNode) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      scoreNode.textContent = `${score.toLocaleString("vi-VN")} điểm`;
      return;
    }

    scoreNode.textContent = "0 điểm";
    const startedAt = performance.now();
    let animationFrame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / 1050);
      const eased = 1 - Math.pow(1 - progress, 3);
      scoreNode.textContent = `${Math.round(score * eased).toLocaleString("vi-VN")} điểm`;
      if (progress < 1) animationFrame = window.requestAnimationFrame(tick);
    };
    animationFrame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [score]);

  return (
    <div aria-live="polite" className="game-result game-result-celebration" ref={rootRef} role="status">
      <Image
        alt=""
        aria-hidden="true"
        className="game-result-celebration__background"
        data-celebration-part="background"
        fill
        priority
        sizes="(max-width: 560px) 100vw, 680px"
        src="/assets/games/results/celebration-fireworks.webp"
      />
      <Image
        alt=""
        aria-hidden="true"
        className="game-result-celebration__firework-pulse"
        data-celebration-part="firework-pulse"
        fill
        sizes="(max-width: 560px) 100vw, 680px"
        src="/assets/games/results/celebration-fireworks.webp"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        aria-hidden="true"
        className="game-result-celebration__confetti"
        data-celebration-part="confetti"
        src="/assets/quiz/correct-confetti.gif"
      />
      <div className="game-result-celebration__mascot-stage" data-celebration-part="mascot">
        <Image
          alt="Himi nâng cúp chúc mừng bạn"
          className="game-result-celebration__mascot"
          height={900}
          priority
          sizes="(max-width: 560px) 70vw, 390px"
          src="/assets/games/results/himi-trophy-celebration.webp"
          width={900}
        />
      </div>

      <div className="game-result-celebration__panel" data-celebration-part="panel">
        <small data-celebration-copy>{eyebrow}</small>
        <h2 data-celebration-copy>{label}</h2>
        <strong className="game-result-celebration__score" data-celebration-copy>
          <Star aria-hidden="true" fill="currentColor" size={22} />
          <span ref={scoreRef}>{score.toLocaleString("vi-VN")} điểm</span>
        </strong>
        <div className="game-result-celebration__actions" data-celebration-actions>
          {actions}
        </div>
      </div>
    </div>
  );
}
