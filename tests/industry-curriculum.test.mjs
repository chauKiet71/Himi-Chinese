import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { industryCurricula, industryCurriculumTerminology } from "../lib/industry-curriculum.ts";
import { validateIndustryCurriculum, validateIndustryCurriculumCollection } from "../lib/industry-curriculum-validation.ts";
import { balanceChallengeOptions, getLessonPageData } from "../lib/lesson-repository.ts";

test("all six industry curricula are complete and preserve their authored applied modules", () => {
  assert.equal(industryCurricula.length, 6);
  assert.deepEqual(new Set(industryCurricula.map(course => course.category)), new Set(["Văn phòng", "Nhà máy", "Logistics", "Kinh doanh", "Dịch vụ"]));
  const manifest = JSON.parse(readFileSync("content/industry-curriculum/manifest.json", "utf8"));
  assert.equal(manifest.totals.lessons, industryCurricula.reduce((sum, course) => sum + course.lessons.length, 0));
  const scenarios = new Set();
  let expectedScenarioCount = 0;
  for (const course of industryCurricula) {
    const expectedLessonCount = course.courseSlug === "kho-van-logistics" ? 31 : 30;
    const expectedModuleSizes = course.courseSlug === "kho-van-logistics" ? [6, 6, 7, 6, 6] : [6, 6, 6, 6, 6];
    assert.equal(course.lessons.length, expectedLessonCount);
    assert.equal(course.modules.length, 5);
    assert.equal(course.lessons.filter(lesson => lesson.isFree).length, 6);
    assert.deepEqual(course.modules.map(module => course.lessons.filter(lesson => lesson.moduleSlug === module.slug).length), expectedModuleSizes);
    for (const courseModule of course.modules.slice(0, 4)) {
      const closer = course.lessons.filter(lesson => lesson.moduleSlug === courseModule.slug).at(-1);
      assert.match(closer.title, /^Tình huống tổng hợp:/, `${course.courseSlug}: module closer must remain a test`);
    }
    for (const lesson of course.lessons.slice(24)) {
      const isExpandedLesson = ["van-phong-hanh-chinh", "thuong-mai-dien-tu", "nha-may-san-xuat", "nha-hang-dich-vu", "kho-van-logistics", "ban-hang-cham-soc-khach-hang"].includes(course.courseSlug);
      assert.equal(lesson.vocabulary.length, isExpandedLesson ? 10 : 6);
      assert.equal(lesson.content.phrases.length, isExpandedLesson ? 10 : 4);
      assert.equal(lesson.content.challenge.questions.length, 3);
      assert.equal(lesson.content.challenge.passScore, 3);
      for (const word of lesson.vocabulary) assert.ok(word.example.includes(word.hanzi), `${lesson.slug}: example must actually demonstrate ${word.hanzi}`);
      for (const line of lesson.content.phrases) {
        assert.match(line.hanzi, /\p{Script=Han}/u);
        assert.doesNotMatch(line.pinyin, /\p{Script=Han}/u);
        assert.ok(line.pinyin.length > 5 && line.translation.length > 5);
      }
      const prompt = lesson.content.challenge.questions[0].prompt;
      assert.ok(!scenarios.has(prompt), `Repeated scenario: ${prompt}`);
      scenarios.add(prompt);
      expectedScenarioCount++;
    }
  }
  assert.equal(scenarios.size, expectedScenarioCount);
});

test("the office curriculum mirrors the supplied 30-lesson 10-10-10 dataset", () => {
  const office = industryCurricula.find(course => course.courseSlug === "van-phong-hanh-chinh");
  assert.ok(office);
  assert.equal(office.lessons.length, 30);
  assert.deepEqual(office.modules.map(module => module.title), [
    "Giao tiếp văn phòng cơ bản",
    "Phối hợp và giải quyết công việc",
    "Họp báo cáo và dự án",
    "Hành chính và giao tiếp nâng cao",
    "Thực hành và phối hợp công việc",
  ]);
  for (const lesson of office.lessons) {
    assert.equal(lesson.vocabulary.length, 10, `${lesson.slug}: vocabulary`);
    assert.equal(lesson.content.phrases.length, 10, `${lesson.slug}: phrases`);
    assert.equal(lesson.content.dialogue.length, 10, `${lesson.slug}: communication sentences`);
  }
});

