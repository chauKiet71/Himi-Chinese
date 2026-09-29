from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BUNDLE = ROOT / "content" / "hsk1-3-textbook-review"


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> None:
    manifest = load(BUNDLE / "manifest.json")
    curriculum = load(BUNDLE / "curriculum.json")
    source = load(BUNDLE / "source-analysis.json")
    grammar = load(BUNDLE / "shared" / "grammar-points.json")
    lexemes = load(BUNDLE / "shared" / "lexeme-candidates.json")
    raw_ocr = load(BUNDLE / "raw-ocr" / "pages.json")

    errors: list[str] = []
    lessons = []
    for number in range(1, 16):
        path = BUNDLE / "lessons" / f"lesson-{number:02d}.json"
        if not path.exists():
            errors.append(f"missing {path.relative_to(ROOT)}")
            continue
        lesson = load(path)
        lessons.append(lesson)
        if lesson.get("metadata", {}).get("lessonNumber") != number:
            errors.append(f"lesson-{number:02d}: wrong lessonNumber")
        start, end = lesson.get("source", {}).get("pdfPages", [0, -1])
        if start > end:
            errors.append(f"lesson-{number:02d}: invalid page range")
        if not lesson.get("contentBlocks"):
            errors.append(f"lesson-{number:02d}: no content blocks")

    if len(curriculum.get("lessons", [])) != 15:
        errors.append("curriculum must contain 15 lessons")
    if len(raw_ocr.get("pages", [])) != 144:
        errors.append("raw OCR must contain 144 pages")
    if source.get("source", {}).get("pdfPages") != 144:
        errors.append("source page count must be 144")
    if manifest.get("status") != "review":
        errors.append("manifest status must be review")

    grammar_ids = {item["id"] for item in grammar.get("items", [])}
    lexeme_ids = {item["id"] for item in lexemes.get("items", [])}
    for lesson in lessons:
        for ref in lesson.get("grammarPointRefs", []):
            if ref not in grammar_ids:
                errors.append(f"unresolved grammar ref {ref}")
        for ref in lesson.get("lexemeCandidateRefs", []):
            if ref not in lexeme_ids:
                errors.append(f"unresolved lexeme ref {ref}")

    output = {
        "bundle": BUNDLE.relative_to(ROOT).as_posix(),
        "lessons": len(lessons),
        "grammarPoints": len(grammar_ids),
        "lexemeCandidates": len(lexeme_ids),
        "ocrPages": len(raw_ocr.get("pages", [])),
        "errors": errors,
    }
    print(json.dumps(output, ensure_ascii=False, indent=2))
    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
