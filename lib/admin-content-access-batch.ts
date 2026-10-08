import { CONTENT_ACCESS_TARGET_TYPES, contentAccessPolicyKey, type ContentAccessPolicy, type ContentAccessTarget } from "./content-access-types.ts";

export function parseContentAccessPolicyBatch(value: FormDataEntryValue | null): ContentAccessPolicy[] | null {
  if (typeof value !== "string" || value.length > 512_000) return null;
  let rows: unknown;
  try { rows = JSON.parse(value); } catch { return null; }
  if (!Array.isArray(rows) || rows.length === 0 || rows.length > 1000) return null;
  const policies: ContentAccessPolicy[] = [];
  const keys = new Set<string>();
  for (const row of rows) {
    if (!row || typeof row !== "object") return null;
    const { targetType, targetKey, tier } = row;
    if (!CONTENT_ACCESS_TARGET_TYPES.includes(targetType) || typeof targetKey !== "string" || !targetKey.trim() || targetKey.length > 500 || !["guest", "free", "vip"].includes(tier)) return null;
    const key = contentAccessPolicyKey(targetType, targetKey);
    if (keys.has(key)) return null;
    keys.add(key);
    policies.push({ targetType, targetKey, tier });
  }
  return policies;
}

export function batchMatchesContentAccessTargets(policies: ContentAccessPolicy[], targets: ContentAccessTarget[]): boolean {
  const expected = new Set(targets.map(({ type, key }) => contentAccessPolicyKey(type, key)));
  return policies.length === expected.size && policies.every(({ targetType, targetKey }) => expected.has(contentAccessPolicyKey(targetType, targetKey)));
}
