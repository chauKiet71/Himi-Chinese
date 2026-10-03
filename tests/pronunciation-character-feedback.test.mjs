import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const evaluator = await readFile(new URL("../components/pronunciation-evaluator.tsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../app/lesson-stage.css", import.meta.url), "utf8");

test("pronunciation feedback propagates nested syllable errors to the owning character", () => {
  assert.match(evaluator, /querySelectorAll\("syll, phone, char"\)/);
  assert.match(evaluator, /pronunciationNodeHasIssue\(node\) \? "incorrect" : "correct"/);
  assert.match(evaluator, /weakHanzi\.has\(character\)[\s\S]*?"incorrect"/);
});

test("unscored pronunciation characters do not inherit the correct green color", () => {
  assert.match(styles, /\.pronunciation-character\.is-unscored\s*\{[^}]*color:\s*#334155;[^}]*text-decoration:\s*none;/);
});

test("microphone toggle chime plays when recording starts and after it stops", () => {
  assert.match(evaluator, /function playMicToggleChime\(\)/);
  assert.match(evaluator, /const recorder = await releaseRecorder\(\);[\s\S]*?if \(playToggleSound\) playMicToggleChime\(\);/);
  assert.match(evaluator, /if \(!navigator\.mediaDevices\?\.getUserMedia\)[\s\S]*?if \(playToggleSound\) playMicToggleChime\(\);[\s\S]*?navigator\.mediaDevices\.getUserMedia/);
});
