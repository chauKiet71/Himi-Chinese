"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

export function GameResultCelebration({
  actions,
  details,
  eyebrow = "HOÀN THÀNH LƯỢT CHƠI",
  label,
  score,
  titleId,
}: {
  actions: ReactNode;
  details?: ReactNode;
  eyebrow?: string;
  label: string;
  score: number;
  titleId?: string;
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
      <picture>
        <source media="(prefers-reduced-motion: reduce)" srcSet="/assets/games/results/celebration-fireworks.webp" />
        <img
          alt=""
          aria-hidden="true"
          className="game-result-celebration__background"
          data-celebration-part="background"
          data-static-fallback="/assets/games/results/celebration-fireworks.webp"
          fetchPriority="high"
          src="/assets/games/results/celebration-fireworks.gif"
        />
      </picture>
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
        <picture>
          <source media="(prefers-reduced-motion: reduce)" srcSet="/assets/games/results/himi-trophy-celebration.webp" />
          <img
            alt="Himi nâng cúp chúc mừng bạn"
            className="game-result-celebration__mascot"
            data-static-fallback="/assets/games/results/himi-trophy-celebration.webp"
            fetchPriority="high"
            height={580}
            src="/assets/games/results/himi-trophy-celebration.gif"
            width={512}
          />
        </picture>
      </div>

      <div className="game-result-celebration__panel" data-celebration-part="panel">
        <small data-celebration-copy>{eyebrow}</small>
        <h2 data-celebration-copy id={titleId}>{label}</h2>
        <strong className="game-result-celebration__score" data-celebration-copy>
          <Star aria-hidden="true" fill="currentColor" size={22} />
          <span ref={scoreRef}>{score.toLocaleString("vi-VN")} điểm</span>
        </strong>
        {details ? <div className="game-result-celebration__details" data-celebration-copy>{details}</div> : null}
        <div className="game-result-celebration__actions" data-celebration-actions>
          {actions}
        </div>
      </div>
    </div>
  );
}
