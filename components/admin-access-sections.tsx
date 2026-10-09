import Link from "next/link";

export function AdminAccessSections({ selected }: { selected: "hsk" | "typing" | "writing" | "listening" }) {
  return <nav aria-label="Nhóm nội dung khóa VIP" className="admin-access-sections">
    <Link href="/admin/access" prefetch={false}>Tất cả nhóm</Link>
    <Link aria-current={selected === "hsk" ? "page" : undefined} href="/admin/access/hsk" prefetch={false}>Lộ trình HSK</Link>
    <Link aria-current={selected === "typing" ? "page" : undefined} href="/admin/access/typing" prefetch={false}>Luyện gõ</Link>
    <Link aria-current={selected === "writing" ? "page" : undefined} href="/admin/access/writing" prefetch={false}>Luyện viết</Link>
    <Link aria-current={selected === "listening" ? "page" : undefined} href="/admin/access/listening" prefetch={false}>Luyện nghe</Link>
  </nav>;
}
