import type { ReactNode } from "react";
import stylesheetHref from "./vip-policy.css?url";

export default function VipLayout({ children }: { children: ReactNode }) {
  return <><link href={stylesheetHref} precedence="himi-vip" rel="stylesheet" />{children}</>;
}
