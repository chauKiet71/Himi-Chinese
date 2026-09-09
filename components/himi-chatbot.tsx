"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { ChevronDown, LoaderCircle, MessageSquareMore, Paperclip, Send, X } from "lucide-react";
import { BrandLogoImage } from "@/components/brand-logo";
import { hiddenAfterCompletion, SUPPORT_IMAGE_BYTES, type SupportStatus } from "@/lib/support-domain";

type Conversation = { id: string; status: SupportStatus; completedAt: string | null; userName: string; userEmail?: string };
type Message = { id: string; senderType: "USER" | "ADMIN" | "SYSTEM"; content: string; imageUrl: string | null; createdAt: string };
type Detail = { conversation: Conversation; messages: Message[]; serverNow: string; nextBefore: string | null };
const labels: Record<SupportStatus, string> = { OPEN: "Đang chờ nhân viên tiếp nhận", CLAIMED: "Nhân viên đang hỗ trợ", WAITING_USER: "Nhân viên đã phản hồi", COMPLETED: "Yêu cầu đã hoàn thành" };
class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.status = status; }
}
async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...options, cache: "no-store", credentials: "same-origin" });
  const body = await response.json();
  if (!response.ok) throw new ApiError(body.error ?? "Không thể kết nối. Vui lòng thử lại.", response.status);
  return body as T;
}

