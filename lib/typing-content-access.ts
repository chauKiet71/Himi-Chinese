import {
  resolveContentAccess,
  typingLevelTarget,
  typingLessonTarget,
  typingQuestionTarget,
  type ContentAccessPolicy,
} from "./content-access-types.ts";
import type { TypingLessonPayload, TypingPracticeItem } from "./typing-practice.ts";

export function typingLessonTargets(levelId: string, lessonId: string) {
  return [typingLevelTarget(levelId), typingLessonTarget(levelId, lessonId)];
}

// Build placeholders explicitly so answers, segments and audio never leak.
function lockedTypingItem(item: TypingPracticeItem, requiredTier: "free" | "vip"): TypingPracticeItem {
  return {
    id: item.id,
    stage: item.stage,
    locked: true,
    requiredTier,
    meaning: "",
    hanzi: "",
    pinyin: "",
    audio: { normal: "", slow: "" },
    words: [],
    segments: [],
  };
}

export function resolveTypingLessonContent({ lesson, policies, viewerAuthenticated, viewerHasVip }: {
  lesson: TypingLessonPayload;
  policies: ContentAccessPolicy[];
  viewerAuthenticated: boolean;
  viewerHasVip: boolean;
}) {
  const parents = typingLessonTargets(lesson.level, lesson.id);
  const viewer = { policies, viewerAuthenticated, viewerHasVip };
  const access = resolveContentAccess({ ...viewer, targets: parents });
  if (!access.allowed) return { access, lesson: null };
  const protectItem = (item: TypingPracticeItem) => {
    const state = resolveContentAccess({
      ...viewer,
      targets: [...parents, typingQuestionTarget(lesson.level, lesson.id, item.stage, item.id)],
    });
    return state.allowed ? item : lockedTypingItem(item, state.requiredTier === "vip" ? "vip" : "free");
  };
  return {
    access,
    lesson: { ...lesson, words: lesson.words.map(protectItem), sentences: lesson.sentences.map(protectItem) },
  };
}
