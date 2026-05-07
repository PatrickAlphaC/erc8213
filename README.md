<p align="center">
  <img src="./app/icon.svg" width="72" height="72" alt="ERC-8213 mark" />
</p>

<h1 align="center">ERC-8213</h1>

<p align="center">
  <em>Wallet Signature &amp; Calldata Digest Display</em><br/>
  Cryptographic fingerprints, displayed honestly.
</p>

<p align="center">
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-e6492c.svg?style=flat-square" /></a>
  <a href="https://github.com/ethereum/ERCs/pull/1639"><img alt="Spec: PR-1639" src="https://img.shields.io/badge/spec-PR--1639-0c0a08.svg?style=flat-square" /></a>
  <img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-0c0a08.svg?style=flat-square" />
  <img alt="Static export · IPFS-portable" src="https://img.shields.io/badge/static-IPFS--portable-0c0a08.svg?style=flat-square" />
</p>

---

## Table of contents

- [Table of contents](#table-of-contents)
- [About](#about)
- [What ERC-8213 standardises](#what-erc-8213-standardises)
- [Site map](#site-map)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [Scripts](#scripts)
- [Deployment](#deployment)
  - [Vercel](#vercel)
  - [IPFS / static host](#ipfs--static-host)
- [Cross-repo digest parity](#cross-repo-digest-parity)
- [Contributing](#contributing)
- [License](#license)

## About

A small, static documentation site for **[ERC-8213](https://github.com/ethereum/ERCs/pull/1639)** — an Ethereum standard that asks wallets to display short, reproducible cryptographic fingerprints (digests) for the things a user is about to sign, so signing decisions can be independently verified.

The site is intended for four audiences:

1. **Curious users** — *what is this and why does it matter?*
2. **Wallet developers** — *what do I compute and where do I display it?*
3. **Signers** — *how do I check that a digest my wallet shows me is correct?*
4. **The mathematically curious** — *show me every byte from typed data to digest.*

## What ERC-8213 standardises

| Digest              | Formula                                                     | Used for                                                                                            |
| ------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **EIP-712 Digest**  | `keccak256(0x1901 ‖ domainSeparator ‖ hashStruct(message))` | The single value an ECDSA signer signs for typed data.                                              |
| **Domain Hash**     | `hashStruct(eip712Domain)`                                  | Fingerprint of the dapp's claimed identity.                                                         |
| **Message Hash**    | `hashStruct(message)`                                       | Fingerprint of the typed message.                                                                   |
| **Calldata Digest** | `keccak256(uint256(len(calldata)) ‖ calldata)`              | Length-prefixed fingerprint of raw transaction calldata. ChainId is intentionally **not** included. |

## Site map

| Route        | Purpose                                                                                                                     |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `/`          | Overview · the four digests at a glance · why they matter.                                                                  |
| `/wallets`   | Live support matrix. Logos pulled from [walletbeat](https://github.com/walletbeat/walletbeat). Updates land via PR.         |
| `/implement` | Builder guide: decision tree, display rules, reference snippets in TypeScript, Rust, and Swift, common pitfalls.            |
| `/verify`    | Client-side verifier. Paste typed-data JSON or `0x…` calldata and watch the four digests recompute live.                    |
| `/compute`   | Pedagogical walkthrough: every type string, typeHash, struct hash, EIP-191 preimage, and final digest, traced byte by byte. |

## Quick start

```bash
# Install deps (pnpm preferred — repo ships pnpm-lock.yaml)
pnpm install

# Run the dev server
pnpm dev
```

Then open <http://localhost:3000>.

> Requires Node.js 20 LTS or 22 LTS, and pnpm 9+.<br/>
> Other package managers work — replace `pnpm` with `npm` or `yarn` in any command below.

## Project structure

```
app/
├── components/        Reusable UI primitives (Frame, DigestPanel, CopyHex, …)
├── lib/
│   ├── digests.ts     viem-based EIP-712 + calldata digest computation
│   └── example.ts     Canonical Permit2 + Uniswap V3 fixtures
├── wallets/
│   ├── data.ts        Wallet support matrix (PR-friendly JSON-shape)
│   └── page.tsx
├── verify/            Client-side verifier (uses lib/digests.ts in the browser)
├── compute/           Pedagogical walkthrough (build-time digests)
├── implement/         Builder guide
├── globals.css        Theme tokens, frame/grain/typography styles
├── layout.tsx         Root layout, fonts, nav, footer
├── page.tsx           Overview / homepage
├── icon.svg           Primary favicon (modern browsers)
├── favicon.ico        Legacy favicon
└── apple-icon.png     iOS home-screen icon

public/
└── wallets/           Brand SVGs sourced from walletbeat
```

## Scripts

| Command      | What it does                                                        |
| ------------ | ------------------------------------------------------------------- |
| `pnpm dev`   | Start Next.js dev server with Turbopack.                            |
| `pnpm build` | Production build → static export in `out/`.                         |
| `pnpm start` | Serve the production build (mostly a no-op for `output: "export"`). |
| `pnpm lint`  | Run `eslint`. The repo has a zero-warnings policy.                  |

## Deployment

### Vercel

The site is a vanilla Next.js project with `output: "export"`. Connect the repo on Vercel and ship — no environment variables required.

### IPFS / static host

`pnpm build` emits a fully static site to `out/` with relative routes (`trailingSlash: true`, `images: { unoptimized: true }`). It runs from any static host or directly from IPFS:

```bash
pnpm build
# ipfs add -r out/
# or upload `out/` to S3 / Cloudflare Pages / GitHub Pages / etc.
```

## Cross-repo digest parity

Digest math in this repo uses **viem**. The companion repo [`cyfrin/chain-tools`](https://github.com/cyfrin/chain-tools) implements the same digests with **ethers**, plus a Python reference implementation. A vitest suite over there imports both libraries and asserts byte-for-byte equality on shared fixtures (`src/lib/erc8213-parity.test.ts`).

If you change the digest implementation here, run that parity test before publishing — drift between the two libraries would mean a wallet verifying against one would see a false mismatch on the other.

## Contributing

The most useful contribution is **updating the wallet support matrix**. Edit [`app/wallets/data.ts`](./app/wallets/data.ts), open a PR, and:

- Reference the wallet's release notes or commit that adds digest display.
- Drop the brand SVG in `public/wallets/` (sourced from [walletbeat](https://github.com/walletbeat/walletbeat) when possible, so logos stay consistent across the ecosystem).
- Bump `lastUpdated` in the same file.

Code-level contributions: open an issue first if it's a non-trivial change. The site is intentionally small and tries to stay that way.

## License

Released under the [MIT License](./LICENSE) © 2026 Cyfrin Inc.
