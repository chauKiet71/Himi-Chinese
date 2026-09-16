"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Check, Gift, X } from "lucide-react";

export type HomeVipWelcomeOfferPlan = {
  ctaHref: string;
  durationDays: number;
  planCode: string;
  planName: string;
  priceVnd: number;
};

const OFFER_STORAGE_VERSION = "v1";

function formatPrice(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

function shortPrice(value: number): string {
  if (value >= 1_000 && value % 1_000 === 0) return `${value / 1_000}k`;
  return formatPrice(value);
}

export function HomeVipWelcomeOffer({ plan }: { plan: HomeVipWelcomeOfferPlan }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [open, setOpen] = useState(false);
  const storageKey = `himi:home-welcome-offer:${plan.planCode}:${OFFER_STORAGE_VERSION}`;

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(storageKey) === "dismissed";
    } catch {
      // The offer remains usable when storage is unavailable.
    }

    const forceOpen = new URLSearchParams(window.location.search).get("welcomeOffer") === "1";
    if (dismissed && !forceOpen) return;
    const handle = window.setTimeout(() => setOpen(true), forceOpen ? 0 : 420);
    return () => window.clearTimeout(handle);
  }, [storageKey]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.focus({ preventScroll: true });
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function rememberDismissal() {
    try {
      window.localStorage.setItem(storageKey, "dismissed");
    } catch {
      // Closing and navigation still work without storage.
    }
  }

  function closeOffer() {
    rememberDismissal();
    setOpen(false);
  }

  function followOffer() {
    rememberDismissal();
    setOpen(false);
  }

  return <dialog
    aria-describedby={descriptionId}
    aria-labelledby={titleId}
    className="home-welcome-offer-dialog"
    onCancel={(event) => {
      event.preventDefault();
      closeOffer();
    }}
    onClick={(event) => {
      if (event.target === event.currentTarget) closeOffer();
    }}
    ref={dialogRef}
    tabIndex={-1}
  >
    <section className="home-welcome-offer-card">
      <button aria-label="Đóng ưu đãi chào mừng" className="home-welcome-offer-close" onClick={closeOffer} type="button">
        <X aria-hidden="true" size={27} strokeWidth={2.2} />
      </button>

      <span className="home-welcome-offer-kicker"><Gift aria-hidden="true" size={23} strokeWidth={2.2} /> Ưu đãi chào mừng</span>

      <div className="home-welcome-offer-hero">
        <div className="home-welcome-offer-copy">
          <h2 id={titleId}>Học trọn 1 tháng chỉ {shortPrice(plan.priceVnd)}</h2>
          <strong className="home-welcome-offer-price">{formatPrice(plan.priceVnd)}</strong>
          <div className="home-welcome-offer-meta" aria-label={`${plan.planName}, ${plan.durationDays} ngày`}>
            <span>Trọn {plan.durationDays} ngày</span>
            <b>Không tự gia hạn</b>
          </div>
          <p id={descriptionId}>Mở khóa toàn bộ bài học, luyện nghe, luyện nói và lộ trình HSK trong 1 tháng.</p>
        </div>
        <Image
          alt="Himi vui mừng cầm thẻ VIP"
          className="home-welcome-offer-mascot"
          height={440}
          priority
          src="/assets/home/himi-vip-offer-mascot.png"
          width={356}
        />
      </div>

      <ul className="home-welcome-offer-benefits">
        <li><span><Check aria-hidden="true" size={19} strokeWidth={2.4} /></span>Truy cập toàn bộ nội dung VIP</li>
        <li><span><Check aria-hidden="true" size={19} strokeWidth={2.4} /></span>Bài học mới được cập nhật liên tục</li>
        <li><span><Check aria-hidden="true" size={19} strokeWidth={2.4} /></span>Thanh toán một lần · Không tự gia hạn</li>
      </ul>

      <Link className="home-welcome-offer-primary" href={plan.ctaHref} onClick={followOffer}>
        Nhận gói VIP 1 tháng <ArrowRight aria-hidden="true" size={24} strokeWidth={2.2} />
      </Link>
      <Link className="home-welcome-offer-secondary" href="/courses" onClick={followOffer}>Học thử miễn phí trước</Link>
      <p className="home-welcome-offer-footnote">Bạn có thể đóng và xem lại gói trong mục VIP</p>
    </section>
  </dialog>;
}
