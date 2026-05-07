"use client";

import Image from "next/image";
import { PageHeader } from "../components/PageHeader";
import { Frame } from "../components/Frame";
import { OutstandingGrid } from "./OutstandingGrid";
import {
  wallets,
  supportLabel,
  kindLabel,
  lastUpdated,
  type Wallet,
} from "./data";

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

function StatusBadge({ s }: { s: Wallet["support"] }) {
  if (s === "yes") {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="dot dot-ok" />
        <span className="text-ok text-xs tracking-[0.15em] uppercase">{supportLabel[s]}</span>
      </span>
    );
  }
  if (s === "partial") {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="dot dot-warn" />
        <span className="text-warn text-xs tracking-[0.15em] uppercase">{supportLabel[s]}</span>
      </span>
    );
  }
  if (s === "no") {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="dot dot-err" />
        <span className="text-err text-xs tracking-[0.15em] uppercase">{supportLabel[s]}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2">
      <span className="dot" style={{ background: "var(--color-ink-faint)" }} />
      <span className="text-ink-faint text-xs tracking-[0.15em] uppercase">{supportLabel[s]}</span>
    </span>
  );
}

export default function WalletsClient() {
  const supported = wallets.filter((w) => w.support === "yes");
  const notSupported = wallets.filter(
    (w) => w.support === "no" || w.support === "partial",
  );

  return (
    <>
      <PageHeader
        num="01"
        kicker="ecosystem · support matrix"
        title={
          <>
            Who&apos;s<span className="serif-italic text-ink-dim"> shipped </span>it?
          </>
        }
        description={
          <>
            Live tally of wallet support for ERC-8213. The bar is simple: does the wallet display at least the EIP-712 digest, or the calldata digest, in a place a signer can read it before approving? Updates arrive by pull request.
          </>
        }
      />

      <section className="mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6 mb-10">
          <div className="col-span-12 md:col-span-2">
            <div className="marginalia">last updated</div>
            <div className="mt-1 text-sm tnum">{lastUpdated}</div>
          </div>
          <div className="col-span-12 md:col-span-3">
            <div className="marginalia">implemented</div>
            <div className="mt-1 text-3xl text-ok tnum">{supported.length.toString().padStart(2, "0")}</div>
          </div>
          <div className="col-span-12 md:col-span-3">
            <div className="marginalia">outstanding</div>
            <div className="mt-1 text-3xl text-err tnum">{notSupported.length.toString().padStart(2, "0")}</div>
          </div>
          <div className="col-span-12 md:col-span-4 flex md:justify-end items-end">
            <a
              href="https://github.com/PatrickAlphaC/erc8213"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Submit an update ↗
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 md:px-10 mt-12">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-2">
            <div className="section-num">§ 01.A</div>
            <div className="marginalia mt-2">implemented</div>
          </div>
          <div className="col-span-12 md:col-span-10">
            <h2 className="text-2xl md:text-3xl leading-snug">
              <span className="serif-italic text-ink-dim">Currently shipping —</span>{" "}
              {supported.length.toString().padStart(2, "0")}
            </h2>
            <div className="mt-6 space-y-4">
              {supported.map((w) => (
                <Frame key={w.id} className="p-5 md:p-6">
                  <div className="flex items-start gap-5">
                    <Logo w={w} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-baseline gap-3">
                          <h3 className="text-xl text-ink">{w.name}</h3>
                          <span className="tag">{kindLabel[w.kind]}</span>
                        </div>
                        <StatusBadge s={w.support} />
                      </div>
                      {w.notes ? (
                        <p className="mt-3 text-sm text-ink-dim leading-relaxed max-w-[680px]">{w.notes}</p>
                      ) : null}
                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-ink-faint">
                        {w.url ? (
                          <a className="link" href={w.url} target="_blank" rel="noopener noreferrer">
                            Website ↗
                          </a>
                        ) : null}
                        {w.ref ? (
                          <a className="link" href={w.ref} target="_blank" rel="noopener noreferrer">
                            Reference ↗
                          </a>
                        ) : (
                          <span className="text-ink-faint italic serif-italic">no reference</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Frame>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 md:px-10 mt-24 mb-32">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-2">
            <div className="section-num" style={{ color: "var(--color-err)" }}>§ 01.B</div>
            <div className="marginalia mt-2">outstanding</div>
          </div>
          <div className="col-span-12 md:col-span-10">
            <h2 className="text-2xl md:text-3xl leading-snug">
              <span className="serif-italic text-ink-dim">Not yet —</span>{" "}
              {notSupported.length.toString().padStart(2, "0")}
            </h2>
            <p className="mt-3 text-ink-dim text-sm max-w-[640px] leading-relaxed">
              These wallets do not yet expose ERC-8213 digests in their signing UI. If you contribute to one, the{" "}
              <a className="link" href="#/implement">implementation guide</a> and the{" "}
              <a
                className="link"
                href="https://github.com/ethereum/ERCs/pull/1639"
                target="_blank"
                rel="noopener noreferrer"
              >
                spec PR
              </a>{" "}
              are the place to start.
            </p>
            <OutstandingGrid wallets={notSupported} />
          </div>
        </div>
      </section>
    </>
  );
}
