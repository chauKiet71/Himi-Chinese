from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

try:
    from pypinyin import Style, lazy_pinyin
except ImportError:  # Keep the review generator usable without optional enrichment.
    Style = None
    lazy_pinyin = None


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_PDF = ROOT / "tmp" / "pdfs" / "hsk1-3.0.pdf"
DEFAULT_OCR = ROOT / "tmp" / "pdfs" / "hsk1-3-analysis" / "ocr"
DEFAULT_OUTPUT = ROOT / "content" / "hsk1-3-textbook-review"

WATERMARK_MARKERS = (
    "SCANED BY TIENG TRUNG HANU",
    "SCANNED BY TIENG TRUNG HANU",
    "新HSK教程1",
    "NEWHSKCOURSE1",
)

SECTION_MARKERS: list[tuple[str, tuple[str, ...]]] = [
    ("objectives", ("目标", "OBJECTIVES")),
    ("warmup", ("热身", "WARM-UP", "WARMUP")),
    ("dialogue", ("课文", "TEXT")),
    ("vocabulary", ("生词", "NEW WORDS", "NEWWORDS")),
    ("grammar", ("小语讲堂", "XIAOYU'S CLASSROOM", "XIAOYUS CLASSROOM")),
    ("pronunciation", ("跟读绕口令", "SHADOW THE TONGUE TWISTER")),
    ("practice", ("综合练习", "COMPREHENSIVE EXERCISES")),
    ("classroom-activity", ("课堂活动", "CLASSROOM ACTIVITY")),
    ("bonus-content", ("小语的彩蛋", "XIAOYU'S BONUS CONTENT")),
    ("culture", ("文化", "CULTURE")),
]

NEXT_SECTION_MARKERS = tuple(
    marker.upper().replace(" ", "")
    for _, markers in SECTION_MARKERS
    for marker in markers
)

CJK_RE = re.compile(r"[\u3400-\u4dbf\u4e00-\u9fff]")
PURE_PRINTED_PAGE_RE = re.compile(r"^\d{3}$")
TRACK_RE = re.compile(r"(?<!\d)(\d{1,2}-\d{1,2})(?!\d)")
VOCAB_STOP_MARKERS = (
    "分角色朗读",
    "根据课文内容",
    "两人一组",
    "综合练习",
    "课堂活动",
    "小语讲堂",
    "跟读绕口令",
    "ROLE-PLAY",
    "WORKINPAIRS",
    "ANSWERTHEQUESTIONS",
)


@dataclass(frozen=True)
class LessonSpec:
    number: int
    title_zh: str
    title_en: str
    title_vi: str
    printed_start: int
    printed_end: int
    grammar: tuple[tuple[str, str, str], ...]
    objectives_vi: tuple[str, ...]

    @property
    def pdf_start(self) -> int:
        return self.printed_start + 15

    @property
    def pdf_end(self) -> int:
        return self.printed_end + 15


