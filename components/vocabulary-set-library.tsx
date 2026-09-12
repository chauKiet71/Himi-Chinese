"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, FolderHeart, Layers3, Plus, Volume2 } from "lucide-react";
import type { SavedVocabulary } from "@/lib/content-types";
import { requestVocabularySet } from "@/lib/vocabulary-set-client";

export type SetSummary = { id: string; title: string; description: string; wordCount: number; category?: string };

function revealCreateForm(form: HTMLFormElement | null) {
  if (!form) return;
  form.querySelector<HTMLInputElement>('input[name="title"]')?.focus({ preventScroll: true });
}

export function VocabularySetLibrary({
  builtins,
  mine,
  savedWords,
  authenticated,
  mineLoadError,
  savedLoadError,
}: {
  builtins: SetSummary[];
  mine: SetSummary[];
  savedWords: SavedVocabulary[];
  authenticated: boolean;
  mineLoadError: boolean;
  savedLoadError: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"saved" | "mine">("saved");
  const [creating, setCreating] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState("");
  const removalPending = useRef(false);
  const visibleSavedWords = savedWords.filter((word) => !removedIds.includes(word.id));
  const createFormRef = useRef<HTMLFormElement>(null);
  const createButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!creating) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    revealCreateForm(createFormRef.current);
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [creating]);

  function openCreateForm() {
    setTab("mine");
    setCreating(true);
    if (creating) revealCreateForm(createFormRef.current);
  }

  function closeCreateForm() {
    setCreating(false);
    setError("");
    createButtonRef.current?.focus();
  }

  const personalStudySet = mine.find((set) => set.wordCount > 0);
  const studyHref = tab === "saved"
    ? visibleSavedWords.length ? "/vocabulary/saved/study/vocabulary" : null
    : personalStudySet ? `/vocabulary/${personalStudySet.id}/study/vocabulary` : null;

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      const result = await requestVocabularySet("/api/vocabulary-sets", "POST", { title: form.get("title"), description: form.get("description") });
      router.push(`/vocabulary/${result.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Chưa thể tạo bộ.");
      setPending(false);
    }
  }

  async function unsave(word: SavedVocabulary) {
    if (removalPending.current) return;
    removalPending.current = true;
    setRemovingId(word.id);
    setRemoveError("");
    try {
      await requestVocabularySet("/api/saved-vocabulary", "DELETE", { id: word.id });
      setRemovedIds((ids) => [...ids, word.id]);
      router.refresh();
    } catch (error) {
      setRemoveError(error instanceof Error ? error.message : "Chưa thể bỏ lưu. Vui lòng thử lại.");
    } finally {
      removalPending.current = false;
      setRemovingId(null);
    }
  }

  function speak(hanzi: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(hanzi);
    utterance.lang = "zh-CN";
    utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
  }

  return <main className="vsets-page">
    <header className="vsets-hero">
      <div><span className="vsets-eyebrow"><Layers3 size={17} /> GÓC TỪ VỰNG CỦA BẠN</span><h1>Mỗi bộ từ, một bước tiến.</h1><p>Gom những từ bạn muốn nhớ. Học theo cách bạn yêu thích.</p>
        <div className="vsets-actions">{authenticated ? <button ref={createButtonRef} className="vsets-primary" aria-expanded={creating} aria-controls="vsets-create-form" onClick={openCreateForm} type="button"><Plus size={18} /> Tạo bộ mới</button> : <Link className="vsets-primary" href="/login?returnTo=%2Fvocabulary"><Plus size={18} /> Đăng nhập để tạo bộ</Link>}<span>{builtins.length} bộ có sẵn · 3 cách học</span></div>
      </div><div className="vsets-hero-art" aria-hidden="true"><span>学</span><span>词</span><small>HỌC MỘT CHÚT, NHỚ THÊM NHIỀU</small></div>
    </header>

    <div className="vsets-toolbar">
      <div className="vsets-tabs" aria-label="Loại bộ từ vựng">
        <button aria-pressed={tab === "saved"} onClick={() => setTab("saved")}><BookOpen size={18} /> Từ đã lưu <span>{visibleSavedWords.length}</span></button>
        <button aria-pressed={tab === "mine"} onClick={() => setTab("mine")}><FolderHeart size={18} /> Bộ của tôi <span>{mine.length}</span></button>
      </div>
      {studyHref ? <Link className="vsets-primary vsets-start-learning" href={studyHref}><BookOpen size={18} /> Bắt đầu học <ArrowRight size={18} /></Link> : <button className="vsets-primary vsets-start-learning" type="button" disabled><BookOpen size={18} /> Bắt đầu học</button>}
    </div>

    {creating && authenticated ? <div
      className="vsets-create-overlay"
      onKeyDown={(event) => {
        if (event.key === "Escape" && !pending) closeCreateForm();
      }}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target && !pending) closeCreateForm();
      }}
      role="presentation"
    >
      <form
        ref={createFormRef}
        id="vsets-create-form"
        className="vsets-form vsets-create-dialog"
        aria-labelledby="vsets-create-title"
        aria-modal="true"
        role="dialog"
        onSubmit={create}
      >
        <h2 id="vsets-create-title">Tạo bộ từ vựng</h2>
        <label>Tên bộ<input name="title" required maxLength={100} placeholder="Ví dụ: Từ mới tuần này" /></label>
        <label>Mô tả<textarea name="description" maxLength={500} placeholder="Bạn muốn học những gì trong bộ này?" rows={3} /></label>
        <div className="vsets-actions"><button className="vsets-primary" disabled={pending}>{pending ? "Đang tạo…" : "Tạo bộ"}</button><button type="button" disabled={pending} onClick={closeCreateForm}>Hủy</button></div>
        {error ? <p role="alert" className="vsets-error">{error}</p> : null}
      </form>
    </div> : null}

    <div className="vsets-section-heading"><div><h2>{tab === "saved" ? "Danh sách từ vựng" : "Bộ từ vựng của tôi"}</h2><p>{tab === "saved" ? "Những từ bạn đã lưu khi học HSK và Giao tiếp." : "Những từ cần nhớ, được sắp xếp theo cách của bạn."}</p></div><span>{tab === "saved" ? `${visibleSavedWords.length} từ` : `${mine.length} bộ`}</span></div>

    {tab === "saved" && removeError ? <p className="vsets-error" role="alert">{removeError}</p> : null}

    {tab === "saved" ? !authenticated
      ? <div className="vsets-empty"><BookOpen size={36} /><h3>Đăng nhập để xem từ đã lưu</h3><p>Các từ bạn lưu trong lúc học HSK và Giao tiếp sẽ xuất hiện tại đây.</p><Link className="vsets-primary" href="/login?returnTo=%2Fvocabulary">Đăng nhập</Link></div>
      : savedLoadError
        ? <div className="vsets-empty" role="alert"><h3>Chưa tải được từ đã lưu</h3><p>Hãy thử lại sau ít phút. Các bộ từ của bạn vẫn được giữ nguyên.</p><button onClick={() => router.refresh()}>Thử lại</button></div>
        : visibleSavedWords.length
          ? <ul className="vsets-saved-grid">{visibleSavedWords.map((word) => <li className="vsets-saved-card" key={word.id}>
            <div className="vsets-saved-word"><strong lang="zh">{word.hanzi}</strong><button aria-label={`Nghe phát âm ${word.hanzi}`} onClick={() => speak(word.hanzi)} type="button"><Volume2 size={19} /></button></div>
            <span className="vsets-saved-pinyin">{word.pinyin}</span><h3>{word.meaning}</h3>
            {word.example ? <p><span lang="zh">{word.example}</span>{word.translation ? ` — ${word.translation}` : ""}</p> : <p>Ôn lại từ này trong lượt học tiếp theo.</p>}
            <footer><span>{word.sourceTitle}</span><button className="vsets-unsave" type="button" aria-label={`Bỏ lưu ${word.hanzi}`} aria-busy={removingId === word.id} disabled={removingId !== null} onClick={() => void unsave(word)}>{removingId === word.id ? "Đang bỏ lưu…" : "Bỏ lưu"}</button></footer>
          </li>)}</ul>
          : <div className="vsets-empty"><BookOpen size={36} /><h3>Chưa có từ nào được lưu</h3><p>Trong bài học, nhấn “Lưu từ” hoặc chọn “Cần ôn lại” khi chơi Flashcard để gom từ vào đây.</p><Link className="vsets-primary" href="/courses">Đi tới lộ trình</Link></div>
      : !authenticated
        ? <div className="vsets-empty"><FolderHeart size={36} /><h3>Một nơi riêng cho những từ bạn học</h3><p>Đăng nhập để tạo bộ và lưu từ vựng theo tài khoản.</p><Link className="vsets-primary" href="/login?returnTo=%2Fvocabulary">Đăng nhập</Link></div>
        : mineLoadError
          ? <div className="vsets-empty" role="alert"><h3>Chưa tải được bộ của bạn</h3><p>Hãy thử lại sau ít phút. Các từ đã lưu vẫn có thể học bình thường.</p><button onClick={() => router.refresh()}>Thử lại</button></div>
          : mine.length
            ? <div className="vsets-grid">{mine.map((set, index) => <Link className="vsets-card" href={`/vocabulary/${set.id}`} key={set.id}><div className={`vsets-card-cover vsets-tone-${index % 4}`}><span lang="zh">{["学", "词", "记", "习"][index % 4]}</span><span className="vsets-badge">{set.category ?? "Cá nhân"}</span></div><div className="vsets-card-body"><h3>{set.title}</h3><p>{set.description || "Bộ từ vựng do bạn tự xây dựng."}</p><div><span><Layers3 size={16} /> {set.wordCount} từ vựng</span><span>Xem bộ <ArrowRight size={17} /></span></div></div></Link>)}</div>
            : <div className="vsets-empty"><Layers3 size={36} /><h3>Bộ đầu tiên đang chờ bạn</h3><p>Tạo bộ mới rồi thêm những từ bạn muốn học.</p><button aria-controls="vsets-create-form" aria-expanded={creating} className="vsets-primary" onClick={openCreateForm} type="button"><Plus size={18} /> Tạo bộ</button></div>}
  </main>;
}