test("the ecommerce curriculum mirrors the supplied 30-lesson 10-10-10 dataset", () => {
  const ecommerce = industryCurricula.find(course => course.courseSlug === "thuong-mai-dien-tu");
  assert.ok(ecommerce);
  assert.equal(ecommerce.lessons.length, 30);
  assert.deepEqual(ecommerce.modules.map(module => module.title), [
    "Sản phẩm và gian hàng",
    "Nhà cung cấp và giá",
    "Vận hành đơn và tồn",
    "Hậu mãi và tối ưu",
    "Thực hành vận hành đơn trực tuyến",
  ]);
  for (const lesson of ecommerce.lessons) {
    assert.equal(lesson.vocabulary.length, 10, `${lesson.slug}: vocabulary`);
    assert.equal(lesson.content.phrases.length, 10, `${lesson.slug}: phrases`);
    assert.equal(lesson.content.dialogue.length, 10, `${lesson.slug}: communication sentences`);
  }
});

test("the factory curriculum mirrors the supplied 30-lesson 10-10-10 dataset", () => {
  const factory = industryCurricula.find(course => course.courseSlug === "nha-may-san-xuat");
  assert.ok(factory);
  assert.equal(factory.lessons.length, 30);
  assert.deepEqual(factory.modules.map(module => module.title), [
    "An toàn và bắt đầu",
    "Vận hành và sản lượng",
    "Chất lượng và xử lý sự cố",
    "Bàn giao và cải tiến",
    "Thực hành trao đổi tại xưởng",
  ]);
  for (const lesson of factory.lessons) {
    assert.equal(lesson.vocabulary.length, 10, `${lesson.slug}: vocabulary`);
    assert.equal(lesson.content.phrases.length, 10, `${lesson.slug}: phrases`);
    assert.equal(lesson.content.dialogue.length, 10, `${lesson.slug}: communication sentences`);
  }
});

test("the restaurant curriculum mirrors the supplied 30-lesson 10-10-10 dataset", () => {
  const restaurant = industryCurricula.find(course => course.courseSlug === "nha-hang-dich-vu");
  assert.ok(restaurant);
  assert.equal(restaurant.lessons.length, 30);
  assert.deepEqual(restaurant.modules.map(module => module.title), [
    "Đón khách và xếp bàn",
    "Gọi món và yêu cầu ăn uống",
    "Phục vụ tại bàn",
    "Thanh toán và phản hồi",
    "Thực hành chăm sóc khách tại bàn",
  ]);
  for (const lesson of restaurant.lessons) {
    assert.equal(lesson.vocabulary.length, 10, `${lesson.slug}: vocabulary`);
    assert.equal(lesson.content.phrases.length, 10, `${lesson.slug}: phrases`);
    assert.equal(lesson.content.dialogue.length, 10, `${lesson.slug}: communication sentences`);
  }
});

test("the logistics curriculum mirrors the supplied 31-lesson 10-10-10 dataset", () => {
  const logistics = industryCurricula.find(course => course.courseSlug === "kho-van-logistics");
  assert.ok(logistics);
  assert.equal(logistics.lessons.length, 31);
  assert.deepEqual(logistics.modules.map(module => module.title), [
    "Kho vận và logistics",
    "Tồn kho và vị trí",
    "Soạn hàng và xuất kho",
    "Vận chuyển và xử lý bất thường",
    "Thực hiện điều phối giao nhận",
  ]);
  assert.deepEqual(logistics.modules.map(module => logistics.lessons.filter(lesson => lesson.moduleSlug === module.slug).length), [6, 6, 7, 6, 6]);
  for (const lesson of logistics.lessons) {
    assert.equal(lesson.vocabulary.length, 10, `${lesson.slug}: vocabulary`);
    assert.equal(lesson.content.phrases.length, 10, `${lesson.slug}: phrases`);
    assert.equal(lesson.content.dialogue.length, 10, `${lesson.slug}: communication sentences`);
  }
});

