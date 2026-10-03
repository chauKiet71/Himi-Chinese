import { isLessonPayload, isLessonResourceUrl, type LessonEnvelope, type LessonResource } from "./lesson-resource.ts";
import { createIndexedDbLessonStore, type LessonContentStore, type StoredLesson } from "./lesson-content-store.ts";

const MAX_ENTRY_BYTES = 2 * 1024 * 1024;
const MAX_MEMORY_ENTRIES = 6;
export const LESSON_SESSION_CHANNEL = "himi-lesson-session";
const activeCaches = new Set<{ scope: string; dispose(): void; flush(): Promise<void> }>();

export class LessonLoadError extends Error {
  status: number;
  constructor(message: string, status = 0) { super(message); this.status = status; }
}

function abortError() { return new DOMException("Request cancelled", "AbortError"); }

function subscribe<T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> {
  if (signal?.aborted) return Promise.reject(abortError());
  return new Promise((resolve, reject) => {
    const abort = () => reject(abortError());
    signal?.addEventListener("abort", abort, { once: true });
    promise.then(resolve, reject).finally(() => signal?.removeEventListener("abort", abort));
  });
}

export function createLessonContentCache({ scope, store = createIndexedDbLessonStore(), fetcher = fetch }: {
  scope: string; store?: LessonContentStore; fetcher?: typeof fetch;
}) {
  const memory = new Map<string, StoredLesson>();
  const pending = new Map<string, Promise<unknown>>();
  const controllers = new Set<AbortController>();
  const latestVersions = new Map<string, string>();
  let disposed = false;
  let diskWork: Promise<unknown> = Promise.resolve();
  const queueDisk = (work: () => Promise<unknown>) => {
    diskWork = diskWork.then(work).catch(() => undefined);
    return diskWork;
  };
  const remember = (entry: StoredLesson) => {
    memory.delete(entry.key);
    memory.set(entry.key, entry);
    while (memory.size > MAX_MEMORY_ENTRIES) memory.delete(memory.keys().next().value!);
  };
  const valid = (entry: LessonEnvelope | undefined, resource: LessonResource) => entry
    && entry.version === resource.version && entry.scope === resource.scope && isLessonPayload(entry.data, resource.url);

  async function load(resource: LessonResource) {
    const key = `${scope}|${resource.url}`;
    let cached = memory.get(key);
    if (!cached) {
      try { await diskWork; cached = await store.get(key); } catch { /* Storage is optional. */ }
    }
    if (disposed) throw abortError();
    if (valid(cached, resource)) {
      remember(cached!);
      void queueDisk(() => store.touch(key));
      return cached!.data;
    }
    const controller = new AbortController();
    controllers.add(controller);
    const timer = setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetcher(resource.url, {
        cache: "no-store", credentials: "same-origin", signal: controller.signal,
        headers: { "X-Himi-Lesson-Scope": scope, "X-Himi-Lesson-Version": resource.version },
      });
      if (!response.ok) {
        if (latestVersions.get(resource.url) === resource.version) {
          memory.delete(key);
          await queueDisk(async () => {
            if (latestVersions.get(resource.url) === resource.version) await store.remove(key);
          });
        }
        const message = response.status === 401 ? "Phiên đăng nhập đã thay đổi. Vui lòng tải lại trang."
          : response.status === 403 ? "Quyền truy cập bài học đã thay đổi. Vui lòng tải lại trang."
          : response.status === 409 ? "Bài học vừa được cập nhật. Vui lòng tải lại trang."
          : "Chưa tải được bài học. Bạn hãy thử lại.";
        throw new LessonLoadError(message, response.status);
      }
      const envelope = await response.json() as LessonEnvelope;
      if (!valid(envelope, resource)) throw new LessonLoadError("Bài học vừa thay đổi. Vui lòng tải lại trang.", 409);
      if (disposed) throw abortError();
      const bytes = new TextEncoder().encode(JSON.stringify(envelope)).byteLength;
      if (bytes <= MAX_ENTRY_BYTES && latestVersions.get(resource.url) === resource.version) {
        const entry: StoredLesson = { ...envelope, key, bytes, lastUsedAt: Date.now() };
        remember(entry);
        // Yield to rendering; quota/blocked storage cannot turn a successful
        // lesson download into an error or hold up the first vocabulary card.
        void queueDisk(async () => {
          if (!disposed && latestVersions.get(resource.url) === resource.version) await store.put(entry);
        });
      }
      return envelope.data;
    } catch (error) {
      if (error instanceof LessonLoadError || disposed) throw error;
      throw new LessonLoadError("Không tải được bài học. Kiểm tra kết nối mạng rồi thử lại.");
    } finally {
      clearTimeout(timer);
      controllers.delete(controller);
    }
  }

  const cache = {
    scope,
    async prepare(url: string, signal?: AbortSignal) {
      if (disposed || signal?.aborted) throw abortError();
      if (!isLessonResourceUrl(url)) throw new LessonLoadError("Không tìm thấy bài học.", 404);
      const response = await fetcher(`${url}?metadata=1`, {
        cache: "no-store", credentials: "same-origin",
        signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15_000)]) : AbortSignal.timeout(15_000),
        headers: { "X-Himi-Lesson-Scope": scope },
      });
      if (!response.ok) throw new LessonLoadError(response.status === 401
        ? "Phiên đăng nhập đã thay đổi. Vui lòng tải lại trang."
        : response.status === 403 ? "Quyền học đã thay đổi. Vui lòng tải lại trang."
          : "Không tải được bài học. Nhấn vào bài để thử lại.", response.status);
      const resource = await response.json() as LessonResource;
      if (resource.url !== url || resource.scope !== scope || typeof resource.version !== "string") {
        throw new LessonLoadError("Phiên học đã thay đổi. Vui lòng tải lại trang.", 409);
      }
      await cache.get(resource, signal);
      await cache.flush();
      if (disposed || signal?.aborted) throw abortError();
    },
    get<T>(resource: LessonResource, signal?: AbortSignal): Promise<T> {
      if (disposed || signal?.aborted) return Promise.reject(abortError());
      if (resource.scope !== scope || !isLessonResourceUrl(resource.url)) {
        return Promise.reject(new LessonLoadError("Phiên học đã thay đổi. Vui lòng tải lại trang.", 401));
      }
      if (typeof window !== "undefined") activeCaches.add(cache);
      const key = `${resource.url}|${resource.version}`;
      latestVersions.set(resource.url, resource.version);
      let operation = pending.get(key);
      if (!operation) {
        operation = load(resource);
        pending.set(key, operation);
        const current = operation;
        const cleanup = () => { if (pending.get(key) === current) pending.delete(key); };
        operation.then(cleanup, cleanup);
      }
      return subscribe(operation as Promise<T>, signal);
    },
    async removeOtherScopes() {
      const oldCaches = [...activeCaches].filter((other) => other.scope !== scope);
      oldCaches.forEach((other) => other.dispose());
      await Promise.all(oldCaches.map((other) => other.flush()));
      if (typeof window !== "undefined") activeCaches.add(cache);
      await queueDisk(() => store.removeOtherScopes(scope));
    },
    async flush() { await diskWork; },
    dispose() {
      disposed = true;
      controllers.forEach((controller) => controller.abort());
      memory.clear();
      pending.clear();
      latestVersions.clear();
      activeCaches.delete(cache);
    },
  };
  return cache;
}

export async function clearLessonContentCache() {
  const caches = [...activeCaches];
  caches.forEach((cache) => cache.dispose());
  await Promise.all(caches.map((cache) => cache.flush()));
  try {
    const channel = new BroadcastChannel(LESSON_SESSION_CHANNEL);
    channel.postMessage({ logout: true });
    channel.close();
  } catch { /* Unsupported browsers still clear their own storage. */ }
  try { await createIndexedDbLessonStore().clear(); } catch { /* Logout must remain usable. */ }
}

export type LessonContentCache = ReturnType<typeof createLessonContentCache>;
