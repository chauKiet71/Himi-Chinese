import { writeDb } from "@/db";
import { createVocabularySet } from "@/lib/vocabulary-set-service";
import { setBody, setFailure, setJson, setUser } from "@/lib/vocabulary-set-api";

export async function POST(request: Request) {
  try {
    const user = await setUser(request);
    const data = await setBody(request);
    const set = await writeDb((db) => createVocabularySet(db, user.id, data, typeof data.sourceId === "string" ? data.sourceId : undefined));
    return setJson(set, 201);
  } catch (error) { return setFailure(error); }
}