LESSONS: tuple[LessonSpec, ...] = (
    LessonSpec(1, "AI小语，你好！", "Hello, AI Xiaoyu!", "Xin chào AI Tiểu Ngữ!", 1, 4, (), (
        "Hiểu và sử dụng lời chào, lời cảm ơn và lời tạm biệt lịch sự.",
        "Nhận biết phép lịch sự giao tiếp và đại từ kính ngữ 您.",
    )),
    LessonSpec(2, "我叫李文", "My name is Li Wen", "Tôi tên là Lý Văn", 5, 9, (
        ("汉语的基本语序", "Basic Word Order in Chinese", "Trật tự từ cơ bản trong tiếng Trung"),
    ), (
        "Giới thiệu bản thân bằng tên tiếng Trung.",
        "Sử dụng 对不起 và 没关系 để xin lỗi và đáp lời.",
        "Nắm trật tự từ cơ bản trong câu tiếng Trung.",
    )),
    LessonSpec(3, "我是中国人", "I'm Chinese", "Tôi là người Trung Quốc", 10, 17, (
        ("“是”字句", "The 是 Sentence", "Câu chữ 是"),
        ("结构助词“的”", "Structural Particle 的", "Trợ từ kết cấu 的"),
        ("用“吗”的是非问句", "Yes-No Question with 吗", "Câu hỏi đúng-sai với 吗"),
    ), (
        "Nói về quốc tịch và quan hệ sở hữu.",
        "Dùng 是, 的 và 吗 trong các mẫu câu cơ bản.",
    )),
    LessonSpec(4, "我有两个孩子", "I have two children", "Tôi có hai người con", 18, 26, (
        ("“有”字句（1）", "The 有 Sentence (1)", "Câu chữ 有 (1)"),
        ("数字的表达", "Expression of Numbers", "Cách biểu đạt số đếm"),
        ("语气助词“呢”（1）", "Modal Particle 呢 (1)", "Trợ từ ngữ khí 呢 (1)"),
        ("名量词和名量结构", "Nominal Measure Words", "Lượng từ danh từ và kết cấu số-lượng-danh"),
    ), (
        "Nói về thành viên gia đình, số lượng và tuổi.",
        "Sử dụng 有, số đếm, lượng từ và 呢.",
    )),
    LessonSpec(5, "今天我休息", "I'm off today", "Hôm nay tôi nghỉ", 27, 34, (
        ("时间的表达（1）", "Expression of Time (1)", "Cách biểu đạt thời gian (1)"),
        ("名词谓语句", "Nominal-Predicate Sentences", "Câu vị ngữ danh từ"),
        ("能愿动词“会”", "Modal Verb 会", "Động từ năng nguyện 会"),
    ), (
        "Nói về ngày tháng, lịch nghỉ và khả năng.",
        "Dùng câu vị ngữ danh từ và động từ năng nguyện 会.",
    )),
    LessonSpec(6, "你的手机号码是多少？", "What's your cell phone number?", "Số điện thoại của bạn là bao nhiêu?", 35, 44, (
        ("能愿动词“想”", "Modal Verb 想", "Động từ năng nguyện 想"),
        ("连动句（1）", "Serial Verb Sentences (1)", "Câu liên động (1)"),
        ("疑问代词“怎么”", "Interrogative Pronoun 怎么", "Đại từ nghi vấn 怎么"),
    ), (
        "Hỏi và cung cấp số điện thoại.",
        "Dùng 想, câu liên động và đại từ nghi vấn 怎么.",
    )),
    LessonSpec(7, "我晚上六点半下班", "I'll finish work at 6:30 in the evening", "Tôi tan làm lúc 6 giờ 30 tối", 45, 53, (
        ("时间的表达（2）", "Expression of Time (2)", "Cách biểu đạt thời gian (2)"),
        ("语气助词“吧”（1）", "Modal Particle 吧 (1)", "Trợ từ ngữ khí 吧 (1)"),
        ("副词、时间词语作状语的位置", "Position of Adverbs and Time Expressions as Adverbials", "Vị trí của phó từ và từ ngữ thời gian làm trạng ngữ"),
        ("语气助词“呢”（2）", "Modal Particle 呢 (2)", "Trợ từ ngữ khí 呢 (2)"),
    ), (
        "Nghe và nói về thời điểm xảy ra sự việc.",
        "Dùng 吧, 呢 và trạng ngữ thời gian đúng vị trí.",
    )),
    LessonSpec(8, "我爸爸也在医院工作", "My father also works at a hospital", "Bố tôi cũng làm việc tại bệnh viện", 54, 60, (
        ("方位词", "Positional Words", "Từ chỉ phương vị"),
        ("介词“在”", "Preposition 在", "Giới từ 在"),
        ("能愿动词“能”", "Modal Verb 能", "Động từ năng nguyện 能"),
    ), (
        "Nói về nơi làm việc và vị trí.",
        "Dùng từ phương vị, giới từ 在 và động từ năng nguyện 能.",
    )),
    LessonSpec(9, "我明天上午在学校学习", "I'll be studying at school tomorrow morning", "Sáng mai tôi học ở trường", 61, 69, (
        ("存现句（1）", "Existential Sentences (1)", "Câu tồn hiện (1)"),
        ("时间词语和处所词语同时作状语的顺序", "Sequence of Time and Location Expressions", "Thứ tự trạng ngữ thời gian và nơi chốn"),
        ("表示序数的“第”", "Indicating Ordinal Numbers", "Biểu thị số thứ tự bằng 第"),
    ), (
        "Nói về kế hoạch học tập theo thời gian và địa điểm.",
        "Dùng câu tồn hiện, trạng ngữ thời gian-nơi chốn và 第.",
    )),
    LessonSpec(10, "这儿的苹果真便宜！", "The apples here are really affordable!", "Táo ở đây thật rẻ!", 70, 77, (
        ("钱数的表达", "Expression of Amount of Money", "Cách biểu đạt số tiền"),
        ("形容词谓语句", "Adjectival-Predicate Sentences", "Câu vị ngữ tính từ"),
        ("疑问代词“怎么样”", "Interrogative Pronoun 怎么样", "Đại từ nghi vấn 怎么样"),
    ), (
        "Hỏi giá, nói số tiền và mô tả hàng hóa.",
        "Dùng câu vị ngữ tính từ và 怎么样.",
    )),
    LessonSpec(11, "我读大学呢", "I'm studying at university", "Tôi đang học đại học", 78, 85, (
        ("正反问", "Affirmative-Negative Questions", "Câu hỏi chính-phản"),
        ("时间副词“在/正在”", "Temporal Adverbs 在/正在", "Phó từ thời gian 在/正在"),
        ("能愿动词“要”", "Modal Verb 要", "Động từ năng nguyện 要"),
    ), (
        "Nói về việc học và hành động đang diễn ra.",
        "Dùng câu hỏi chính-phản, 在/正在 và 要.",
    )),
    LessonSpec(12, "昨天下雪了", "It snowed yesterday", "Hôm qua có tuyết rơi", 86, 94, (
        ("非主谓句", "Non-Subject-Predicate Sentences", "Câu phi chủ-vị"),
        ("语气助词“了”（1）", "Modal Particle 了 (1)", "Trợ từ ngữ khí 了 (1)"),
        ("“太……了”格式", "The 太……了 Pattern", "Cấu trúc 太……了"),
    ), (
        "Mô tả thời tiết và sự thay đổi tình trạng.",
        "Dùng câu phi chủ-vị, 了 và cấu trúc 太……了.",
    )),
    LessonSpec(13, "请给我一杯茶", "I'll have a cup of tea, please", "Vui lòng cho tôi một cốc trà", 95, 102, (
        ("能愿动词“可以”", "Modal Verb 可以", "Động từ năng nguyện 可以"),
        ("“动词+一下”结构", "Verb + 一下 Structure", "Cấu trúc động từ + 一下"),
        ("双宾语句（1）", "Double-Object Sentences (1)", "Câu hai tân ngữ (1)"),
    ), (
        "Gọi đồ uống và đưa ra yêu cầu lịch sự.",
        "Dùng 可以, động từ + 一下 và câu hai tân ngữ.",
    )),
    LessonSpec(14, "我看了一个电影", "I watched a movie", "Tôi đã xem một bộ phim", 103, 111, (
        ("动态助词“了”（2）", "Aspect Particle 了 (2)", "Trợ từ động thái 了 (2)"),
        ("离合词（1）", "Separable Words (1)", "Từ ly hợp (1)"),
        ("范围副词“都”", "Scope Adverb 都", "Phó từ phạm vi 都"),
    ), (
        "Kể về hành động đã xảy ra hoặc đã hoàn thành.",
        "Dùng 了, từ ly hợp và phó từ phạm vi 都.",
    )),
    LessonSpec(15, "大兴机场见！", "See you at Daxing Airport!", "Hẹn gặp ở sân bay Đại Hưng!", 112, 121, (
        ("并列复句“……，还/也……”", "Coordinate Compound Sentence with 还/也", "Câu phức đẳng lập với 还/也"),
    ), (
        "Trao đổi kế hoạch đi lại và điểm hẹn.",
        "Dùng câu phức đẳng lập với 还 hoặc 也.",
    )),
)


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def normalized(text: str) -> str:
    return re.sub(r"\s+", "", text).upper()


