
#!/usr/bin/env bash
# Plan releases and publish only Tsundere Messages.
set -euo pipefail

# shellcheck source=.github/scripts/lib.sh
. "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

bun run plan-releases --pool "$POOL_CHECKOUT/pool" --out "$PLAN"

# Exclude the template's example plugins and themes.
tmp="${PLAN}.tmp"
jq '[.[] | select(.zip | contains("dev.tsundere.messages@"))]' "$PLAN" > "$tmp"
mv "$tmp" "$PLAN"

echo "count=$(jq 'length' "$PLAN")" >> "$GITHUB_OUTPUT"
