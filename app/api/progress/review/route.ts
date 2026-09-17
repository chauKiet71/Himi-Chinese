import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-session";
import { getSavedVocabularySlugs, recordVocabularyReview, setVocabularySaved } from "@/lib/progress-repository";
import { isSameOriginRequest } from "@/lib/request-security";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rawSlugs = new URL(request.url).searchParams.get("slugs") ?? "";
  const slugs = [...new Set(rawSlugs.split(",").filter(Boolean))];
  if (!slugs.length || slugs.length > 50 || slugs.some((slug) => slug.length > 180 || !slugPattern.test(slug))) {
    return NextResponse.json({ error: "Invalid vocabulary slugs" }, { status: 400 });
  }
  return NextResponse.json({ savedSlugs: await getSavedVocabularySlugs(user.id, slugs) });
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const data = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const updatesSavedState = typeof data.saved === "boolean";
  const recordsReview = typeof data.remembered === "boolean";
  if (typeof data.vocabularySlug !== "string" || data.vocabularySlug.length > 180
    || !slugPattern.test(data.vocabularySlug) || updatesSavedState === recordsReview) {
    return NextResponse.json({ error: "Invalid review" }, { status: 400 });
  }

  const recorded = updatesSavedState
    ? await setVocabularySaved(user.id, data.vocabularySlug, data.saved as boolean)
    : await recordVocabularyReview(user.id, data.vocabularySlug, data.remembered as boolean);
  return recorded
    ? NextResponse.json({ saved: updatesSavedState ? data.saved : true })
    : NextResponse.json({ error: "Vocabulary not found" }, { status: 404 });
}
