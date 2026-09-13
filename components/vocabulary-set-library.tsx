"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  FolderHeart,
  GraduationCap,
  Layers3,
  MessageCircle,
  Plus,
  Search,
  Trash2,
  Volume2,
} from "lucide-react";
import type { SavedVocabulary } from "@/lib/content-types";
import { requestVocabularySet } from "@/lib/vocabulary-set-client";

export type SetSummary = { id: string; title: string; description: string; wordCount: number; category?: string };
type LibraryTab = "saved" | "mine";
type SourceFilter = "all" | SavedVocabulary["sourceType"];

const sourceOptions: Array<{ id: Exclude<SourceFilter, "all">; label: string; icon: typeof GraduationCap }> = [
  { id: "hsk", label: "HSK", icon: GraduationCap },
  { id: "course", label: "Giao tiếp", icon: MessageCircle },
];

function revealCreateForm(form: HTMLFormElement | null) {
  if (!form) return;
  form.querySelector<HTMLInputElement>('input[name="title"]')?.focus({ preventScroll: true });
}

function normalizeSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("vi").trim();
}

function matchesSearch(word: SavedVocabulary, query: string) {
  if (!query) return true;
  return normalizeSearch([word.hanzi, word.pinyin, word.meaning, word.example, word.translation, word.sourceTitle].join(" ")).includes(query);
}

