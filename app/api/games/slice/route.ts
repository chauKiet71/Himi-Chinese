import { isSliceHskLevel } from "@/lib/slice-game";
import { getSliceHskVocabulary } from "@/lib/slice-hsk-vocabulary";

export function GET(request: Request) {
  const level = new URL(request.url).searchParams.get("level");
  if (!isSliceHskLevel(level)) {
    return Response.json({ error: "Vui lòng chọn khóa HSK1 đến HSK6." }, { status: 400 });
  }
  return Response.json({ level, words: getSliceHskVocabulary(level) });
}
