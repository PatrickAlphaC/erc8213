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
          </div>
        </div>
      </div>
    </footer>
  );
}
