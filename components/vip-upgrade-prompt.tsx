"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, BookOpen, Crown, LogIn, Mic2, UserPlus, X } from "lucide-react";

const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export type VipUpgradeTarget = {
  kind: "Lộ trình" | "Module" | "Bài học" | "Câu hỏi" | "Chữ Hán" | "Nội dung";
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
  closeHref,
  onExit,
  title = "Mở khóa phần học này",
}: {
  closeHref: string;
  onExit?: () => void;
  title?: string;
}) {
  return <VipUpgradeDialog closeHref={closeHref} onExit={onExit} onClose={() => {}} open target={{ kind: "Nội dung", title }} />;
}

export function VipUpgradeDialog({
  authenticated = true,
  closeHref,
  onExit,
  onClose,
  open,
  returnTo = "/courses",
  target,
}: {
  authenticated?: boolean;
  closeHref?: string;
  onExit?: () => void;
  onClose: () => void;
  open: boolean;
  returnTo?: string;
  target: VipUpgradeTarget | null;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const mounted = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    return () => { if (dialog.open) dialog.close(); };
  }, [open, mounted]);

  function closeDialog() {
    if (closeHref) onExit?.();
    dialogRef.current?.close();
    onClose();
    if (closeHref) window.location.replace(closeHref);
  }

  const encodedReturnTo = encodeURIComponent(returnTo);

  if (!mounted) return null;

  // Keep lesson and typing styles from overriding the shared popup's controls.
  return createPortal(<dialog
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
      <button aria-label={closeHref ? "Đóng bài học và quay lại danh sách" : "Đóng yêu cầu nâng cấp"} className="vip-upgrade-close" onClick={closeDialog} type="button"><X aria-hidden="true" size={21} /></button>
      <div className="vip-upgrade-visual" aria-hidden="true">
        <Image alt="" className="vip-upgrade-mascot" height={440} src="/assets/home/himi-vip-offer-mascot.png" width={356} />
      </div>
      <div className="vip-upgrade-content">
        <h2 id={titleId}>{authenticated ? <>Bài học này chỉ có ở <strong>Himi VIP</strong></> : <>Đăng nhập để <strong>mở khóa bài học</strong></>}</h2>
        <p className="sr-only" id={descriptionId}>{authenticated
          ? `${target?.kind ?? "Nội dung"}${target?.title ? ` “${target.title}”` : ""} chỉ dành cho thành viên VIP.`
          : `Đăng nhập hoặc tạo tài khoản để tiếp tục mở khóa ${target?.kind?.toLowerCase() ?? "nội dung"}${target?.title ? ` “${target.title}”` : ""}.`}</p>
        <ul className="vip-upgrade-benefits">
          <li><span><BookOpen aria-hidden="true" /></span><div><strong>Mở khóa toàn bộ bài học</strong><small>Học không giới hạn</small></div></li>
          <li><span><Mic2 aria-hidden="true" /></span><div><strong>Luyện phát âm AI chuẩn</strong><small>Nhận phản hồi chi tiết</small></div></li>
          <li><span><Crown aria-hidden="true" /></span><div><strong>Nhiều tính năng cao cấp khác</strong><small>Trải nghiệm học trọn vẹn hơn</small></div></li>
        </ul>
        {authenticated ? <Link className="vip-upgrade-primary" href="/vip"><Crown aria-hidden="true" /> Nâng cấp ngay <ArrowRight aria-hidden="true" /></Link> : <div className="vip-upgrade-guest-actions">
          <p>Bạn chưa đăng nhập. Hãy dùng tài khoản hiện có hoặc tạo tài khoản miễn phí trước khi chọn gói VIP.</p>
          <Link className="vip-upgrade-primary" href={`/login?returnTo=${encodedReturnTo}`}><LogIn aria-hidden="true" /> Đăng nhập để mở khóa <ArrowRight aria-hidden="true" /></Link>
          <Link className="vip-upgrade-secondary" href={`/register?returnTo=${encodedReturnTo}`}><UserPlus aria-hidden="true" /> Chưa có tài khoản? Đăng ký miễn phí</Link>
          <Link className="vip-upgrade-benefits-link" href="/vip">Xem quyền lợi VIP</Link>
        </div>}
      </div>
    </section>
  </dialog>, document.body);
}
