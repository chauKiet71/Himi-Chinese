import Link from "next/link";
import { VipContentGate } from "@/components/vip-upgrade-prompt";


export function TypingAccessGate({ title, backHref, closeHref = backHref, returnTo, loginRequired = false }: {
  title: string;
  backHref: string;
  closeHref?: string;
  returnTo: string;
  loginRequired?: boolean;
}) {
  if (!loginRequired) return <VipContentGate closeHref={closeHref} title={title} />;

  return <section className="typing-load-state">
    <h1>Đăng nhập để luyện gõ</h1>
    <p>{title}</p>
    <Link className="button button-primary" href={`/login?error=required&returnTo=${encodeURIComponent(returnTo)}`}>Đăng nhập</Link>
    <Link className="button button-secondary" href={backHref}>Quay lại Luyện gõ</Link>
  </section>;
}
