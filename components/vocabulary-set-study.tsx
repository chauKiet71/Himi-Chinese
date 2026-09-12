"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Volume2, X } from "lucide-react";
import { hanziCharacters, type VocabularySet, type SetStudyMode } from "@/lib/vocabulary-sets";

const Writing = dynamic(() => import("./vocabulary-set-writing").then((module) => module.VocabularySetWriting), { ssr: false, loading: () => <p role="status">Đang mở ô luyện viết…</p> });
const modeLabels = { vocabulary: "Từ vựng", hanzi: "Chữ Hán", flashcard: "Flashcard" };

export function VocabularySetStudy({ set, mode }: { set: VocabularySet; mode: SetStudyMode }) {
  const [words, setWords] = useState(set.words);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [missed, setMissed] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [audioError, setAudioError] = useState("");
  const characters = hanziCharacters(words);
  const total = mode === "hanzi" ? characters.length : words.length;
  const word = words[index];
  const character = characters[index];
  const characterWords = mode === "hanzi" ? words.filter((item) => item.hanzi.includes(character)) : [];
  const studyBase = `/vocabulary/${set.id}/study`;
  const back = set.id === "saved" ? "/vocabulary" : `/vocabulary/${set.id}`;
  const backLabel = set.id === "saved" ? "Bộ từ vựng" : "Chi tiết bộ";
  const returnLabel = set.id === "saved" ? "Về bộ từ vựng" : "Về chi tiết bộ";
  const progressValue = total ? done ? total : Math.min(index + 1, total) : 0;
  useEffect(() => () => { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); }, []);
  function stopAudio() { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); setAudioError(""); }
  function speak() {
    stopAudio();
    if (!("speechSynthesis" in window)) { setAudioError("Trình duyệt chưa hỗ trợ phát âm."); return; }
    const utterance = new SpeechSynthesisUtterance(mode === "hanzi" ? character : word.hanzi);
    utterance.lang = "zh-CN"; utterance.rate = 0.82;
    utterance.onerror = (event) => { if (event.error !== "canceled" && event.error !== "interrupted") setAudioError("Chưa thể phát âm. Hãy kiểm tra giọng tiếng Trung trên thiết bị."); };
    window.speechSynthesis.speak(utterance);
  }
  function next(remembered = true) {
    stopAudio();
    if (!remembered && word) setMissed((current) => [...current, word.id]);
    setFlipped(false);
    if (index + 1 >= total) setDone(true); else setIndex(index + 1);
  }
  function restart(onlyMissed = false) {
    stopAudio(); setWords(onlyMissed ? words.filter((item) => missed.includes(item.id)) : set.words);
    setIndex(0); setFlipped(false); setMissed([]); setDone(false);
  }
  return <main className="vsets-page vsets-session vsets-immersive-session">
    <header className="vsets-immersive-header">
      <div className="vsets-immersive-toolbar">
        <Link aria-label={`Thoát lượt học về ${backLabel}`} href={back}><X aria-hidden="true" size={22} /></Link>
        <div aria-label={`Bước ${progressValue} trên ${total}`} aria-valuemax={Math.max(total, 1)} aria-valuemin={0} aria-valuenow={progressValue} className="vsets-immersive-progress" role="progressbar"><span style={{ width: `${total ? (progressValue / total) * 100 : 0}%` }} /></div>
        <strong>{progressValue} / {total}</strong>
        <span>{modeLabels[mode]}</span>
      </div>
      <div className="vsets-immersive-heading">
        <div><small>ÔN TẬP BỘ TỪ</small><h1>{set.title}</h1></div>
        <nav className="vsets-tabs" aria-label="Chế độ học">{Object.entries(modeLabels).map(([value, label]) => <Link aria-current={value === mode ? "page" : undefined} href={`${studyBase}/${value}`} key={value}>{label}</Link>)}</nav>
      </div>
    </header>

    <section className="vsets-immersive-stage">
      {!total ? <div className="vsets-empty"><h2>Chưa có từ để học</h2><p>Thêm từ vào bộ rồi quay lại bắt đầu nhé.</p><Link className="vsets-primary" href={back}>{returnLabel}</Link></div>
        : done ? <section className="vsets-empty vsets-complete"><span className="vsets-complete-icon"><Check size={36} /></span><h2>Hoàn thành lượt học!</h2><p>{mode === "flashcard" ? `Bạn đã nhớ ${total - missed.length}/${total} từ trong lượt này.` : `Bạn đã xem ${total} ${mode === "hanzi" ? "chữ Hán" : "từ vựng"}.`}</p><div className="vsets-actions">{missed.length ? <button className="vsets-primary" onClick={() => restart(true)}>Ôn {missed.length} từ chưa nhớ</button> : null}<button onClick={() => restart()}><RotateCcw size={17} /> Học lại toàn bộ</button><Link href={back}>{returnLabel}</Link></div></section>
        : <>
          <span className="vsets-immersive-kicker">{mode === "hanzi" ? "Chữ" : "Từ"} {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
          {mode === "hanzi" ? <section className="vsets-study-card"><Writing key={character} character={character} /><p className="vsets-character-context">Có trong: {characterWords.map((item) => `${item.hanzi} (${item.pinyin}) — ${item.meaning}`).join("; ")}</p></section>
            : mode === "flashcard" ? <button className={`vsets-study-card vsets-flashcard${flipped ? " is-flipped" : ""}`} aria-label={flipped ? "Ẩn nghĩa của thẻ" : "Lật thẻ để xem nghĩa"} aria-pressed={flipped} onClick={() => setFlipped(!flipped)}><small>{flipped ? "NGHĨA TIẾNG VIỆT" : "BẠN CÒN NHỚ TỪ NÀY?"}</small><strong className="vsets-large-hanzi" lang={flipped ? "vi" : "zh"}>{flipped ? word.meaning : word.hanzi}</strong>{flipped ? <><span>{word.hanzi} · {word.pinyin}</span>{word.example ? <p>{word.example}<br />{word.translation}</p> : null}</> : null}<small>Nhấn để {flipped ? "trở về mặt trước" : "lật thẻ"}</small></button>
              : <article className="vsets-study-card"><small>TỪ VỰNG</small><strong className="vsets-large-hanzi" lang="zh">{word.hanzi}</strong><span className="vsets-pinyin">{word.pinyin}</span><h2>{word.meaning}</h2>{word.example ? <div className="vsets-example"><p lang="zh">{word.example}</p><p>{word.translation}</p></div> : null}</article>}
          <div className="vsets-audio"><button onClick={speak}><Volume2 size={20} /> Nghe phát âm</button>{audioError ? <p role="status">{audioError}</p> : null}</div>
          {mode === "flashcard" && !flipped ? <p className="vsets-hint">Lật thẻ để xem đáp án trước khi tự đánh giá.</p> : null}
        </>}
    </section>

    {total && !done ? <footer className="vsets-immersive-footer">
      {mode === "flashcard"
        ? <button disabled={!flipped} onClick={() => next(false)} type="button"><RotateCcw size={17} /> Chưa nhớ</button>
        : <button disabled={!index} onClick={() => { stopAudio(); setIndex(index - 1); }} type="button"><ArrowLeft size={17} /> Trước</button>}
      <span><strong>{mode === "hanzi" ? "Chữ" : "Từ"} {index + 1} / {total}</strong><small>{mode === "flashcard" ? "Lật thẻ rồi tự đánh giá" : "Học lần lượt theo bộ từ"}</small></span>
      {mode === "flashcard"
        ? <button className="vsets-primary" disabled={!flipped} onClick={() => next(true)} type="button"><Check size={18} /> Đã nhớ</button>
        : <button className="vsets-primary" onClick={() => next()} type="button">{index === total - 1 ? "Hoàn thành" : "Tiếp theo"}<ArrowRight size={17} /></button>}
    </footer> : null}
  </main>;
}
