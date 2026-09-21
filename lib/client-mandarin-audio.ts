"use client";

export function speakMandarin(text: string, onDone?: () => void, rate = 1) {
  if (!("speechSynthesis" in window)) {
    onDone?.();
    return false;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = rate;
  utterance.pitch = 1;
  utterance.onend = () => onDone?.();
  utterance.onerror = () => onDone?.();
  window.speechSynthesis.speak(utterance);
  return true;
}
