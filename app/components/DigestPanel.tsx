import type { ReactNode } from "react";
import { Frame } from "./Frame";
import { CopyHex } from "./CopyHex";

export function DigestPanel({
  num,
  label,
  formula,
  value,
  desc,
  accent = false,
}: {
  num: string;
  label: string;
  formula: ReactNode;
  value: string;
  desc?: ReactNode;
  accent?: boolean;
}) {
  return (
    <Frame className={accent ? "p-6 md:p-8" : "p-5 md:p-6"}>
      <div className="flex items-baseline justify-between mb-4">
        <div className="flex items-baseline gap-3">
          <span className="text-accent text-[10px] tracking-[0.25em]">
            §{num}
          </span>
          <span
            className={`uppercase tracking-[0.18em] ${
              accent ? "text-sm md:text-base" : "text-xs"
            } text-ink`}
          >
            {label}
          </span>
        </div>
        {accent ? (
          <span className="serif-italic text-ink-dim text-sm">primary</span>
        ) : null}
      </div>
      <div className="text-xs text-ink-dim mb-3 hex">{formula}</div>
      <CopyHex value={value} label={label} size={accent ? "lg" : "md"} />
      {desc ? (
        <div className="text-xs text-ink-dim leading-relaxed mt-4 pt-4 border-t border-rule">
          {desc}
        </div>
      ) : null}
    </Frame>
  );
}
