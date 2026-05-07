import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — ERC-8213",
};

export default function NotFound() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 md:px-10 py-32 md:py-48">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-2">
          <div className="section-num">§ ??</div>
          <div className="marginalia mt-2">404 · not found</div>
        </div>
        <div className="col-span-12 md:col-span-9">
          <h1 className="text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em]">
            Nothing here.{" "}
            <span className="serif-italic text-ink-dim">
              The digest didn&apos;t match.
            </span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-ink-dim leading-relaxed max-w-[640px]">
            The page you&apos;re looking for either moved or never existed. The
            spec is still draft, the site is still small — links are likely to
            shift.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-accent">
              Back to overview →
            </Link>
            <Link href="/verify" className="btn">
              Verify a signature
            </Link>
            <Link href="/wallets" className="btn">
              Wallet support
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