def is_noise(text: str) -> bool:
    stripped = text.strip()
    if not stripped or PURE_PRINTED_PAGE_RE.fullmatch(stripped):
        return True
    upper = normalized(stripped)
    return any(marker in upper for marker in WATERMARK_MARKERS)


def classify_language(text: str) -> str:
    has_cjk = bool(CJK_RE.search(text))
    has_latin = bool(re.search(r"[A-Za-zÀ-ỹ]", text))
    if has_cjk and has_latin:
        return "mixed"
    if has_cjk:
        return "zh"
    if has_latin:
        return "latin"
    return "other"


def line_center_y(line: dict[str, Any]) -> float:
    return sum(point[1] for point in line["box"]) / len(line["box"])


def line_left_x(line: dict[str, Any]) -> float:
    return min(point[0] for point in line["box"])


def load_ocr_pages(ocr_dir: Path) -> dict[int, dict[str, Any]]:
    pages: dict[int, dict[str, Any]] = {}
    for path in sorted(ocr_dir.glob("page-*.json")):
        page = json.loads(path.read_text(encoding="utf-8"))
        page_number = int(page["page"])
        clean_lines = []
        for source_line in page.get("lines", []):
            text = str(source_line.get("text", "")).strip()
            if is_noise(text):
                continue
            clean_lines.append({
                "text": text,
                "confidence": round(float(source_line.get("confidence", 0.0)), 4),
                "box": source_line.get("box", []),
                "language": classify_language(text),
            })
        clean_lines.sort(key=lambda line: (round(line_center_y(line) / 8), line_left_x(line)))
        pages[page_number] = {
            "pdfPage": page_number,
            "image": page.get("image"),
            "imageWidth": page.get("imageWidth"),
            "imageHeight": page.get("imageHeight"),
            "averageConfidence": round(
                sum(line["confidence"] for line in clean_lines) / max(1, len(clean_lines)), 4
            ),
            "lines": clean_lines,
        }
    return pages


