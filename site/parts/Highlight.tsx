import { Fragment, type ReactNode } from "react";

const TOKEN = /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?)/g;

/** A tiny JSON highlighter: keys, strings, numbers and literals. */
export function highlightJson(source: string): ReactNode {
  const out: ReactNode[] = [];
  let last = 0;
  for (const match of source.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) out.push(source.slice(last, index));
    const [text, string, colon, literal, number] = match;
    const kind = string ? (colon ? "key" : "str") : literal ? "lit" : number ? "num" : "";
    out.push(
      <span key={index} className={`tok-${kind}`}>
        {string ?? text}
      </span>,
    );
    if (colon) out.push(colon);
    last = index + text.length;
  }
  out.push(source.slice(last));
  return <Fragment>{out}</Fragment>;
}