export function HimiChatbot() {
  const [open, setOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [draft, setDraft] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [connectionError, setConnectionError] = useState(false);
  const [now, setNow] = useState(0);
  const [revision, setRevision] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const nearBottom = useRef(true);
  const busyRef = useRef(false);
  const initialized = useRef(false);
  const offset = useRef(0);
  const requestRef = useRef<{ signature: string; requestId: string; imageId: string; uploaded: boolean } | null>(null);
  const [olderMessages, setOlderMessages] = useState<Message[]>([]);
  const [olderCursor, setOlderCursor] = useState<string | null | undefined>(undefined);
  const closeChat = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => launcherRef.current?.focus(), 180);
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 220);
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") closeChat(); };
    window.addEventListener("keydown", escape);
    return () => { window.clearTimeout(timer); window.removeEventListener("keydown", escape); };
  }, [open, closeChat]);
  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let failureCount = 0;
    const poll = async () => {
      try {
        if (document.visibilityState === "hidden") return;
        const result = await api<{ conversations: Conversation[]; profile: { userName: string; userEmail: string }; serverNow: string }>(
          "/api/support/conversations", { signal: controller.signal });
        if (controller.signal.aborted) return;
        offset.current = new Date(result.serverNow).getTime() - Date.now();
        setNow(Date.now() + offset.current);
        setAuthenticated(true); setLoaded(true);
        if (!initialized.current) {
          initialized.current = true;
          setUserName(result.profile.userName); setUserEmail(result.profile.userEmail);
          if (!selectedId && result.conversations[0]) { setSelectedId(result.conversations[0].id); return; }
        }
        if (selectedId) {
          const next = await api<Detail>("/api/support/conversations/" + selectedId, { signal: controller.signal });
          if (controller.signal.aborted) return;
          setDetail(next);
        }
        failureCount = 0;
        setConnectionError(false);
      } catch (err) {
        if (controller.signal.aborted) return;
        failureCount++;
        if (err instanceof ApiError && err.status === 401) {
          setAuthenticated(false); setDetail(null); setSelectedId(null);
          setDraft(""); setUserName(""); setUserEmail(""); setAttachment(null); setPreview(null); requestRef.current = null;
          initialized.current = false; setOlderMessages([]); setLoaded(true);
        } else if (err instanceof ApiError && err.status === 404) {
          setDetail(null); setSelectedId(null); setOlderMessages([]); setOlderCursor(undefined);
          initialized.current = false;
        } else setConnectionError(true);
      } finally {
        if (!controller.signal.aborted) timer = setTimeout(poll, Math.min(30_000, 5000 * 2 ** failureCount));
      }
    };
    void poll();
    return () => { controller.abort(); clearTimeout(timer); };
  }, [open, selectedId, revision]);
  useEffect(() => {
    if (!open) return;
    const timer = window.setInterval(() => setNow(Date.now() + offset.current), 1000);
    return () => window.clearInterval(timer);
  }, [open]);
  useEffect(() => {
    if (!open || !nearBottom.current) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [detail, open]);

  const active = detail?.conversation.id === selectedId ? detail : null;
  const hidden = !!active && hiddenAfterCompletion(active.conversation.completedAt, now);
  const visibleMessages = active && !hidden ? [...new Map([...olderMessages, ...active.messages].map(m => [m.id, m])).values()]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id)) : [];
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busyRef.current || (!draft.trim() && !attachment)) return;
    busyRef.current = true; setBusy(true); setError(""); setNotice("");
    const signature = JSON.stringify([selectedId, draft, userName, userEmail, attachment?.name, attachment?.size, attachment?.lastModified]);
    if (requestRef.current?.signature !== signature) requestRef.current = {
      signature, requestId: crypto.randomUUID(), imageId: crypto.randomUUID(), uploaded: false,
    };
    const pending = requestRef.current;
    try {
      if (attachment && !pending.uploaded) {
        setNotice("Đang tải ảnh lên…");
        await api("/api/support/images", { method: "POST", headers: { "Content-Type": attachment.type, "Idempotency-Key": pending.imageId }, body: attachment });
        pending.uploaded = true;
      }
      setNotice("Đang gửi yêu cầu…");
      const result = await api<{ conversationId: string }>(selectedId ? "/api/support/conversations/" + selectedId + "/messages" : "/api/support/conversations", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
          userName, userEmail, content: draft, imageId: attachment ? pending.imageId : null, requestId: pending.requestId,
        }),
      });
      setSelectedId(result.conversationId); setDraft(""); setAttachment(null); setPreview(null); requestRef.current = null;
      setNotice("Đã lưu tin nhắn và chuyển vào hàng đợi hỗ trợ.");
      nearBottom.current = true; setRevision(v => v + 1);
    } catch (err) { setError(err instanceof Error ? err.message : "Gửi chưa thành công. Thử lại để tiếp tục."); setNotice(""); }
    finally { busyRef.current = false; setBusy(false); }
  }
  async function loadOlder() {
    const cursor = olderCursor === undefined ? active?.nextBefore : olderCursor;
    if (!selectedId || !cursor || busyRef.current) return;
    busyRef.current = true; setBusy(true);
    try {
      const page = await api<Detail>("/api/support/conversations/" + selectedId + "?before=" + encodeURIComponent(cursor));
      setOlderMessages(previous => [...page.messages, ...previous]); setOlderCursor(page.nextBefore);
    } catch { setError("Không tải được lịch sử. Vui lòng thử lại."); }
    finally { busyRef.current = false; setBusy(false); }
  }

  return (
    <aside className={"himi-chatbot-widget " + (open ? "is-open" : "")} aria-label="Himi hỗ trợ">
      <section id="himi-support-panel" aria-label="Hỗ trợ Himi qua nhân viên" aria-hidden={!open} className="himi-chatbot-panel" role="dialog">
        <header className="himi-chatbot-header">
          <span className="himi-chatbot-header-avatar"><BrandLogoImage size={46} /></span>
          <span className="himi-chatbot-header-copy"><strong>Himi hỗ trợ</strong><span>Trao đổi trực tiếp với nhân viên</span></span>
          <button aria-label="Thu gọn cửa sổ chat" onClick={closeChat} type="button"><ChevronDown size={22} /></button>
        </header>
        <div className="himi-chatbot-messages" ref={listRef} onScroll={() => {
          const el = listRef.current; if (el) nearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        }}>
          {connectionError ? <p className="himi-support-error" role="status">Đang mất kết nối. Himi sẽ tự thử lại; tin đã lưu không bị mất.</p> : null}
          {!loaded ? <p role="status">Đang tải hỗ trợ…</p> : authenticated === false ?
            <p>Đăng nhập để gửi yêu cầu và lưu lịch sử trao đổi của bạn. <a href="/login">Đăng nhập</a></p> : <>
              {active && !hidden ? <p className="himi-support-status" role="status">{labels[active.conversation.status]}
                {active.conversation.completedAt ? " · Ẩn sau " + Math.max(0, Math.ceil((new Date(active.conversation.completedAt).getTime() + 60_000 - now) / 1000)) + " giây" : ""}</p> : null}
              {!hidden && (olderCursor === undefined ? active?.nextBefore : olderCursor) ? <button className="himi-support-history" disabled={busy} onClick={loadOlder} type="button">Xem tin nhắn trước</button> : null}
              {visibleMessages.map(message => <article className={"himi-chatbot-message is-" + (message.senderType === "USER" ? "user" : "assistant")} key={message.id}>
                {message.senderType !== "USER" ? <span className="himi-chatbot-message-avatar" aria-hidden="true"><BrandLogoImage size={28} /></span> : null}
                <div className="himi-support-bubble">
                  {message.senderType !== "USER" ? <span className="himi-support-sender">{message.senderType === "ADMIN" ? "Nhân viên Himi" : "Hệ thống"}</span> : null}
                  {message.content ? <p>{message.content}</p> : null}
                  {message.imageUrl ? <a href={message.imageUrl} target="_blank" rel="noreferrer"><Image alt="Ảnh đính kèm trong hội thoại" src={message.imageUrl} width={240} height={180} unoptimized /></a> : null}
                </div>
              </article>)}
            </>}
        </div>
        {authenticated ? <form className="himi-chatbot-composer" onSubmit={submit}>
          {attachment ? <div className="himi-chatbot-attachment">
            {preview ? <Image src={preview} alt="Ảnh chuẩn bị gửi" width={40} height={40} unoptimized /> : null}
            <span>{attachment.name}</span><button aria-label="Bỏ ảnh đính kèm" disabled={busy} onClick={() => { setAttachment(null); setPreview(null); }} type="button"><X size={16} /></button>
          </div> : null}
          {error ? <p className="himi-support-error" role="alert">{error}</p> : null}
          <p className="himi-support-notice" aria-live="polite">{notice}</p>
          <div className="himi-chatbot-input-shell">
            <input type="text" aria-label="Nhập tin nhắn" placeholder="Nhập nội dung cần hỗ trợ…" ref={inputRef} maxLength={3000} value={draft} onChange={e => setDraft(e.target.value)} disabled={busy} />
            <button aria-label="Đính kèm ảnh (tối đa 5 MB)" className="himi-chatbot-icon-button" disabled={busy} onClick={() => fileRef.current?.click()} type="button"><Paperclip size={19} /></button>
            <input accept="image/jpeg,image/png,image/webp" className="himi-chatbot-file-input" ref={fileRef} tabIndex={-1} type="file" onChange={e => {
              const file = e.target.files?.[0]; e.target.value = "";
              if (!file) return;
              if (file.size > SUPPORT_IMAGE_BYTES || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setError("Chọn ảnh JPG, PNG hoặc WebP tối đa 5 MB."); return; }
              setAttachment(file); setPreview(URL.createObjectURL(file)); setError("");
            }} />
            <button aria-label="Gửi tin nhắn" className="himi-chatbot-send" disabled={busy || (!draft.trim() && !attachment)} type="submit">
              {busy ? <LoaderCircle className="himi-support-spinner" size={18} /> : <Send size={18} />}
            </button>
          </div>
        </form> : null}
      </section>
      <button aria-expanded={open} aria-controls="himi-support-panel" aria-haspopup="dialog" aria-label="Mở trợ lý Himi" className="himi-chatbot-launcher" onClick={() => setOpen(true)} ref={launcherRef} type="button">
        <span className="himi-chatbot-launcher-icon" aria-hidden="true"><MessageSquareMore size={34} strokeWidth={2.35} /></span>
        <span className="himi-chatbot-launcher-badge" aria-hidden="true" />
      </button>
    </aside>
  );
}
