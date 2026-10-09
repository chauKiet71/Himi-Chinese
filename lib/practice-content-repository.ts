import "server-only";
import { and, eq } from "drizzle-orm";
import { readDb } from "../db/index.ts";
import { practiceContentDocuments } from "../db/schema.ts";
import type { WritingLevel, WritingLessonSummary, WritingTopic } from "./writing-content.ts";
import type { ListeningCatalogIndex, ListeningCatalogLesson } from "./listening-catalog.ts";
import { getContentAccessPolicies } from "./content-access-repository.ts";
import { hasActiveVipAccess } from "./lesson-access.ts";
import { resolveContentAccess, type ContentAccessTarget } from "./content-access-types.ts";
import { listeningTargets, protectWritingTopic, writingTargets } from "./practice-content-access.ts";

export type WritingCatalog = { levels: WritingLevel[]; lessons: Record<string, WritingLessonSummary[]> };

export async function readPracticeDocument<T>(kind: string, key: string): Promise<T | null> {
  const rows = await readDb((db) => db.select({ payload: practiceContentDocuments.payload })
    .from(practiceContentDocuments).where(and(eq(practiceContentDocuments.kind, kind), eq(practiceContentDocuments.key, key))).limit(1));
  return rows.length ? rows[0].payload as T : null;
}

export async function practiceViewerAccess(targets: ContentAccessTarget[], userId: string | null) {
  const [policies, viewerHasVip] = await Promise.all([
    getContentAccessPolicies(targets, undefined, { failClosed: true }),
    userId ? hasActiveVipAccess(userId) : Promise.resolve(false),
  ]);
  return { policies, viewerAuthenticated: Boolean(userId), viewerHasVip };
}

export async function getWritingCatalog() {
  return readPracticeDocument<WritingCatalog>("writing_catalog", "index");
}

export async function getWritingPractice(level: string, lesson: string, userId: string | null) {
  const levelId = level.startsWith("hsk-") ? level : `hsk-${level}`;
  const topic = await readPracticeDocument<WritingTopic>("writing_lesson", `${levelId}:${lesson}`);
  if (!topic) return null;
  const viewer = await practiceViewerAccess(topic.characters.flatMap((character) => writingTargets(levelId, lesson, character.id)), userId);
  return protectWritingTopic(topic, viewer.policies, viewer.viewerAuthenticated, viewer.viewerHasVip);
}

export async function getListeningCatalog(userId: string | null) {
  const catalog = await readPracticeDocument<ListeningCatalogIndex>("listening_catalog", "index");
  if (!catalog) return null;
  const targets = catalog.tracks.flatMap((track) => track.groups.flatMap((group) => group.topics.flatMap((topic) => topic.lessons.flatMap((lesson) =>
    listeningTargets({ id: lesson.id, trackId: track.id, groupId: group.id, topicId: topic.id })))));
  const viewer = await practiceViewerAccess(targets, userId);
  return { ...catalog, tracks: catalog.tracks.map((track) => ({ ...track, groups: track.groups.map((group) => ({ ...group, topics: group.topics.map((topic) => ({
    ...topic, lessons: topic.lessons.map((lesson) => ({ ...lesson, access: resolveContentAccess({
      targets: listeningTargets({ id: lesson.id, trackId: track.id, groupId: group.id, topicId: topic.id }), ...viewer,
    }) })),
  })) })) })) };
}

export async function getListeningPractice(id: string, userId: string | null) {
  const lesson = await readPracticeDocument<ListeningCatalogLesson>("listening_lesson", id);
  if (!lesson) return null;
  const targets = listeningTargets(lesson);
  const viewer = await practiceViewerAccess(targets, userId);
  const access = resolveContentAccess({ targets, ...viewer });
  return { access, lesson: access.allowed ? lesson : null };
}
