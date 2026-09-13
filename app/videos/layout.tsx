import type { ReactNode } from "react";
import stylesheetHref from "../video-learning.css?url";

export default function VideosLayout({ children }: { children: ReactNode }) {
  return <><link href={stylesheetHref} precedence="himi-videos" rel="stylesheet" />{children}</>;
}
