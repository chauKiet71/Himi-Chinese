import { resolveContentAccess, type ContentAccessPolicy, type ContentAccessTarget } from "./content-access-types.ts";
import type { WritingTopic } from "./writing-content.ts";
import type { ListeningCatalogLesson } from "./listening-catalog.ts";

export function writingTargets(level: string, lesson?: string, character?: string): ContentAccessTarget[] {
  const targets: ContentAccessTarget[] = [{ type: "writing_level", key: level }];
  if (lesson) targets.push({ type: "writing_lesson", key: `${level}:${lesson}` });
  if (lesson && character) targets.push({ type: "writing_character", key: `${level}:${lesson}:${character}` });
  return targets;
}

export function listeningTargets(lesson: Pick<ListeningCatalogLesson, "id" | "trackId" | "groupId" | "topicId">): ContentAccessTarget[] {
  return [
    { type: "listening_track", key: lesson.trackId },
    { type: "listening_group", key: `${lesson.trackId}:${lesson.groupId}` },
    { type: "listening_topic", key: `${lesson.trackId}:${lesson.groupId}:${lesson.topicId}` },
    { type: "listening_lesson", key: lesson.id },
  ];
}

export function protectWritingTopic(topic: WritingTopic, policies: ContentAccessPolicy[], viewerAuthenticated: boolean, viewerHasVip: boolean) {
  const resolve = (targets: ContentAccessTarget[]) => resolveContentAccess({ targets, policies, viewerAuthenticated, viewerHasVip });
  const access = resolve(writingTargets(topic.levelId, topic.slug));
  if (!access.allowed) return { access, topic: null };
  return { access, topic: {
    ...topic,
    characters: topic.characters.map((character) => {
      const state = resolve(writingTargets(topic.levelId, topic.slug, character.id));
      return state.allowed ? { ...character, locked: false, accessTier: state.requiredTier }
        : { id: character.id, hanzi: "", pinyin: "", meaning: "", locked: true, accessTier: state.requiredTier };
    }),
  } };
}
