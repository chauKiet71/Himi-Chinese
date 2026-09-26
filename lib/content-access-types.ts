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
export type AccessTier = "guest" | "free" | "vip";

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
  source: "guest" | "free" | "login_required" | "vip" | "vip_required";
  lockedAt: ContentAccessTarget | null;
};

export function contentAccessPolicyKey(type: ContentAccessTargetType, key: string): string {
  return `${type}:${key}`;
}

export function resolveContentAccess({
  targets,
  policies,
  viewerAuthenticated = true,
  viewerHasVip,
}: {
  targets: ContentAccessTarget[];
  policies: Iterable<ContentAccessPolicy>;
  viewerAuthenticated?: boolean;
  viewerHasVip: boolean;
}): ContentAccessState {
  const policyMap = new Map(
    [...policies].map((policy) => [contentAccessPolicyKey(policy.targetType, policy.targetKey), policy.tier]),
  );
  const resolvedTargets = targets.map((target) => {
    const policyKey = contentAccessPolicyKey(target.type, target.key);
    return {
      explicit: policyMap.has(policyKey),
      target,
      tier: policyMap.get(policyKey) ?? target.defaultTier ?? "free",
    };
  });
  const vipTarget = resolvedTargets.find(({ tier }) => tier === "vip")?.target ?? null;
  if (vipTarget) {
    return viewerHasVip
      ? { allowed: true, requiredTier: "vip", source: "vip", lockedAt: vipTarget }
      : { allowed: false, requiredTier: "vip", source: "vip_required", lockedAt: vipTarget };
  }

  // A direct rule on the closest node wins between guest and free. This lets
  // an administrator expose one lesson/item to visitors without a default
  // free rule on its parent accidentally overriding that choice.
  const directRule = [...resolvedTargets].reverse().find(({ explicit }) => explicit);
  const fallbackRule = resolvedTargets.at(-1);
  const requiredTier = (directRule ?? fallbackRule)?.tier === "guest" ? "guest" : "free";
  if (requiredTier === "guest") {
    return { allowed: true, requiredTier, source: "guest", lockedAt: null };
  }

  const authenticated = viewerAuthenticated || viewerHasVip;
  if (authenticated) {
    return { allowed: true, requiredTier, source: "free", lockedAt: null };
  }
  const lockedAt = (directRule ?? fallbackRule)?.target ?? targets.at(-1) ?? null;
  return { allowed: false, requiredTier, source: "login_required", lockedAt };
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
