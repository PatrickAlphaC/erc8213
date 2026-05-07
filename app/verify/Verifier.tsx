"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Frame } from "../components/Frame";
import { CopyHex } from "../components/CopyHex";
import { OpenInCyfrin } from "../components/OpenInCyfrin";
import {
  calldataDigest,
  eip712Digests,
  isHex,
  byteLen,
  type Hex,
  type TypedDataInput,
} from "../lib/digests";
import { examplePermit, exampleCalldata } from "../lib/example";

type Mode = "typed" | "calldata";

const examplePermitJson = JSON.stringify(examplePermit, null, 2);

const PARAM_TYPED = "typed";
const PARAM_CALLDATA = "calldata";
const PARAM_MODE = "mode";

function ResultPanel({
  num,
  label,
  formula,
  value,
  note,
  primary,
}: {
  num: string;
  label: string;
  formula: React.ReactNode;
  value: Hex | null;
  note?: string;
  primary?: boolean;
}) {
  return (
    <Frame className={primary ? "p-6 md:p-8" : "p-5 md:p-6"}>
      <div className="flex items-baseline justify-between mb-3 gap-3">
        <div className="flex items-baseline gap-3">
          <span className="text-accent text-[10px] tracking-[0.25em]">§{num}</span>
          <span
            className={`uppercase tracking-[0.18em] ${
              primary ? "text-sm md:text-base" : "text-xs"
            } text-ink`}
          >
            {label}
          </span>
        </div>
        {primary ? (
          <span className="serif-italic text-ink-dim text-sm">primary</span>
        ) : null}
      </div>
      <div className="text-xs text-ink-dim mb-3 hex">{formula}</div>
      {value ? (
        <CopyHex value={value} label={label} size={primary ? "lg" : "md"} />
      ) : (
        <div className="text-ink-faint text-sm italic">
          waiting for valid input…
        </div>
      )}
      {note ? (
        <div className="text-xs text-ink-faint mt-3 pt-3 border-t border-rule">
          {note}
        </div>
      ) : null}
    </Frame>
  );
}

