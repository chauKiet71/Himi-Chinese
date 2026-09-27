import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ChevronRight, Clock3, Eye, RotateCcw } from "lucide-react";
import { GameResultCelebration } from "@/components/game-result-celebration";
import stylesheetHref from "../../typing-practice.css?url";

export default function CompletionPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return <><link href={stylesheetHref} precedence="himi-typing-preview" rel="stylesheet" /><main className="typing-completion-stage game-session-world" style={{ background: "#fffaf7" }}>
    <GameResultCelebration
      actions={<>
        <button type="button"><RotateCcw aria-hidden="true" size={17} /> Luyện lại</button>
        <button type="button">Bài tiếp theo <ArrowRight aria-hidden="true" size={17} /></button>
      </>}
      details={<>
        <p className="typing-complete-summary">Bạn đã đi hết 30 từ và cụm từ trong phiên này.</p>
        <div className="typing-complete-stats">
          <div><CheckCircle2 aria-hidden="true" size={21} /><span><strong>18</strong><small>Tự gõ đúng</small></span></div>
          <div><Eye aria-hidden="true" size={21} /><span><strong>6</strong><small>Có xem đáp án</small></span></div>
          <div><ChevronRight aria-hidden="true" size={21} /><span><strong>6</strong><small>Đã bỏ qua</small></span></div>
          <div><Clock3 aria-hidden="true" size={21} /><span><strong>04:21</strong><small>Thời gian</small></span></div>
        </div>
      </>}
      eyebrow="HSK 2 · BÀI 1 ĐÃ HOÀN THÀNH"
      label="Một lượt gõ rất tập trung!"
      score={600}
      titleId="completion-preview-title"
    />
  </main></>;
}
