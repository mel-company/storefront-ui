import { useState } from "react";

export function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="code">
      {label && <span className="code-label">{label}</span>}
      <button
        type="button"
        className="code-copy"
        onClick={() => {
          void navigator.clipboard?.writeText(code).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
          });
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
