// Only bounded, read-only learning APIs belong here. Never cache auth, payments,
// support messages, uploads or mutation requests.
export const LEARNING_CACHE_PREFIX = "himi-learning-api-v1:";
const MAX_ENTRY_BYTES = 2 * 1024 * 1024;
const GAME_TTL_MS = 5 * 60_000;
const PROGRESS_TTL_MS = 30_000;

export function learningCachePolicy(url: string): { key: string; ttl: number } | null {
  const game = /^\/api\/games\/(?:vocabulary|slice)\?level=(hsk-[1-6])$/.exec(url);
  if (game) return { key: `/api/games/vocabulary?level=${game[1]}`, ttl: GAME_TTL_MS };
  if (url === "/api/progress/practice") return { key: url, ttl: PROGRESS_TTL_MS };
  return null;
}

type Entry = { body: string; savedAt: number };
type CacheOptions = {
  scope: string;
  fetcher?: typeof fetch;
  storage?: () => CacheStorage | undefined;
  now?: () => number;
};

function abortError() { return new DOMException("Request cancelled", "AbortError"); }

// A component cancelling its subscription must not cancel another component's
// request or the background warmer sharing the same network operation.
function subscribe(promise: Promise<Response>, signal?: AbortSignal): Promise<Response> {
  if (signal?.aborted) return Promise.reject(abortError());
  return new Promise((resolve, reject) => {
    const abort = () => reject(abortError());
    signal?.addEventListener("abort", abort, { once: true });
    promise.then((response) => resolve(response.clone()), reject)
      .finally(() => signal?.removeEventListener("abort", abort));
  });
}

export function createBrowserApiCache({ scope, fetcher = fetch, storage = () => globalThis.caches, now = Date.now }: CacheOptions) {
  const name = LEARNING_CACHE_PREFIX + encodeURIComponent(scope);
  const memory = new Map<string, Entry>();
  const pending = new Map<string, Promise<Response>>();
  const versions = new Map<string, number>();
  // Serialize disk writes/deletes so a completed mutation cannot be overwritten
  // by an older read that happened to finish at the same time.
  let diskWork: Promise<unknown> = Promise.resolve();

  async function disk() {
    try { return await storage()?.open(name); } catch { return undefined; }
  }
  function queueDisk(work: () => Promise<unknown>) {
    diskWork = diskWork.then(work).catch(() => undefined);
    return diskWork;
  }
  const toResponse = (entry: Entry) => new Response(entry.body, { headers: { "Content-Type": "application/json" } });

  async function load(key: string, ttl: number): Promise<Response> {
    const version = versions.get(key) ?? 0;
    let entry = memory.get(key);
    if (!entry) {
      try {
        await diskWork;
        const saved = await (await disk())?.match(key);
        if (saved) {
          const savedAt = Number(saved.headers.get("x-himi-saved-at"));
          const body = await saved.text();
          if (Number.isFinite(savedAt) && body.length <= MAX_ENTRY_BYTES) {
            JSON.parse(body);
            entry = { body, savedAt };
          }
        }
      } catch { /* Corrupt or unavailable storage is a cache miss. */ }
    }
    if (entry && now() >= entry.savedAt && now() - entry.savedAt < ttl && (versions.get(key) ?? 0) === version) {
      memory.set(key, entry);
      return toResponse(entry);
    }
    // Expired gated content must be authorized again; no stale/offline fallback.
    const response = await fetcher(key, { cache: "no-store", credentials: "same-origin", signal: AbortSignal.timeout(12_000) });
    if (!response.ok) {
      if ((versions.get(key) ?? 0) === version) {
        memory.delete(key);
        await queueDisk(async () => {
          if ((versions.get(key) ?? 0) === version) await (await disk())?.delete(key);
        });
      }
      return response;
    }
    if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
    const body = await response.clone().text();
    if (new TextEncoder().encode(body).byteLength > MAX_ENTRY_BYTES) return response;
    try { JSON.parse(body); } catch { return response; }
    if ((versions.get(key) ?? 0) === version) {
      const next = { body, savedAt: now() };
      memory.set(key, next);
      await queueDisk(async () => {
        if ((versions.get(key) ?? 0) !== version) return;
        await (await disk())?.put(key, new Response(body, { headers: {
          "Content-Type": "application/json", "x-himi-saved-at": String(next.savedAt),
        } }));
      });
    }
    return response;
  }

  function get(url: string, options: { signal?: AbortSignal } = {}): Promise<Response> {
    if (options.signal?.aborted) return Promise.reject(abortError());
    const policy = learningCachePolicy(url);
    if (!policy) return fetcher(url, { cache: "no-store", credentials: "same-origin", signal: options.signal });
    let operation = pending.get(policy.key);
    if (!operation) {
      operation = load(policy.key, policy.ttl);
      pending.set(policy.key, operation);
      const current = operation;
      const cleanup = () => { if (pending.get(policy.key) === current) pending.delete(policy.key); };
      operation.then(cleanup, cleanup);
    }
    return subscribe(operation, options.signal);
  }

  async function invalidate(url: string) {
    const policy = learningCachePolicy(url);
    if (!policy) return;
    versions.set(policy.key, (versions.get(policy.key) ?? 0) + 1);
    memory.delete(policy.key);
    pending.delete(policy.key);
    await queueDisk(async () => (await disk())?.delete(policy.key));
  }

  async function removeOtherScopes() {
    try {
      const caches = storage();
      const names = await caches?.keys() ?? [];
      await Promise.all(names.filter((key) => key.startsWith("himi-learning-api-") && key !== name).map((key) => caches?.delete(key)));
    } catch { /* Storage is optional, including in private browsing. */ }
  }

  return { get, invalidate, removeOtherScopes };
}

export type BrowserApiCache = ReturnType<typeof createBrowserApiCache>;
