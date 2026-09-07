"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  ChevronRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  X,
} from "lucide-react";

function PasswordInput({
  autoComplete,
  label,
  maxLength,
  minLength,
  name,
}: {
  autoComplete: "current-password" | "new-password";
  label: string;
  maxLength: number;
  minLength?: number;
  name: string;
}) {
  const inputId = useId();
  const [visible, setVisible] = useState(false);

  return <label className="account-password-field" htmlFor={inputId}>
    <span>{label}</span>
    <span className="account-password-input-shell">
      <LockKeyhole aria-hidden="true" size={19} />
      <input
        autoComplete={autoComplete}
        id={inputId}
        maxLength={maxLength}
        minLength={minLength}
        name={name}
        placeholder={label}
        required
        type={visible ? "text" : "password"}
      />
      <button
        aria-label={visible ? `Ẩn ${label.toLocaleLowerCase("vi-VN")}` : `Hiện ${label.toLocaleLowerCase("vi-VN")}`}
        onClick={() => setVisible((current) => !current)}
        type="button"
      >
        {visible ? <EyeOff aria-hidden="true" size={20} /> : <Eye aria-hidden="true" size={20} />}
      </button>
    </span>
  </label>;
}

export function AccountPasswordSheet({
  maxLength,
  minLength,
  openOnMount = false,
}: {
  maxLength: number;
  minLength: number;
  openOnMount?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  function openDialog() {
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  useEffect(() => {
    if (openOnMount) openDialog();
  }, [openOnMount]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const lockScroll = () => {
      document.documentElement.dataset.accountSheetOpen = "true";
    };
    const unlockScroll = () => {
      delete document.documentElement.dataset.accountSheetOpen;
      triggerRef.current?.focus();
    };

    dialog.addEventListener("close", unlockScroll);
    dialog.addEventListener("cancel", unlockScroll);
    if (dialog.open) lockScroll();

    const observer = new MutationObserver(() => {
      if (dialog.open) lockScroll();
      else delete document.documentElement.dataset.accountSheetOpen;
    });
    observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });

    return () => {
      dialog.removeEventListener("close", unlockScroll);
      dialog.removeEventListener("cancel", unlockScroll);
      observer.disconnect();
      delete document.documentElement.dataset.accountSheetOpen;
    };
  }, []);

  return <div className="account-security-details">
    <button className="account-security-row" onClick={openDialog} ref={triggerRef} type="button">
      <LockKeyhole aria-hidden="true" size={22} />
      <span><strong>Đổi mật khẩu</strong><small>Cập nhật mật khẩu để bảo vệ tài khoản</small></span>
      <ChevronRight aria-hidden="true" size={20} />
    </button>

    <dialog
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      className="account-password-dialog"
      onCancel={(event) => {
        event.preventDefault();
        closeDialog();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
      ref={dialogRef}
    >
      <section className="account-password-sheet">
        <span aria-hidden="true" className="account-password-sheet-handle" />
        <header>
          <div>
            <span className="account-password-sheet-icon"><ShieldCheck aria-hidden="true" size={20} /></span>
            <h2 id={titleId}>Đổi mật khẩu</h2>
          </div>
          <button aria-label="Đóng đổi mật khẩu" onClick={closeDialog} type="button"><X aria-hidden="true" size={23} /></button>
        </header>
        <p id={descriptionId}>Vì lý do bảo mật, vui lòng không chia sẻ mật khẩu của bạn với bất kỳ ai.</p>
        <form action="/api/auth/change-password" className="account-password-sheet-form" method="post">
          <PasswordInput autoComplete="current-password" label="Mật khẩu hiện tại" maxLength={maxLength} name="currentPassword" />
          <PasswordInput autoComplete="new-password" label="Mật khẩu mới" maxLength={maxLength} minLength={minLength} name="nextPassword" />
          <PasswordInput autoComplete="new-password" label="Nhập lại mật khẩu" maxLength={maxLength} minLength={minLength} name="confirmPassword" />
          <button className="account-password-submit" type="submit">Cập nhật mật khẩu</button>
          <button className="account-password-cancel" onClick={closeDialog} type="button">Hủy</button>
        </form>
      </section>
    </dialog>
  </div>;
}
