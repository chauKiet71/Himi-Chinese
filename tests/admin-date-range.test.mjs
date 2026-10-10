import assert from "node:assert/strict";
import test from "node:test";
import { resolveAdminDateSelection, adminDateKey } from "../lib/admin-date-range.ts";
import { buildAdminTimeSeries } from "../lib/admin-reporting.ts";
const now = new Date("2026-10-10T06:00:00Z");

test("date presets use Vietnam calendar boundaries, including weeks and previous months", () => {
  const expected = { today: ["2026-10-10", "2026-10-10"], yesterday: ["2026-10-09", "2026-10-09"], two_days: ["2026-10-09", "2026-10-10"], last_7: ["2026-10-04", "2026-10-10"], last_14: ["2026-09-27", "2026-10-10"], last_28: ["2026-09-13", "2026-10-10"], last_30: ["2026-09-11", "2026-10-10"], this_week: ["2026-10-05", "2026-10-10"], last_week: ["2026-09-28", "2026-10-04"], this_month: ["2026-10-01", "2026-10-10"], last_month: ["2026-09-01", "2026-09-30"], all: ["1970-01-01", "2026-10-10"] };
  for (const [datePreset, dates] of Object.entries(expected)) {
    const selection = resolveAdminDateSelection({ datePreset }, "last_30", now);
    assert.deepEqual([selection.from, selection.to], dates, datePreset);
  }
  assert.equal(adminDateKey(new Date("2026-10-09T18:00:00Z")), "2026-10-10");
  const today = resolveAdminDateSelection({ datePreset: "today" }, "all", now);
  assert.equal(today.range.start.toISOString(), "2026-10-09T17:00:00.000Z");
  assert.equal(today.range.end.toISOString(), "2026-10-10T16:59:59.999Z");
});
test("custom and comparison dates reject invalid, reversed and impossible dates", () => {
  const valid = resolveAdminDateSelection({ datePreset: "custom", from: "2026-02-01", to: "2026-02-28", compareFrom: "2026-01-01", compareTo: "2026-01-28" }, "all", now);
  assert.equal(valid.from, "2026-02-01");
  assert.equal(valid.comparison.start.toISOString(), "2025-12-31T17:00:00.000Z");
  for (const from of ["2026-02-30", "invalid", "2026-12-01"]) {
    const invalid = resolveAdminDateSelection({ datePreset: "custom", from, to: "2026-02-28", compareFrom: "2026-03-01", compareTo: "2026-02-28" }, "last_30", now);
    assert.equal(invalid.preset, "last_30"); assert.equal(invalid.comparison, null);
  }
  assert.equal(resolveAdminDateSelection({ datePreset: "last_month" }, "all", new Date("2026-01-10T06:00:00Z")).from, "2025-12-01");
});
test("long ranges keep charts bounded without dropping values at the end", () => {
  const { range } = resolveAdminDateSelection({ datePreset: "all" }, "all", now);
  assert.ok(range.bucketCount <= 60);
  const entries = [{ at: range.start }, { at: range.end }];
  assert.equal(buildAdminTimeSeries(range, entries, item => item.at, () => 1).reduce((sum, item) => sum + item.value, 0), 2);
});
