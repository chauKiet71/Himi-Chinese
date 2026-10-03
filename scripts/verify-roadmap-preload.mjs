import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { writeFile } from "node:fs/promises";
const { chromium } = await import(pathToFileURL(process.env.HIMI_PLAYWRIGHT_MODULE).href);
const base = process.env.HIMI_VERIFY_URL ?? "http://localhost:3001";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const report = [];
try {
  const context = await browser.newContext({ viewport: { width: 1265, height: 1189 } });
  const page = await context.newPage();
  page.on("pageerror", (error) => console.error("Page error:", error.message));
  page.setDefaultTimeout(60_000);
  let release, bodyCalls = 0, fail = false;
  let gate = new Promise((resolve) => { release = resolve; });
  await page.route("**/api/lessons/hsk/**", async (route) => {
    if (fail) return route.abort();
    if (!new URL(route.request().url()).searchParams.has("metadata")) { bodyCalls++; await gate; }
    return route.continue();
  });
  await page.goto(base + "/courses?view=hsk", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  const lesson = page.getByRole("link", { name: "Bài 1: Xin chào!", exact: true });
  await lesson.click();
  await page.getByText("Đang tải bài học...", { exact: true }).waitFor({ timeout: 15_000 });
  assert.match(page.url(), /\/courses\?view=hsk$/);
  await page.waitForFunction(() => document.querySelector(".hsk-lesson-row.is-loading .hsk-lesson-spinner")?.children.length === 12);
  await page.screenshot({ path: "qa-artifacts/roadmap-preload-desktop.png" });
  await lesson.click();
  await page.getByRole("link", { name: "Bài 2: Cảm ơn bạn!", exact: true }).click();
  assert.match(page.url(), /\/courses\?view=hsk$/);
  release();
  await page.getByRole("button", { name: "Phát âm 你", exact: true }).waitFor();
  assert.equal(bodyCalls, 1);
  report.push("Pending body: stays on roadmap with 12-spoke spinner; repeated/other clicks do not start navigation or duplicate downloads.");
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Phát âm 你", exact: true }).waitFor();
  assert.equal(bodyCalls, 1);
  report.push("Destination and reload reuse the lesson saved before navigation.");
  await page.goto(base + "/courses?view=hsk", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  fail = true;
  await lesson.click();
  await page.getByRole("alert").filter({ hasText: "Không tải được bài học" }).waitFor();
  assert.match(page.url(), /\/courses\?view=hsk$/);
  assert.equal(await page.getByText("Đang tải bài học...", { exact: true }).count(), 0);
  fail = false;
  await lesson.click();
  await page.getByRole("button", { name: "Phát âm 你", exact: true }).waitFor();
  assert.equal(bodyCalls, 1);
  report.push("Failure stays on roadmap and clears spinner; retry succeeds using the saved content.");
  await context.close();
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const phone = await mobile.newPage();
  gate = new Promise((resolve) => { release = resolve; });
  await phone.route("**/api/lessons/hsk/**", async (route) => {
    if (!new URL(route.request().url()).searchParams.has("metadata")) await gate;
    return route.continue();
  });
  await phone.goto(base + "/courses?view=hsk", { waitUntil: "domcontentloaded" });
  await phone.waitForLoadState("networkidle");
  await phone.getByRole("link", { name: "Bài 1: Xin chào!", exact: true }).click();
  await phone.getByText("Đang tải bài học...", { exact: true }).waitFor();
  await phone.screenshot({ path: "qa-artifacts/roadmap-preload-mobile.png" });
  assert.ok(await phone.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  release();
  await mobile.close();
  report.push("Mobile loading state fits without horizontal overflow.");
  console.log(JSON.stringify(report, null, 2));
  await writeFile("qa-artifacts/roadmap-preload-report.json", JSON.stringify(report, null, 2) + "\n");
} catch (error) {
  for (const context of browser.contexts()) for (const page of context.pages()) {
    console.error("Browser state:", page.url(), (await page.locator("body").innerText()).slice(-1600));
    await page.screenshot({ path: "qa-artifacts/roadmap-preload-error.png" });
  }
  throw error;
} finally { await browser.close(); }
