#!/usr/bin/env bash
#
# Add the static build to a local IPFS node and print the CID.
#
# Settings below are chosen to match Pinata's defaults so that, given a
# byte-identical build, the local CID equals the one returned by the
# release workflow. Compare the two to verify reproducibility.
#
# Usage:
#   ./scripts/ipfs-publish.sh              # add and pin to local node
#   ./scripts/ipfs-publish.sh --hash-only  # compute CID without pinning
#
# Requires the ipfs (Kubo) CLI: https://docs.ipfs.tech/install/command-line/

set -euo pipefail

BUILD_DIR="${BUILD_DIR:-out}"
HASH_ONLY=0

for arg in "$@"; do
  case "$arg" in
    --hash-only|-n) HASH_ONLY=1 ;;
    -h|--help)
      # Print just the leading comment block (lines starting with `#`),
      # stripped of the leading `# ` so the help text reads as plain prose.
      awk '/^#!/ {next} /^#/ {sub(/^# ?/, ""); print; next} {exit}' "$0"
      exit 0
      ;;
    *)
      echo "Unknown argument: $arg" >&2
      exit 64
      ;;
  esac
done

if ! command -v ipfs >/dev/null 2>&1; then
  echo "Error: ipfs (Kubo) is not installed or not on PATH." >&2
  echo "Install:  https://docs.ipfs.tech/install/command-line/" >&2
  exit 127
fi

if [ ! -d "$BUILD_DIR" ]; then
  echo "Build directory '$BUILD_DIR' not found — running pnpm build first."
  pnpm build
fi

# Pinata defaults (as of 2026): CIDv1, default size-262144 chunker,
# raw leaves enabled. Keep these in sync with the IPFS workflow if Pinata
# changes their defaults.
ADD_FLAGS=(
  --recursive
  --cid-version 1
  --chunker "size-262144"
  --raw-leaves=true
  --quieter
)

if [ "$HASH_ONLY" = "1" ]; then
  ADD_FLAGS+=(--only-hash)
  MODE="hash-only (nothing pinned)"
else
  MODE="pinned to local node"
fi

echo "Adding '$BUILD_DIR' to IPFS — $MODE"
CID=$(ipfs add "${ADD_FLAGS[@]}" "$BUILD_DIR")

echo ""
echo "  CID: $CID"
echo ""
echo "Compare against the Pinata CID emitted by the release workflow."
echo "If they match, the deployment is byte-reproducible."
echo ""
echo "Local preview (if your IPFS daemon is running):"
echo "  http://localhost:8080/ipfs/$CID/"
echo ""
echo "Public gateway:"
echo "  https://$CID.ipfs.dweb.link/"
