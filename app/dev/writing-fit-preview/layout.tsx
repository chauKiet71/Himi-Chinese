import type { ReactNode } from "react";
import stylesheetHref from "../../writing-studio.css?url";

export default function WritingFitPreviewLayout({ children }: { children: ReactNode }) {
  return <><link href={stylesheetHref} precedence="himi-writing-preview" rel="stylesheet" />{children}</>;
}
