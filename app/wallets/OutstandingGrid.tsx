"use client";

import { useState } from "react";
import Image from "next/image";
import { kindLabel, type Wallet } from "./data";

const KIND_FILTERS: ReadonlyArray<{ id: "all" | Wallet["kind"]; label: string }> = [
  { id: "all", label: "All" },
  { id: "hardware", label: "Hardware" },
  { id: "browser", label: "Browser" },
  { id: "mobile", label: "Mobile" },
  { id: "smart-contract", label: "Smart contract" },
];

function Logo({ w }: { w: Wallet }) {
  return (
    <div
      className="w-12 h-12 shrink-0 flex items-center justify-center border p-1.5"
      style={{
        background: `color-mix(in srgb, var(--color-ink) 90%, ${w.color} 10%)`,
        borderColor: `${w.color}66`,
      }}
    >
      <Image
        src={w.logo}
        alt={`${w.name} logo`}
        width={48}
        height={48}
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
}

export function OutstandingGrid({ wallets }: { wallets: Wallet[] }) {
  const [filter, setFilter] = useState<"all" | Wallet["kind"]>("all");

  const filtered =
    filter === "all" ? wallets : wallets.filter((w) => w.kind === filter);

  const counts = KIND_FILTERS.reduce<Record<string, number>>((acc, f) => {
    acc[f.id] =
      f.id === "all" ? wallets.length : wallets.filter((w) => w.kind === f.id).length;
    return acc;
  }, {});

  return (
    <>
      {/* Filter chips */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="marginalia mr-2">filter</span>
        {KIND_FILTERS.map((f) => {
          const active = filter === f.id;
          const empty = counts[f.id] === 0;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              disabled={empty}
              className={[
                "px-3 py-1.5 text-[11px] tracking-[0.15em] uppercase border transition-colors",
                active
                  ? "border-accent text-accent"
                  : "border-rule-strong text-ink-dim hover:border-accent hover:text-accent",
                empty ? "opacity-40 cursor-not-allowed hover:border-rule-strong hover:text-ink-dim" : "",
              ].join(" ")}
            >
              {f.label}
              <span className="ml-2 text-ink-faint tnum">
                {counts[f.id]?.toString().padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((w) => (
          <div
            key={w.id}
            className="border border-rule p-4 flex items-center gap-4 transition-colors hover:border-rule-strong"
          >
            <Logo w={w} />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-base text-ink">{w.name}</span>
                <span className="tag">{kindLabel[w.kind]}</span>
              </div>
              {w.notes ? (
                <p className="mt-1 text-xs text-ink-faint truncate">{w.notes}</p>
              ) : null}
            </div>
            <span className="inline-flex items-center gap-2">
              <span className="dot dot-err" />
              <span className="text-err text-xs tracking-[0.15em] uppercase">
                Not implemented
              </span>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
