"use client";

import { useState } from "react";

export function CopyHex({
  value,
  label,
  size = "md",
}: {
  value: string;
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* noop */
    }
  };
  const sizeCls =
    size === "lg"
      ? "text-base md:text-lg"
      : size === "sm"
        ? "text-xs"
        : "text-sm";
  return (
    <div className="group flex items-start gap-3">
      <div className={`hex flex-1 ${sizeCls} text-ink leading-relaxed`}>
        {value}
      </div>
      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy ${label ?? "value"}`}
        className="shrink-0 text-[10px] tracking-[0.15em] uppercase text-ink-faint hover:text-accent transition-colors px-2 py-1 border border-rule-strong"
      >
        {copied ? "copied" : "copy"}
      </button>
    </div>
  );
}
