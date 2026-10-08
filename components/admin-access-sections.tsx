import Link from "next/link";

export function AdminAccessSections({ selected }: { selected: "hsk" | "typing" }) {
  return <nav aria-label="Nhóm nội dung khóa VIP" className="admin-access-sections">
    <Link href="/admin/access" prefetch={false}>Tất cả nhóm</Link>
    <Link aria-current={selected === "hsk" ? "page" : undefined} href="/admin/access/hsk" prefetch={false}>Lộ trình HSK</Link>
    <Link aria-current={selected === "typing" ? "page" : undefined} href="/admin/access/typing" prefetch={false}>Luyện gõ</Link>
  </nav>;
}
