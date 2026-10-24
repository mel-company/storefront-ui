import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const SRC_DOC =
  '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0"></body></html>';

export interface FrameProps {
  /** The device width the content is laid out at. */
  width: number;
  title: string;
  /** Cap the visible height; the frame scrolls inside. */
  maxHeight?: number;
  /** Fill the parent's height and scroll inside, instead of growing with the content. */
  fill?: boolean;
  /** Scrolls the frame back to the top whenever this changes, like a page navigation. */
  scrollKey?: string;
  children: ReactNode;
}

/**
 * Renders children inside an iframe at a real device width, so media queries
 * behave like on a phone or desktop, then scales it down to fit the column.
 * The library's styles are copied in and kept in sync during development.
 */
export function Frame({ width, title, maxHeight, fill = false, scrollKey, children }: FrameProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [body, setBody] = useState<HTMLElement | null>(null);
  const [contentHeight, setContentHeight] = useState(320);
  const [available, setAvailable] = useState(width);
  const [boxHeight, setBoxHeight] = useState(0);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      setAvailable(entry.contentRect.width);
      setBoxHeight(entry.contentRect.height);
    });
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    let cleanup = () => {};

    const setup = () => {
      const doc = iframe.contentDocument;
      if (!doc?.body) return;
      let pending: Promise<unknown>[] = [];
      const syncStyles = () => {
        const copies: Element[] = [];
        pending = [];
        for (const sheet of Array.from(document.styleSheets)) {
          const owner = sheet.ownerNode as Element | null;
          if (!owner) continue;
          let css: string | null = null;
          try {
            // Same-origin sheets go in as inline CSS: they apply at once, with no second request.
            css = Array.from(sheet.cssRules, (rule) => rule.cssText).join("\n");
          } catch {
            // Cross-origin (fonts): only the link can be copied.
          }
          let copy: Element;
          if (css === null) {
            copy = owner.cloneNode(true) as Element;
            pending.push(new Promise((resolve) => copy.addEventListener("load", resolve, { once: true })));
          } else {
            copy = doc.createElement("style");
            copy.textContent = css;
          }
          copy.setAttribute("data-copied", "");
          copies.push(copy);
        }
        doc.head.querySelectorAll("[data-copied]").forEach((node) => node.remove());
        copies.forEach((copy) => doc.head.appendChild(copy));
      };
      syncStyles();
      const styles = new MutationObserver(syncStyles);
      styles.observe(document.head, { childList: true, subtree: true, characterData: true });
      const size = new ResizeObserver(() => setContentHeight(doc.body.scrollHeight));
      size.observe(doc.body);
      let cancelled = false;
      // Show content only once its styles are in, never as bare HTML. Capped, so a slow font never hides the preview.
      void Promise.race([Promise.all(pending), new Promise((resolve) => window.setTimeout(resolve, 1500))]).then(() => {
        if (!cancelled) setBody(doc.body);
      });
      cleanup = () => {
        cancelled = true;
        styles.disconnect();
        size.disconnect();
      };
    };

    // The initial about:blank document is replaced once srcdoc loads, so only
    // attach to the srcdoc document.
    const doc = iframe.contentDocument;
    if (doc?.URL === "about:srcdoc" && doc.readyState === "complete") setup();
    else iframe.addEventListener("load", setup, { once: true });
    return () => {
      iframe.removeEventListener("load", setup);
      cleanup();
    };
  }, []);

  useEffect(() => {
    iframeRef.current?.contentWindow?.scrollTo(0, 0);
  }, [scrollKey]);

  const scale = Math.min(1, available / width);
  const height = fill ? boxHeight / scale : maxHeight ? Math.min(contentHeight, maxHeight) : contentHeight;

  return (
    <div ref={wrapRef} className="frame" style={fill ? { height: "100%" } : { height: height * scale }}>
      <iframe
        ref={iframeRef}
        title={title}
        srcDoc={SRC_DOC}
        style={{ width, height, transform: `scale(${scale})`, insetInlineStart: Math.max(0, (available - width) / 2) }}
      />
      {body && createPortal(children, body)}
    </div>
  );
}
