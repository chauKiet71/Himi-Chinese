import { notFound } from "next/navigation";
import { LessonPronunciationCoach } from "@/components/lesson-pronunciation-coach";
import { PronunciationEvaluator } from "@/components/pronunciation-evaluator";
import type { DialogueLine } from "@/lib/content-types";

const previewDialogue = [
  { speaker: "Himi", hanzi: "你好。", pinyin: "Nǐ hǎo.", translation: "Xin chào." },
  { speaker: "Himi", hanzi: "好的，以后有问题可以找我。", pinyin: "Hǎo de, yǐhòu yǒu wèntí kěyǐ zhǎo wǒ.", translation: "Được, sau này có vấn đề bạn có thể tìm tôi." },
  { speaker: "Himi", hanzi: "我是新来的，请多关照。", pinyin: "Wǒ shì xīn lái de, qǐng duō guānzhào.", translation: "Tôi là người mới, mong mọi người giúp đỡ." },
  { speaker: "Himi", hanzi: "今天我们一起确认会议时间和需要准备的资料。", pinyin: "Jīntiān wǒmen yìqǐ quèrèn huìyì shíjiān hé xūyào zhǔnbèi de zīliào.", translation: "Hôm nay chúng ta cùng xác nhận thời gian họp và tài liệu cần chuẩn bị." },
  { speaker: "Himi", hanzi: "谢谢。", pinyin: "Xièxie.", translation: "Cảm ơn." },
  { speaker: "Himi", hanzi: "没问题。", pinyin: "Méi wèntí.", translation: "Không vấn đề gì." },
  { speaker: "Himi", hanzi: "请稍等一下。", pinyin: "Qǐng shāo děng yíxià.", translation: "Vui lòng đợi một chút." },
  { speaker: "Himi", hanzi: "我马上处理。", pinyin: "Wǒ mǎshàng chǔlǐ.", translation: "Tôi sẽ xử lý ngay." },
  { speaker: "Himi", hanzi: "明天见。", pinyin: "Míngtiān jiàn.", translation: "Hẹn gặp ngày mai." },
  { speaker: "Himi", hanzi: "合作愉快。", pinyin: "Hézuò yúkuài.", translation: "Hợp tác vui vẻ." },
] satisfies DialogueLine[];

export default function PronunciationPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return <main className="lesson-stage-workspace" style={{ position: "fixed", inset: 0, zIndex: 999, minHeight: "100vh", padding: "28px 20px", overflow: "auto", background: "#f8faf9" }}>
    <div style={{ maxWidth: 1400, margin: "0 auto 28px" }}><LessonPronunciationCoach dialogue={previewDialogue} words={[]} /></div>
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
