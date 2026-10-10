"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { adminDatePresets, resolveAdminDateSelection, type AdminDatePreset } from "@/lib/admin-date-range";

type Props = { preset: AdminDatePreset; from: string; to: string; label: string; compareFrom?: string; compareTo?: string; today: string };
export function AdminDateFilter(props: Props) {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState(props.preset);
  const [from, setFrom] = useState(props.from);
  const [to, setTo] = useState(props.to);
  const [compare, setCompare] = useState(Boolean(props.compareFrom && props.compareTo));
  const [compareFrom, setCompareFrom] = useState(props.compareFrom ?? "");
  const [compareTo, setCompareTo] = useState(props.compareTo ?? "");
  const [month, setMonth] = useState(props.to.slice(0, 7));
  const [pickingEnd, setPickingEnd] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); root.current?.querySelector<HTMLButtonElement>(".admin-date-trigger")?.focus(); } };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", escape); };
  }, [open]);
  const choosePreset = (key: AdminDatePreset) => {
    setPreset(key); setPickingEnd(false);
    if (key === "custom") return;
    const selection = resolveAdminDateSelection({ datePreset: key }, "last_30", new Date(`${props.today}T12:00:00+07:00`));
    setFrom(selection.from); setTo(selection.to); setMonth(selection.to.slice(0, 7));
  };
  const moveMonth = (delta: number) => {
    const date = new Date(`${month}-01T00:00:00Z`);
    date.setUTCMonth(date.getUTCMonth() + delta);
    setMonth(date.toISOString().slice(0, 7));
  };
  const chooseDay = (key: string) => {
    setPreset("custom");
    if (!pickingEnd) { setFrom(key); setTo(key); setPickingEnd(true); }
    else { setFrom(key < from ? key : from); setTo(key < from ? from : key); setPickingEnd(false); }
  };
  const toggleCompare = (checked: boolean) => {
    setCompare(checked);
    if (checked && (!compareFrom || !compareTo)) {
      const start = Date.parse(`${from}T00:00:00Z`), end = Date.parse(`${to}T00:00:00Z`);
      if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) return;
      const length = end - start + 86_400_000;
      setCompareFrom(new Date(Math.max(Date.parse("1970-01-01"), start - length)).toISOString().slice(0, 10));
      setCompareTo(new Date(Math.max(Date.parse("1970-01-01"), start - 86_400_000)).toISOString().slice(0, 10));
    }
  };
  const valid = from && to && from <= to && (!compare || (compareFrom && compareTo && compareFrom <= compareTo));
  const calendar = (delta: number) => {
    const first = new Date(`${month}-01T00:00:00Z`); first.setUTCMonth(first.getUTCMonth() + delta);
    const year = first.getUTCFullYear(), monthIndex = first.getUTCMonth();
    const leading = first.getUTCDay();
    const days = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
    return <div className="admin-date-calendar" key={delta}>
      <div className="admin-date-month-title">
        <select aria-label={`Tháng lịch ${delta + 1}`} value={monthIndex} onChange={(event) => setMonth(new Date(Date.UTC(year, Number(event.target.value) - delta, 1)).toISOString().slice(0, 7))}>{Array.from({ length: 12 }, (_, index) => <option key={index} value={index}>Tháng {index + 1}</option>)}</select>
        <select aria-label={`Năm lịch ${delta + 1}`} value={year} onChange={(event) => setMonth(new Date(Date.UTC(Number(event.target.value), monthIndex - delta, 1)).toISOString().slice(0, 7))}>{Array.from({ length: 131 }, (_, index) => 1970 + index).map(value => <option key={value} value={value}>{value}</option>)}</select>
      </div>
      <div className="admin-date-days">{["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map(name => <span className="admin-date-weekday" key={name}>{name}</span>)}
        {Array.from({ length: 42 }, (_, index) => {
          const number = index - leading + 1;
          if (number < 1 || number > days) return <span key={index} />;
          const key = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(number).padStart(2, "0")}`;
          return <button type="button" key={index} aria-label={`Chọn ngày ${number}/${monthIndex + 1}/${year}`} aria-pressed={key >= from && key <= to} className={`${key >= from && key <= to ? "in-range" : ""}${key === from || key === to ? " is-edge" : ""}`} onClick={() => chooseDay(key)}>{number}</button>;
        })}
      </div>
    </div>;
  };
  return <div className="admin-date-filter" ref={root}>
    <button type="button" className="admin-date-trigger" aria-expanded={open} aria-haspopup="dialog" onClick={() => { if (!open) { setPreset(props.preset); setFrom(props.from); setTo(props.to); setMonth(props.to.slice(0, 7)); setCompare(Boolean(props.compareFrom && props.compareTo)); setCompareFrom(props.compareFrom ?? ""); setCompareTo(props.compareTo ?? ""); setPickingEnd(false); } setOpen(!open); }}><CalendarDays size={16} /><span>{props.label}</span><ChevronDown size={15} /></button>
    {open ? <div role="dialog" aria-label="Chọn khoảng thời gian" className="admin-date-popover">
      <div className="admin-date-presets">{adminDatePresets.map(([key, label]) => <button type="button" key={key} aria-pressed={preset === key} onClick={() => choosePreset(key)}><i />{label}</button>)}</div>
      <div className="admin-date-main">
        <div className="admin-date-calendar-nav"><button type="button" aria-label="Tháng trước" onClick={() => moveMonth(-1)} disabled={month <= "1970-01"}><ChevronLeft size={18} /></button><span>{pickingEnd ? "Chọn ngày kết thúc" : "Chọn ngày bắt đầu"}</span><button type="button" aria-label="Tháng sau" onClick={() => moveMonth(1)} disabled={month >= "2100-11"}><ChevronRight size={18} /></button></div>
        <div className="admin-date-calendars">{calendar(0)}{calendar(1)}</div>
        <div className="admin-date-inputs"><label>Từ ngày<input type="date" min="1970-01-01" max="2100-12-31" value={from} onChange={(event) => { setFrom(event.target.value); setPreset("custom"); }} /></label><label>Đến ngày<input type="date" min={from || "1970-01-01"} max="2100-12-31" value={to} onChange={(event) => { setTo(event.target.value); setPreset("custom"); }} /></label></div>
        <label className="admin-date-compare"><input type="checkbox" checked={compare} onChange={(event) => toggleCompare(event.target.checked)} />So sánh với khoảng thời gian khác</label>
        {compare ? <div className="admin-date-inputs"><label>So sánh từ<input type="date" min="1970-01-01" max="2100-12-31" value={compareFrom} onChange={(event) => setCompareFrom(event.target.value)} /></label><label>So sánh đến<input type="date" min={compareFrom || "1970-01-01"} max="2100-12-31" value={compareTo} onChange={(event) => setCompareTo(event.target.value)} /></label></div> : null}
        {!valid ? <p className="admin-date-error" role="alert">Chọn khoảng ngày hợp lệ: ngày kết thúc phải từ ngày bắt đầu trở đi.</p> : null}
        <div className="admin-date-footer"><small>Ngày hiển thị theo giờ TP Hồ Chí Minh</small><button type="button" onClick={() => setOpen(false)}>Hủy</button><button type="button" className="is-primary" disabled={!valid} onClick={() => {
          const url = new URL(window.location.href);
          for (const key of ["page", "period", "success", "error", "compareFrom", "compareTo"]) url.searchParams.delete(key);
          url.searchParams.set("datePreset", preset); url.searchParams.set("from", from); url.searchParams.set("to", to);
          if (compare) { url.searchParams.set("compareFrom", compareFrom); url.searchParams.set("compareTo", compareTo); }
          window.location.assign(url.pathname + url.search);
        }}>Cập nhật</button></div>
      </div>
    </div> : null}
  </div>;
}
