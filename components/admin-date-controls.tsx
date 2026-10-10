import { AdminDateFilter } from "@/components/admin-date-filter";
import { formatAdminCurrency } from "@/components/admin-business-widgets";
import { adminDateKey, type AdminDateSelection } from "@/lib/admin-date-range";
import { getAdminBusinessAnalytics } from "@/lib/admin-analytics-service";

export function AdminDateControls({ selection, description = "Khoảng thời gian" }: { selection: AdminDateSelection; description?: string }) {
  return <div className="admin-report-filter-row"><div><strong>{description}</strong><span>{selection.label}</span></div><AdminDateFilter preset={selection.preset} from={selection.from} to={selection.to} label={selection.label} compareFrom={selection.compareFrom} compareTo={selection.compareTo} today={adminDateKey(new Date())} /></div>;
}

export async function AdminDateComparison({ selection }: { selection: AdminDateSelection }) {
  if (!selection.comparison) return null;
  const [current, previous] = await Promise.all([getAdminBusinessAnalytics(selection.range), getAdminBusinessAnalytics(selection.comparison)]);
  const metrics = [
    { label: "Người dùng mới", current: current.stats.newUsers, previous: previous.stats.newUsers, money: false },
    { label: "Doanh thu", current: current.stats.revenue, previous: previous.stats.revenue, money: true },
    { label: "Lượt đăng ký VIP", current: current.stats.vipRegistrations, previous: previous.stats.vipRegistrations, money: false },
  ];
  return <section className="admin-date-comparison admin-panel" aria-label="So sánh khoảng thời gian"><div><strong>So sánh toàn hệ thống</strong><span>{selection.range.label} so với {selection.comparison.label}</span></div><div className="admin-date-comparison-metrics">{metrics.map(metric => <article key={metric.label}><span>{metric.label}</span><strong>{metric.money ? formatAdminCurrency(metric.current) : metric.current.toLocaleString("vi-VN")}</strong><small>Khoảng so sánh: {metric.money ? formatAdminCurrency(metric.previous) : metric.previous.toLocaleString("vi-VN")}</small><b>{metric.previous === 0 ? metric.current === 0 ? "Không đổi" : "Tăng từ 0" : `${metric.current >= metric.previous ? "+" : ""}${((metric.current - metric.previous) / metric.previous * 100).toFixed(1)}%`}</b></article>)}</div></section>;
}
