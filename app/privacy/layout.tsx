import type { ReactNode } from "react";
import stylesheetHref from "../legal.css?url";

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return <><link href={stylesheetHref} precedence="himi-legal" rel="stylesheet" />{children}</>;
}
