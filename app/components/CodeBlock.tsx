"use client";

import { useState, type ReactNode } from "react";

export function CodeBlock({
  language,
  children,
  filename,
  raw,
}: {
  language?: string;
  children: ReactNode;
  filename?: string;
  raw?: string;
}) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    if (!raw) return;
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* noop */
    }
  };
  return (
    <div className="group">
      {(filename || language) && (
        <div className="flex items-center justify-between border border-rule border-b-0 px-4 py-2 bg-bg-alt text-[10px] tracking-[0.18em] uppercase text-ink-faint">
          <span>{filename ?? language}</span>
          {raw ? (
            <button
              type="button"
              onClick={onCopy}
              className="text-ink-faint hover:text-accent transition-colors"
            >
              {copied ? "copied" : "copy"}
            </button>
          ) : null}
        </div>
      )}
      <pre className="code">{children}</pre>
    </div>
  );
}
