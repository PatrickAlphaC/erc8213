"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Overview", num: "00" },
  { href: "/wallets", label: "Wallets", num: "01" },
  { href: "/implement", label: "Implement", num: "02" },
  { href: "/verify", label: "Verify", num: "03" },
  { href: "/compute", label: "Compute", num: "04" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-bg/85 backdrop-blur-md">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-baseline gap-3 group"
            aria-label="ERC-8213"
          >
            <span className="text-accent text-sm tracking-[0.2em]">ERC</span>
            <span className="text-ink text-base font-medium tracking-[0.05em]">
              8213
            </span>
            <span className="serif-italic text-ink-dim text-sm hidden md:inline">
              digest display
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {links.slice(1).map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={[
                    "group relative px-3 py-2 text-xs tracking-[0.15em] uppercase transition-colors",
                    active
                      ? "text-accent"
                      : "text-ink-dim hover:text-ink",
                  ].join(" ")}
                >
                  <span className="text-[10px] mr-1.5 text-ink-faint group-hover:text-accent transition-colors">
                    {l.num}
                  </span>
                  <span className="hidden sm:inline">{l.label}</span>
                  <span className="sm:hidden">{l.label.slice(0, 3)}</span>
                  {active ? (
                    <span className="absolute -bottom-px left-3 right-3 h-px bg-accent" />
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
