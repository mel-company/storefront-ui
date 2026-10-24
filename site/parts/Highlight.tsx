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

const TSX = /(\/\/[^\n]*)|("(?:\\.|[^"\\])*")|\b(import|from|export|function|return|const)\b|(<\/?)([A-Z]\w*)/g;

/** Just enough TSX highlighting for the short samples on this page. */
export function highlightTsx(source: string): ReactNode {
  const out: ReactNode[] = [];
  let last = 0;
  for (const match of source.matchAll(TSX)) {
    const index = match.index ?? 0;
    if (index > last) out.push(source.slice(last, index));
    const [text, comment, string, keyword, bracket, tag] = match;
    if (comment) out.push(<span key={index} className="tok-com">{comment}</span>);
    else if (string) out.push(<span key={index} className="tok-str">{string}</span>);
    else if (keyword) out.push(<span key={index} className="tok-kw">{keyword}</span>);
    else if (tag) {
      out.push(bracket);
      out.push(<span key={index} className="tok-tag">{tag}</span>);
    }
    last = index + text.length;
  }
  out.push(source.slice(last));
  return <Fragment>{out}</Fragment>;
}
