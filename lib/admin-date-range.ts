import type { AdminPeriodRange } from "./admin-reporting.ts";

export const adminDatePresets = [
  ["today", "Hôm nay"], ["yesterday", "Hôm qua"], ["two_days", "Hôm nay và hôm qua"],
  ["last_7", "7 ngày qua"], ["last_14", "14 ngày qua"], ["last_28", "28 ngày qua"], ["last_30", "30 ngày qua"],
  ["this_week", "Tuần này"], ["last_week", "Tuần trước"], ["this_month", "Tháng này"], ["last_month", "Tháng trước"],
  ["all", "Tối đa"], ["custom", "Tùy chỉnh"],
] as const;
export type AdminDatePreset = typeof adminDatePresets[number][0];
export type AdminDateParams = { datePreset?: string; from?: string; to?: string; compareFrom?: string; compareTo?: string; period?: string };
export type AdminDateSelection = { preset: AdminDatePreset; from: string; to: string; label: string; range: AdminPeriodRange; comparison: AdminPeriodRange | null; compareFrom: string; compareTo: string };
const day = 86_400_000;
const offset = 7 * 3_600_000;

export function adminDateKey(now: Date): string { return new Date(now.getTime() + offset).toISOString().slice(0, 10); }
function validDate(value?: string): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/u.test(value) && Number.isFinite(Date.parse(value)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value && value >= "1970-01-01" && value <= "2100-12-31");
}
export function adminDateRange(from: string, to: string, label?: string): AdminPeriodRange {
  const start = new Date(`${from}T00:00:00+07:00`);
  const end = new Date(new Date(`${to}T00:00:00+07:00`).getTime() + day - 1);
  const days = Math.round((end.getTime() + 1 - start.getTime()) / day);
  const bucketMilliseconds = days === 1 ? 4 * 3_600_000 : Math.ceil(days / 60) * day;
  return { start, end, period: days === 1 ? "day" : days <= 7 ? "week" : "month", label: label ?? `${formatAdminDate(from)} – ${formatAdminDate(to)}`, bucketCount: Math.ceil(days * day / bucketMilliseconds), bucketMilliseconds };
}
export function formatAdminDate(value: string): string { return value.split("-").reverse().join("/"); }
export function adminDateQuery(selection: AdminDateSelection): Record<string, string> {
  return { datePreset: selection.preset, from: selection.from, to: selection.to, ...(selection.comparison ? { compareFrom: selection.compareFrom, compareTo: selection.compareTo } : {}) };
}
export function resolveAdminDateSelection(params: AdminDateParams, fallback: AdminDatePreset = "last_30", now = new Date()): AdminDateSelection {
  const legacy = params.period === "day" ? "today" : params.period === "week" ? "last_7" : params.period === "month" ? "last_30" : params.period === "all" ? "all" : fallback;
  let preset: AdminDatePreset = adminDatePresets.some(([key]) => key === params.datePreset) ? params.datePreset as AdminDatePreset : legacy;
  const today = adminDateKey(now);
  const date = new Date(`${today}T00:00:00Z`);
  let from = today, to = today;
  const shift = (days: number) => new Date(date.getTime() + days * day).toISOString().slice(0, 10);
  if (preset === "custom" && validDate(params.from) && validDate(params.to) && params.from <= params.to) { from = params.from; to = params.to; }
  else {
    if (preset === "custom") preset = fallback;
    if (preset === "yesterday") from = to = shift(-1);
    if (preset === "two_days") from = shift(-1);
    if (preset.startsWith("last_") && /^last_\d+$/u.test(preset)) from = shift(1 - Number(preset.slice(5)));
    if (preset === "this_week" || preset === "last_week") { const sinceMonday = (date.getUTCDay() + 6) % 7; from = shift(-sinceMonday - (preset === "last_week" ? 7 : 0)); if (preset === "last_week") to = shift(-sinceMonday - 1); }
    if (preset === "this_month") from = `${today.slice(0, 7)}-01`;
    if (preset === "last_month") { from = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - 1, 1)).toISOString().slice(0, 10); to = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 0)).toISOString().slice(0, 10); }
    if (preset === "all") from = "1970-01-01";
  }
  const label = adminDatePresets.find(([key]) => key === preset)![1];
  const range = adminDateRange(from, to, preset === "all" ? label : `${label}: ${from === to ? formatAdminDate(from) : `${formatAdminDate(from)} – ${formatAdminDate(to)}`}`);
  const compareFrom = validDate(params.compareFrom) ? params.compareFrom : "";
  const compareTo = validDate(params.compareTo) ? params.compareTo : "";
  const comparison = compareFrom && compareTo && compareFrom <= compareTo ? adminDateRange(compareFrom, compareTo) : null;
  return { preset, from, to, label: range.label, range, comparison, compareFrom, compareTo };
}