def section_type(text: str) -> str | None:
    value = normalized(text)
    if len(value) > 80:
        return None
    for kind, markers in SECTION_MARKERS:
        if any(normalized(marker) in value for marker in markers):
            return kind
    return None


def build_blocks(spec: LessonSpec, pages: dict[int, dict[str, Any]]) -> list[dict[str, Any]]:
    blocks: list[dict[str, Any]] = []
    current: dict[str, Any] | None = None
    sequence = 0
    for page_number in range(spec.pdf_start, spec.pdf_end + 1):
        page = pages[page_number]
        for line in page["lines"]:
            kind = section_type(line["text"])
            if kind:
                sequence += 1
                current = {
                    "id": f"hsk1-3-l{spec.number:02d}-block-{sequence:02d}",
                    "type": kind,
                    "headingOcr": line["text"],
                    "sourcePdfPages": [page_number],
                    "rawLines": [],
                    "reviewStatus": "ocr-review-required",
                }
                blocks.append(current)
                continue
            if current is None:
                sequence += 1
                current = {
                    "id": f"hsk1-3-l{spec.number:02d}-block-{sequence:02d}",
                    "type": "unclassified",
                    "headingOcr": None,
                    "sourcePdfPages": [page_number],
                    "rawLines": [],
                    "reviewStatus": "ocr-review-required",
                }
                blocks.append(current)
            if page_number not in current["sourcePdfPages"]:
                current["sourcePdfPages"].append(page_number)
            current["rawLines"].append({
                "pdfPage": page_number,
                "text": line["text"],
                "confidence": line["confidence"],
                "language": line["language"],
            })
    return [block for block in blocks if block["headingOcr"] or block["rawLines"]]


def group_rows(lines: list[dict[str, Any]], tolerance: float = 10.0) -> list[list[dict[str, Any]]]:
    rows: list[list[dict[str, Any]]] = []
    for line in sorted(lines, key=lambda item: (line_center_y(item), line_left_x(item))):
        center = line_center_y(line)
        if not rows:
            rows.append([line])
            continue
        previous_center = sum(line_center_y(item) for item in rows[-1]) / len(rows[-1])
        if abs(center - previous_center) <= tolerance:
            rows[-1].append(line)
        else:
            rows.append([line])
    for row in rows:
        row.sort(key=line_left_x)
    return rows


