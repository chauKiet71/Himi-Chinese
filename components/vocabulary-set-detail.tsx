"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Copy, Layers3, Pencil, PenLine, Plus, Search, Trash2 } from "lucide-react";
import { hanziCharacters, type VocabularySet } from "@/lib/vocabulary-sets";
import { requestVocabularySet } from "@/lib/vocabulary-set-client";

export function VocabularySetDetail({ set, authenticated }: { set: VocabularySet; authenticated: boolean }) {
  const savedCollection = set.id === "saved";
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [refreshing, startTransition] = useTransition();
  const pending = busy || refreshing;
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = set.words.filter((word) => `${word.hanzi} ${word.pinyin} ${word.meaning}`.toLocaleLowerCase("vi").includes(query.trim().toLocaleLowerCase("vi")));
  async function mutate(body: unknown, success: string) {
    setBusy(true); setError(""); setMessage("");
    try {
      await requestVocabularySet(`/api/vocabulary-sets/${set.id}`, "PATCH", body);
      setMessage(success); startTransition(() => router.refresh()); return true;
    } catch (error) { setError(error instanceof Error ? error.message : "Chưa thể lưu thay đổi."); return false; }
    finally { setBusy(false); }
  }
  async function submit(event: FormEvent<HTMLFormElement>, action: "update" | "addWord") {
    event.preventDefault();
    const form = event.currentTarget;
    if (await mutate({ action, data: Object.fromEntries(new FormData(form)) }, action === "update" ? "Đã lưu thông tin bộ." : "Đã thêm từ vào bộ.")) {
      if (action === "update") setEditing(false); else form.reset();
    }
  }
  async function copy() {
    setBusy(true); setError("");
    try { const result = await requestVocabularySet("/api/vocabulary-sets", "POST", { sourceId: set.id }); router.push(`/vocabulary/${result.id}`); }
    catch (error) { setError(error instanceof Error ? error.message : "Chưa thể sao chép."); setBusy(false); }
  }
  async function removeSet() {
    if (!window.confirm(`Xóa bộ “${set.title}” và toàn bộ từ trong bộ?`)) return;
    setBusy(true); setError("");
    try { await requestVocabularySet(`/api/vocabulary-sets/${set.id}`, "DELETE"); router.push("/vocabulary"); router.refresh(); }
    catch (error) { setError(error instanceof Error ? error.message : "Chưa thể xóa bộ."); setBusy(false); }
  }
  return <main className="vsets-page">
    <Link className="vsets-back" href="/vocabulary"><ArrowLeft size={17} /> Bộ từ vựng</Link>
    <header className="vsets-detail-header"><div><span className="vsets-eyebrow">{savedCollection ? "TỪ ĐÃ LƯU" : set.builtin ? "BỘ CÓ SẴN" : "BỘ CỦA TÔI"} · {set.words.length} TỪ VỰNG</span><h1>{set.title}</h1><p>{set.description || "Thêm những từ bạn muốn nhớ vào bộ này."}</p></div><div className="vsets-actions">{savedCollection ? null : set.builtin ? authenticated ? <button disabled={pending} onClick={copy}><Copy size={17} /> {busy ? "Đang sao chép…" : "Lưu thành bộ của tôi"}</button> : <Link href={`/login?returnTo=${encodeURIComponent(`/vocabulary/${set.id}`)}`}>Đăng nhập để sao chép</Link> : <><button disabled={pending} onClick={() => setEditing(!editing)}><Pencil size={16} /> Sửa thông tin</button><button className="vsets-danger" disabled={pending} onClick={removeSet}><Trash2 size={16} /> Xóa bộ</button></>}</div></header>
    {error ? <p className="vsets-error" role="alert">{error}</p> : null}<p className="vsets-status" role="status">{message}</p>
    {editing ? <form className="vsets-panel vsets-form" onSubmit={(event) => submit(event, "update")}><h2>Sửa thông tin bộ</h2><label>Tên bộ<input name="title" required maxLength={100} defaultValue={set.title} /></label><label>Mô tả<textarea name="description" maxLength={500} defaultValue={set.description} /></label><div className="vsets-actions"><button className="vsets-primary" disabled={pending}>Lưu thay đổi</button><button type="button" onClick={() => setEditing(false)}>Hủy</button></div></form> : null}
    <section className="vsets-study-options" aria-label="Bắt đầu học"><h2>Bắt đầu học</h2><div>{[
      { mode: "vocabulary", label: "Từ vựng", hint: "Hiểu nghĩa, nghe phát âm và đọc ví dụ.", Icon: BookOpen, disabled: !set.words.length },
      { mode: "hanzi", label: "Chữ Hán", hint: "Xem thứ tự nét và luyện viết từng chữ.", Icon: PenLine, disabled: !hanziCharacters(set.words).length },
      { mode: "flashcard", label: "Flashcard", hint: "Lật thẻ, tự kiểm tra và ôn từ chưa nhớ.", Icon: Layers3, disabled: !set.words.length },
    ].map(({ mode, label, hint, Icon, disabled }) => disabled ? <div className="vsets-mode disabled" key={mode}><Icon size={24} /><strong>{label}</strong><p>Thêm từ để bắt đầu học.</p></div> : <Link className="vsets-mode" href={`/vocabulary/${set.id}/study/${mode}`} key={mode}><Icon size={24} /><strong>{label}</strong><p>{hint}</p><ArrowRight size={18} /></Link>)}</div></section>
    <div className="vsets-section-heading"><h2>Danh sách từ <span>({set.words.length})</span></h2>{!set.builtin ? <button className="vsets-primary" onClick={() => setAdding(!adding)}><Plus size={17} /> Thêm từ</button> : null}</div>
    {adding ? <form className="vsets-panel vsets-form" onSubmit={(event) => submit(event, "addWord")}><h3>Thêm từ mới</h3><div className="vsets-form-row"><label>Từ tiếng Trung<input autoFocus name="hanzi" required maxLength={40} placeholder="学习" /></label><label>Pinyin<input name="pinyin" required maxLength={160} placeholder="xuéxí" /></label><label>Nghĩa tiếng Việt<input name="meaning" required maxLength={300} placeholder="Học tập" /></label></div><div className="vsets-form-row"><label>Ví dụ (không bắt buộc)<input name="example" maxLength={500} placeholder="我喜欢学习中文。" /></label><label>Dịch ví dụ<input name="translation" maxLength={500} placeholder="Tôi thích học tiếng Trung." /></label></div><div className="vsets-actions"><button className="vsets-primary" disabled={pending}>{pending ? "Đang lưu…" : "Thêm vào bộ"}</button><button type="button" onClick={() => setAdding(false)}>Đóng</button></div></form> : null}
    {set.words.length ? <label className="vsets-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm chữ Hán, pinyin hoặc nghĩa…" aria-label="Tìm từ trong bộ" /></label> : null}
    {filtered.length ? <ul className="vsets-word-list">{filtered.map((word, index) => <li key={word.id}><span className="vsets-word-number">{index + 1}</span><div><strong lang="zh">{word.hanzi}</strong><span>{word.pinyin}</span></div><div><strong>{word.meaning}</strong>{word.example ? <p><span lang="zh">{word.example}</span>{word.translation ? ` — ${word.translation}` : ""}</p> : null}</div>{!set.builtin ? <button disabled={pending} className="vsets-icon-button vsets-danger" aria-label={`Xóa từ ${word.hanzi}`} onClick={() => { if (window.confirm(`Xóa từ “${word.hanzi}” khỏi bộ?`)) void mutate({ action: "removeWord", wordId: word.id }, "Đã xóa từ khỏi bộ."); }}><Trash2 size={17} /></button> : null}</li>)}</ul> : <div className="vsets-empty"><BookOpen size={32} /><h3>{query ? "Không tìm thấy từ phù hợp" : "Bộ này chưa có từ"}</h3><p>{query ? "Thử tìm bằng chữ Hán, pinyin hoặc nghĩa khác." : "Nhấn “Thêm từ” để chuẩn bị cho buổi học đầu tiên."}</p></div>}
  </main>;
}
