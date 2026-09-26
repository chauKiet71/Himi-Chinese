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
  assert.match(hskSession, /value=\{\{ authenticated, exitLabel, level: session\.level, onChangeCourse: changeCourse \}\}/);
});

test("Flashcard choices appear after reveal and review words are saved to the vocabulary library", () => {
  const gameCenter = read("components/game-center.tsx");
  const hskSession = read("components/hsk-game-session.tsx");
  const saveClient = read("lib/saved-vocabulary-client.ts");
  const savedToast = read("components/vocabulary-saved-toast.tsx");

  assert.match(gameCenter, /revealed \? <div className="flash-rating-actions">/);
  assert.match(gameCenter, /trySaveHskGameVocabularyWord\(course\.level, word\)/);
  assert.match(gameCenter, /if \(!remembered\)/);
  assert.match(gameCenter, /authenticated=\{authenticated\}/);
  assert.match(hskSession, /authenticated: boolean/);
  assert.match(saveClient, /sourceKey: `\$\{level\}:flashcard:\$\{word\.id\}`/);
  assert.match(saveClient, /sourceTitle: `\$\{levelLabel\} · Flashcard 3D`/);
  assert.match(gameCenter, /<VocabularySavedToast/);
  assert.match(savedToast, /Đã lưu/);
  assert.match(savedToast, /Bạn có thể học lại từ này trong Bộ từ vựng/);
  assert.match(savedToast, /href="\/vocabulary"/);
});

test("HSK game session no longer renders the duplicate course bar", () => {
  const gameCenter = read("components/game-center.tsx");
  const globalStyles = read("app/globals.css");
  const brandStyles = read("app/brand-theme.css");

  assert.doesNotMatch(gameCenter, /game-hsk-course-bar/);
  assert.doesNotMatch(globalStyles, /game-hsk-course-bar/);
  assert.doesNotMatch(brandStyles, /game-hsk-course-bar/);
});

test("an HSK course shows DONE only after its random game round is completed", () => {
  const gameCenter = read("components/game-center.tsx");
  const hskSession = read("components/hsk-game-session.tsx");
  const sliceGame = read("components/writing-slice-game.tsx");
  const gameRoute = read("app/api/progress/game/route.ts");
  const repository = read("lib/activity-progress-repository.ts");
  const styles = read("app/game-completion.css");

  assert.match(gameCenter, /onComplete=\{\(score\) => completeGame\(gameId, score, level\)\}/);
  assert.match(gameCenter, /gameCourseCompletionKey\(id, hskLevel\)/);
  assert.match(hskSession, /hasCompletedGameCourse\(completedCourses, gameId, course\.id\)/);
  assert.match(hskSession, /> DONE<\/span>/);
  assert.match(hskSession, /completed \? "Chơi lại"/);
  assert.match(sliceGame, /onComplete\?\.\(pending\.finalScore, level\)/);
  assert.match(gameRoute, /hskLevel/);
  assert.match(repository, /gameAttempts\.hskLevel/);
  assert.match(styles, /\.writing-course-card\.is-complete/);
  assert.match(styles, /\.writing-course-done/);
});

test("completed games use the animated Himi celebration with a reduced-motion fallback", () => {
  const gameCenter = read("components/game-center.tsx");
  const flashcardSession = read("components/hsk-flashcard-session.tsx");
  const sliceGame = read("components/writing-slice-game.tsx");
  const typingStudio = read("components/typing-practice-studio.tsx");
  const celebration = read("components/game-result-celebration.tsx");
  const celebrationStyles = read("app/game-completion.css");
  const rootLayout = read("app/layout.tsx");

  assert.match(gameCenter, /<GameResultCelebration/);
  assert.match(flashcardSession, /<GameResultCelebration/);
  assert.doesNotMatch(sliceGame, /<GameResultCelebration/);
  assert.match(sliceGame, /Chém từ không giới hạn/);
  assert.match(sliceGame, /Ba từ liên tiếp đã chạm đất/);
  assert.match(typingStudio, /<GameResultCelebration/);
  assert.match(celebration, /himi-trophy-celebration\.gif/);
  assert.match(celebration, /himi-trophy-celebration\.webp/);
  assert.match(celebration, /celebration-fireworks\.gif/);
  assert.match(celebration, /celebration-fireworks\.webp/);
  assert.match(celebration, /correct-confetti\.gif/);
  assert.match(celebration, /requestAnimationFrame\(tick\)/);
  assert.match(celebration, /prefers-reduced-motion: reduce/);
  assert.match(celebrationStyles, /\.game-result-celebration__actions/);
  assert.match(celebrationStyles, /@media \(max-width: 700px\)/);
  assert.match(celebrationStyles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(rootLayout, /import "\.\/game-completion\.css"/);
  assert.equal(fs.statSync(path.join(root, "public/assets/games/results/celebration-fireworks.gif")).size > 0, true);
  assert.equal(fs.statSync(path.join(root, "public/assets/games/results/himi-trophy-celebration.gif")).size > 0, true);
  assert.doesNotMatch(gameCenter, /game-session-tip/);
  assert.doesNotMatch(flashcardSession, /game-session-tip/);
});
