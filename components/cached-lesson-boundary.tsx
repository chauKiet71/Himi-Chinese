"use client";

import Link from "next/link";
import { Suspense, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useLessonContentCache } from "@/components/learning-data-provider";
import { LessonLoadError } from "@/lib/lesson-content-cache";
import type { LessonResource } from "@/lib/lesson-resource";

const loadingShellStyle = { display: "grid", gridTemplateRows: "1fr", alignItems: "center", padding: "24px" };

export function LessonLoadingIndicator({ shellClassName }: { shellClassName?: string }) {
  const indicator = <span className="lesson-loading-indicator" role="status">
    <span className="lesson-loading-spinner" aria-hidden="true">
      {Array.from({ length: 12 }, (_, index) => <i key={index} style={{ "--spoke": index } as CSSProperties} />)}
    </span>
    <span>Đang tải bài học...</span>
  </span>;

  return shellClassName
    ? <main className={`${shellClassName} lesson-loading-only`} aria-busy="true">{indicator}</main>
    : indicator;
}

// Remount for a different lesson/version; never flash the previous lesson while
// the next request is pending, nor replace content in the middle of a session.
export function CachedLessonBoundary<T>(props: {
  resource: LessonResource; title: string; backHref: string; shellClassName?: string; children: (data: T) => ReactNode;
}) {
  return <CachedLessonContent<T> {...props} key={`${props.resource.scope}|${props.resource.url}|${props.resource.version}`} />;
}

function CachedLessonContent<T>({ resource, title, backHref, shellClassName = "lesson-page", children }: {
  resource: LessonResource; title: string; backHref: string; shellClassName?: string; children: (data: T) => ReactNode;
}) {
  const cache = useLessonContentCache();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<LessonLoadError | null>(null);
  const [attempt, setAttempt] = useState(0);
  const { url, version, scope } = resource;

  useEffect(() => {
    const controller = new AbortController();
    cache.get<T>({ url, version, scope }, controller.signal).then((lesson) => {
      if (!controller.signal.aborted) setData(lesson);
    }).catch((cause: unknown) => {
      if (!controller.signal.aborted) setError(cause instanceof LessonLoadError ? cause : new LessonLoadError("Chưa mở được bài học. Bạn hãy thử lại."));
    });
    return () => controller.abort();
  }, [cache, url, version, scope, attempt]);

  if (error) return <main className={shellClassName} style={loadingShellStyle}>
    <section className="section-shell lesson-content-card">
      <h1>{title}</h1>
      <p role="alert">{error.message}</p>
      <button className="button button-primary" type="button" onClick={() => {
        if ([401, 403, 404, 409].includes(error.status)) { window.location.reload(); return; }
        setError(null);
        setAttempt((value) => value + 1);
      }}>{error.status ? "Tải lại bài học" : "Thử lại"}</button>{" "}
      <Link className="button button-secondary" href={backHref} prefetch={false}>Về lộ trình</Link>
    </section>
  </main>;

  const loading = <LessonLoadingIndicator shellClassName={shellClassName} />;
  return data ? <Suspense fallback={loading}>{children(data)}</Suspense> : loading;
}
