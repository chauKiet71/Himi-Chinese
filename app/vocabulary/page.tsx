import type { Metadata } from "next";
import { readDb } from "@/db";
import { getCurrentUser } from "@/lib/auth-session";
import { builtinVocabularySets } from "@/lib/vocabulary-sets";
import { listMyVocabularySets } from "@/lib/vocabulary-set-service";
import { listSavedVocabulary } from "@/lib/saved-vocabulary-service";
import type { SavedVocabulary } from "@/lib/content-types";
import { VocabularySetLibrary, type SetSummary } from "@/components/vocabulary-set-library";

export const metadata: Metadata = { title: "Bộ từ vựng", description: "Xem lại từ đã lưu, tạo bộ cá nhân và học từ vựng, chữ Hán, flashcard." };
export default async function VocabularyPage() {
  const user = await getCurrentUser();
  let mine: SetSummary[] = [];
  let savedWords: SavedVocabulary[] = [];
  let mineLoadError = false;
  let savedLoadError = false;
  if (user) {
    const [mineResult, savedResult] = await Promise.allSettled([
      readDb((db) => listMyVocabularySets(db, user.id), { reportFailure: false }),
      readDb((db) => listSavedVocabulary(user.id, db), { reportFailure: false }),
    ]);
    if (mineResult.status === "fulfilled") mine = mineResult.value; else mineLoadError = true;
    if (savedResult.status === "fulfilled") savedWords = savedResult.value; else savedLoadError = true;
  }
  return <VocabularySetLibrary authenticated={Boolean(user)} mine={mine} savedWords={savedWords} mineLoadError={mineLoadError} savedLoadError={savedLoadError} builtins={builtinVocabularySets.map(({ words, ...set }) => ({ ...set, wordCount: words.length }))} />;
}
