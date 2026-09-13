import type { ReactNode } from "react";
import stylesheetHref from "../typing-practice.css?url";

export default function TypingLayout({ children }: { children: ReactNode }) {
  return <><link href={stylesheetHref} precedence="himi-typing" rel="stylesheet" />{children}</>;
}
