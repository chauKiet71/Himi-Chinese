# Browser learning-data cache

The root learning-data provider warms all six HSK vocabulary datasets and signed-in practice progress after hydration, one request per idle callback. Slice and other HSK games share the same vocabulary payload. It pauses between requests when hidden/offline and skips speculative downloads on Save-Data or 2G connections. User-triggered requests still work normally.

Responses live in memory and asynchronous Cache Storage (no service worker or large synchronous localStorage writes). A new page load can reuse the persisted response. Only seven canonical GET URLs are eligible, each limited to 2 MiB. Cache Storage requires HTTPS or localhost; unavailable/full storage falls back to memory and normal network requests.

Cache namespaces include the server-authenticated user ID, role and session creation time; guests use a separate namespace. On provider startup old account/version namespaces are deleted. No session token is exposed or saved. Vocabulary expires after five minutes and progress after 30 seconds. Expired content must pass the existing server permission checks again; expired private content is never served as an offline fallback. Authorization/content policy changes may take up to the TTL to appear in already cached data. Changing account or signing in again uses a new namespace.

Successful practice POSTs invalidate cached progress before subsequent reads. Per-key generations prevent an older in-flight GET from repopulating an invalidated cache. Concurrent callers share one request; cancelling a component only cancels its subscription. A network request times out after 12 seconds. Failed/non-JSON responses are not cached; 401/403 responses evict previous data.

This covers the existing browser learning GET APIs. Course, lesson, video, and vocabulary-library pages currently receive data through server rendering, so browser API caching does not eliminate their server/database work or make the entire site offline. The existing primary-route prefetch remains in place. Auth, payment status, chatbot, uploads, media and all writes remain live operations. Avoid preloading arbitrary endpoints: some create orders, update progress or perform expensive on-demand work.

## Verification

Run `node --experimental-strip-types --test tests/browser-api-cache.test.mjs`. Browser checks: open `/games` on HTTPS/localhost, wait for warm-up, inspect `himi-learning-api-v1:*` in DevTools Application → Cache Storage; reload and select HSK1. Fresh data should not cause another vocabulary request. After five minutes a new request must occur. Change account/logout and confirm the namespace changes; submit practice progress and verify the next read is fresh. Test with disabled storage and throttled/Save-Data network settings.

Platform references: [Cache Storage](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage), [idle scheduling](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback).

Validation on 2026-09-12: 21 focused tests passed (10 cache behavior tests plus existing game/navigation/practice tests); ESLint passed on all changed TypeScript/TSX files. In Chrome on localhost:3001, HSK1 memory game loaded, then reload and HSK1 slice game loaded with 172 words. Browser timing/network-cache hit rates were not measured; persistence and deduplication were verified with the behavioral tests using a Cache Storage adapter. Full TypeScript checking reports four errors in unchanged `lib/admin-analytics-service.ts` (lines 63–65, 92). The broader rendered-HTML suite has six failures in existing home/practice/navigation/catalog assertions, outside this cache change.
