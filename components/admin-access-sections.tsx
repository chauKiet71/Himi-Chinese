import Link from "next/link";

export function AdminAccessSections({ selected }: { selected: "hsk" | "typing" }) {
  return <nav aria-label="Nhóm nội dung khóa VIP" className="admin-access-breadcrumbs">
    <Link aria-current={selected === "hsk" ? "page" : undefined} href="/admin/access" prefetch={false}>Lộ trình HSK</Link>
    <span>/</span>
    <Link aria-current={selected === "typing" ? "page" : undefined} href="/admin/access/typing" prefetch={false}>Luyện gõ</Link>
  </nav>;
}
