import assert from "node:assert/strict";
import test from "node:test";

import { curatedYoutubeVideoTranscripts } from "../lib/youtube-video-transcripts.curated.ts";
import { chinesePodcastStationTranscripts } from "../lib/youtube-video-transcripts.station.ts";

const expectedTracks = {
  V6SrjHDisDs: 89,
  mrxzgms3E1g: 14,
  AOEWadftWHA: 15,
  uuUmhi2F0kc: 136,
  JHxgGKMVIJA: 90,
};

test("selected YouTube videos expose complete interactive learning tracks", () => {
  for (const [videoId, expectedCount] of Object.entries(expectedTracks)) {
    const transcript = curatedYoutubeVideoTranscripts[videoId];
    assert.equal(transcript.length, expectedCount, `${videoId} should keep its reviewed sentence count`);

    for (const [index, line] of transcript.entries()) {
      assert.ok(line.hanzi.trim(), `${videoId} line ${index + 1} needs Hanzi`);
      assert.ok(line.pinyin.trim(), `${videoId} line ${index + 1} needs pinyin`);
      assert.ok(line.translation.trim(), `${videoId} line ${index + 1} needs Vietnamese`);
      assert.ok(line.endMs > line.startMs, `${videoId} line ${index + 1} needs a valid time range`);
      if (index > 0) {
        assert.ok(line.startMs >= transcript[index - 1].startMs, `${videoId} transcript must stay chronological`);
      }
    }
  }
});

const stationTracks = {
  "6OKFy2kXDWs": 276,
  scY9K3CiEuA: 245,
  "aw_zlJW-m7M": 182,
  "p-3OMg77tck": 246,
  "8AZC3H8SKYk": 216,
  FLMT4JUmL48: 191,
  qvJxQNMvCRI: 225,
  qDrZvAVH578: 221,
  "p94YQNreY_8": 218,
  "f-THLbSEZ4Y": 224,
  e8ax9jveH2I: 192,
  IFoC72QyzEM: 221,
  "kKmkCTy-x2w": 193,
  "4lHwBZr66so": 199,
};

test("all newly added Chinese Podcast Station videos have synchronized learning tracks", () => {
  for (const [videoId, expectedCount] of Object.entries(stationTracks)) {
    const transcript = chinesePodcastStationTranscripts[videoId];
    assert.equal(transcript.length, expectedCount, `${videoId} should expose every official caption line`);

    for (const [index, line] of transcript.entries()) {
      assert.ok(line.hanzi.trim(), `${videoId} line ${index + 1} needs Chinese text`);
      assert.ok(line.pinyin.trim(), `${videoId} line ${index + 1} needs pinyin`);
      assert.ok(line.translation.trim(), `${videoId} line ${index + 1} needs Vietnamese`);
      assert.ok(line.keyword.trim(), `${videoId} line ${index + 1} needs a practice keyword`);
      assert.ok(line.endMs > line.startMs, `${videoId} line ${index + 1} needs a valid time range`);
      assert.equal(line.sceneStartMs, line.startMs, `${videoId} line ${index + 1} should replay from its cue start`);
      assert.equal(line.sceneEndMs, line.endMs, `${videoId} line ${index + 1} should replay to its cue end`);
      if (index > 0) {
        assert.ok(line.startMs >= transcript[index - 1].startMs, `${videoId} transcript must stay chronological`);
      }
    }
  }
});
