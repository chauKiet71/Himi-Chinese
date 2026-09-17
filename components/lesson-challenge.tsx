"use client";

import { useState } from "react";
import { CheckCircle2, LockKeyhole, RotateCcw } from "lucide-react";
import type { LessonChallenge } from "@/lib/content-types";
import { VipUpgradeInlineForm } from "@/components/vip-upgrade-prompt";

export function LessonChallengePanel({
  challenge,
  onPassed,
  onComplete,
}: {
  challenge: LessonChallenge;
  onPassed: (passed: boolean) => void;
  onComplete?: () => void;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState<number | null>(null);
  const accessibleQuestionIndexes = challenge.questions.flatMap((question, index) => question.locked ? [] : [index]);
  const answered = accessibleQuestionIndexes.filter((index) => answers[index] !== undefined).length;
  const passed = score !== null && accessibleQuestionIndexes.length > 0 && score >= challenge.passScore;

  function choose(questionIndex: number, optionIndex: number) {
    setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }));
    if (score !== null) {
      setScore(null);
      onPassed(false);
    }
  }

  function grade() {
    const nextScore = accessibleQuestionIndexes.reduce(
      (total, index) => total + (answers[index] === challenge.questions[index].correctOption ? 1 : 0),
      0,
    );
    setScore(nextScore);
    onPassed(nextScore >= challenge.passScore);
  }

  function retry() {
    setAnswers({});
    setScore(null);
    onPassed(false);
  }

  return <section className="lesson-challenge" aria-labelledby="lesson-challenge-title">
    <div className="lesson-challenge-heading">
      <div><span className="section-kicker">Kiểm tra kiến thức</span><h2 id="lesson-challenge-title">{challenge.title}</h2><p>{challenge.description}</p></div>
      <div className="lesson-challenge-target"><strong>{challenge.passScore}/{accessibleQuestionIndexes.length}</strong><span>Điểm đạt</span></div>
    </div>

    <div className="challenge-question-list">{challenge.questions.map((question, questionIndex) => question.locked ? <fieldset className="challenge-question is-locked" key={question.id ?? `locked-${questionIndex}`}>
      <legend><span>{String(questionIndex + 1).padStart(2, "0")}</span><LockKeyhole aria-hidden="true" size={15} /> Câu hỏi VIP</legend>
      <p className="challenge-locked-copy">Nội dung và đáp án của câu này chỉ được gửi đến tài khoản VIP.</p>
      <VipUpgradeInlineForm className="button button-secondary" />
    </fieldset> : <fieldset className="challenge-question" key={question.id ?? question.prompt}>
      <legend><span>{String(questionIndex + 1).padStart(2, "0")}</span>{question.prompt}</legend>
      <div className="challenge-options">{question.options.map((option, optionIndex) => {
        const selected = answers[questionIndex] === optionIndex;
        const correct = score !== null && optionIndex === question.correctOption;
        const incorrect = score !== null && selected && optionIndex !== question.correctOption;
        return <label className={`${selected ? "selected" : ""}${correct ? " correct" : ""}${incorrect ? " incorrect" : ""}`} key={option}>
          <input
            checked={selected}
            name={`challenge-question-${questionIndex}`}
            onChange={() => choose(questionIndex, optionIndex)}
            type="radio"
            value={optionIndex}
          />
          <span>{option}</span>
        </label>;
      })}</div>
      {score !== null ? <p className="challenge-explanation">{question.explanation}</p> : null}
    </fieldset>)}</div>

    <div className="challenge-result" aria-live="polite">
      {accessibleQuestionIndexes.length === 0 ? <p>Tất cả câu hỏi trong bài này yêu cầu tài khoản VIP.</p> : score === null ? <p>Đã trả lời {answered}/{accessibleQuestionIndexes.length} câu có thể truy cập.</p> : passed
        ? <p className="challenge-result-pass"><CheckCircle2 size={19} /> Đạt {score}/{accessibleQuestionIndexes.length}. Bạn có thể hoàn thành bài và tiếp tục.</p>
        : <p>Đạt {score}/{accessibleQuestionIndexes.length}. Hãy xem giải thích và thử lại.</p>}
      {accessibleQuestionIndexes.length === 0
        ? <VipUpgradeInlineForm />
        : score === null
        ? <button className="button button-primary" disabled={answered !== accessibleQuestionIndexes.length} onClick={grade} type="button">Chấm kết quả</button>
        : passed && onComplete ? <div className="challenge-result-actions"><button className="button button-secondary" onClick={retry} type="button"><RotateCcw size={17} /> Làm lại</button><button className="button button-primary" onClick={onComplete} type="button"><CheckCircle2 size={17} /> Hoàn thành bài</button></div>
        : <button className="button button-secondary" onClick={retry} type="button"><RotateCcw size={17} /> Làm lại</button>}
    </div>
  </section>;
}
