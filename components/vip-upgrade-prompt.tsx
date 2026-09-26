"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useId, useRef } from "react";
import { ArrowRight, BookOpen, Crown, LockKeyhole, Mic2, Sparkles, X } from "lucide-react";

export type VipUpgradeTarget = {
  kind: "Lộ trình" | "Module" | "Bài học" | "Câu hỏi" | "Chữ Hán";
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

export function VipContentGate({
  children,
  className = "",
  description = "Mở khóa toàn bộ nội dung và tiếp tục học không giới hạn.",
  eyebrow = "Nội dung VIP",
  title = "Mở khóa phần học này",
}: {
  children?: ReactNode;
  className?: string;
  description?: string;
  eyebrow?: string;
  title?: string;
}) {
  return <section className={`vip-content-gate ${className}`.trim()}>
    <div aria-hidden="true" className="vip-content-preview">
      {children ?? <>
        <span className="vip-preview-pill"><Sparkles size={14} /> Himi lesson</span>
        <span className="vip-preview-heading" />
        <span className="vip-preview-line is-long" />
        <span className="vip-preview-line" />
        <span className="vip-preview-choice" />
        <span className="vip-preview-choice" />
      </>}
    </div>
    <div className="vip-content-gate-panel">
      <span className="vip-content-gate-icon"><LockKeyhole aria-hidden="true" size={24} /></span>
      <div className="vip-content-gate-copy">
        <small>{eyebrow}</small>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="vip-content-gate-actions">
        <VipUpgradeInlineForm />
        <Link className="vip-content-gate-link" href="/vip">Xem quyền lợi</Link>
      </div>
    </div>
  </section>;
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
      <div className="vip-upgrade-visual" aria-hidden="true">
        <Image alt="" className="vip-upgrade-mascot" height={440} src="/assets/home/himi-vip-offer-mascot.png" width={356} />
      </div>
      <div className="vip-upgrade-content">
        <h2 id={titleId}>Bài học này chỉ có ở <strong>Himi VIP</strong></h2>
        <p className="sr-only" id={descriptionId}>{target?.kind ?? "Nội dung"}{target?.title ? ` “${target.title}”` : ""} chỉ dành cho thành viên VIP.</p>
        <ul className="vip-upgrade-benefits">
          <li><span><BookOpen aria-hidden="true" /></span><div><strong>Mở khóa toàn bộ bài học</strong><small>Học không giới hạn</small></div></li>
          <li><span><Mic2 aria-hidden="true" /></span><div><strong>Luyện phát âm AI chuẩn</strong><small>Nhận phản hồi chi tiết</small></div></li>
          <li><span><Crown aria-hidden="true" /></span><div><strong>Nhiều tính năng cao cấp khác</strong><small>Trải nghiệm học trọn vẹn hơn</small></div></li>
        </ul>
        <Link className="vip-upgrade-primary" href="/vip"><Crown aria-hidden="true" /> Nâng cấp ngay <ArrowRight aria-hidden="true" /></Link>
      </div>
    </section>
  </dialog>;
}
