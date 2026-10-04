import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const read = (file) => readFileSync(resolve(process.cwd(), file), "utf8");

test("course, listening, and video catalogs share the wide desktop frame", () => {
  const [coursesPage, courseSkeleton, courseStyles, listeningStudio, listeningStyles, videoLibrary, videoStyles] = [
    "app/courses/page.tsx",
    "components/course-catalog-skeleton.tsx",
    "app/hsk-curriculum.css",
    "components/listening-catalog-studio.tsx",
    "app/listening-studio.css",
    "components/video-library.tsx",
    "app/video-learning.css",
  ].map(read);

  assert.match(coursesPage, /view === "catalog" \? "learner-full-width-catalog"/);
  assert.match(courseSkeleton, /learner-full-width-catalog/);
  assert.match(listeningStudio, /listening-catalog-studio learner-full-width-catalog/);
  assert.match(videoLibrary, /video-library-page learner-full-width-catalog/);

  for (const styles of [courseStyles, listeningStyles, videoStyles]) {
    assert.match(styles, /@media \(min-width: 1121px\)/);
    assert.match(styles, /width: min\(1480px, calc\(100% - 40px\)\);/);
  }

  assert.match(listeningStyles, /learner-full-width-catalog:not\(\.listening-catalog-detail-page\) \{[\s\S]*?padding-inline: 0;/);
});
