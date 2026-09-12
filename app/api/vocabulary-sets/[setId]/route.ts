import { writeDb } from "@/db";
import { mutateVocabularySet, type SetMutation } from "@/lib/vocabulary-set-service";
import { setBody, setFailure, setJson, setUser } from "@/lib/vocabulary-set-api";
import { VocabularySetError } from "@/lib/vocabulary-sets";

type Context = { params: Promise<{ setId: string }> };
export async function PATCH(request: Request, context: Context) {
  try {
    const user = await setUser(request);
    const { setId } = await context.params;
    const body = await setBody(request);
    let mutation: SetMutation;
    if (body.action === "update" || body.action === "addWord") mutation = { action: body.action, data: body.data };
    else if (body.action === "removeWord" && typeof body.wordId === "string") mutation = { action: "removeWord", wordId: body.wordId };
    else throw new VocabularySetError("Thao tác không hợp lệ.");
    await writeDb((db) => mutateVocabularySet(db, user.id, setId, mutation));
    return setJson({ ok: true });
  } catch (error) { return setFailure(error); }
}
export async function DELETE(request: Request, context: Context) {
  try {
    const user = await setUser(request);
    const { setId } = await context.params;
    await writeDb((db) => mutateVocabularySet(db, user.id, setId, { action: "delete" }));
    return setJson({ ok: true });
  } catch (error) { return setFailure(error); }
}