test("the sales curriculum mirrors the supplied 30-lesson 10-10-10 dataset", () => {
  const sales = industryCurricula.find(course => course.courseSlug === "ban-hang-cham-soc-khach-hang");
  assert.ok(sales);
  assert.equal(sales.lessons.length, 30);
  assert.deepEqual(sales.modules.map(module => module.title), [
    "Tư vấn nhu cầu",
    "Báo giá và chốt đơn",
    "Theo dõi đơn và giao hàng",
    "Chăm sóc sau bán và khiếu nại",
    "Thực hiện tư vấn và theo dõi khách",
  ]);
  for (const lesson of sales.lessons) {
    assert.equal(lesson.vocabulary.length, 10, `${lesson.slug}: vocabulary`);
    assert.equal(lesson.content.phrases.length, 10, `${lesson.slug}: phrases`);
    assert.equal(lesson.content.dialogue.length, 10, `${lesson.slug}: communication sentences`);
  }
});

test("the curriculum validator rejects broken cross references and unanswerable checks before import", () => {
  const mutations = [
    [course => { course.lessons[0].moduleSlug = "missing"; }, /unknown module/],
    [course => { course.lessons[1].slug = course.lessons[0].slug; }, /duplicate/],
    [course => { course.lessons[24].content.challenge.questions[0].correctOption = 7; }, /integer out of range/],
    [course => { course.lessons[24].content.challenge.passScore = 4; }, /integer out of range/],
    [course => { course.lessons[24].content.challenge.questions[0].options[1] = course.lessons[24].content.challenge.questions[0].options[0]; }, /duplicate/],
    [course => { course.lessons[24].content.phrases[0].pinyin = ""; }, /non-empty/],
    [course => { course.lessons[24].vocabulary[0].audioUrl = "javascript:alert(1)"; }, /audioUrl/],
    [course => { course.lessons[24].vocabulary[0].example = "Ví dụ không có từ đang dạy"; }, /must contain the vocabulary term/],
    [course => { course.schemaVersion = 2; }, /unsupported/],
  ];
  for (const [mutate, message] of mutations) {
    const copy = structuredClone(industryCurricula[0]);
    mutate(copy);
    assert.throws(() => validateIndustryCurriculum(copy), message);
  }
});

test("cross-course validation rejects inconsistent pinyin for the same vocabulary term", () => {
  const copy = structuredClone(industryCurricula);
  const occurrences = copy.flatMap(course => course.lessons.flatMap(lesson => lesson.vocabulary
    .filter(word => word.hanzi === "退货")
    .map(word => ({ course, lesson, word }))));
  assert.ok(occurrences.length >= 2);
  occurrences[1].word.pinyin = "tuì huò";
  assert.throws(() => validateIndustryCurriculumCollection(copy, industryCurriculumTerminology), /inconsistent pinyin for 退货/);
});

