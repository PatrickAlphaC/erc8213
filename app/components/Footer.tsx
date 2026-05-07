import { version as pkgVersion } from "../../package.json";

// At deploy time the IPFS workflow injects NEXT_PUBLIC_VERSION from the
// pushed git tag (e.g. `v0.1.1`); local + Vercel builds fall back to the
// version field in package.json.
const rawVersion = process.env.NEXT_PUBLIC_VERSION ?? pkgVersion;
const SITE_VERSION = rawVersion.startsWith("v") ? rawVersion : `v${rawVersion}`;

export function Footer() {
  return (
    <footer className="mt-32 border-t border-rule">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-10">
        <div className="ascii-div mb-6 select-none">
          {Array.from({ length: 200 }).map((_, i) => (i % 4 === 0 ? "+" : "—")).join("")}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs text-ink-dim">
          <div className="md:col-span-4">
            <div className="text-accent text-[10px] tracking-[0.2em] uppercase mb-2">
              ERC-8213
            </div>
            <p className="serif-italic text-base text-ink leading-snug max-w-xs">
              cryptographic fingerprints, displayed honestly.
            </p>
            <a
              href="https://github.com/PatrickAlphaC/erc8213"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Source on GitHub"
              className="mt-4 inline-flex items-center gap-2 text-ink-dim hover:text-accent transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-1.97c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39s1.97.13 2.89.39c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.79.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
              </svg>
              <span className="text-xs tracking-[0.12em] uppercase">
                Source on GitHub
              </span>
            </a>
          </div>
          <div className="md:col-span-2">
            <div className="marginalia mb-3">Spec</div>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://github.com/ethereum/ERCs/pull/1639"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  Pull request
                </a>
              </li>
              <li>
                <a
                  href="https://eips.ethereum.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  EIPs index
                </a>
              </li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <div className="marginalia mb-3">Related</div>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://eips.ethereum.org/EIPS/eip-712"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  EIP-712
                </a>
              </li>
              <li>
                <a
                  href="https://clearsigning-org.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  ERC-7730
                </a>
              </li>
            </ul>
          </div>
          <div className="md:col-span-4 text-right">
            <div className="marginalia mb-3">Site</div>
            <p className="text-ink-faint">
              static · client-side compute · ipfs-portable
            </p>
            <p className="text-ink-faint mt-2">
              not affiliated with the ethereum foundation.
            </p>
            <p className="text-ink-faint mt-3 tnum tracking-[0.12em]">
              <span className="text-accent">{SITE_VERSION}</span>
              <span className="mx-2">·</span>
              <a
                href={`https://github.com/PatrickAlphaC/erc8213/releases/tag/${SITE_VERSION}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                release notes ↗
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