export function Verifier() {
  const [mode, setMode] = useState<Mode>("typed");
  const [typedInput, setTypedInput] = useState<string>(examplePermitJson);
  const [calldataInput, setCalldataInput] = useState<string>(exampleCalldata);
  const hydratedRef = useRef(false);

  // Hydrate state from URL once on mount, so a shared link
  // (`/verify?mode=calldata&calldata=0x…`) restores the verification.
  // setState-in-effect is the standard pattern for one-shot URL hydration in
  // a statically-exported client component — `window` isn't available at
  // build time, so a useState initializer cannot read it.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const m = sp.get(PARAM_MODE);
    if (m === "calldata" || m === "typed") setMode(m);
    const t = sp.get(PARAM_TYPED);
    if (t) setTypedInput(t);
    const cd = sp.get(PARAM_CALLDATA);
    if (cd) setCalldataInput(cd);
    hydratedRef.current = true;
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Reflect state back into the URL without scrolling/reloading.
  useEffect(() => {
    if (!hydratedRef.current || typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    sp.set(PARAM_MODE, mode);
    if (typedInput && typedInput !== examplePermitJson) sp.set(PARAM_TYPED, typedInput);
    else sp.delete(PARAM_TYPED);
    if (calldataInput && calldataInput !== exampleCalldata) sp.set(PARAM_CALLDATA, calldataInput);
    else sp.delete(PARAM_CALLDATA);
    const next = sp.toString();
    const url = `${window.location.pathname}${next ? `?${next}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", url);
  }, [mode, typedInput, calldataInput]);

  const typedResult = useMemo(() => {
    try {
      const parsed = JSON.parse(typedInput) as TypedDataInput;
      if (!parsed.domain || !parsed.types || !parsed.primaryType || !parsed.message) {
        return { ok: false as const, err: "JSON missing one of: domain, types, primaryType, message" };
      }
      return { ok: true as const, value: eip712Digests(parsed) };
    } catch (e) {
      return { ok: false as const, err: e instanceof Error ? e.message : String(e) };
    }
  }, [typedInput]);

  const calldataResult = useMemo(() => {
    const trimmed = calldataInput.trim();
    if (!trimmed) return { ok: false as const, err: "empty" };
    if (!isHex(trimmed)) {
      return {
        ok: false as const,
        err: "not 0x-prefixed hex with even nibble count",
      };
    }
    const hex = trimmed as Hex;
    return {
      ok: true as const,
      value: { digest: calldataDigest(hex), len: byteLen(hex) },
    };
  }, [calldataInput]);

  return (
    <section className="mx-auto max-w-[1280px] px-6 md:px-10 mt-4 mb-32">
      {/* Mode toggle */}
      <div className="flex items-center gap-0 border-b border-rule mb-10">
        {([
          { id: "typed", label: "EIP-712 typed data", num: "A" },
          { id: "calldata", label: "Calldata", num: "B" },
        ] as { id: Mode; label: string; num: string }[]).map((t) => {
          const active = mode === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setMode(t.id)}
              className={[
                "relative px-5 py-3 text-xs tracking-[0.18em] uppercase transition-colors",
                active ? "text-accent" : "text-ink-dim hover:text-ink",
              ].join(" ")}
            >
              <span className="text-[10px] mr-2 text-ink-faint">{t.num}</span>
              {t.label}
              {active ? (
                <span className="absolute -bottom-px left-0 right-0 h-px bg-accent" />
              ) : null}
            </button>
          );
        })}
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => {
            if (mode === "typed") setTypedInput(examplePermitJson);
            else setCalldataInput(exampleCalldata);
          }}
          className="text-[10px] tracking-[0.18em] uppercase text-ink-faint hover:text-accent transition-colors px-3 py-3"
        >
          ↺ load example
        </button>
      </div>

      {mode === "typed" ? (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-6">
            <div className="marginalia mb-3">input · typed data (json)</div>
            <textarea
              className="field hex"
              rows={22}
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              spellCheck={false}
            />
            <div className="mt-2 min-h-[1.5rem] text-xs">
              {typedResult.ok ? (
                <span className="text-ok">✓ parsed · {Object.keys((JSON.parse(typedInput) as TypedDataInput).types).length} types defined</span>
              ) : (
                <span className="text-err">✕ {typedResult.err}</span>
              )}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="marginalia mb-3">output · digests</div>
            <div className="space-y-4">
              <ResultPanel
                num="01"
                label="EIP-712 Digest"
                primary
                formula={<>keccak256(0x1901 ‖ domainSeparator ‖ hashStruct(message))</>}
                value={typedResult.ok ? typedResult.value.digest : null}
                note="What the wallet asks ECDSA to sign. This is the value to compare."
              />
              <ResultPanel
                num="02"
                label="Domain Hash"
                formula={<>hashStruct(eip712Domain)</>}
                value={typedResult.ok ? typedResult.value.domainHash : null}
              />
              <ResultPanel
                num="03"
                label="Message Hash"
                formula={<>hashStruct(message)</>}
                value={typedResult.ok ? typedResult.value.messageHash : null}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-6">
            <div className="marginalia mb-3">input · raw calldata (0x…)</div>
            <textarea
              className="field hex"
              rows={22}
              value={calldataInput}
              onChange={(e) => setCalldataInput(e.target.value)}
              spellCheck={false}
            />
            <div className="mt-2 min-h-[1.5rem] text-xs flex items-center justify-between gap-3 flex-wrap">
              {calldataResult.ok ? (
                <span className="text-ok">
                  ✓ {calldataResult.value.len.toLocaleString()} bytes
                </span>
              ) : (
                <span className="text-err">✕ {calldataResult.err}</span>
              )}
              {calldataResult.ok ? (
                <OpenInCyfrin data={calldataInput.trim()} label="Decode in Cyfrin Tools" />
              ) : null}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="marginalia mb-3">output · digest</div>
            <ResultPanel
              num="04"
              label="Calldata Digest"
              primary
              formula={<>keccak256(uint256(len) ‖ calldata)</>}
              value={calldataResult.ok ? calldataResult.value.digest : null}
              note="ChainId is intentionally not included so the same digest can be reproduced across networks."
            />

            <Frame className="p-5 mt-4">
              <div className="marginalia mb-2">independent verification</div>
              <p className="text-xs text-ink-dim leading-relaxed">
                To verify this matches a wallet display, copy the digest above
                and visually diff it against the wallet&apos;s screen. Equality
                is the only acceptable outcome — even a single byte
                divergence means you are about to sign something different from
                what you pasted.
              </p>
            </Frame>
          </div>
        </div>
      )}
    </section>
  );
}
