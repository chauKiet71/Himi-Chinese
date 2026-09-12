import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-session";
import { isSameOriginRequest } from "@/lib/request-security";
import { removeSavedVocabulary, saveLearningVocabulary, SavedVocabularyError } from "@/lib/saved-vocabulary-service";

export async function DELETE(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid body" }, { status: 400 }); }
  try {
    await removeSavedVocabulary(user.id, body);
    return NextResponse.json({ saved: false });
  } catch (error) {
    if (error instanceof SavedVocabularyError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Chưa thể bỏ lưu. Vui lòng thử lại." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid body" }, { status: 400 }); }
  try {
    await saveLearningVocabulary(user.id, body);
    return NextResponse.json({ saved: true });
  } catch (error) {
    if (error instanceof SavedVocabularyError) return NextResponse.json({ error: error.message }, { status: error.status });
    throw error;
  }
}
