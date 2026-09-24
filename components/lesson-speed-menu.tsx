"use client";

import { useRef } from "react";
import { ChevronDown, Gauge } from "lucide-react";

export const LESSON_PLAYBACK_RATES = [0.75, 1, 1.25] as const;
export type LessonPlaybackRate = (typeof LESSON_PLAYBACK_RATES)[number];

export function LessonSpeedMenu({
  rate,
  onChange,
}: {
  rate: LessonPlaybackRate;
  onChange: (rate: LessonPlaybackRate) => void;
}) {
  const menuRef = useRef<HTMLDetailsElement>(null);

  return <details className="lesson-speed-menu" ref={menuRef}>
    <summary aria-label={`Tốc độ phát hiện tại ${rate} lần`} title="Chọn tốc độ phát">
      <Gauge aria-hidden="true" size={17} />
      <span>{rate}×</span>
      <ChevronDown aria-hidden="true" className="lesson-speed-chevron" size={14} />
    </summary>
    <div aria-label="Tốc độ phát" className="lesson-speed-options" role="group">
      {LESSON_PLAYBACK_RATES.map((value) => <button
        aria-pressed={rate === value}
        key={value}
        onClick={() => {
          onChange(value);
          if (menuRef.current) menuRef.current.open = false;
        }}
        type="button"
      >{value}×</button>)}
    </div>
  </details>;
}