def extract_lexeme_candidates(spec: LessonSpec, pages: dict[int, dict[str, Any]]) -> list[dict[str, Any]]:
    candidates: list[dict[str, Any]] = []
    seen: set[tuple[int, str]] = set()
    for page_number in range(spec.pdf_start, spec.pdf_end + 1):
        lines = pages[page_number]["lines"]
        vocab_y = [line_center_y(line) for line in lines if section_type(line["text"]) == "vocabulary"]
        if not vocab_y:
            continue
        start_y = min(vocab_y)
        stop_y = min(
            (
                line_center_y(line)
                for line in lines
                if line_center_y(line) > start_y + 24
                and (
                    section_type(line["text"]) not in (None, "vocabulary")
                    or any(marker in normalized(line["text"]) for marker in VOCAB_STOP_MARKERS)
                )
            ),
            default=float("inf"),
        )
        table_lines = [
            line for line in lines
            if start_y + 18 <= line_center_y(line) < stop_y
            and "Proper Noun" not in line["text"]
            and "专有名词" not in line["text"]
        ]
        for row in group_rows(table_lines):
            raw = " | ".join(line["text"] for line in row)
            cjk_chunks = re.findall(r"[\u3400-\u4dbf\u4e00-\u9fff]{1,10}", raw)
            if not cjk_chunks:
                continue
            hanzi = max(cjk_chunks, key=len)
            if len(hanzi) > 8 or hanzi in {"生词", "课文", "小语讲堂", "综合练习", "课堂活动"}:
                continue
            key = (page_number, hanzi)
            if key in seen:
                continue
            seen.add(key)
            latin_chunks = [
                line["text"].strip()
                for line in row
                if not CJK_RE.search(line["text"]) and re.search(r"[A-Za-zÀ-ỹ]", line["text"])
            ]
            candidates.append({
                "id": f"hsk1-3-l{spec.number:02d}-lex-candidate-{len(candidates)+1:03d}",
                "lessonNumber": spec.number,
                "hanziCandidate": hanzi,
                "pinyinGenerated": (
                    " ".join(lazy_pinyin(hanzi, style=Style.TONE, neutral_tone_with_five=False))
                    if lazy_pinyin is not None and Style is not None
                    else None
                ),
                "pinyinProvenance": "generated-from-hanzi-needs-review",
                "latinCandidates": latin_chunks,
                "rawRow": raw,
                "sourcePdfPage": page_number,
                "averageConfidence": round(sum(line["confidence"] for line in row) / len(row), 4),
                "reviewStatus": "candidate-needs-language-review",
            })
    return candidates


def collect_tracks(spec: LessonSpec, pages: dict[int, dict[str, Any]]) -> list[str]:
    tracks = set()
    for page_number in range(spec.pdf_start, spec.pdf_end + 1):
        for line in pages[page_number]["lines"]:
            tracks.update(TRACK_RE.findall(line["text"]))
    return sorted(tracks, key=lambda value: tuple(int(part) for part in value.split("-")))


