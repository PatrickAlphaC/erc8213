# Releasing

Cutting a release bumps the version, tags it, opens a GitHub Release, and lets
the IPFS workflow pin the static build to [Pinata](https://pinata.cloud). The
whole thing is two commands from your terminal.

```
pnpm release <patch|minor|major>   →   git tag vX.Y.Z   →   GitHub Release
                                                                  │
                                          .github/workflows/ipfs.yml (on publish)
                                                                  ▼
                                              build  →  pin to Pinata  →  print CID
```

The released artifact is the static export in `out/`, addressed by an IPFS CID.
Builds are deterministic (see [Reproducible builds](#reproducible-builds)), so the
CID anyone computes from a given tag equals the one the workflow pins.

## Prerequisites

- **[`gh`](https://cli.github.com/) (GitHub CLI)**, authenticated — `brew install gh && gh auth login`. `release.sh` refuses to run without it.
- A **clean working tree** on the commit you want to release. The script refuses a dirty tree, and warns if you are not on `main`.
- **Repo secrets** `PINATA_API_KEY` and `PINATA_SECRET_KEY`, set under Settings → Secrets and variables → Actions. The IPFS workflow needs them to pin; without them the build step still runs but the pin fails.
- **[Kubo](https://docs.ipfs.tech/install/command-line/) (`ipfs` CLI)** — *optional*, only for verifying the CID locally (`pnpm ipfs:hash`).

pnpm is preferred (the lockfile and CI use it), but `npm`/`yarn` work too — `release.sh` shells out to `npm version` regardless.

## How to cut a release

### 1. Bump, tag, push, and open the release

```bash
pnpm release patch        # 0.1.8 → 0.1.9
pnpm release minor        # 0.1.8 → 0.2.0
pnpm release major        # 0.1.8 → 1.0.0

./scripts/release.sh --draft minor   # cut as a draft to review before it goes live
```

`scripts/release.sh` runs four steps:

1. **Pre-flight** — checks `gh` is installed, the tree is clean, and you're on `main` (prompts otherwise).
2. **`npm version <level>`** — bumps `package.json`, commits it as `release X.Y.Z`, and creates the `vX.Y.Z` tag.
3. **`git push --follow-tags`** — pushes the commit and the tag to the remote.
4. **`gh release create vX.Y.Z --generate-notes`** — opens a GitHub Release on that tag with auto-generated notes.

When it finishes it prints the command to watch the deploy.

> **`--draft`** cuts the release as a draft. A draft does *not* fire the `release: published` event, so the IPFS pin won't run until you open the draft in the GitHub UI and click **Publish release**.

### 2. The IPFS workflow pins the build (automatic)

Publishing the release triggers [`.github/workflows/ipfs.yml`](.github/workflows/ipfs.yml), which:

1. Installs deps with `pnpm install --frozen-lockfile`.
2. Runs `pnpm build` with `NEXT_PUBLIC_VERSION=<tag>` (so the site footer shows the released version) and `NEXT_PUBLIC_IPFS_BUILD=true` (relative asset paths, so it renders under a path-style gateway).
3. Pins `out/` to Pinata as `erc8213-<tag>`, CIDv1.
4. Emits the CID and gateway URL as run annotations.

Watch it and read off the CID:

```bash
gh run watch -R PatrickAlphaC/erc8213
# the CID is in the "Output IPFS CID" step's annotations, and at:
#   https://<CID>.ipfs.dweb.link/
```

You can also re-run the pin without cutting a release from **Actions → Build and Deploy to IPFS → Run workflow** (`workflow_dispatch`).

### 3. (Optional) Confirm the pin is reproducible

If you have Kubo installed, recompute the CID from your local checkout and check it against the one the workflow pinned:

```bash
NEXT_PUBLIC_IPFS_BUILD=true NEXT_PUBLIC_VERSION=v0.1.9 pnpm build
pnpm ipfs:hash        # computes the CID without pinning anything
```

A match means the pinned site is byte-for-byte the build of this commit. See [Verifying a release independently](#verifying-a-release-independently) for the third-party version.

## Individual commands

```bash
pnpm release patch          # bump patch, tag, push, cut the GitHub release
pnpm release minor          # bump minor …
pnpm release major          # bump major …
./scripts/release.sh --draft <level>   # same, but the release is a draft

pnpm build                  # static export to out/
pnpm ipfs:hash              # compute the CID of out/ without pinning (builds out/ if missing)
pnpm ipfs:publish           # add + pin out/ to your local Kubo node, print CID + preview URL

./scripts/release.sh --help
./scripts/ipfs-publish.sh --help
```

CI (`.github/workflows/ci.yml`) runs `pnpm typecheck`, `pnpm lint`, `pnpm build`, and `pnpm test` on every PR and push to `main`. Get that green before releasing.

## Reproducible builds

Two builds of the same commit produce the same CID, which is what lets anyone verify a release:

- **`generateBuildId`** in [`next.config.ts`](next.config.ts) returns `NEXT_PUBLIC_VERSION` (default `"dev"`) instead of Next's usual random per-build id. The random id would otherwise be baked into manifests and chunk paths, so every build would differ.
- **`scripts/ipfs-publish.sh`** adds `out/` with flags chosen to match Pinata's defaults (`--cid-version 1 --chunker size-262144 --raw-leaves=true`). Same bytes + same chunking ⇒ same CID.

So a reproducible CID needs the *same* `NEXT_PUBLIC_VERSION` the workflow used — the git tag, e.g. `v0.1.9`. Build with a different value and the buildId differs and the CID won't match.

## Verifying a release independently

Anyone can confirm the pinned site matches a tagged commit of this repo:

```bash
git checkout v0.1.9
pnpm install --frozen-lockfile
NEXT_PUBLIC_IPFS_BUILD=true NEXT_PUBLIC_VERSION=v0.1.9 pnpm build
pnpm ipfs:hash
# CID should equal the one in the release notes / the workflow's annotation
```

No Pinata account or local daemon is needed — `ipfs add --only-hash` just computes the CID.

## Troubleshooting

**`gh (GitHub CLI) is not installed`** — `brew install gh && gh auth login`, then re-run.

**`working tree is dirty. Commit or stash first`** — releases must be reproducible from a single commit. Commit or stash, then re-run.

**`not on main`** — the script prompts for confirmation. Answer `y` only if you mean to release off a branch.

**The release published but nothing pinned** — either it's still a draft (publish it), or `PINATA_API_KEY`/`PINATA_SECRET_KEY` aren't set as repo secrets. Check the failed run with `gh run view -R PatrickAlphaC/erc8213`.

**Local CID doesn't match the workflow's** — you almost certainly built with a different `NEXT_PUBLIC_VERSION`. Rebuild with the exact tag (`NEXT_PUBLIC_VERSION=vX.Y.Z`) and `NEXT_PUBLIC_IPFS_BUILD=true`. If it still differs, Pinata may have changed its chunking defaults — reconcile the flags in `scripts/ipfs-publish.sh` with the `ipfs.yml` workflow.

**`ipfs (Kubo) is not installed`** — only `pnpm ipfs:hash` / `pnpm ipfs:publish` need it; install from <https://docs.ipfs.tech/install/command-line/>. Cutting a release does not.
