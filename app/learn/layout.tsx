import type { ReactNode } from "react";
import stylesheetHref from "../lesson-interactive.css?url";

export default function LearnLayout({ children }: { children: ReactNode }) {
  return <><link href={stylesheetHref} precedence="himi-lesson-interactive" rel="stylesheet" />{children}</>;
}
