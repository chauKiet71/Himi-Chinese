import Link from "next/link";
import { AdminConsoleHeader, AdminNotice, ContentAccessPolicyForm } from "./admin-console";
import { AdminAccessSections } from "./admin-access-sections";
import { getContentAccessPolicies } from "../lib/content-access-repository";
import { contentAccessPolicyKey, type ContentAccessTarget } from "../lib/content-access-types";
import { updateContentAccessPolicyAction } from "../app/admin/actions";

export type PracticeAccessNode = { label: string; description?: string; target: ContentAccessTarget; href?: string };

export async function AdminPracticeAccess({ kind, userName, nodes, returnTo, error, success }: {
  kind: "writing" | "listening"; userName: string | null; nodes: PracticeAccessNode[];
  returnTo: string; error?: string; success?: string;
}) {
  const title = kind === "writing" ? "Luyện viết" : "Luyện nghe";
  const policies = new Map((await getContentAccessPolicies(nodes.map((node) => node.target), undefined, { failClosed: true }))
    .map((policy) => [contentAccessPolicyKey(policy.targetType, policy.targetKey), policy.tier]));
  return <main className="admin-page"><div className="section-shell">
    <AdminConsoleHeader title={`Khóa VIP ${title}`} eyebrow="Content access" userName={userName ?? "Admin"}
      description="Quyền được lưu riêng cho phần này. Khóa VIP ở cấp cha áp dụng cho mọi nội dung bên dưới." />
    <AdminAccessSections selected={kind} />
    <AdminNotice error={error} success={success} />
    <Link href={`/admin/access/${kind}`} prefetch={false}>Về danh sách {title}</Link>
    <section className="admin-panel"><div className="admin-access-list">
      {nodes.map(({ target, label, description, href }) => <article className="admin-access-node" key={contentAccessPolicyKey(target.type, target.key)}>
        <header><strong>{label}</strong>{description ? <span>{description}</span> : null}</header>
        <ContentAccessPolicyForm action={updateContentAccessPolicyAction} currentTier={policies.get(contentAccessPolicyKey(target.type, target.key))}
          returnTo={returnTo} targetType={target.type} targetKey={target.key} />
        {href ? <Link className="admin-access-open" href={href} prefetch={false}>Quản lý nội dung bên trong →</Link> : null}
      </article>)}
    </div></section>
  </div></main>;
}
