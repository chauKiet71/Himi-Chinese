export type SetWord = {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  example: string;
  translation: string;
};

export type VocabularySet = {
  id: string;
  title: string;
  description: string;
  category: string;
  builtin: boolean;
  words: SetWord[];
};

export const studyModes = ["vocabulary", "hanzi", "flashcard"] as const;
export type SetStudyMode = typeof studyModes[number];
export function isSetStudyMode(value: string): value is SetStudyMode {
  return studyModes.some((mode) => mode === value);
}
export function hanziCharacters(words: SetWord[]): string[] {
  return [...new Set(words.flatMap((word) => [...word.hanzi].filter((char) => /\p{Script=Han}/u.test(char))))];
}
export class VocabularySetError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; }
}
function inputObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new VocabularySetError("Dữ liệu không hợp lệ.");
  return value as Record<string, unknown>;
}
function field(value: unknown, label: string, max: number, required = true): string {
  if (value === undefined && !required) return "";
  if (typeof value !== "string") throw new VocabularySetError(`${label} không hợp lệ.`);
  const text = value.normalize("NFC").trim();
  if ((required && !text) || text.length > max) throw new VocabularySetError(`${label} cần ${required ? "từ 1 đến" : "tối đa"} ${max} ký tự.`);
  return text;
}
export function validateSet(value: unknown) {
  const data = inputObject(value);
  return { title: field(data.title, "Tên bộ", 100), description: field(data.description, "Mô tả", 500, false) };
}
export function validateSetWord(value: unknown): Omit<SetWord, "id"> {
  const data = inputObject(value);
  const hanzi = field(data.hanzi, "Từ tiếng Trung", 40);
  if (!/\p{Script=Han}/u.test(hanzi)) throw new VocabularySetError("Từ tiếng Trung cần có ít nhất một chữ Hán.");
  return { hanzi, pinyin: field(data.pinyin, "Pinyin", 160), meaning: field(data.meaning, "Nghĩa tiếng Việt", 300), example: field(data.example, "Ví dụ", 500, false), translation: field(data.translation, "Dịch ví dụ", 500, false) };
}
export function isSetId(value: string) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value); }

function builtin(id: string, title: string, description: string, category: string, rows: string[][]): VocabularySet {
  return { id, title, description, category, builtin: true, words: rows.map(([hanzi, pinyin, meaning, example = "", translation = ""], index) => ({ id: `${id}-${index}`, hanzi, pinyin, meaning, example, translation })) };
}

export const builtinVocabularySets: VocabularySet[] = [
  builtin("giao-tiep-co-ban", "Chào hỏi mỗi ngày", "Bắt đầu một cuộc trò chuyện bằng những câu từ quen thuộc.", "Giao tiếp", [
    ["你好", "nǐ hǎo", "Xin chào", "你好，我叫小明。", "Xin chào, tôi tên là Tiểu Minh."],
    ["谢谢", "xièxie", "Cảm ơn", "谢谢你的帮助。", "Cảm ơn sự giúp đỡ của bạn."],
    ["再见", "zàijiàn", "Tạm biệt"], ["请", "qǐng", "Mời; xin", "请坐。", "Mời ngồi."],
    ["对不起", "duìbuqǐ", "Xin lỗi"], ["没关系", "méi guānxi", "Không sao"],
    ["朋友", "péngyou", "Bạn bè", "他是我的朋友。", "Anh ấy là bạn của tôi."], ["认识", "rènshi", "Quen biết", "很高兴认识你。", "Rất vui được làm quen với bạn."],
  ]),
  builtin("van-phong", "Một ngày ở văn phòng", "Từ vựng thiết thực khi làm việc và trao đổi với đồng nghiệp.", "Công việc", [
    ["公司", "gōngsī", "Công ty"], ["同事", "tóngshì", "Đồng nghiệp"], ["工作", "gōngzuò", "Công việc; làm việc", "我在这里工作。", "Tôi làm việc ở đây."],
    ["会议", "huìyì", "Cuộc họp", "会议九点开始。", "Cuộc họp bắt đầu lúc chín giờ."],
    ["邮件", "yóujiàn", "Thư; email"], ["文件", "wénjiàn", "Tài liệu"], ["电脑", "diànnǎo", "Máy tính"], ["完成", "wánchéng", "Hoàn thành", "我已经完成了。", "Tôi đã hoàn thành rồi."],
  ]),
  builtin("an-uong", "Ăn uống & gọi món", "Tự tin gọi món, chọn đồ uống và thanh toán.", "Đời sống", [
    ["菜单", "càidān", "Thực đơn"], ["米饭", "mǐfàn", "Cơm"], ["面条", "miàntiáo", "Mì"], ["水", "shuǐ", "Nước", "请给我一杯水。", "Làm ơn cho tôi một cốc nước."],
    ["茶", "chá", "Trà"], ["咖啡", "kāfēi", "Cà phê"], ["好吃", "hǎochī", "Ngon", "这个菜很好吃。", "Món này rất ngon."], ["买单", "mǎidān", "Thanh toán", "服务员，买单。", "Phục vụ ơi, tính tiền."],
  ]),
  builtin("thoi-gian", "Thời gian & lịch hẹn", "Nói về ngày giờ và sắp xếp những cuộc hẹn.", "Đời sống", [
    ["今天", "jīntiān", "Hôm nay"], ["明天", "míngtiān", "Ngày mai", "明天见！", "Hẹn gặp ngày mai!"], ["昨天", "zuótiān", "Hôm qua"], ["现在", "xiànzài", "Bây giờ"],
    ["时间", "shíjiān", "Thời gian", "你有时间吗？", "Bạn có thời gian không?"], ["星期", "xīngqī", "Tuần; thứ"], ["分钟", "fēnzhōng", "Phút"], ["小时", "xiǎoshí", "Giờ; tiếng đồng hồ"],
  ]),
];
export function getBuiltinSet(id: string) { return builtinVocabularySets.find((set) => set.id === id); }
