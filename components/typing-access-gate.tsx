import Link from "next/link";
import { VipContentGate } from "@/components/vip-upgrade-prompt";


export function TypingAccessGate({ title, backHref, returnTo, loginRequired = false }: {
  title: string;
  backHref: string;
  returnTo: string;
  loginRequired?: boolean;
}) {
  return <section className="typing-load-state">
    {loginRequired ? <>
      <h1>Đăng nhập để luyện gõ</h1>
      <p>{title}</p>
      <Link className="button button-primary" href={`/login?error=required&returnTo=${encodeURIComponent(returnTo)}`}>Đăng nhập</Link>
    </> : <VipContentGate title={title} description="Nâng cấp VIP để mở khóa nội dung Luyện gõ này." />}
    <Link className="button button-secondary" href={backHref}>Quay lại Luyện gõ</Link>
  </section>;
}
