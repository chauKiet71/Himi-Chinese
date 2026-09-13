import type { ReactNode } from "react";
import lessonStylesheetHref from "../hsk-lesson.css?url";
import guidedStylesheetHref from "../hsk-guided-lesson.css?url";
import quizStylesheetHref from "../hsk-quiz.css?url";
import interactiveStylesheetHref from "../lesson-interactive.css?url";

export default function HskLayout({ children }: { children: ReactNode }) {
  return <>
    <link href={lessonStylesheetHref} precedence="himi-hsk-lesson" rel="stylesheet" />
    <link href={guidedStylesheetHref} precedence="himi-hsk-guided" rel="stylesheet" />
    <link href={quizStylesheetHref} precedence="himi-hsk-quiz" rel="stylesheet" />
    <link href={interactiveStylesheetHref} precedence="himi-lesson-interactive" rel="stylesheet" />
    {children}
  </>;
}
