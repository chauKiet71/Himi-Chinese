import type { Metadata } from "next";
import Link from "next/link";
import { Crown, Download, Search, Trash2, UserRoundCheck, UsersRound } from "lucide-react";
import { deleteAdminUserAction, grantOrExtendVipAction } from "@/app/admin/actions";
import { formatAdminCurrency, formatAdminDateTime } from "@/components/admin-business-widgets";
import { AdminConsoleHeader, AdminNotice } from "@/components/admin-console";
import { AdminUserPagination } from "@/components/admin-user-pagination";
import { AdminDateControls, AdminDateComparison } from "@/components/admin-date-controls";
import { adminDateQuery, resolveAdminDateSelection, type AdminDateParams } from "@/lib/admin-date-range";
import { requireAdminUser } from "@/lib/admin-auth";
import { getAdminUserConsole } from "@/lib/admin-user-service";

export const metadata: Metadata = { title: "Quản lý người dùng" };

const roleLabels = {
  admin: "Quản trị viên",
  editor: "Biên tập viên",
  learner: "Học viên",
  reviewer: "Kiểm duyệt viên",
} as const;

function HiddenFormValue({ name, value }: { name: string; value: string }) {
  // Vinext can drop the value attribute from input[type="hidden"] after
  // hydration. A visually hidden read-only text control remains successful
  // form data, so server actions receive the intended identifier.
  return <input aria-hidden="true" name={name} readOnly style={{ display: "none" }} tabIndex={-1} type="text" value={value} />;
}

export default async function AdminUsersPage({ searchParams }: {
  searchParams: Promise<AdminDateParams & { error?: string; q?: string; success?: string; page?: string; pageSize?: string }>;
}) {
  const [admin, params] = await Promise.all([requireAdminUser(), searchParams]);
  const selection = resolveAdminDateSelection(params, "all");
  const dateQuery = adminDateQuery(selection);
  const data = await getAdminUserConsole({ range: selection.range, search: params.q, page: Number(params.page ?? 1), pageSize: Number(params.pageSize ?? 50) });
  const exportSearch = new URLSearchParams(dateQuery);
  if (data.search) exportSearch.set("q", data.search);

  return <main className="admin-page"><div className="section-shell">
    <AdminConsoleHeader
      description="Tra cứu tài khoản, kiểm tra trạng thái Free/VIP, nâng cấp quyền học và quản lý tài khoản học viên."
      eyebrow="Khách hàng"
      title="Quản lý người dùng"
      userName={admin.displayName}
    />
    <AdminNotice error={params.error} success={params.success} />
    <AdminDateControls selection={selection} description="Thời gian đăng ký tài khoản" />
    <AdminDateComparison selection={selection} />

    <section className="admin-user-toolbar admin-panel">
      <form action="/admin/users" method="get" className="admin-user-search-form">
        <HiddenFormValue name="pageSize" value={String(data.pageSize)} />
        {Object.entries(dateQuery).map(([name, value]) => <HiddenFormValue key={name} name={name} value={value} />)}
        <label><span>Tìm kiếm</span><input defaultValue={data.search} name="q" placeholder="Tên người dùng hoặc email…" type="search" /></label>
        <button className="button button-secondary" type="submit"><Search size={15} /> Lọc dữ liệu</button>
      </form>
      <Link className="button button-primary" href={`/api/admin/users/export?${exportSearch.toString()}`} prefetch={false}><Download size={15} /> Xuất Excel</Link>
    </section>

    <section className="admin-panel admin-user-panel">
      <div className="panel-heading"><div><span>Danh sách người dùng</span><h2>{data.totalUsers} tài khoản trong kết quả</h2></div><span>Dữ liệu sắp xếp mới nhất trước</span></div>
      <div className="table-scroll"><table className="data-table admin-user-table">
        <thead><tr><th>Người dùng</th><th>Trạng thái</th><th>Thời gian đăng ký</th><th>Nâng cấp gói</th><th>Thao tác</th></tr></thead>
        <tbody>{data.users.length ? data.users.map((member) => {
          const vip = member.subscription;
          const eligible = member.role === "learner" && member.isActive && Boolean(member.emailVerifiedAt) && data.plans.length > 0;
          return <tr key={member.id}>
            <td><div className="admin-user-identity"><span>{(member.displayName || member.email).slice(0, 1).toUpperCase()}</span><div><strong>{member.displayName || "Chưa đặt tên"}</strong><small>{member.email}</small><small>{roleLabels[member.role]} · {member.emailVerifiedAt ? "Đã xác minh" : "Chưa xác minh"}</small></div></div></td>
            <td><span className={`admin-account-status ${vip ? "is-vip" : "is-free"}`}>{vip ? <Crown size={12} /> : <UserRoundCheck size={12} />}{vip ? "VIP" : "Free"}</span>{!member.isActive ? <small className="admin-account-locked">Đã khóa</small> : null}</td>
            <td><time dateTime={member.createdAt.toISOString()}>{formatAdminDateTime(member.createdAt)}</time></td>
            <td>{member.role === "learner" ? <form action={grantOrExtendVipAction} className="admin-inline-upgrade">
              <HiddenFormValue name="returnTo" value="/admin/users" /><HiddenFormValue name="userId" value={member.id} />
              <select aria-label={`Gói VIP cho ${member.email}`} defaultValue={vip?.planId ?? data.plans[0]?.id} disabled={!eligible} name="planId" required>
                {data.plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name} · {formatAdminCurrency(plan.priceVnd)}</option>)}
              </select>
              <button className="button button-primary" disabled={!eligible} type="submit">{vip ? "Gia hạn" : "Nâng cấp"}</button>
            </form> : <span className="admin-muted-cell">Quản lý tại Đội nội dung</span>}</td>
            <td>{member.role === "learner" ? <form action={deleteAdminUserAction} className="admin-inline-delete">
              <HiddenFormValue name="userId" value={member.id} />
              <label title="Xóa vĩnh viễn tài khoản và dữ liệu liên quan"><input name="confirmDelete" required type="checkbox" value="DELETE" /><span className="sr-only">Xác nhận xóa vĩnh viễn {member.email}</span></label>
              <button className="button button-danger" type="submit"><Trash2 size={13} /> Xóa</button>
            </form> : <span className="admin-muted-cell">Không khả dụng</span>}</td>
          </tr>;
        }) : <tr><td className="admin-table-empty" colSpan={5}>Không tìm thấy tài khoản phù hợp.</td></tr>}</tbody>
      </table></div>
      <AdminUserPagination page={data.page} pageSize={data.pageSize} totalPages={data.totalPages} totalUsers={data.totalUsers} period={data.period} search={data.search} dateQuery={dateQuery} />
      <p className="admin-table-note"><UsersRound size={13} /> “Xóa” sẽ xóa vĩnh viễn tài khoản cùng dữ liệu học tập, VIP, giao dịch và hỗ trợ liên quan. Thao tác không thể hoàn tác; nhật ký quản trị vẫn được lưu.</p>
    </section>
  </div></main>;
}
