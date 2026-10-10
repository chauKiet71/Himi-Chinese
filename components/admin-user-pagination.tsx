"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function AdminUserPagination({ page, pageSize, totalPages, totalUsers, period, search, dateQuery = {} }: {
  page: number; pageSize: number; totalPages: number; totalUsers: number; period: string; search: string; dateQuery?: Record<string, string>;
}) {
  const href = (target: number) => {
    const query = new URLSearchParams({ period, pageSize: String(pageSize), page: String(target) });
    for (const [key, value] of Object.entries(dateQuery)) query.set(key, value);
    if (search) query.set("q", search);
    return `/admin/users?${query}`;
  };
  const pages = Array.from(new Set([1, totalPages, page - 1, page, page + 1]
    .filter((value) => value >= 1 && value <= totalPages))).sort((a, b) => a - b);
  return <div className="admin-user-pagination">
    <form action="/admin/users" method="get" className="admin-user-page-size">
      <input aria-hidden="true" readOnly tabIndex={-1} style={{ display: "none" }} type="text" name="period" value={period} />
      {Object.entries(dateQuery).map(([name, value]) => <input key={name} aria-hidden="true" readOnly tabIndex={-1} style={{ display: "none" }} type="text" name={name} value={value} />)}
      {search ? <input aria-hidden="true" readOnly tabIndex={-1} style={{ display: "none" }} type="text" name="q" value={search} /> : null}
      <label>Hiển thị <select aria-label="Số tài khoản mỗi trang" name="pageSize" value={pageSize} onChange={(event) => event.currentTarget.form?.requestSubmit()}>
        {[50, 100, 200, 300, 500].map((size) => <option key={size} value={size}>{size}</option>)}
      </select> tài khoản / trang</label>
    </form>
    <span className="admin-user-page-range">{totalUsers ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, totalUsers)} / {totalUsers} tài khoản</span>
    <nav aria-label="Phân trang người dùng" className="admin-user-page-nav">
      {page > 1 ? <Link className="admin-user-page-arrow" aria-label="Trang trước" href={href(page - 1)}><ArrowLeft size={18} /></Link> : <span className="admin-user-page-arrow is-disabled" aria-disabled="true"><ArrowLeft size={18} /></span>}
      <div className="admin-user-page-numbers">{pages.map((value, index) => <span key={value}>
        {index > 0 && value > pages[index - 1] + 1 ? <span className="admin-user-page-ellipsis">…</span> : null}
        <Link aria-label={`Trang ${value}`} aria-current={value === page ? "page" : undefined} href={href(value)}>{value}</Link>
      </span>)}</div>
      {page < totalPages ? <Link className="admin-user-page-arrow" aria-label="Trang sau" href={href(page + 1)}><ArrowRight size={18} /></Link> : <span className="admin-user-page-arrow is-disabled" aria-disabled="true"><ArrowRight size={18} /></span>}
    </nav>
  </div>;
}
