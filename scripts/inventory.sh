#!/usr/bin/env bash
#
# Generate a sorted sha256 manifest of every file in out/. Output is
# byte-identical to the manifest the CI workflow uploads as an artifact,
# so a plain `diff` against the downloaded artifact reveals exactly which
# files differ between local and CI.
#
# Usage:
#   ./scripts/inventory.sh                  # writes out-inventory.local.txt
#   ./scripts/inventory.sh --diff <file>    # writes manifest, then diffs against <file>
#
# Workflow for debugging an IPFS CID mismatch:
#
#   1. gh run download <run-id> -n out-inventory-vX.Y.Z
#   2. pnpm build  (with the same env vars CI used)
#   3. ./scripts/inventory.sh --diff out-inventory.txt

set -euo pipefail

OUT_FILE="out-inventory.local.txt"
DIFF_TARGET=""

while [ $# -gt 0 ]; do
  case "$1" in
    --diff) DIFF_TARGET="${2:-}"; shift 2 ;;
    -h|--help)
      awk '/^#!/ {next} /^#/ {sub(/^# ?/, ""); print; next} {exit}' "$0"
      exit 0
      ;;
    *) echo "Unknown argument: $1" >&2; exit 64 ;;
  esac
done

if [ ! -d out ]; then
  echo "Error: 'out/' not found. Run pnpm build first." >&2
  exit 1
fi

# macOS coreutils ship sha256sum under a different name on some setups;
# fall back to `shasum -a 256` and reformat to match GNU sha256sum.
if command -v sha256sum >/dev/null 2>&1; then
  HASH_CMD="sha256sum"
else
  HASH_CMD="shasum -a 256"
fi

(cd out && \
  find . -type f -print0 | LC_ALL=C sort -z | \
  xargs -0 $HASH_CMD) > "$OUT_FILE"

echo "Wrote $OUT_FILE ($(wc -l < "$OUT_FILE" | tr -d ' ') files)"

if [ -n "$DIFF_TARGET" ]; then
  if [ ! -f "$DIFF_TARGET" ]; then
    echo "Error: diff target '$DIFF_TARGET' not found." >&2
    exit 1
  fi
  echo ""
  echo "Diff vs $DIFF_TARGET:"
  if diff -u "$DIFF_TARGET" "$OUT_FILE"; then
    echo "  identical — every file matches byte-for-byte."
  fi
fi
