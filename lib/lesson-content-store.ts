import type { LessonEnvelope } from "./lesson-resource.ts";

export const LESSON_CONTENT_DB = "himi-lesson-content-v1";
export const LESSON_CACHE_MAX_BYTES = 40 * 1024 * 1024;
export const LESSON_CACHE_MAX_ENTRIES = 200;
export type StoredLesson = LessonEnvelope & { key: string; bytes: number; lastUsedAt: number };
export type LessonContentStore = {
  get(key: string): Promise<StoredLesson | undefined>;
  put(entry: StoredLesson): Promise<void>;
  touch(key: string): Promise<void>;
  remove(key: string): Promise<void>;
  removeOtherScopes(scope: string): Promise<void>;
  clear(): Promise<void>;
};

// Metadata lives separately, so LRU eviction never deserializes all lesson bodies.
export function createIndexedDbLessonStore(factory = () => globalThis.indexedDB): LessonContentStore {
  let database: Promise<IDBDatabase> | undefined;
  function open() {
    if (!database) database = new Promise<IDBDatabase>((resolve, reject) => {
      const request = factory().open(LESSON_CONTENT_DB, 1);
      let timedOut = false;
      const timer = setTimeout(() => { timedOut = true; reject(new Error("Lesson storage unavailable")); }, 1_500);
      request.onupgradeneeded = () => {
        request.result.createObjectStore("content", { keyPath: "key" });
        request.result.createObjectStore("metadata", { keyPath: "key" });
      };
      request.onsuccess = () => {
        clearTimeout(timer);
        if (timedOut) { request.result.close(); return; }
        request.result.onversionchange = () => { request.result.close(); database = undefined; };
        resolve(request.result);
      };
      request.onerror = () => { clearTimeout(timer); reject(request.error); };
      request.onblocked = () => { clearTimeout(timer); timedOut = true; reject(new Error("Lesson storage blocked")); };
    });
    return database;
  }

  async function transaction<T>(mode: IDBTransactionMode, work: (tx: IDBTransaction, result: (value: T) => void) => void): Promise<T> {
    const db = await open();
    return new Promise<T>((resolve, reject) => {
      const tx = db.transaction(["content", "metadata"], mode);
      let value: T;
      const timer = setTimeout(() => { tx.abort(); }, 1_500);
      tx.oncomplete = () => { clearTimeout(timer); resolve(value); };
      tx.onabort = tx.onerror = () => { clearTimeout(timer); reject(tx.error ?? new Error("Lesson storage failed")); };
      work(tx, (next) => { value = next; });
    });
  }

  return {
    get(key) {
      return transaction<StoredLesson | undefined>("readwrite", (tx, result) => {
        const request = tx.objectStore("content").get(key);
        request.onsuccess = () => {
          const entry = request.result as StoredLesson | undefined;
          result(entry);
          if (entry) tx.objectStore("metadata").put({ key, scope: entry.scope, bytes: entry.bytes, lastUsedAt: Date.now() });
        };
      });
    },
    put(entry) {
      if (entry.bytes > LESSON_CACHE_MAX_BYTES) return Promise.resolve();
      return transaction<void>("readwrite", (tx) => {
        const metadata = tx.objectStore("metadata");
        const request = metadata.getAll();
        request.onsuccess = () => {
          const entries = (request.result as Omit<StoredLesson, "data" | "version">[])
            .filter((item) => item.key !== entry.key).sort((a, b) => a.lastUsedAt - b.lastUsedAt);
          let bytes = entries.reduce((sum, item) => sum + item.bytes, entry.bytes);
          let count = entries.length + 1;
          for (const item of entries) {
            if (bytes <= LESSON_CACHE_MAX_BYTES && count <= LESSON_CACHE_MAX_ENTRIES) break;
            tx.objectStore("content").delete(item.key);
            metadata.delete(item.key);
            bytes -= item.bytes;
            count--;
          }
          tx.objectStore("content").put(entry);
          metadata.put({ key: entry.key, scope: entry.scope, bytes: entry.bytes, lastUsedAt: entry.lastUsedAt });
        };
      });
    },
    touch(key) {
      return transaction<void>("readwrite", (tx) => {
        const metadata = tx.objectStore("metadata");
        const request = metadata.get(key);
        request.onsuccess = () => {
          if (request.result) metadata.put({ ...request.result, lastUsedAt: Date.now() });
        };
      });
    },
    remove(key) {
      return transaction<void>("readwrite", (tx) => {
        tx.objectStore("content").delete(key);
        tx.objectStore("metadata").delete(key);
      });
    },
    removeOtherScopes(scope) {
      return transaction<void>("readwrite", (tx) => {
        const request = tx.objectStore("metadata").openCursor();
        request.onsuccess = () => {
          const cursor = request.result;
          if (!cursor) return;
          if (cursor.value.scope !== scope) {
            tx.objectStore("content").delete(cursor.primaryKey);
            cursor.delete();
          }
          cursor.continue();
        };
      });
    },
    clear() {
      return transaction<void>("readwrite", (tx) => {
        tx.objectStore("content").clear();
        tx.objectStore("metadata").clear();
      });
    },
  };
}
