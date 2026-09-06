import assert from "node:assert/strict";
import test from "node:test";
import { createHskGameRound, HSK_GAME_ROUND_SIZE, hskMeaningOptions, shuffleGameItems } from "../lib/hsk-game-round.ts";
import { SLICE_HSK_COURSES } from "../lib/slice-game.ts";
import { getSliceHskVocabulary } from "../lib/slice-hsk-vocabulary.ts";

test("all six games can start and replay with vocabulary from every HSK level", () => {
  for (const course of SLICE_HSK_COURSES) {
    const vocabulary = getSliceHskVocabulary(course.id);
    const sourceIds = new Set(vocabulary.map((word) => word.id));
    for (const [gameId, count] of Object.entries(HSK_GAME_ROUND_SIZE)) {
      const first = createHskGameRound(vocabulary, gameId, [], () => 0.25);
      const replay = createHskGameRound(vocabulary, gameId, first, () => 0.75);
      for (const round of [first, replay]) {
        assert.equal(round.length, count, `${course.label}: ${gameId}`);
        assert.ok(round.every((word) => sourceIds.has(word.id)));
        for (const field of ["hanzi", "pinyin", "meaning"]) {
          assert.equal(new Set(round.map((word) => word[field].normalize("NFC").toLowerCase().replace(/\s+/gu, ""))).size, count);
        }
        if (gameId === "listen" || gameId === "quiz") {
          round.forEach((word, index) => {
            const options = hskMeaningOptions(round, index, () => 0.4);
            assert.equal(options.length, 4);
            assert.equal(new Set(options).size, 4);
            assert.equal(options.filter((option) => option === word.meaning).length, 1);
            assert.ok(options.every((option) => round.some((candidate) => candidate.meaning === option)));
          });
        }
      }
      assert.ok(replay.every((word) => !first.some((previous) => previous.id === word.id)));
    }
  }
});

test("ambiguous homophones, duplicate Hanzi and duplicate meanings do not create impossible matching rounds", () => {
  const base = getSliceHskVocabulary("hsk-1").slice(0, 30);
  const candidates = [...base, ...base.map((word) => ({ ...word, id: `${word.id}-duplicate` }))];
  const before = structuredClone(candidates);
  const round = createHskGameRound(candidates, "connect", [], () => 0.5);
  assert.equal(new Set(round.map((word) => word.hanzi)).size, 5);
  assert.equal(new Set(round.map((word) => word.pinyin)).size, 5);
  assert.deepEqual(candidates, before);
  assert.throws(() => createHskGameRound([base[0]], "memory"), /chưa đủ/);
});

test("shuffling cards keeps every card once and leaves the source untouched", () => {
  const cards = ["a-hanzi", "a-meaning", "b-hanzi", "b-meaning"];
  const first = shuffleGameItems(cards, () => 0);
  const second = shuffleGameItems(cards, () => 0.99);
  assert.deepEqual(new Set(first), new Set(cards));
  assert.notDeepEqual(first, second);
  assert.deepEqual(cards, ["a-hanzi", "a-meaning", "b-hanzi", "b-meaning"]);
});
