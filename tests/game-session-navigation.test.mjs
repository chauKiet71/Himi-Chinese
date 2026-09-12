import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("HSK game session back button returns to the HSK course picker", () => {
  const gameCenter = read("components/game-center.tsx");
  const hskSession = read("components/hsk-game-session.tsx");

  assert.match(gameCenter, /const backAction = course\?\.onChangeCourse \?\? onExit/);
  assert.match(gameCenter, /Quay lại chọn khóa HSK/);
  assert.match(gameCenter, /onClick=\{backAction\}/);
  assert.match(hskSession, /value=\{\{ exitLabel, onChangeCourse: changeCourse \}\}/);
});

test("HSK game session no longer renders the duplicate course bar", () => {
  const gameCenter = read("components/game-center.tsx");
  const globalStyles = read("app/globals.css");
  const brandStyles = read("app/brand-theme.css");

  assert.doesNotMatch(gameCenter, /game-hsk-course-bar/);
  assert.doesNotMatch(globalStyles, /game-hsk-course-bar/);
  assert.doesNotMatch(brandStyles, /game-hsk-course-bar/);
});