export function VocabularySetLibrary({
  mine,
  savedWords,
  authenticated,
  mineLoadError,
  savedLoadError,
}: {
  mine: SetSummary[];
  savedWords: SavedVocabulary[];
  authenticated: boolean;
  mineLoadError: boolean;
  savedLoadError: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<LibraryTab>("saved");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState("");
  const removalPending = useRef(false);
  const createFormRef = useRef<HTMLFormElement>(null);
  const createButtonRef = useRef<HTMLButtonElement>(null);
  const visibleSavedWords = savedWords.filter((word) => !removedIds.includes(word.id));
  const normalizedQuery = normalizeSearch(query);
  const filteredWords = visibleSavedWords.filter((word) => (
    (sourceFilter === "all" || word.sourceType === sourceFilter) && matchesSearch(word, normalizedQuery)
  ));

  useEffect(() => {
    if (!creating) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    revealCreateForm(createFormRef.current);
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [creating]);

  function selectTab(nextTab: LibraryTab) {
    setTab(nextTab);
    if (nextTab === "mine") {
      setSourceFilter("all");
      setQuery("");
    }
  }

  function selectSource(source: SourceFilter) {
    setTab("saved");
    setSourceFilter(source);
  }

  function openCreateForm() {
    setTab("mine");
    setSourceFilter("all");
    setQuery("");
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

  function resetFilters() {
    setSourceFilter("all");
    setQuery("");
  }

  return <main className="vsets-page">
    <header className="vsets-hero">
      <div className="vsets-hero-copy">
        <span className="vsets-eyebrow"><Layers3 size={17} /> BỘ TỪ VỰNG</span>
        <h1>Gom từ hay. Học theo cách của bạn.</h1>
        <p>{visibleSavedWords.length} từ đã lưu · 3 cách học</p>
        <div className="vsets-actions vsets-hero-actions">
          {studyHref
            ? <Link className="vsets-primary vsets-start-learning" href={studyHref}><BookOpen size={18} /> Bắt đầu học <ArrowRight size={18} /></Link>
            : authenticated
              ? <button className="vsets-primary vsets-start-learning" type="button" disabled><BookOpen size={18} /> Bắt đầu học</button>
              : <Link className="vsets-primary vsets-start-learning" href="/login?returnTo=%2Fvocabulary"><BookOpen size={18} /> Đăng nhập để học</Link>}
          {authenticated
            ? <button ref={createButtonRef} className="vsets-secondary" type="button" aria-expanded={creating} aria-controls="vsets-create-form" onClick={openCreateForm}><Plus size={18} /> Tạo bộ mới</button>
            : <Link className="vsets-secondary" href="/login?returnTo=%2Fvocabulary"><Plus size={18} /> Đăng nhập để tạo bộ</Link>}
        </div>
      </div>
      <div className="vsets-hero-art" aria-hidden="true"><span>学</span><span>词</span><small>HỌC MỘT CHÚT, NHỚ THÊM NHIỀU</small></div>
    </header>

    <div className="vsets-library-shell">
      <aside className="vsets-library-nav" aria-label="Thư viện từ vựng">
        <h2>THƯ VIỆN CỦA BẠN</h2>
        <nav className="vsets-library-links">
          <button className={tab === "saved" && sourceFilter === "all" ? "is-active" : undefined} aria-current={tab === "saved" && sourceFilter === "all" ? "page" : undefined} onClick={() => selectSource("all")}>
            <BookOpen size={20} /><span>Từ đã lưu</span><strong>{visibleSavedWords.length}</strong>
          </button>
          <button className={tab === "mine" ? "is-active" : undefined} aria-current={tab === "mine" ? "page" : undefined} onClick={() => selectTab("mine")}>
            <FolderHeart size={20} /><span>Bộ của tôi</span><strong>{mine.length}</strong><Plus className="vsets-nav-plus" size={18} />
          </button>
        </nav>

        <div className="vsets-source-nav">
          <h3>THEO NGUỒN HỌC</h3>
          {sourceOptions.map(({ id, label, icon: Icon }) => <button key={id} className={tab === "saved" && sourceFilter === id ? "is-active" : undefined} aria-pressed={tab === "saved" && sourceFilter === id} onClick={() => selectSource(id)}><Icon size={20} /><span>{label}</span></button>)}
        </div>

        {authenticated && mine.length === 0 ? <div className="vsets-create-helper">
          <FolderHeart size={26} />
          <div><strong>Chưa có bộ từ riêng</strong><p>Tạo một bộ để gom những từ bạn muốn học cùng nhau.</p></div>
          <button type="button" aria-controls="vsets-create-form" aria-expanded={creating} onClick={openCreateForm}>Tạo bộ đầu tiên</button>
        </div> : null}
      </aside>

      <section className="vsets-library-main" aria-live="polite">
        <header className="vsets-content-header">
          <div><h2>{tab === "saved" ? "Từ đã lưu" : "Bộ của tôi"}</h2><p>{tab === "saved" ? "Những từ bạn đã lưu khi học HSK và Giao tiếp." : "Những từ cần nhớ, được sắp xếp theo cách của bạn."}</p></div>
          {tab === "saved" ? <label className="vsets-search"><Search size={20} aria-hidden="true" /><span className="sr-only">Tìm từ đã lưu</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo Hán tự, pinyin hoặc nghĩa..." /></label> : null}
        </header>

        {tab === "saved" ? <div className="vsets-filterbar">
          <div className="vsets-filter-options" aria-label="Lọc từ đã lưu">
            <button aria-pressed={sourceFilter === "all"} onClick={() => selectSource("all")}>Tất cả <span>({visibleSavedWords.length})</span></button>
            {sourceOptions.map(({ id, label }) => <button key={id} aria-pressed={sourceFilter === id} onClick={() => selectSource(id)}>{label}</button>)}
          </div>
          <span className="vsets-sort-label">Sắp xếp: Mới lưu</span>
        </div> : null}

        {tab === "saved" && removeError ? <p className="vsets-error" role="alert">{removeError}</p> : null}

        {tab === "saved" ? !authenticated
          ? <div className="vsets-empty"><BookOpen size={36} /><h3>Đăng nhập để xem từ đã lưu</h3><p>Các từ bạn lưu trong lúc học HSK và Giao tiếp sẽ xuất hiện tại đây.</p><Link className="vsets-primary" href="/login?returnTo=%2Fvocabulary">Đăng nhập</Link></div>
          : savedLoadError
            ? <div className="vsets-empty" role="alert"><h3>Chưa tải được từ đã lưu</h3><p>Hãy thử lại sau ít phút. Các bộ từ của bạn vẫn được giữ nguyên.</p><button onClick={() => router.refresh()}>Thử lại</button></div>
            : visibleSavedWords.length && filteredWords.length
              ? <div className="vsets-saved-table" role="table" aria-label="Danh sách từ đã lưu">
                <div className="vsets-saved-table-head" role="row"><span role="columnheader">Từ</span><span role="columnheader">Đọc · Nghĩa</span><span role="columnheader">Ví dụ</span><span role="columnheader">Thao tác</span></div>
                <ul>{filteredWords.map((word) => <li key={word.id} role="row">
                  <strong className="vsets-list-hanzi" lang="zh" role="cell">{word.hanzi}</strong>
                  <div className="vsets-list-reading" role="cell"><strong>{word.pinyin}</strong><span>{word.meaning}</span><small>{word.sourceTitle}</small></div>
                  <div className="vsets-list-example" role="cell">{word.example ? <><span lang="zh">{word.example}</span>{word.translation ? <small>{word.translation}</small> : null}</> : <small>Ôn lại từ này trong lượt học tiếp theo.</small>}</div>
                  <div className="vsets-list-actions" role="cell">
                    <button className="vsets-pronounce" aria-label={`Nghe phát âm ${word.hanzi}`} onClick={() => speak(word.hanzi)} type="button"><Volume2 size={19} /></button>
                    <button className="vsets-unsave" type="button" aria-label={`Bỏ lưu ${word.hanzi}`} aria-busy={removingId === word.id} disabled={removingId !== null} onClick={() => void unsave(word)}><Trash2 size={17} /><span>{removingId === word.id ? "Đang bỏ…" : "Bỏ lưu"}</span></button>
                  </div>
                </li>)}</ul>
              </div>
              : visibleSavedWords.length
                ? <div className="vsets-empty"><Search size={36} /><h3>Không tìm thấy từ phù hợp</h3><p>Thử từ khóa khác hoặc xem lại toàn bộ từ bạn đã lưu.</p><button onClick={resetFilters}>Xóa bộ lọc</button></div>
                : <div className="vsets-empty"><BookOpen size={36} /><h3>Chưa có từ nào được lưu</h3><p>Trong bài học, nhấn “Lưu từ” hoặc chọn “Cần ôn lại” khi chơi Flashcard để gom từ vào đây.</p><Link className="vsets-primary" href="/courses">Đi tới lộ trình</Link></div>
          : !authenticated
            ? <div className="vsets-empty"><FolderHeart size={36} /><h3>Một nơi riêng cho những từ bạn học</h3><p>Đăng nhập để tạo bộ và lưu từ vựng theo tài khoản.</p><Link className="vsets-primary" href="/login?returnTo=%2Fvocabulary">Đăng nhập</Link></div>
            : mineLoadError
              ? <div className="vsets-empty" role="alert"><h3>Chưa tải được bộ của bạn</h3><p>Hãy thử lại sau ít phút. Các từ đã lưu vẫn có thể học bình thường.</p><button onClick={() => router.refresh()}>Thử lại</button></div>
              : mine.length
                ? <div className="vsets-grid">{mine.map((set, index) => <Link className="vsets-card" href={`/vocabulary/${set.id}`} key={set.id} prefetch={false}><div className={`vsets-card-cover vsets-tone-${index % 4}`}><span lang="zh">{["学", "词", "记", "习"][index % 4]}</span><span className="vsets-badge">{set.category ?? "Cá nhân"}</span></div><div className="vsets-card-body"><h3>{set.title}</h3><p>{set.description || "Bộ từ vựng do bạn tự xây dựng."}</p><div><span><Layers3 size={16} /> {set.wordCount} từ vựng</span><span>Xem bộ <ArrowRight size={17} /></span></div></div></Link>)}</div>
                 : <div className="vsets-empty"><Layers3 size={36} /><h3>Bộ đầu tiên đang chờ bạn</h3><p>Tạo bộ mới rồi thêm những từ bạn muốn học.</p><button className="vsets-primary" type="button" aria-controls="vsets-create-form" aria-expanded={creating} onClick={openCreateForm}><Plus size={18} /> Tạo bộ</button></div>}
      </section>
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
        <div className="vsets-form-heading">
          <div><span className="vsets-eyebrow">BỘ CỦA TÔI</span><h2 id="vsets-create-title">Tạo bộ từ vựng</h2></div>
          <button type="button" disabled={pending} onClick={closeCreateForm}>Đóng</button>
        </div>
        <label>Tên bộ<input name="title" required maxLength={100} placeholder="Ví dụ: Từ mới tuần này" /></label>
        <label>Mô tả<textarea name="description" maxLength={500} placeholder="Bạn muốn học những gì trong bộ này?" rows={3} /></label>
        <div className="vsets-actions"><button className="vsets-primary" disabled={pending}>{pending ? "Đang tạo…" : "Tạo bộ"}</button><button type="button" disabled={pending} onClick={closeCreateForm}>Hủy</button></div>
        {error ? <p role="alert" className="vsets-error">{error}</p> : null}
      </form>
    </div> : null}
  </main>;
}
