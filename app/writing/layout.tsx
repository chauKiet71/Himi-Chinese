import type { ReactNode } from "react";
import stylesheetHref from "../writing-studio.css?url";

export default function WritingLayout({ children }: { children: ReactNode }) {
  return <><link href={stylesheetHref} precedence="himi-writing" rel="stylesheet" />{children}</>;
}