test("shared zh-CN terminology and repeated sentences stay consistent", () => {
  assert.equal(industryCurriculumTerminology.get("合规"), "héguī");
  assert.equal(industryCurriculumTerminology.get("转速"), "zhuànsù");
  assert.equal(industryCurriculumTerminology.get("曝光量"), "bàoguāngliàng");

  const wrongTerm = structuredClone(industryCurricula);
  const canonicalOccurrence = wrongTerm
    .flatMap(course => course.lessons.flatMap(lesson => lesson.vocabulary))
    .find(word => industryCurriculumTerminology.has(word.hanzi));
  assert.ok(canonicalOccurrence, "expected at least one curriculum term with canonical pinyin");
  canonicalOccurrence.pinyin = `${canonicalOccurrence.pinyin} `;
  assert.throws(() => validateIndustryCurriculumCollection(wrongTerm, industryCurriculumTerminology), /must use canonical pinyin/);

  const repeatedSentence = structuredClone(industryCurricula);
  const sentenceOccurrences = new Map();
  for (const course of repeatedSentence) {
    for (const lesson of course.lessons) {
      for (const line of [...lesson.content.dialogue, ...(lesson.content.phrases ?? [])]) {
        const occurrences = sentenceOccurrences.get(line.hanzi) ?? [];
        occurrences.push(line);
        sentenceOccurrences.set(line.hanzi, occurrences);
      }
    }
  }
  const repeated = [...sentenceOccurrences.values()].find(occurrences => occurrences.length > 1);
  assert.ok(repeated, "expected at least one repeated sentence across the curricula");
  repeated[1].translation = "Bản dịch không đồng nhất";
  assert.throws(() => validateIndustryCurriculumCollection(repeatedSentence, industryCurriculumTerminology), /inconsistent repeated sentence/);
});

test("challenge answers keep their meaning while their visible positions are balanced", () => {
  const questions = [0, 0, 1, 2].map((correctOption, index) => ({
    prompt: `Câu ${index + 1}`,
    options: [`A${index}`, `B${index}`, `C${index}`],
    correctOption,
    explanation: "Giải thích",
  }));
  const correctAnswers = questions.map(question => question.options[question.correctOption]);
  const balanced = balanceChallengeOptions(questions);

  assert.deepEqual(balanced.map(question => question.correctOption), [0, 1, 2, 0]);
  assert.deepEqual(balanced.map(question => question.options[question.correctOption]), correctAnswers);
  assert.deepEqual(questions.map(question => question.correctOption), [0, 0, 1, 2]);

  const legacyQuestions = industryCurricula.flatMap(course => course.lessons.slice(0, 24).flatMap(lesson => (
    balanceChallengeOptions(lesson.content.challenge?.questions ?? [], lesson.slug)
  )));
  const positionCounts = [0, 1, 2].map(position => legacyQuestions.filter(question => question.correctOption === position).length);
  assert.ok(legacyQuestions.length >= 80, `Expected broad challenge coverage, received ${legacyQuestions.length} questions`);
  assert.ok(positionCounts.every(count => count > 0), `Every answer position must be used: ${positionCounts.join("/")}`);
  assert.ok(Math.max(...positionCounts) - Math.min(...positionCounts) <= 10, `Answer positions must stay balanced: ${positionCounts.join("/")}`);

  const giveawayPattern = /Bỏ qua|Không cần|Luôn |tùy ý|不重要|随便|不用|以后再|完全错/iu;
  for (const question of industryCurricula.flatMap(course => course.lessons.slice(0, 24).flatMap(lesson => lesson.content.challenge?.questions ?? []))) {
    question.options.forEach((option, optionIndex) => {
      if (optionIndex !== question.correctOption) assert.doesNotMatch(option, giveawayPattern, `Distractor is too obvious: ${option}`);
    });
  }
});

test("JSON lessons reach the web repository while new VIP bodies stay on the server", async () => {
  const previous = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  try {
    for (const course of industryCurricula) {
      const free = await getLessonPageData({ courseSlug: course.courseSlug });
      assert.equal(free.lessons.length, course.lessons.length);
      assert.deepEqual(free.lesson.vocabulary, course.lessons[0].vocabulary);
      const applied = await getLessonPageData({ courseSlug: course.courseSlug, lessonSlug: course.lessons[24].slug });
      assert.equal(applied.lesson.title, course.lessons[24].title);
      assert.equal(applied.access.allowed, false);
      assert.deepEqual(applied.lesson.vocabulary, []);
      assert.deepEqual(applied.lesson.dialogue, []);
      assert.equal(applied.lesson.phrases, undefined);
      assert.equal(applied.lesson.challenge, undefined);
    }
  } finally {
    if (previous === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previous;
  }
});
