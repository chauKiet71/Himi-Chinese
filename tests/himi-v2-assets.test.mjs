import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectUrl = new URL("../", import.meta.url);
const assetUrl = (name) => new URL(`public/assets/mascot/himi-v2/${name}`, projectUrl);
const assetPath = (name) => fileURLToPath(assetUrl(name));
const read = (path) => readFile(new URL(path, projectUrl), "utf8");

const variants = ["wave", "listen", "cheer", "celebrate", "writing", "video"];

test("Himi v2 ships transparent animated and reduced-motion assets", async () => {
  for (const variant of variants) {
    const animated = await sharp(assetPath(`himi-${variant}-animated.webp`), { animated: true }).metadata();
    const fallback = await sharp(assetPath(`himi-${variant}.webp`)).metadata();

    assert.equal(animated.format, "webp");
    assert.equal(animated.hasAlpha, true);
    assert.equal(animated.pages, 60);
    assert.equal(animated.pageHeight, 512);
    assert.ok(animated.delay?.every((delay) => delay <= 20));
    assert.equal(fallback.format, "webp");
    assert.equal(fallback.hasAlpha, true);
  }
});

test("UI references only the Himi v2 mascot suite", async () => {
  const sources = await Promise.all([
    read("components/review-home-studio.tsx"),
    read("components/listening-studio.tsx"),
    read("components/course-roadmap.tsx"),
    read("components/auth-card.tsx"),
    read("app/globals.css"),
    read("app/responsive.css"),
    read("app/himi-section-banner.css"),
    read("app/video-learning.css"),
  ]);
  const combined = sources.join("\n");

  assert.match(combined, /\/assets\/mascot\/himi-v2\/himi-wave-animated\.webp/);
  assert.match(combined, /\/assets\/mascot\/himi-v2\/himi-listen-animated\.webp/);
  assert.match(combined, /\/assets\/mascot\/himi-v2\/himi-cheer-animated\.webp/);
  assert.match(combined, /\/assets\/mascot\/himi-v2\/himi-celebrate\.webp/);
  assert.match(combined, /\/assets\/mascot\/himi-v2\/himi-writing-animated\.webp/);
  assert.match(combined, /\/assets\/mascot\/himi-v2\/himi-video-animated\.webp/);
  assert.match(combined, /login-paper-scene-desktop-himi-v2\.png/);
  assert.match(combined, /login-paper-scene-mobile-himi-v2\.png/);
  assert.doesNotMatch(combined, /\/assets\/mascot\/penguin|himi-current-wave-fixed|himi-current-static|penguin-walk-cycle-v2|penguin-register-success|login-paper-scene-(?:desktop|mobile)-v2/);

  await assert.rejects(access(new URL("public/assets/mascot/penguin", projectUrl)));
  await assert.rejects(access(new URL("public/assets/home/himi-current-wave-fixed.gif", projectUrl)));
  await assert.rejects(access(new URL("public/assets/home/himi-current-static.webp", projectUrl)));
});

test("authentication scenes use the clean Himi v2-ready artwork", async () => {
  const desktop = await sharp(fileURLToPath(new URL("public/assets/auth/login-paper-scene-desktop-himi-v2.png", projectUrl))).metadata();
  const mobile = await sharp(fileURLToPath(new URL("public/assets/auth/login-paper-scene-mobile-himi-v2.png", projectUrl))).metadata();
  const walker = await sharp(fileURLToPath(new URL("public/assets/auth/himi-walk-animated.webp", projectUrl)), { animated: true }).metadata();
  const coverEyes = await sharp(fileURLToPath(new URL("public/assets/auth/himi-v2-cover-eyes.png", projectUrl))).metadata();

  assert.equal(desktop.width, 1536);
  assert.equal(desktop.height, 1024);
  assert.equal(mobile.width, 1024);
  assert.equal(mobile.height, 1536);
  assert.equal(walker.hasAlpha, true);
  assert.ok((walker.pages ?? 0) >= 8);
  assert.ok(walker.delay?.every((delay) => delay <= 63));
  assert.equal(coverEyes.hasAlpha, true);
});

test("password focus makes Himi cover his eyes", async () => {
  const [authCard, styles] = await Promise.all([
    read("components/auth-card.tsx"),
    read("app/globals.css"),
  ]);

  assert.match(authCard, /onFocusChange\?\:\s*\(focused: boolean\) => void/);
  assert.match(authCard, /onFocus=\{\(\) => onFocusChange\?\.\(true\)\}/);
  assert.match(authCard, /onBlur=\{\(\) => onFocusChange\?\.\(false\)\}/);
  assert.match(authCard, /passwordFocused \? "auth-password-is-active"/);
  assert.match(authCard, /himi-v2-cover-eyes\.png/);
  assert.match(styles, /\.auth-password-is-active \.auth-login-scene-art::after/);
  assert.match(styles, /\.auth-password-is-active \.auth-password-mascot/);
});

test("mobile authentication home button centers its icon", async () => {
  const styles = await read("app/responsive.css");

  assert.match(styles, /\.auth-scene-home \{[^}]*display: inline-flex;[^}]*align-items: center;[^}]*justify-content: center;[^}]*gap: 0;[^}]*line-height: 0;/s);
  assert.match(styles, /\.auth-scene-home svg,[\s\S]*?\.auth-scene-replay svg \{[^}]*display: block;[^}]*margin: 0;/s);
});

test("mobile authentication inputs use the requested 14px type size", async () => {
  const [globalStyles, styles] = await Promise.all([
    read("app/globals.css"),
    read("app/responsive.css"),
  ]);

  assert.match(globalStyles, /\.auth-card-register-scene \.auth-input-shell input \{[^}]*font-size: 14px;/s);
  assert.match(globalStyles, /\.auth-card-login-scene \.auth-input-shell input \{[^}]*font-size: 14px;[^}]*font-weight: 400;/s);
  assert.match(globalStyles, /\.auth-card-login-scene \.auth-input-shell input::placeholder \{[^}]*font-weight: 400;/s);
  assert.match(styles, /@media \(max-width: 720px\)[\s\S]*?\.auth-card-login-scene \.auth-input-shell input \{[^}]*font-size: 14px;/s);
  assert.match(styles, /@media \(orientation: landscape\) and \(max-height: 500px\)[\s\S]*?\.auth-card-login-scene \.auth-input-shell input \{[^}]*font-size: 14px;/s);
  assert.match(styles, /@media \(max-width: 720px\) \{\s*\.auth-card-register-scene \.auth-input-shell input \{\s*font-size: 14px;/s);
});
