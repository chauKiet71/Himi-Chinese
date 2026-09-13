import type { ReactNode } from "react";
import stylesheetHref from "../legal.css?url";

export default function TermsLayout({ children }: { children: ReactNode }) {
  return <><link href={stylesheetHref} precedence="himi-legal" rel="stylesheet" />{children}</>;
}
