"use client";

import { DigestPanel } from "./components/DigestPanel";
import { Frame } from "./components/Frame";
import { OpenInCyfrin } from "./components/OpenInCyfrin";
import { calldataDigest, eip712Digests, byteLen } from "./lib/digests";
import { exampleCalldata, examplePermit } from "./lib/example";

const { domainHash, messageHash, digest } = eip712Digests(examplePermit);
const cdDigest = calldataDigest(exampleCalldata);
const cdLen = byteLen(exampleCalldata);

export default function HomePageClient() {
  return (
    <>
      {/* HERO — tight headline + the comparison as the centerpiece */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-[0.18] pointer-events-none" />
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-10 pt-12 md:pt-14 pb-14 md:pb-20">
          <div className="grid grid-cols-12 gap-6 items-end mb-8 md:mb-10">
            <div className="col-span-12 md:col-span-3 reveal" style={{ animationDelay: "60ms" }}>
              <div className="section-num">§ 00 · erc-8213</div>
              <div className="marginalia mt-1">draft · 2026</div>
            </div>
            <div className="col-span-12 md:col-span-9 reveal" style={{ animationDelay: "120ms" }}>
              <h1 className="text-[32px] md:text-[56px] leading-[1.02] tracking-[-0.03em] text-ink">
                Cryptographic fingerprints,{" "}
                <span className="serif-italic text-accent">displayed honestly.</span>
              </h1>
            </div>
          </div>

          <div
            className="grid grid-cols-12 gap-4 md:gap-6 items-stretch reveal"
            style={{ animationDelay: "260ms" }}
          >
            <div className="col-span-12 md:col-span-6 flex flex-col">
              <div className="flex items-baseline justify-between mb-4 gap-3">
                <span className="text-sm md:text-base tracking-[0.18em] uppercase text-ink-dim">
                  what your wallet shows you today
                </span>
                <span className="text-ink-faint text-xs md:text-sm tracking-[0.25em]">A</span>
              </div>
              <div className="frame p-6 md:p-8 bg-bg flex-1 flex flex-col">
                <span className="corner-bl" />
                <span className="corner-br" />
                <div className="hex text-[13px] md:text-[15px] text-ink-dim leading-[1.65] break-all flex-1">
                  {exampleCalldata.slice(0, 500)}
                  <span className="text-ink-faint">…</span>
                </div>
                <div className="mt-5 pt-5 border-t border-rule flex items-center justify-between gap-3 flex-wrap">
                  <span className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-err flex items-center gap-2">
                    <span className="dot dot-err" />
                    unverifiable · {cdLen.toLocaleString()} bytes
                  </span>
                  <OpenInCyfrin data={exampleCalldata} label="Decode" />
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6 flex flex-col">
              <div className="flex items-baseline justify-between mb-4 gap-3">
                <span className="text-sm md:text-base tracking-[0.18em] uppercase text-ink">
                  what erc-8213 asks for
                </span>
                <span className="text-accent text-xs md:text-sm tracking-[0.25em]">B</span>
              </div>
              <Frame className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-accent mb-3">
                    calldata digest
                  </div>
                  <div className="hex text-lg md:text-2xl lg:text-[28px] text-ink break-all leading-[1.4]">
                    {cdDigest}
                  </div>
                  <div className="serif-italic text-ink-dim text-base md:text-lg mt-5 max-w-[440px]">
                    Same payload. Reproducible from the calldata alone, on any device, on any chain.
                  </div>
                </div>
                <div className="mt-5 pt-5 border-t border-rule text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-ok flex items-center gap-2">
                  <span className="dot dot-ok" />
                  32 bytes · independently reproducible
                </div>
              </Frame>
            </div>
          </div>
        </div>
      </section>

      {/* THE PITCH */}
      <section className="border-t border-rule bg-bg-alt">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-14 md:py-20">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-2">
              <div className="marginalia">the pitch</div>
            </div>
            <div className="col-span-12 md:col-span-9">
              <p className="text-base md:text-xl text-ink-dim leading-relaxed max-w-[720px]">
                A wallet asks you to sign. You see a hex blob the length of a paragraph, or worse — nothing at all.{" "}
                <span className="serif-italic text-ink">ERC-8213</span> standardises four short fingerprints so a signer can independently verify what is being signed, on any device, against any source of truth.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#/verify" className="btn btn-accent">
                  Verify a signature →
                </a>
                <a href="#/wallets" className="btn">
                  Wallet support
                </a>
                <a
                  href="https://github.com/ethereum/ERCs/pull/1639"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                >
                  Read the spec ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE FOUR DIGESTS */}
      <section className="mx-auto max-w-[1280px] px-6 md:px-10 pt-20 md:pt-32 pb-16">
        <div className="grid grid-cols-12 gap-6 mb-12 md:mb-20">
          <div className="col-span-12 md:col-span-2">
            <div className="section-num">§ 01</div>
            <div className="marginalia mt-2">terminology</div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="text-3xl md:text-5xl leading-[1.05] tracking-[-0.02em] text-ink">
              Four digests.
              <br />
              <span className="serif-italic text-ink-dim">One vocabulary every wallet should speak.</span>
            </h2>
            <p className="mt-6 text-ink-dim text-base md:text-lg leading-relaxed max-w-[640px]">
              ERC-8213 doesn&apos;t invent new cryptography. It standardises the names, encodings, and display rules for values that already exist — so you can compare what your wallet shows to what an independent verifier shows, byte for byte.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10">
          <div className="lg:col-span-2">
            <DigestPanel
              num="01"
              label="EIP-712 Digest"
              accent
              formula={
                <>
                  keccak256(<span className="text-accent">0x1901</span> ‖ domainSeparator ‖ hashStruct(message))
                </>
              }
              value={digest}
              desc={
                <>
                  The single 32-byte value an ECDSA signer signs for typed data. Wallets{" "}
                  <em className="serif-italic text-ink">should</em> display this — alone or alongside the domain and message hashes — when prompting for an EIP-712 signature.
                </>
              }
            />
          </div>
          <DigestPanel
            num="02"
            label="Domain Hash"
            formula={<>hashStruct(eip712Domain)</>}
            value={domainHash}
            desc={
              <>
                A fingerprint of the dapp&apos;s claimed identity: name, version, chainId, contract. Compare to a known-good source to detect rebinding to the wrong app.
              </>
            }
          />
          <DigestPanel
            num="03"
            label="Message Hash"
            formula={<>hashStruct(message)</>}
            value={messageHash}
            desc={
              <>
                A fingerprint of the typed message itself. Two requests with identical message hashes ask you to authorise the same thing.
              </>
            }
          />
          <div className="lg:col-span-2">
            <DigestPanel
              num="04"
              label="Calldata Digest"
              accent
              formula={
                <>
                  keccak256(<span className="text-accent">uint256(len)</span> ‖ calldata)
                </>
              }
              value={cdDigest}
              desc={
                <>
                  For raw transactions. Length-prefixed so two payloads sharing a common prefix never collide.{" "}
                  <span className="text-ink">chainId is deliberately omitted</span> so the same digest can be reproduced and compared across forks and replays.
                </>
              }
            />
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-20 md:py-32">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-2">
              <div className="section-num">§ 02</div>
              <div className="marginalia mt-2">motivation</div>
            </div>
            <div className="col-span-12 md:col-span-9">
              <h2 className="text-3xl md:text-5xl leading-[1.05] tracking-[-0.02em]">
                <span className="serif-italic text-ink-dim">Why a wallet should display </span>a fingerprint{" "}
                <span className="serif-italic text-ink-dim">at all.</span>
              </h2>
              <ol className="editorial mt-12 text-ink-dim text-base md:text-lg leading-relaxed max-w-[700px]">
                <li>
                  <span className="text-ink">Independent verification.</span> A signer can reproduce the digest from the same inputs on a separate device — a hardware wallet, a script, a colleague&apos;s laptop — and confirm equality before signing.
                </li>
                <li>
                  <span className="text-ink">Defense against UI lies.</span> If a malicious dapp shows you one message and asks the wallet to sign another, the digest changes. A human-readable description can be forged; a hash cannot.
                </li>
                <li>
                  <span className="text-ink">Auditable provenance.</span> Auditors, multisig signers, and incident responders can refer to a single canonical fingerprint instead of arguing over reformatted JSON.
                </li>
                <li>
                  <span className="text-ink">Complement, not replace.</span> ERC-8213 sits below ERC-7730&apos;s human-readable layer. Description for the eye, fingerprint for the audit trail.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="mx-auto max-w-[1280px] px-6 md:px-10 pb-32">
        <div className="ascii-div mb-10 select-none">
          {Array.from({ length: 200 }).map((_, i) => (i % 6 === 0 ? "+" : i % 3 === 0 ? "·" : "—")).join("")}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="#/implement" className="group block">
            <Frame className="p-6 h-full transition-colors hover:border-accent">
              <div className="flex items-baseline justify-between mb-4">
                <span className="section-num">§ 03</span>
                <span className="text-ink-faint text-xs group-hover:text-accent transition-colors">→</span>
              </div>
              <h3 className="text-xl leading-snug">
                For wallet builders
                <span className="serif-italic text-ink-dim block mt-1 text-base">what to compute, when to show it.</span>
              </h3>
            </Frame>
          </a>
          <a href="#/verify" className="group block">
            <Frame className="p-6 h-full transition-colors hover:border-accent">
              <div className="flex items-baseline justify-between mb-4">
                <span className="section-num">§ 04</span>
                <span className="text-ink-faint text-xs group-hover:text-accent transition-colors">→</span>
              </div>
              <h3 className="text-xl leading-snug">
                For signers
                <span className="serif-italic text-ink-dim block mt-1 text-base">reproduce a wallet&apos;s digests in your browser.</span>
              </h3>
            </Frame>
          </a>
          <a href="#/compute" className="group block">
            <Frame className="p-6 h-full transition-colors hover:border-accent">
              <div className="flex items-baseline justify-between mb-4">
                <span className="section-num">§ 05</span>
                <span className="text-ink-faint text-xs group-hover:text-accent transition-colors">→</span>
              </div>
              <h3 className="text-xl leading-snug">
                For the curious
                <span className="serif-italic text-ink-dim block mt-1 text-base">every byte, every hash, traced.</span>
              </h3>
            </Frame>
          </a>
        </div>
      </section>
    </>
  );
}
