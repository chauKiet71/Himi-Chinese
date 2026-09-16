import type { HskVocabularyAudio } from "./hsk-lesson-content.ts";

let currentAudio: HTMLAudioElement | null = null;

export function cancelHskPronunciation(): void {
  currentAudio?.pause();
  currentAudio = null;
  if (typeof window !== "undefined") window.speechSynthesis?.cancel();
}

function speakWithBrowser(text: string, rate: number): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = rate;
  const voice = window.speechSynthesis.getVoices().find((candidate) => (
    candidate.lang.toLocaleLowerCase().startsWith("zh")
  ));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
  return true;
}

export async function playHskPronunciation({
  audio,
  rate = 1,
  text,
}: {
  audio?: HskVocabularyAudio;
  rate?: number;
  text: string;
}): Promise<boolean> {
  cancelHskPronunciation();
  const source = rate < 1 ? audio?.slow ?? audio?.normal : audio?.normal ?? audio?.slow;
  if (!source || typeof Audio === "undefined") return speakWithBrowser(text, rate);

  const player = new Audio(source);
  player.playbackRate = rate < 1 && audio?.slow ? 1 : rate;
  currentAudio = player;
  try {
    await player.play();
    return true;
  } catch {
    if (currentAudio === player) currentAudio = null;
    return speakWithBrowser(text, rate);
  }
}
