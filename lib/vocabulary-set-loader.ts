import "server-only";
import { notFound, redirect } from "next/navigation";
import { readDb } from "../db/index.ts";
import { getCurrentUser } from "./auth-session.ts";
import { getBuiltinSet, isSetId } from "./vocabulary-sets.ts";
import { readVocabularySet } from "./vocabulary-set-service.ts";
import { listSavedVocabulary } from "./saved-vocabulary-service.ts";

export async function loadVocabularySet(setId: string) {
  const builtin = getBuiltinSet(setId);
  if (builtin) return builtin;
  if (setId === "saved") {
    const user = await getCurrentUser();
    if (!user) redirect("/login?returnTo=%2Fvocabulary");
    const words = await readDb((db) => listSavedVocabulary(user.id, db));
    return {
      id: "saved",
      title: "Từ đã lưu",
      description: "Những từ bạn đã lưu trong lúc học HSK và Giao tiếp.",
      category: "Ôn tập",
      builtin: true,
      words: words.map(({ id, hanzi, pinyin, meaning, example, translation }) => ({ id, hanzi, pinyin, meaning, example, translation })),
    };
  }
  if (!isSetId(setId)) notFound();
  const user = await getCurrentUser();
  if (!user) redirect(`/login?returnTo=${encodeURIComponent(`/vocabulary/${setId}`)}`);
  const set = await readDb((db) => readVocabularySet(db, user.id, setId));
  if (!set) notFound();
  return set;
}
