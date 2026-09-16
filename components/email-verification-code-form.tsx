"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";

const NON_DIGIT_PATTERN = /\D/gu;

export function EmailVerificationCodeForm({ email, invalid = false }: { email: string; invalid?: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);
  const lastSubmittedCodeRef = useRef("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (code.length !== 6 || submitting || lastSubmittedCodeRef.current === code) return;
    lastSubmittedCodeRef.current = code;
    setSubmitting(true);
    formRef.current?.requestSubmit();
  }, [code, submitting]);

  const updateCode = (event: ChangeEvent<HTMLInputElement>) => {
    const nextCode = event.currentTarget.value.replace(NON_DIGIT_PATTERN, "").slice(0, 6);
    setCode(nextCode);
  };

  const markSubmitting = () => {
    setSubmitting(true);
  };

  return <form
    action="/api/auth/verify-email"
    aria-busy={submitting}
    className="auth-form auth-code-form"
    method="post"
    onSubmit={markSubmitting}
    ref={formRef}
  >
    <input name="email" type="hidden" value={email} />
    <label htmlFor="verification-code">Mã xác minh 6 số<input
      aria-describedby="verification-code-help"
      aria-invalid={invalid || undefined}
      autoCapitalize="none"
      autoComplete="one-time-code"
      enterKeyHint="done"
      id="verification-code"
      inputMode="numeric"
      maxLength={6}
      minLength={6}
      name="code"
      onChange={updateCode}
      pattern="[0-9]{6}"
      placeholder="000000"
      readOnly={submitting}
      required
      type="text"
      value={code}
    /></label>
    <p className="auth-code-help" id="verification-code-help">Bạn có thể nhập ngay. Mã sẽ hết hạn sau 10 phút và chỉ dùng được một lần.</p>
    {submitting ? <p aria-live="polite" className="auth-code-auto-status is-submitting">Đang xác minh và chuyển hướng...</p> : null}
    <button className="sr-only" type="submit">Xác minh mã</button>
  </form>;
}
