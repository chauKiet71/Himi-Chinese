"use client";

import { useEffect, useId, useRef } from "react";
import { Crown, LockKeyhole, X } from "lucide-react";

export type VipUpgradeTarget = {
  kind: "Lộ trình" | "Module" | "Bài học" | "Câu hỏi";
  title: string;
};

export function VipUpgradeInlineForm({
  className = "button button-primary",
}: {
  className?: string;
}) {
  return <form action="/vip" className="vip-upgrade-inline-form" method="get">
    <button className={className} type="submit"><Crown aria-hidden="true" size={17} /> Nâng cấp</button>
  </form>;
}

export function VipUpgradeDialog({
  onClose,
  open,
  target,
}: {
  onClose: () => void;
  open: boolean;
  target: VipUpgradeTarget | null;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.documentElement.dataset.vipPromptOpen = "true";
    return () => {
      delete document.documentElement.dataset.vipPromptOpen;
    };
  }, [open]);

  function closeDialog() {
    dialogRef.current?.close();
    onClose();
  }

  return <dialog
    aria-describedby={descriptionId}
    aria-labelledby={titleId}
    className="vip-upgrade-dialog"
    onCancel={(event) => {
      event.preventDefault();
      closeDialog();
    }}
    onClick={(event) => {
      if (event.target === event.currentTarget) closeDialog();
    }}
    ref={dialogRef}
  >
    <section className="vip-upgrade-sheet">
      <button aria-label="Đóng yêu cầu nâng cấp" className="vip-upgrade-close" onClick={closeDialog} type="button"><X aria-hidden="true" size={21} /></button>
      <span className="vip-upgrade-icon"><LockKeyhole aria-hidden="true" size={28} /></span>
      <span className="vip-upgrade-kicker">Nội dung VIP</span>
      <h2 id={titleId}>Cần nâng cấp để tiếp tục học</h2>
      <p id={descriptionId}>
        <strong>{target?.kind ?? "Nội dung"}{target?.title ? ` “${target.title}”` : ""}</strong> chỉ dành cho thành viên VIP. Nâng cấp để mở nội dung này và tiếp tục lộ trình.
      </p>
      <form action="/vip" className="vip-upgrade-actions" method="get">
        <button className="button button-primary" type="submit"><Crown aria-hidden="true" size={17} /> Nâng cấp</button>
        <button className="button button-secondary" onClick={closeDialog} type="button">Để sau</button>
      </form>
    </section>
  </dialog>;
}
