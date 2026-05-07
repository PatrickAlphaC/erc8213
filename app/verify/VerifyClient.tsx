"use client";

import { PageHeader } from "../components/PageHeader";
import { Verifier } from "./Verifier";

export default function VerifyClient() {
  return (
    <>
      <PageHeader
        num="03"
        kicker="for signers"
        title={
          <>
            Reproduce<span className="serif-italic text-ink-dim"> the digest. </span>Trust nothing.
          </>
        }
        description={
          <>
            Paste typed data or calldata below. The four fingerprints are computed in your browser, on this page only, and never leave the tab. Compare them, character by character, against what your wallet displays before you sign.
          </>
        }
      />

      <section className="mx-auto max-w-[1280px] px-6 md:px-10 -mt-4 mb-2">
        <div className="border border-rule p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-sm text-ink-dim leading-relaxed">
            <span className="text-accent text-[10px] tracking-[0.2em] uppercase mr-3 align-middle">
              also useful
            </span>
            <span className="serif-italic text-ink">This page fingerprints. </span>
            For full ABI decoding — function names, argument values, nested multicall payloads — open the calldata in Cyfrin Tools.
          </div>
          <a
            href="https://tools.cyfrin.io/abi-encoding"
            target="_blank"
            rel="noopener noreferrer"
            className="btn shrink-0"
          >
            Open Cyfrin Tools ↗
          </a>
        </div>
      </section>

      <Verifier />
    </>
  );
}
