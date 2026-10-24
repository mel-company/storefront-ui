import { useState, type ReactNode } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="copy"
      onClick={() => {
        void navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1400);
        });
      }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function CodeBlock({ code, label, children }: { code: string; label?: string; children?: ReactNode }) {
  return (
    <div className="code">
      <div className="code-head">
        <span>{label ?? ""}</span>
        <CopyButton text={code} />
      </div>
      <pre>
        <code>{children ?? code}</code>
      </pre>
    </div>
  );
}
