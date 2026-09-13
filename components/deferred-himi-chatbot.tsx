"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import chatbotStylesheetHref from "@/app/chatbot-widget.css?url";

const HimiChatbot = lazy(() => import("@/components/himi-chatbot").then((module) => ({
  default: module.HimiChatbot,
})));

export function DeferredHimiChatbot() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const browserWindow = window as typeof window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    if (browserWindow.requestIdleCallback) {
      const handle = browserWindow.requestIdleCallback(() => setReady(true), { timeout: 2_500 });
      return () => browserWindow.cancelIdleCallback?.(handle);
    }
    const handle = window.setTimeout(() => setReady(true), 1_200);
    return () => window.clearTimeout(handle);
  }, []);

  if (!ready) return null;
  return <>
    <link href={chatbotStylesheetHref} precedence="himi-chatbot" rel="stylesheet" />
    <Suspense fallback={null}><HimiChatbot /></Suspense>
  </>;
}
