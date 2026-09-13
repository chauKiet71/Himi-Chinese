import type { ReactNode } from "react";
import gameMotionStylesheetHref from "../game-motion.css?url";
import gameCompletionStylesheetHref from "../game-completion.css?url";

export default function GamesLayout({ children }: { children: ReactNode }) {
  return <>
    <link href={gameMotionStylesheetHref} precedence="himi-games-motion" rel="stylesheet" />
    <link href={gameCompletionStylesheetHref} precedence="himi-games-completion" rel="stylesheet" />
    {children}
  </>;
}
