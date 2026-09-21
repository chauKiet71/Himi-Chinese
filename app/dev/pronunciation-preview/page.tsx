import { notFound } from "next/navigation";
import { PronunciationEvaluator } from "@/components/pronunciation-evaluator";

export default function PronunciationPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return <main className="lesson-stage-workspace" style={{ minHeight: "100vh", padding: "48px 20px", background: "#f8faf9" }}>
    <section className="lesson-pronunciation-coach lesson-reference-deck" style={{ maxWidth: 920, margin: "0 auto" }}>
      <div className="lesson-pronunciation-action">
        <PronunciationEvaluator compact previewResult={{
          totalScore: 66,
          accuracyScore: 68,
          fluencyScore: 64,
          integrityScore: 72,
          toneScore: 61,
          weakSyllables: ["是", "rén"],
          feedback: "Đã đúng phần chính. Nói chậm hơn và tách rõ từng cụm từ.",
          characterFeedback: ["correct", "incorrect"],
        }} showListen={false} targetText="是" />
      </div>
    </section>
  </main>;
}
