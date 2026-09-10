import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import type { HskLessonContent } from "@/lib/hsk-lesson-content";
import { VipUpgradeInlineForm } from "@/components/vip-upgrade-prompt";

export function HskVipLocked({ lesson }: { lesson: HskLessonContent }) {
  return <main className="hsk-lesson-page">
    <section className="section-shell lesson-content-card lesson-locked-panel" aria-labelledby="hsk-vip-locked-title">
      <span><LockKeyhole aria-hidden="true" size={28} /></span>
      <small>{lesson.levelLabel} · Bài {lesson.lessonNumber}</small>
      <h1 id="hsk-vip-locked-title">{lesson.title}</h1>
      <p>Bài học này thuộc nội dung VIP. Nội dung, câu hỏi và đáp án chưa được gửi tới trình duyệt của bạn.</p>
      <div>
        <VipUpgradeInlineForm />
        <Link className="button button-secondary" href="/courses?view=hsk">Quay lại lộ trình HSK</Link>
      </div>
    </section>
  </main>;
}
