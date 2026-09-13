import type { ReactNode } from "react";
import stylesheetHref from "../hsk-curriculum.css?url";

export default function CoursesLayout({ children }: { children: ReactNode }) {
  return <><link href={stylesheetHref} precedence="himi-courses" rel="stylesheet" />{children}</>;
}
