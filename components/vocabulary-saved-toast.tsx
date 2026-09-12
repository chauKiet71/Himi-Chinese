"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";

export type VocabularySavedNotice = {
  id: string;
  hanzi: string;
  meaning: string;
};

export function VocabularySavedToast({
  notice,
  onDismiss,
}: {
  notice: VocabularySavedNotice;
  onDismiss: () => void;
}) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLeaving(true), 3800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(onDismiss, 260);
    return () => window.clearTimeout(timer);
  }, [leaving, onDismiss]);

  return (
    <aside
      aria-atomic="true"
      className={`vocabulary-saved-toast${leaving ? " is-leaving" : ""}`}
      role="status"
    >
      <span aria-hidden="true" className="vocabulary-saved-toast__icon">
        <CheckCircle2 size={24} strokeWidth={2.4} />
      </span>
      <div className="vocabulary-saved-toast__copy">
        <strong>Đã lưu <b lang="zh-CN">{notice.hanzi}</b> vào Bộ từ vựng</strong>
        <p>{notice.meaning} · Bạn có thể học lại từ này trong Bộ từ vựng.</p>
        <Link href="/vocabulary">
          Mở Bộ từ vựng <ArrowRight aria-hidden="true" size={15} />
        </Link>
      </div>
      <button aria-label="Đóng thông báo đã lưu từ" onClick={() => setLeaving(true)} type="button">
        <X aria-hidden="true" size={17} />
      </button>
    </aside>
  );
}
