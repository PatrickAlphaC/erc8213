#!/usr/bin/env bash
#
# Cut a GitHub release that matches package.json's version.
#
#   ./scripts/release.sh patch        # 0.1.0 → 0.1.1, tag v0.1.1, push, release
#   ./scripts/release.sh minor        # 0.1.0 → 0.2.0
#   ./scripts/release.sh major        # 0.1.0 → 1.0.0
#   ./scripts/release.sh --draft minor   # cut release as a draft
#
# What it does:
#   1. `npm version <level>` bumps package.json, commits the bump, creates
#      the matching `vX.Y.Z` git tag.
#   2. Pushes the commit AND the tag to origin.
#   3. `gh release create` opens a GitHub Release on that tag with
#      auto-generated notes; the IPFS workflow picks it up from there.
#
# Pre-flight: working tree must be clean and on main.

set -euo pipefail

DRAFT=""
LEVEL=""

for arg in "$@"; do
  case "$arg" in
    --draft) DRAFT="--draft" ;;
    patch|minor|major) LEVEL="$arg" ;;
    -h|--help)
      awk '/^#!/ {next} /^#/ {sub(/^# ?/, ""); print; next} {exit}' "$0"
      exit 0
      ;;
    *) echo "Unknown argument: $arg" >&2; exit 64 ;;
  esac
done

if [ -z "$LEVEL" ]; then
  echo "Usage: $0 <patch|minor|major> [--draft]" >&2
  exit 64
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: gh (GitHub CLI) is not installed." >&2
  echo "Install:  brew install gh && gh auth login" >&2
  exit 127
fi

# Refuse if the tree is dirty — npm version will refuse anyway, but a clear
# message up front is nicer than the npm error.
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Error: working tree is dirty. Commit or stash first." >&2
  git status -s
  exit 1
fi

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
  echo "Warning: not on main (current: $BRANCH). Continue? [y/N]"
  read -r reply
  [ "$reply" = "y" ] || [ "$reply" = "Y" ] || exit 1
fi

echo "→ npm version $LEVEL (bumps package.json, commits, tags)"
NEW_TAG=$(npm version "$LEVEL" -m "release %s")
echo "  new tag: $NEW_TAG"

echo "→ pushing commit + tag to origin"
git push --follow-tags

echo "→ cutting GitHub release for $NEW_TAG"
gh release create "$NEW_TAG" --generate-notes $DRAFT

echo ""
echo "✓ Release $NEW_TAG cut."
echo "  Track the IPFS deploy: gh run watch -R PatrickAlphaC/erc8213"
