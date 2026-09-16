import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { createServer } from "vite";

// Use an existing Playwright installation; no browser/dependency downloads.
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_DIR
  ? resolve(process.env.PLAYWRIGHT_MODULE_DIR, "playwright")
  : "playwright");
const lessonId = "dialogue-beginner-topic-chat-with-chinese-001-daily-001";
const root = process.cwd();
const entryId = "/__listening-display-check.tsx";
const server = await createServer({
  configFile: false,
  root,
  cacheDir: "node_modules/.vite-listening-display-check",
  resolve: { alias: [
    { find: "next/image", replacement: resolve(root, "tests/fixtures/next-image.tsx") },
    { find: "@", replacement: root },
  ] },
  esbuild: { jsx: "automatic" },
  optimizeDeps: { entries: [], include: ["react", "react-dom/client", "react/jsx-runtime", "react/jsx-dev-runtime", "lucide-react"] },
  server: { host: "127.0.0.1", port: 4318, strictPort: true, hmr: false },
  plugins: [{
    name: "listening-display-check",
    resolveId(id) { if (id === entryId) return entryId; },
    load(id) {
      if (id !== entryId) return;
      return `import React from "react";
        import { createRoot } from "react-dom/client";
        import { ListeningCatalogStudio } from "/components/listening-catalog-studio.tsx";
        import "/app/globals.css";
        import "/app/listening-studio.css";
        import "/app/responsive.css";
        import "/app/adaptive-responsive.css";
        createRoot(document.getElementById("root")).render(
          <ListeningCatalogStudio authenticated initialLessonId="${lessonId}" />
        );`;
    },
    configureServer(vite) {
      vite.middlewares.use((req, res, next) => {
        if (req.url !== "/") return next();
        res.setHeader("Content-Type", "text/html");
        res.end(`<html><head><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
          <body><div id="root"></div><script type="module" src="${entryId}"></script></body></html>`);
      });
    },
  }],
});
let browser;
const results = [];
try {
  await server.listen();
  browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
  for (const size of [{ width: 375, height: 667 }, { width: 390, height: 844 },
    { width: 844, height: 390 }, { width: 1440, height: 900 }]) {
    const touch = size.width <= 900;
    const context = await browser.newContext({ viewport: size, hasTouch: touch,
      isMobile: touch, reducedMotion: "reduce" });
    const page = await context.newPage();
    console.log(`Checking ${size.width}x${size.height}`);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("http://127.0.0.1:4318/", { waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.locator(".listening-focus-transcript-row").first().waitFor();
    const summary = page.locator(".listening-focus-mobile-display summary");
    const compact = await summary.isVisible();
    await page.getByRole("button", { name: "Phát toàn bộ bài nghe", exact: true }).click();
    await page.waitForFunction(() => !document.querySelector("audio").paused);
    await page.evaluate(() => { const audio = document.querySelector("audio"); audio.currentTime = 34; });
    await page.waitForFunction(() => document.querySelector("audio").currentTime >= 34);
    const changes = [];
    for (const [name, selector] of [["Pinyin", ".listening-focus-sentence > span:not(.listening-focus-translation)"],
      ["Tiếng Việt", ".listening-focus-translation"], ["中文", ".listening-focus-sentence > strong"]]) {
      if (compact && await page.locator("details").getAttribute("open") === null) {
        await summary.tap();
        // Safari may blur a summary without a relatedTarget during a label tap.
        await summary.evaluate((element) => element.dispatchEvent(new FocusEvent("focusout", { bubbles: true, relatedTarget: null })));
        assert.notEqual(await page.locator("details").getAttribute("open"), null);
      }
      const control = compact
        ? page.locator(".listening-focus-display-options").getByRole("button", { name, exact: true })
        : page.locator(".listening-focus-language-tools").getByRole("button", { name, exact: true });
      if (touch) await control.tap(); else await control.click();
      const hidden = await page.locator(selector).count() === 0;
      const playing = await page.evaluate(() => !document.querySelector("audio").paused);
      changes.push({ name, hidden, playing });
      console.log(JSON.stringify(changes.at(-1)));
      if (hidden) {
        if (touch) await control.tap(); else await control.click();
        assert.equal(await page.locator(selector).count(), 15, `${name} restored at ${size.width}px`);
      }
    }
    if (compact) {
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("details").getAttribute("open"), null);
      await summary.tap();
      await page.locator("h1").evaluate((element) => element.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })));
      assert.equal(await page.locator("details").getAttribute("open"), null);
    }
    results.push({ viewport: size, changes, errors,
      overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) });
    await context.close();
  }
  console.log(JSON.stringify(results, null, 2));
  for (const result of results) {
    assert.deepEqual(result.errors, []);
    assert.equal(result.overflow, false);
    for (const change of result.changes) {
      assert.equal(change.hidden, true, `${change.name} hides transcript at ${result.viewport.width}px`);
      assert.equal(change.playing, true, "Display toggles must not pause playback");
    }
  }
} finally {
  await browser?.close();
  await server.close();
}
