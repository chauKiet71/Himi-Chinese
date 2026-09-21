"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";

type LogoutResult = {
  ok?: boolean;
  redirectTo?: string;
};

export function LogoutForm({
  children,
  className,
  returnTo = "/",
}: {
  children: ReactNode;
  className?: string;
  returnTo?: string;
}) {
  const submittingRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;

    const form = event.currentTarget;
    submittingRef.current = true;
    setSubmitting(true);

    try {
      const formData = new FormData(form);
      formData.set("responseMode", "json");
      const response = await fetch(form.action, {
        body: formData,
        cache: "no-store",
        credentials: "same-origin",
        method: "POST",
      });
      const result = await response.json() as LogoutResult;
      if (!response.ok || !result.ok || !result.redirectTo) throw new Error("Logout failed");

      // A document navigation discards prefetched RSC state and rebuilds the
      // account shell from the now-cleared session cookie.
      window.location.replace(result.redirectTo);
    } catch {
      // Keep logout usable without client JavaScript/fetch by falling back to
      // the route's normal POST + 303 redirect behavior.
      HTMLFormElement.prototype.submit.call(form);
    }
  };

  return <form
    action="/api/auth/logout"
    aria-busy={submitting}
    className={className}
    method="post"
    onSubmit={handleSubmit}
  >
    <input name="returnTo" type="hidden" value={returnTo} />
    {children}
  </form>;
}
