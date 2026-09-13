import type { ReactNode } from "react";
import stylesheetHref from "../account-wallet.css?url";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <><link href={stylesheetHref} precedence="himi-account" rel="stylesheet" />{children}</>;
}
