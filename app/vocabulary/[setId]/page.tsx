import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-session";
import { loadVocabularySet } from "@/lib/vocabulary-set-loader";
import { VocabularySetDetail } from "@/components/vocabulary-set-detail";

export const metadata = { title: "Chi tiết bộ từ vựng" };
export default async function SetPage({ params }: { params: Promise<{ setId: string }> }) {
  const { setId } = await params;
  if (setId === "saved") redirect("/vocabulary");
  const [set, user] = await Promise.all([loadVocabularySet(setId), getCurrentUser()]);
  return <VocabularySetDetail key={set.id} set={set} authenticated={Boolean(user)} />;
}
