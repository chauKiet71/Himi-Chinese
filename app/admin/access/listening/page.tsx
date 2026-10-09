import { notFound } from "next/navigation";
import { AdminPracticeAccess, type PracticeAccessNode } from "@/components/admin-practice-access";
import { requireAdminUser } from "@/lib/admin-auth";
import { readPracticeDocument } from "@/lib/practice-content-repository";
import { listeningTargets } from "@/lib/practice-content-access";
import type { ListeningCatalogIndex } from "@/lib/listening-catalog";

export const metadata = { title: "Khóa VIP Luyện nghe" };
export default async function Page({ searchParams }: { searchParams: Promise<{ level?: string; error?: string; success?: string }> }) {
  const [admin, query, catalog] = await Promise.all([requireAdminUser(), searchParams, readPracticeDocument<ListeningCatalogIndex>("listening_catalog", "index")]);
  if (!catalog) notFound();
  const base = "/admin/access/listening";
  const track = catalog.tracks.find((entry) => entry.id === query.level);
  if (query.level && !track) notFound();
  const returnTo = track ? `${base}?level=${track.id}` : base;
  const nodes: PracticeAccessNode[] = !track ? catalog.tracks.map((entry) => ({
    label: entry.labelVi, description: `${entry.lessonCount} bài`, target: { type: "listening_track", key: entry.id }, href: `${base}?level=${entry.id}`,
  })) : [{ label: `Toàn bộ ${track.labelVi}`, target: { type: "listening_track", key: track.id } }];
  if (track) for (const group of track.groups) {
    nodes.push({ label: group.labelVi, target: { type: "listening_group", key: `${track.id}:${group.id}` } });
    for (const topic of group.topics) {
      nodes.push({ label: `${group.labelVi} · ${topic.labelVi}`, target: { type: "listening_topic", key: `${track.id}:${group.id}:${topic.id}` } });
      for (const lesson of topic.lessons) nodes.push({ label: lesson.titleVi, description: `${lesson.sentenceCount} câu · ${lesson.keywordCount} từ khóa`,
        target: listeningTargets({ id: lesson.id, trackId: track.id, groupId: group.id, topicId: topic.id })[3] });
    }
  }
  return <AdminPracticeAccess kind="listening" userName={admin.displayName} nodes={nodes} returnTo={returnTo} error={query.error} success={query.success} />;
}
