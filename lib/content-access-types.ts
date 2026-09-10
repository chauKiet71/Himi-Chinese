export const CONTENT_ACCESS_TARGET_TYPES = [
  "learning_path",
  "learning_module",
  "learning_lesson",
  "learning_question",
  "hsk_level",
  "hsk_lesson",
  "hsk_vocabulary",
  "hsk_writing",
  "hsk_question",
] as const;

export type ContentAccessTargetType = typeof CONTENT_ACCESS_TARGET_TYPES[number];
export type AccessTier = "free" | "vip";

export type ContentAccessTarget = {
  type: ContentAccessTargetType;
  key: string;
  defaultTier?: AccessTier;
};

export type ContentAccessPolicy = {
  targetType: ContentAccessTargetType;
  targetKey: string;
  tier: AccessTier;
};

export type ContentAccessState = {
  allowed: boolean;
  requiredTier: AccessTier;
  source: "free" | "vip" | "vip_required";
  lockedAt: ContentAccessTarget | null;
};

export function contentAccessPolicyKey(type: ContentAccessTargetType, key: string): string {
  return `${type}:${key}`;
}

export function resolveContentAccess({
  targets,
  policies,
  viewerHasVip,
}: {
  targets: ContentAccessTarget[];
  policies: Iterable<ContentAccessPolicy>;
  viewerHasVip: boolean;
}): ContentAccessState {
  const policyMap = new Map(
    [...policies].map((policy) => [contentAccessPolicyKey(policy.targetType, policy.targetKey), policy.tier]),
  );
  const lockedAt = targets.find((target) => {
    const tier = policyMap.get(contentAccessPolicyKey(target.type, target.key)) ?? target.defaultTier ?? "free";
    return tier === "vip";
  }) ?? null;
  const requiredTier: AccessTier = lockedAt ? "vip" : "free";

  if (requiredTier === "free") return { allowed: true, requiredTier, source: "free", lockedAt: null };
  return viewerHasVip
    ? { allowed: true, requiredTier, source: "vip", lockedAt }
    : { allowed: false, requiredTier, source: "vip_required", lockedAt };
}

export function learningPathTarget(courseId: string): ContentAccessTarget {
  return { type: "learning_path", key: courseId };
}

export function learningModuleTarget(moduleId: string): ContentAccessTarget {
  return { type: "learning_module", key: moduleId };
}

export function learningLessonTarget(lessonId: string, isFree: boolean): ContentAccessTarget {
  return { type: "learning_lesson", key: lessonId, defaultTier: isFree ? "free" : "vip" };
}

export function learningQuestionTarget(lessonId: string, questionId: string, defaultTier: AccessTier = "free"): ContentAccessTarget {
  return { type: "learning_question", key: `${lessonId}:${questionId}`, defaultTier };
}

export function hskLevelTarget(levelId: string): ContentAccessTarget {
  return { type: "hsk_level", key: levelId };
}

export function hskLessonTarget(levelId: string, lessonId: string, defaultTier: AccessTier = "free"): ContentAccessTarget {
  return { type: "hsk_lesson", key: `${levelId}:${lessonId}`, defaultTier };
}

export function hskVocabularyTarget(levelId: string, lessonId: string, vocabularyId: string, defaultTier: AccessTier = "free"): ContentAccessTarget {
  return { type: "hsk_vocabulary", key: `${levelId}:${lessonId}:${vocabularyId}`, defaultTier };
}

export function hskWritingTarget(levelId: string, lessonId: string, writingId: string, defaultTier: AccessTier = "free"): ContentAccessTarget {
  return { type: "hsk_writing", key: `${levelId}:${lessonId}:${writingId}`, defaultTier };
}

export function hskQuestionTarget(levelId: string, lessonId: string, questionId: string, defaultTier: AccessTier = "free"): ContentAccessTarget {
  return { type: "hsk_question", key: `${levelId}:${lessonId}:${questionId}`, defaultTier };
}
