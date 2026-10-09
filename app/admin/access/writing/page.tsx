import { notFound } from "next/navigation";
import { AdminPracticeAccess, type PracticeAccessNode } from "@/components/admin-practice-access";
import { requireAdminUser } from "@/lib/admin-auth";
import { getWritingCatalog, readPracticeDocument } from "@/lib/practice-content-repository";
import { writingTargets } from "@/lib/practice-content-access";
import type { WritingTopic } from "@/lib/writing-content";

export const metadata = { title: "Khóa VIP Luyện viết" };
export default async function Page({ searchParams }: { searchParams: Promise<{ level?: string; lesson?: string; error?: string; success?: string }> }) {
  const [admin, query, catalog] = await Promise.all([requireAdminUser(), searchParams, getWritingCatalog()]);
  if (!catalog) notFound();
  const base = "/admin/access/writing";
  const level = catalog.levels.find((entry) => entry.id === query.level);
  if (query.level && !level) notFound();
  let nodes: PracticeAccessNode[];
  let returnTo = base;
  if (!level) {
    nodes = catalog.levels.map((entry) => ({ label: `Toàn bộ ${entry.label}`, description: `${entry.lessonCount} bài · ${entry.characterCount} chữ`,
      target: writingTargets(entry.id)[0], href: `${base}?level=${entry.id}` }));
  } else {
    returnTo = `${base}?level=${level.id}`;
    nodes = [{ label: `Toàn bộ ${level.label}`, target: writingTargets(level.id)[0] }];
    if (!query.lesson) {
      nodes.push(...catalog.lessons[level.id].map((lesson) => ({ label: `Bài ${lesson.lessonNumber}: ${lesson.title}`,
        target: writingTargets(level.id, lesson.id)[1], href: `${returnTo}&lesson=${lesson.id}` })));
    } else {
      const topic = await readPracticeDocument<WritingTopic>("writing_lesson", `${level.id}:${query.lesson}`);
      if (!topic) notFound();
      returnTo += `&lesson=${topic.slug}`;
      nodes.push({ label: topic.title, target: writingTargets(level.id, topic.slug)[1] }, ...topic.characters.map((character) => ({
        label: character.hanzi, description: `${character.pinyin} · ${character.meaning}`, target: writingTargets(level.id, topic.slug, character.id)[2],
      })));
    }
  }
  return <AdminPracticeAccess kind="writing" userName={admin.displayName} nodes={nodes} returnTo={returnTo} error={query.error} success={query.success} />;
}
