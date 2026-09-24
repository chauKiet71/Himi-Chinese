"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MutableRefObject, type ReactNode } from "react";
import { AudioLines, Award, CircleStop, LoaderCircle, Mic, RotateCcw, Volume2 } from "lucide-react";
import { speakMandarin } from "@/lib/client-mandarin-audio";

export type PronunciationResult = {
  totalScore: number;
  accuracyScore: number | null;
  fluencyScore: number | null;
  integrityScore: number | null;
  toneScore: number | null;
  weakSyllables: string[];
  feedback: string;
  characterFeedback: Array<"correct" | "incorrect" | "unscored">;
};

type RecorderSession = {
  context: AudioContext;
  source: MediaStreamAudioSourceNode;
  processor: ScriptProcessorNode;
  silentGain: GainNode;
  stream: MediaStream;
  chunks: Float32Array[];
  sampleRate: number;
};

type IflytekResponse = {
  code: number;
  message?: string;
  data?: { status?: number; data?: string };
};

function mergeAudioChunks(chunks: Float32Array[]) {
  const length = chunks.reduce((total, chunk) => total + chunk.length, 0);
  const merged = new Float32Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }
  return merged;
}

function toPcm16(audio: Float32Array, sourceRate: number) {
  const targetRate = 16_000;
  const ratio = sourceRate / targetRate;
  const sampleCount = Math.max(1, Math.round(audio.length / ratio));
  const pcm = new Int16Array(sampleCount);

  for (let outputIndex = 0; outputIndex < sampleCount; outputIndex += 1) {
    const start = Math.floor(outputIndex * ratio);
    const end = Math.max(start + 1, Math.min(audio.length, Math.floor((outputIndex + 1) * ratio)));
    let sum = 0;
    for (let inputIndex = start; inputIndex < end; inputIndex += 1) sum += audio[inputIndex];
    const sample = Math.max(-1, Math.min(1, sum / (end - start)));
    pcm[outputIndex] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }

  return new Uint8Array(pcm.buffer);
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function decodeBase64Utf8(value: string) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function numberAttribute(element: Element, name: string) {
  const rawValue = element.getAttribute(name)
    ?? element.querySelector(`${name}[value]`)?.getAttribute("value")
    ?? "";
  const raw = Number.parseFloat(rawValue);
  if (!Number.isFinite(raw)) return null;
  return Math.max(0, Math.min(100, raw <= 10 ? raw * 10 : raw));
}

export function parseIflytekPronunciationResult(xml: string, targetText = ""): PronunciationResult {
  const document = new DOMParser().parseFromString(xml, "application/xml");
  if (document.querySelector("parsererror")) throw new Error("iFlytek trả về kết quả không hợp lệ.");
  // iFLYTEK Global wraps the scored node in another element with the same
  // category name. Select the descendant that actually owns total_score.
  const scoreNode = document.querySelector(
    "read_sentence[total_score], read_word[total_score], read_syllable[total_score], read_chapter[total_score], rec_paper[total_score]",
  ) ?? document.querySelector("[total_score]") ?? document.querySelector("FinalResult");
  if (!scoreNode) throw new Error("Không tìm thấy điểm phát âm trong kết quả iFlytek.");

  const totalScore = numberAttribute(scoreNode, "total_score");
  if (totalScore === null) throw new Error("iFlytek chưa trả về điểm tổng.");
  const weakSyllables = Array.from(document.querySelectorAll("syll"))
    .filter((node) => {
      const detail = Number(node.getAttribute("dp_message") ?? node.getAttribute("perr_msg") ?? "0");
      return Number.isFinite(detail) && detail !== 0;
    })
    .map((node) => node.getAttribute("content") ?? "")
    .filter((content) => content && !["sil", "silv", "fil"].includes(content))
    .filter((content, index, items) => items.indexOf(content) === index)
    .slice(0, 4);

  const feedback = totalScore >= 85
    ? "Phát âm rõ và tự nhiên. Hãy giữ nhịp nói này."
    : totalScore >= 70
      ? "Khá tốt. Hãy nghe lại mẫu và chú ý thanh điệu ở cuối câu."
      : totalScore >= 50
        ? "Đã đúng phần chính. Nói chậm hơn và tách rõ từng cụm từ."
        : "Hãy nghe lại câu mẫu, đọc từng cụm ngắn rồi thử lại.";
  const hanzi = Array.from(targetText).filter((character) => /\p{Script=Han}/u.test(character));
  const scoredCharacters = Array.from(document.querySelectorAll("word[content], char[content]"))
    .flatMap((node) => {
      const content = node.getAttribute("content") ?? "";
      const detail = Number(node.getAttribute("dp_message") ?? node.getAttribute("perr_msg") ?? "0");
      const score = numberAttribute(node, "total_score") ?? numberAttribute(node, "phone_score");
      const state: "correct" | "incorrect" = (Number.isFinite(detail) && detail !== 0) || (score !== null && score < 60) ? "incorrect" : "correct";
      return Array.from(content).filter((character) => /\p{Script=Han}/u.test(character)).map(() => state);
    });
  const characterFeedback = hanzi.map((_, index) => scoredCharacters[index]
    ?? (totalScore >= 85 ? "correct" : totalScore < 50 ? "incorrect" : "unscored"));

  return {
    totalScore: Math.round(totalScore),
    accuracyScore: numberAttribute(scoreNode, "accuracy_score") ?? numberAttribute(scoreNode, "phone_score"),
    fluencyScore: numberAttribute(scoreNode, "fluency_score"),
    integrityScore: numberAttribute(scoreNode, "integrity_score"),
    toneScore: numberAttribute(scoreNode, "tone_score"),
    weakSyllables,
    feedback,
    characterFeedback,
  };
}

function categoryFor(text: string) {
  const characters = Array.from(text.replace(/[\s，。！？、,.!?]/g, ""));
  if (characters.length <= 1) return "read_syllable";
  if (characters.length <= 4) return "read_word";
  return "read_sentence";
}

async function evaluateWithIflytek(pcm: Uint8Array, targetText: string, webSocketRef: MutableRefObject<WebSocket | null>) {
  const authResponse = await fetch("/api/speech/iflytek/authorize", { method: "POST", cache: "no-store" });
  const auth = await authResponse.json() as { appId?: string; url?: string; message?: string };
  if (!authResponse.ok || !auth.appId || !auth.url) throw new Error(auth.message ?? "Không thể kết nối dịch vụ iFlytek.");

  return new Promise<PronunciationResult>((resolve, reject) => {
    const socket = new WebSocket(auth.url!);
    webSocketRef.current = socket;
    let settled = false;
    let sendTimer: number | null = null;
    const timeout = window.setTimeout(() => finish(new Error("iFlytek phản hồi quá lâu. Hãy thử lại.")), 30_000);

    function finish(error?: Error, result?: PronunciationResult) {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      if (sendTimer !== null) window.clearInterval(sendTimer);
      webSocketRef.current = null;
      if (socket.readyState === WebSocket.OPEN) socket.close(1000, "complete");
      if (error) reject(error);
      else if (result) resolve(result);
    }

    socket.onerror = () => finish(new Error("Không thể mở kết nối chấm phát âm iFlytek."));
    socket.onmessage = (event) => {
      try {
        const response = JSON.parse(String(event.data)) as IflytekResponse;
        if (response.code !== 0) {
          finish(new Error(`iFlytek: ${response.message ?? `lỗi ${response.code}`}`));
          return;
        }
        if (response.data?.status === 2 && response.data.data) {
          finish(undefined, parseIflytekPronunciationResult(decodeBase64Utf8(response.data.data), targetText));
        }
      } catch (error) {
        finish(error instanceof Error ? error : new Error("Không đọc được kết quả iFlytek."));
      }
    };
    socket.onopen = () => {
      socket.send(JSON.stringify({
        common: { app_id: auth.appId },
        business: {
          sub: "ise",
          ent: "cn_vip",
          category: categoryFor(targetText),
          cmd: "ssb",
          text: `\uFEFF${targetText}`,
          tte: "utf-8",
          ttp_skip: true,
          aue: "raw",
          auf: "audio/L16;rate=16000",
          rstcd: "utf8",
          group: "adult",
          check_type: "common",
          rst: "entirety",
          ise_unite: "1",
          extra_ability: "multi_dimension;syll_phone_err_msg",
        },
        data: { status: 0, data: "" },
      }));

      const frameSize = 1280;
      let offset = 0;
      let firstFrame = true;
      sendTimer = window.setInterval(() => {
        if (socket.readyState !== WebSocket.OPEN) return;
        if (offset >= pcm.length) {
          if (sendTimer !== null) window.clearInterval(sendTimer);
          sendTimer = null;
          socket.send(JSON.stringify({
            business: { cmd: "auw", aus: 4, aue: "raw" },
            data: { status: 2, data: "", data_type: 1, encoding: "raw" },
          }));
          return;
        }

        const frame = pcm.subarray(offset, Math.min(offset + frameSize, pcm.length));
        socket.send(JSON.stringify({
          business: { cmd: "auw", aus: firstFrame ? 1 : 2, aue: "raw" },
          data: { status: 1, data: bytesToBase64(frame), data_type: 1, encoding: "raw" },
        }));
        firstFrame = false;
        offset += frame.length;
      }, 40);
    };
  });
}

export function PronunciationEvaluator({
  targetText,
  compact = false,
  showListen = true,
  listenRate = 1,
  actionMiddle = null,
  onEvaluated,
  previewResult = null,
}: {
  targetText: string;
  compact?: boolean;
  showListen?: boolean;
  listenRate?: number;
  actionMiddle?: ReactNode;
  onEvaluated?: (result: PronunciationResult) => void;
  previewResult?: PronunciationResult | null;
}) {
  const [status, setStatus] = useState<"idle" | "recording" | "evaluating">("idle");
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PronunciationResult | null>(previewResult);
  const recorderRef = useRef<RecorderSession | null>(null);
  const timerRef = useRef<number | null>(null);
  const autoStopRef = useRef<number | null>(null);
  const stopRecordingRef = useRef<() => void>(() => undefined);
  const webSocketRef = useRef<WebSocket | null>(null);

  const releaseRecorder = useCallback(async () => {
    const recorder = recorderRef.current;
    recorderRef.current = null;
    if (!recorder) return null;
    recorder.processor.onaudioprocess = null;
    recorder.source.disconnect();
    recorder.processor.disconnect();
    recorder.silentGain.disconnect();
    recorder.stream.getTracks().forEach((track) => track.stop());
    await recorder.context.close();
    return recorder;
  }, []);

  const stopRecording = useCallback(async () => {
    if (status !== "recording") return;
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
    if (autoStopRef.current !== null) window.clearTimeout(autoStopRef.current);
    autoStopRef.current = null;
    setStatus("evaluating");
    setError("");
    const recorder = await releaseRecorder();
    if (!recorder) {
      setStatus("idle");
      return;
    }

    const samples = mergeAudioChunks(recorder.chunks);
    if (samples.length < recorder.sampleRate * 0.35) {
      setError("Đoạn ghi âm quá ngắn. Hãy đọc trọn câu rồi dừng.");
      setStatus("idle");
      return;
    }

    try {
      const nextResult = await evaluateWithIflytek(toPcm16(samples, recorder.sampleRate), targetText, webSocketRef);
      setResult(nextResult);
      onEvaluated?.(nextResult);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Chưa thể chấm phát âm. Hãy thử lại.");
    } finally {
      setStatus("idle");
    }
  }, [onEvaluated, releaseRecorder, status, targetText]);
  useEffect(() => {
    stopRecordingRef.current = () => { void stopRecording(); };
  }, [stopRecording]);

  const startRecording = async () => {
    setError("");
    setResult(null);
    setSeconds(0);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Trình duyệt này chưa hỗ trợ ghi âm bằng micro.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      const AudioContextConstructor = window.AudioContext
        ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextConstructor) throw new Error("Thiết bị chưa hỗ trợ xử lý âm thanh.");
      const context = new AudioContextConstructor();
      const source = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(4096, 1, 1);
      const silentGain = context.createGain();
      silentGain.gain.value = 0;
      const chunks: Float32Array[] = [];
      processor.onaudioprocess = (event) => chunks.push(new Float32Array(event.inputBuffer.getChannelData(0)));
      source.connect(processor);
      processor.connect(silentGain);
      silentGain.connect(context.destination);
      recorderRef.current = { context, source, processor, silentGain, stream, chunks, sampleRate: context.sampleRate };
      setStatus("recording");
      timerRef.current = window.setInterval(() => setSeconds((current) => current + 1), 1000);
      autoStopRef.current = window.setTimeout(() => stopRecordingRef.current(), 30_000);
    } catch (caught) {
      setError(caught instanceof Error && caught.name === "NotAllowedError"
        ? "Bạn cần cho phép dùng micro để chấm phát âm."
        : caught instanceof Error ? caught.message : "Không thể mở micro.");
    }
  };

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    if (autoStopRef.current !== null) window.clearTimeout(autoStopRef.current);
    webSocketRef.current?.close(1000, "leave");
    void releaseRecorder();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, [releaseRecorder]);

  const resultLabel = result
    ? result.totalScore >= 90 ? "Tốt"
      : result.totalScore >= 75 ? "Khá tốt"
        : result.totalScore >= 50 ? "Trung bình"
          : "Cần luyện thêm"
    : "";
  const resultTone = result
    ? result.totalScore >= 90 ? "excellent"
      : result.totalScore >= 75 ? "good"
        : result.totalScore >= 50 ? "average"
          : "practice"
    : "";

  return <div className={`pronunciation-evaluator${compact ? " is-compact" : ""}`}>
    <div className="pronunciation-actions">
      {showListen ? <button className="pronunciation-listen" onClick={() => speakMandarin(targetText, undefined, listenRate)} type="button">
        <Volume2 size={18} /> Nghe mẫu
      </button> : null}
      {actionMiddle ? <div className="pronunciation-action-middle">{actionMiddle}</div> : null}
      <div className="pronunciation-record-stage">
        <span aria-hidden="true" className="pronunciation-waveform"><AudioLines size={88} strokeWidth={1.6} /></span>
        {status === "recording" ? <button aria-label="Dừng ghi âm" className="pronunciation-record is-recording" onClick={stopRecording} type="button">
          <CircleStop size={19} /> {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
        </button> : <button className="pronunciation-record" disabled={status === "evaluating"} onClick={startRecording} type="button">
          {status === "evaluating" ? <LoaderCircle className="lesson-vocab-spinner" size={19} /> : <Mic size={19} />}
          {status === "evaluating" ? "Đang chấm điểm…" : "Đọc"}
        </button>}
        <span aria-hidden="true" className="pronunciation-waveform pronunciation-waveform-end"><AudioLines size={88} strokeWidth={1.6} /></span>
      </div>
    </div>

    {error ? <div className="pronunciation-error" role="alert"><span>{error}</span><button onClick={() => setError("")} type="button"><RotateCcw size={15} /> Thử lại</button></div> : null}
    {result ? <div className={`pronunciation-result is-${resultTone}`} aria-live="polite">
      <div className="pronunciation-total"><span className="pronunciation-score-label"><Award aria-hidden="true" size={15} /> Điểm phát âm</span><span className="pronunciation-score-value"><strong>{result.totalScore}</strong><small>/100</small></span></div>
      <div className="pronunciation-feedback"><span className="pronunciation-rating">{resultLabel}</span><p>{result.feedback}</p>
        {result.weakSyllables.length ? <div className="pronunciation-weakness"><small>Âm cần chú ý</small><span>{result.weakSyllables.map((syllable) => <i key={syllable}>{syllable}</i>)}</span></div> : null}
      </div>
      {!compact ? <div className="pronunciation-dimensions">
        {[["Độ chính xác", result.accuracyScore], ["Độ trôi chảy", result.fluencyScore], ["Độ đầy đủ", result.integrityScore], ["Thanh điệu", result.toneScore]].map(([label, score]) => score !== null
          ? <span key={String(label)}><small>{label}</small><i aria-hidden="true"><b style={{ "--pronunciation-score": `${score}%` } as CSSProperties} /></i><strong>{score}</strong></span>
          : null)}
      </div> : null}
    </div> : null}
  </div>;
}
