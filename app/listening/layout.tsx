import type { ReactNode } from "react";
import stylesheetHref from "../listening-studio.css?url";

export default function ListeningLayout({ children }: { children: ReactNode }) {
  return <>
    <link href={stylesheetHref} precedence="himi-route" rel="stylesheet" />
    {children}
  </>;
}
