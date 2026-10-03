// Run against a local dev server with its existing guest-visible first HSK lesson.
// All IndexedDB mutations happen in disposable browser contexts, never user data.
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const modulePath = process.env.HIMI_PLAYWRIGHT_MODULE;
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : "playwright");
const base = process.env.HIMI_VERIFY_URL ?? "http://localhost:3100";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname), "Use a local dev server");
const browser = await chromium.launch({ channel: "chrome", headless: true });
const report = { checks: [], requests: [], errors: [] };
const context = await browser.newContext({ viewport: { width: 1365, height: 900 } });
const page = await context.newPage();
page.setDefaultTimeout(60_000);
page.on("pageerror", (error) => report.errors.push(error.message));
page.on("request", (request) => { const url = new URL(request.url()); if (url.pathname.startsWith("/api/lessons/") && !url.searchParams.has("metadata")) report.requests.push(url.pathname); });
const first = "/hsk/1/hsk1-bai-01-chao-anh";
const firstApi = "/api/lessons/hsk/hsk-1/hsk1-bai-01-chao-anh";
const openFirst = async () => {
  await page.goto(base + first + "/play", { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.getByRole("button", { name: "Phát âm 你", exact: true }).waitFor();
};
const metadata = async () => page.evaluate(async () => {
  const db = await new Promise((resolve, reject) => { const r = indexedDB.open("himi-lesson-content-v1"); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
  const rows = await new Promise((resolve, reject) => { const r = db.transaction("metadata").objectStore("metadata").getAll(); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
  db.close();
  return rows;
});

try {
  await page.goto(base + "/courses?view=hsk", { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.getByRole("link", { name: "Bài 1: Xin chào!", exact: true }).waitFor();
  assert.equal(report.requests.length, 0);
  report.checks.push("Roadmap: zero lesson-body requests before selection");
  await page.getByRole("link", { name: "Bài 1: Xin chào!", exact: true }).click();
  await page.getByRole("button", { name: "Phát âm 你", exact: true }).waitFor();
  assert.deepEqual(report.requests, [firstApi]);
  assert.equal((await metadata()).length, 1);
  report.checks.push("First selection: one body request and one IndexedDB entry");
  await mkdir("qa-artifacts", { recursive: true });
  await page.screenshot({ path: "qa-artifacts/lesson-cache-desktop.png" });

  await openFirst();
  assert.equal(report.requests.length, 1);
  report.checks.push("Full document reload: zero additional body requests");
  await page.goto(base + first + "/quiz", { waitUntil: "domcontentloaded" });
  await page.locator(".hsk-quiz-session:not([aria-busy]) .hsk-quiz-stage").waitFor();
  assert.equal(report.requests.length, 1);
  report.checks.push("Quiz uses the same saved lesson without downloading again");

  await page.goto(base + "/courses?view=hsk", { waitUntil: "domcontentloaded" });
  await page.getByRole("link", { name: "Bài 2: Cảm ơn bạn!", exact: true }).click();
  await page.locator(".hsk-guided-vocabulary-grid").waitFor();
  assert.equal(report.requests.length, 2);
  assert.notEqual(report.requests[1], firstApi);
  report.checks.push("Selecting lesson 2 downloads only lesson 2");
  await openFirst();
  assert.equal(report.requests.length, 2);

  await page.evaluate(async (url) => {
    const db = await new Promise((resolve) => { const r = indexedDB.open("himi-lesson-content-v1"); r.onsuccess = () => resolve(r.result); });
    await new Promise((resolve, reject) => {
      const tx = db.transaction("content", "readwrite");
      const store = tx.objectStore("content"), request = store.get("guest|" + url);
      request.onsuccess = () => store.put({ ...request.result, version: "outdated-test-version" });
      tx.oncomplete = resolve; tx.onerror = () => reject(tx.error);
    });
    db.close();
  }, firstApi);
  await openFirst();
  assert.equal(report.requests.length, 3);
  report.checks.push("Outdated persisted version is replaced with one new download");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "qa-artifacts/lesson-cache-mobile.png" });

  // Exercise the real browser implementation, not an in-memory IndexedDB mock.
  const storageResult = await page.evaluate(async () => {
    const { createIndexedDbLessonStore } = await import("/lib/lesson-content-store.ts");
    const store = createIndexedDbLessonStore();
    await store.clear();
    for (let i = 0; i < 201; i++) await store.put({ key: `test-${i}`, scope: "test", version: "v1", data: {}, bytes: 100, lastUsedAt: i });
    const evictedOldest = !(await store.get("test-0"));
    const keptLatest = Boolean(await store.get("test-200"));
    await store.clear();
    for (let i = 0; i < 41; i++) await store.put({ key: `size-${i}`, scope: "test", version: "v1", data: {}, bytes: 1024 * 1024, lastUsedAt: i });
    const enforcedBytes = !(await store.get("size-0")) && Boolean(await store.get("size-40"));
    await store.removeOtherScopes("guest");
    const removedOtherScope = !(await store.get("size-40"));
    return { evictedOldest, keptLatest, enforcedBytes, removedOtherScope };
  });
  assert.deepEqual(storageResult, { evictedOldest: true, keptLatest: true, enforcedBytes: true, removedOtherScope: true });
  report.checks.push("Real IndexedDB: 200-entry limit, 40 MiB limit, oldest eviction, other-scope cleanup");

  await page.route("**" + firstApi, (route) => route.abort());
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Thử lại", exact: true }).waitFor();
  await page.unroute("**" + firstApi);
  await page.getByRole("button", { name: "Thử lại", exact: true }).click();
  await page.getByRole("button", { name: "Phát âm 你", exact: true }).waitFor();
  report.checks.push("Network failure displays retry; retry successfully opens the lesson");

  const privateContext = await browser.newContext();
  await privateContext.addInitScript(() => { Object.defineProperty(window, "indexedDB", { get() { throw new DOMException("Blocked", "SecurityError"); } }); });
  const privatePage = await privateContext.newPage();
  await privatePage.goto(base + first + "/play", { waitUntil: "domcontentloaded" });
  await privatePage.getByRole("button", { name: "Phát âm 你", exact: true }).waitFor();
  report.checks.push("Blocked IndexedDB: lesson still opens from network");
  await privateContext.close();
  assert.deepEqual(report.errors, []);
  report.checks.push("No uncaught browser errors");
  console.log(JSON.stringify(report, null, 2));
} finally {
  await writeFile("qa-artifacts/lesson-cache-browser-report.json", JSON.stringify(report, null, 2) + "\n");
  await browser.close();
}
