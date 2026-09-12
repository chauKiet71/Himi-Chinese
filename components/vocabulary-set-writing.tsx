"use client";
import { useEffect, useRef, useState } from "react";
import HanziWriter from "hanzi-writer";
import { Eye, PenLine, RotateCcw } from "lucide-react";

export function VocabularySetWriting({ character }: { character: string }) {
  const board = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"watch" | "write">("watch");
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState("Đang tải dữ liệu nét…");
  useEffect(() => {
    const element = board.current;
    if (!element) return;
    let canceled = false;
    element.replaceChildren();
    const update = (text: string) => { if (!canceled) setStatus(text); };
    const writer = HanziWriter.create(element, character, {
      width: 260, height: 260, padding: 18, showCharacter: false, showOutline: true,
      strokeColor: "#214f45", radicalColor: "#e96951", highlightColor: "#e96951", outlineColor: "#e3e7df", drawingColor: "#214f45",
      onLoadCharDataError: () => update("Chưa tải được dữ liệu nét. Kiểm tra kết nối rồi nhấn Thử lại."),
    });
    if (mode === "watch") void writer.animateCharacter({ onComplete: () => update("Đã xem hết các nét. Chọn Luyện viết để tự tay viết chữ này.") }).catch(() => update("Chưa tải được dữ liệu nét. Nhấn Thử lại."));
    else void writer.quiz({ onMistake: () => update("Thử lại theo nét gợi ý nhé."), onCorrectStroke: ({ strokesRemaining }) => update(`Còn ${strokesRemaining} nét.`), onComplete: () => update("Bạn đã viết đúng chữ này!") }).catch(() => update("Chưa tải được dữ liệu nét. Nhấn Thử lại."));
    return () => { canceled = true; writer.cancelQuiz(); void writer.pauseAnimation(); element.replaceChildren(); };
  }, [character, mode, attempt]);
  return <div className="vsets-writing"><div className="vsets-actions"><button aria-pressed={mode === "watch"} onClick={() => { setMode("watch"); setStatus("Đang xem thứ tự nét…"); }}><Eye size={17} /> Xem nét</button><button aria-pressed={mode === "write"} onClick={() => { setMode("write"); setStatus("Viết theo nét mờ trên ô chữ."); }}><PenLine size={17} /> Luyện viết</button></div><div className="vsets-writing-board" ref={board} role="img" aria-label={`Ô luyện viết chữ ${character}`} /><p role="status">{status}</p><button onClick={() => { setAttempt((value) => value + 1); setStatus("Đang tải dữ liệu nét…"); }}><RotateCcw size={16} /> Thử lại</button></div>;
}
