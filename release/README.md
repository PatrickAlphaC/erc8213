# Release

Pins the [erc8213](../) app to IPFS and updates the `erc8213.eth` ENS contenthash via the Safe at [`0x20F4…66C`](https://etherscan.io/address/0x20F41376c713072937eb02Be70ee1eD0D639966C) — the same 2-of-3 Safe that controls `localsafe.eth` and `patrickalphac.eth`.

The whole flow runs from your terminal — no CI required. The GitHub Actions workflow at `.github/workflows/ipfs.yml` is kept only as a break-glass option to re-pin a tag's build from CI.

## Setup

```bash
cd release
pnpm install
cp .env.example .env
# fill in MAINNET_RPC_URL (required) and PINATA_JWT (optional)
```

`pnpm` is required because `.npmrc` enforces a 7-day minimum release age on every dependency. npm doesn't honor this setting.

`erc8213.eth` must be owned by the Safe for the contenthash transaction to be executable — it already is (`tx.mjs` reads the owner from chain and warns if it ever isn't).

## How to cut a release

> Pre-requisite: your working tree is on the commit you intend to release from. Releases must come from a **clean** checkout — `build.mjs` refuses to run with uncommitted changes (override with `--force` for local iteration).

### 1. Bump version, build, pin, propose the transaction

```bash
pnpm release patch    # 0.1.9 -> 0.1.10
pnpm release minor    # 0.1.9 -> 0.2.0
pnpm release major    # 0.1.9 -> 1.0.0
pnpm release          # no bump — release the current commit as-is
```

If you pass a bump, the script runs `npm version` first — bumping the project's `package.json`, creating a commit `v<new-version>`, and tagging it. The rest of the flow then builds from that new HEAD. You can also pass `prepatch`/`preminor`/`premajor`/`prerelease` for pre-release versions.

After bumping, three steps run:

1. **Build** — `next build` with `NEXT_PUBLIC_IPFS_BUILD=true` (relative asset paths) and `NEXT_PUBLIC_VERSION` set to the release tag. erc8213's `next.config.ts` derives the Next buildId from `NEXT_PUBLIC_VERSION`, so the same tag always produces the same bundle. Embeds the commit + commit timestamp into `out/release-manifest.json`.
2. **Pin** — computes the IPFS CID locally (via `ipfs-unixfs-importer`). If `PINATA_JWT` is set, mirrors to Pinata and fails if Pinata's returned CID doesn't match the local one, then unpins prior `erc8213-*` releases. Prints `ipfs add -r out/` for users running their own Kubo node.
3. **Transaction** — reads the `erc8213.eth` owner + resolver and the Safe state from mainnet, encodes `setContenthash(...)` calldata, computes the EIP-712 `safeTxHash`, and cross-checks it against `Safe.getTransactionHash()` on-chain. Writes three files to `tx-data/`.

After this finishes, push the bump:

```bash
git push --follow-tags
```

### 2. Submit the transaction to the Safe

The script prints two options at the end:

- **Safe TX Builder** — open the printed URL, click "Load batch", upload `tx-data/safe-batch.json`.
- **localsafe.cyfrin.io** — click the printed URL; the transaction is pre-filled via the URL fragment. (It's the same Safe, so the localsafe app signs it directly. The content-addressed mirror at `localsafe.eth.limo` works too.)

### 3. Each signer verifies on their hardware wallet

The script prints these values for cross-check against what the wallet displays:

| Value | What to check |
|---|---|
| `to` | the `erc8213.eth` resolver (currently `0xF291…AC15`) |
| `param 0 (node)` | the namehash of `erc8213.eth` (`0x7fcc…da17`) |
| `param 1 (hash)` | the contenthash: starts with `0xe301` (IPFS), the rest is the CID bytes |
| `EIP-712 safeTxHash` | the digest the wallet asks you to sign |
| `ERC-8213 calldata digest` | independent fingerprint of the calldata, verifiable at [erc8213.eth.limo](https://erc8213.eth.limo/) |

The Safe contract itself computed the same `safeTxHash` via `Safe.getTransactionHash()` — the script already verified this at generate time.

### 4. Execute on-chain

The Safe is 2-of-3. Once two signers have signed, any signer can execute. Wait for the transaction to confirm.

### 5. Cut the GitHub release

```bash
pnpm release:publish
```

This:

1. Reads the on-chain contenthash from the resolver and decodes it.
2. Verifies it matches the CID in `release-manifest.json` (refuses if not).
3. Requires HEAD to be at a git tag (typically the one `pnpm release patch|minor|major` just created). Pass `--tag vX.Y.Z` to override.
4. Creates a published GitHub release at that tag with notes containing the CID, contenthash, Safe + resolver Etherscan links, and IPFS gateway URLs.

## Files

### `../out/` (gitignored — what gets pinned to IPFS)

The full static export of the Next.js app, plus a `release-manifest.json` with the commit hash and timestamp.

### `tx-data/` (gitignored — release metadata, **not** on IPFS)

| | |
|---|---|
| `safe-batch.json` | Safe TX Builder format |
| `localsafe-tx.json` | localsafe `importTx` format |
| `tx-summary.txt` | human-readable summary for hardware-wallet verification |

## Individual commands

```bash
pnpm build              # just build out/
pnpm pin                # just pin (requires out/)
pnpm tx                 # just compute the Safe transaction (requires out/ + .cid)
pnpm release            # build + pin + tx (no version bump)
pnpm release patch      # bump patch version then release
pnpm release minor      # bump minor version then release
pnpm release major      # bump major version then release
pnpm release:publish    # post-on-chain: create GitHub release
pnpm verify             # rebuild out/ and compare its CID to what's on-chain (exit 0 = match)

pnpm build --force      # bypass the dirty-checkout guard (testing only)
```

## Verifying that on-chain == source

Any third party can confirm that the contenthash currently set for `erc8213.eth` matches a specific commit of this repo:

```bash
git checkout <tag>
cd release
pnpm install
pnpm verify
```

`pnpm verify` rebuilds `../out/` from the checked-out source, computes the CID, reads `Resolver.contenthash(namehash("erc8213.eth"))` from mainnet, and reports `MATCH` or `MISMATCH`. Exit code 0 = match, 1 = mismatch — suitable for CI.

## Verifying the CID independently

```bash
git checkout <tag>
cd release
pnpm install
pnpm build
ipfs add -rn ../out/      # requires Kubo
# CID should match the one in the GitHub release notes
```

## If you don't pin locally

The on-chain contenthash points at a CID; something has to actually host those bytes. `pnpm pin` with `PINATA_JWT` set covers this. If you release without `PINATA_JWT`, pin the build yourself (`ipfs add -r out/` on your Kubo node) or run the break-glass workflow (**Actions → Build and Deploy to IPFS → Run workflow**, from the tag ref) to pin the same build via the repo's Pinata secrets. Otherwise the site won't be retrievable even though the contenthash is set.

## Troubleshooting

**`Working tree has uncommitted changes`** — commit (or stash) first. Releases must be reproducible from a single commit. Use `--force` only when iterating locally.

**`Pinata upload failed (401)`** — `PINATA_JWT` is invalid or expired. Generate a new JWT in the Pinata dashboard.

**`CID MISMATCH` between local and Pinata** — investigate before publishing. The contenthash set on-chain would not match what Pinata is hosting.

**`ENS owner does not match Safe`** — `erc8213.eth` is owned by something other than the expected Safe. Investigate before continuing.

**`safeTxHash mismatch`** — the Safe contract disagrees with our local EIP-712 computation. Likely a Safe-version mismatch — check `Safe.VERSION()` against `SAFE_TX_TYPES` in `abi.mjs`.

**`On-chain CID does not match the local build`** — the Safe transaction hasn't executed yet, or someone updated the contenthash to a different value. Rebuild if the source has changed.