def build_bundle(pdf_path: Path, ocr_dir: Path, output_dir: Path) -> None:
    pages = load_ocr_pages(ocr_dir)
    missing = sorted(set(range(1, 145)) - set(pages))
    if missing:
        raise ValueError(f"Missing OCR pages: {missing}")

    if output_dir.exists():
        shutil.rmtree(output_dir)
    output_dir.mkdir(parents=True)
    generated_at = datetime.now(timezone.utc).isoformat()

    all_candidates: list[dict[str, Any]] = []
    all_grammar: list[dict[str, Any]] = []
    lesson_files: list[dict[str, Any]] = []
    curriculum_lessons: list[dict[str, Any]] = []

    for spec in LESSONS:
        blocks = build_blocks(spec, pages)
        lexeme_candidates = extract_lexeme_candidates(spec, pages)
        all_candidates.extend(lexeme_candidates)
        grammar_refs = []
        for index, (title_zh, title_en, title_vi) in enumerate(spec.grammar, start=1):
            grammar_id = f"hsk1-3-l{spec.number:02d}-grammar-{index:02d}"
            grammar_refs.append(grammar_id)
            all_grammar.append({
                "id": grammar_id,
                "lessonNumber": spec.number,
                "titleZh": title_zh,
                "titleEn": title_en,
                "titleVi": title_vi,
                "source": {
                    "provenance": "verified-from-table-of-contents",
                    "tocPdfPages": [12, 13, 14],
                },
                "reviewStatus": "title-verified-explanation-not-yet-editorially-reviewed",
            })

        lesson = {
            "schemaVersion": "0.1.0-review",
            "id": f"hsk1-3-lesson-{spec.number:02d}",
            "status": "review",
            "metadata": {
                "lessonNumber": spec.number,
                "titleZh": spec.title_zh,
                "titleEn": spec.title_en,
                "titleVi": spec.title_vi,
                "course": "New HSK Course 1 (HSK 3.0)",
                "skills": ["listening", "speaking", "reading"],
            },
            "source": {
                "printedPages": [spec.printed_start, spec.printed_end],
                "pdfPages": [spec.pdf_start, spec.pdf_end],
                "ocrMethod": "rapidocr-onnxruntime",
            },
            "objectivesVi": list(spec.objectives_vi),
            "grammarPointRefs": grammar_refs,
            "audioTrackRefs": collect_tracks(spec, pages),
            "lexemeCandidateRefs": [candidate["id"] for candidate in lexeme_candidates],
            "contentBlocks": blocks,
            "editorial": {
                "structureReview": "generated-needs-review",
                "hanziReview": "ocr-review-required",
                "pinyinReview": "required",
                "translationViReview": "required",
                "mediaStatus": "track-ids-only-source-media-not-in-pdf",
            },
        }
        lesson_path = output_dir / "lessons" / f"lesson-{spec.number:02d}.json"
        write_json(lesson_path, lesson)
        lesson_files.append({"path": lesson_path.relative_to(output_dir).as_posix(), "kind": "lesson", "lessonNumber": spec.number})
        curriculum_lessons.append({
            "lessonNumber": spec.number,
            "lessonRef": lesson["id"],
            "titleZh": spec.title_zh,
            "titleEn": spec.title_en,
            "titleVi": spec.title_vi,
            "printedPages": [spec.printed_start, spec.printed_end],
            "pdfPages": [spec.pdf_start, spec.pdf_end],
            "grammarPointRefs": grammar_refs,
        })

    raw_pages = []
    for page_number, page in sorted(pages.items()):
        raw_pages.append({
            "pdfPage": page_number,
            "averageConfidence": page["averageConfidence"],
            "lineCount": len(page["lines"]),
            "lines": [
                {"text": line["text"], "confidence": line["confidence"], "box": line["box"]}
                for line in page["lines"]
            ],
        })

    write_json(output_dir / "shared" / "grammar-points.json", {
        "schemaVersion": "0.1.0-review",
        "items": all_grammar,
    })
    write_json(output_dir / "shared" / "lexeme-candidates.json", {
        "schemaVersion": "0.1.0-review",
        "noteVi": "Danh sách ứng viên trích từ bảng từ mới bằng OCR; chưa được coi là từ vựng đã duyệt.",
        "items": all_candidates,
    })
    write_json(output_dir / "raw-ocr" / "pages.json", {
        "schemaVersion": "0.1.0-review",
        "pages": raw_pages,
    })
    write_json(output_dir / "curriculum.json", {
        "schemaVersion": "0.1.0-review",
        "id": "hsk1-3-new-course-1-review",
        "titleZh": "新HSK教程1",
        "titleEn": "New HSK Course 1",
        "titleVi": "Giáo trình HSK mới 1 (HSK 3.0)",
        "status": "review",
        "lessons": curriculum_lessons,
    })
    write_json(output_dir / "source-analysis.json", {
        "schemaVersion": "0.1.0-review",
        "source": {
            "fileName": pdf_path.name,
            "sha256": sha256(pdf_path),
            "fileSizeBytes": pdf_path.stat().st_size,
            "pdfPages": 144,
            "printedContentPages": [1, 128],
            "publisher": "Foreign Language Teaching and Research Press",
            "publicationYear": 2026,
            "isbn": "978-7-5213-6774-4",
        },
        "extraction": {
            "method": ["poppler-render", "rapidocr-onnxruntime", "programmatic-section-segmentation"],
            "ocrPages": len(pages),
            "ocrLines": sum(len(page["lines"]) for page in pages.values()),
            "averageOcrConfidence": round(
                sum(line["confidence"] for page in pages.values() for line in page["lines"])
                / max(1, sum(len(page["lines"]) for page in pages.values())),
                4,
            ),
            "knownWeakFields": [
                "pinyin tone marks",
                "multi-column reading order",
                "word-table column association",
                "small part-of-speech labels",
                "illustration text",
            ],
        },
        "rights": {
            "status": "permission-not-verified",
            "noteVi": "Bundle review không xác nhận quyền tái phân phối nội dung, hình ảnh hoặc tài nguyên số của sách.",
        },
        "generatedAt": generated_at,
    })

    files = [
        {"path": "README.md", "kind": "documentation"},
        {"path": "source-analysis.json", "kind": "source-analysis"},
        {"path": "curriculum.json", "kind": "curriculum"},
        {"path": "shared/grammar-points.json", "kind": "shared-content"},
        {"path": "shared/lexeme-candidates.json", "kind": "shared-content-review"},
        {"path": "raw-ocr/pages.json", "kind": "raw-ocr"},
        *lesson_files,
    ]
    write_json(output_dir / "manifest.json", {
        "schemaVersion": "0.1.0-review",
        "bundleId": "hsk1-3-new-course-1-review",
        "title": "Dữ liệu kiểm tra - New HSK Course 1 (HSK 3.0)",
        "description": "Bundle độc lập để kiểm tra dữ liệu trích xuất; chưa được nối vào ứng dụng.",
        "status": "review",
        "counts": {
            "lessons": len(LESSONS),
            "grammarPoints": len(all_grammar),
            "lexemeCandidates": len(all_candidates),
            "ocrPages": len(raw_pages),
        },
        "files": files,
        "generatedAt": generated_at,
    })

    readme = f"""# New HSK Course 1 (HSK 3.0) - review data

Đây là bundle dữ liệu độc lập để kiểm tra trước khi biên tập hoặc tích hợp. Bundle này **không được ứng dụng nạp tự động**.

## Phạm vi

- 15 bài học, tiêu đề và phạm vi trang đã đối chiếu từ mục lục.
- {len(all_grammar)} tiêu đề điểm ngữ pháp có tiếng Trung, tiếng Anh và bản dịch tiếng Việt.
- {len(all_candidates)} ứng viên từ mới do OCR nhận diện; mọi mục đều cần người biết tiếng Trung duyệt lại.
- 144 trang OCR thô để truy vết về nguồn.
- Mã audio chỉ là tham chiếu; PDF không chứa file audio/video.

## Tệp nên kiểm tra trước

1. `curriculum.json` - danh sách 15 bài và điểm ngữ pháp.
2. `lessons/lesson-01.json` - ví dụ đầy đủ về cấu trúc block và OCR.
3. `shared/lexeme-candidates.json` - ứng viên từ mới, chưa phải dữ liệu xuất bản.
4. `source-analysis.json` - chất lượng OCR, nguồn và giới hạn.

## Trạng thái

`review`: cấu trúc dùng để đánh giá; pinyin, nghĩa tiếng Việt, thứ tự đọc nhiều cột và bài tập chưa được duyệt ngôn ngữ.
"""
    (output_dir / "README.md").write_text(readme, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate a standalone HSK 1 3.0 review bundle from OCR JSON.")
    parser.add_argument("--pdf", type=Path, default=DEFAULT_PDF)
    parser.add_argument("--ocr-dir", type=Path, default=DEFAULT_OCR)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    build_bundle(args.pdf.resolve(), args.ocr_dir.resolve(), args.output_dir.resolve())
    print(args.output_dir.resolve())


if __name__ == "__main__":
    main()
