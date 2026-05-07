"use client";

import { useEffect, useState } from "react";

const links = [
  { hash: "#/", label: "Overview", num: "00" },
  { hash: "#/wallets", label: "Wallets", num: "01" },
  { hash: "#/implement", label: "Implement", num: "02" },
  { hash: "#/verify", label: "Verify", num: "03" },
  { hash: "#/compute", label: "Compute", num: "04" },
];

function currentHash(): string {
  if (typeof window === "undefined") return "#/";
  // Strip query/extra so the active marker matches the canonical link.
  const h = window.location.hash || "#/";
  const cleaned = h.split("?")[0];
  return cleaned === "#" ? "#/" : cleaned;
}

export function Nav() {
  const [active, setActive] = useState<string>("#/");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setActive(currentHash());
    const onHashChange = () => setActive(currentHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-bg/85 backdrop-blur-md">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="flex items-center justify-between h-16">
          <a
            href="#/"
            className="flex items-baseline gap-3 group"
            aria-label="ERC-8213"
          >
            <span className="text-accent text-sm tracking-[0.2em]">ERC</span>
            <span className="text-ink text-base font-medium tracking-[0.05em]">8213</span>
            <span className="serif-italic text-ink-dim text-sm hidden md:inline">
              digest display
            </span>
          </a>

          <nav className="flex items-center gap-1">
            {links.slice(1).map((l) => {
              const isActive = active === l.hash;
              return (
                <a
                  key={l.hash}
                  href={l.hash}
                  className={[
                    "group relative px-3 py-2 text-xs tracking-[0.15em] uppercase transition-colors",
                    isActive ? "text-accent" : "text-ink-dim hover:text-ink",
                  ].join(" ")}
                >
                  <span className="text-[10px] mr-1.5 text-ink-faint group-hover:text-accent transition-colors">
                    {l.num}
                  </span>
                  <span className="hidden sm:inline">{l.label}</span>
                  <span className="sm:hidden">{l.label.slice(0, 3)}</span>
                  {isActive ? (
                    <span className="absolute -bottom-px left-3 right-3 h-px bg-accent" />
                  ) : null}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
