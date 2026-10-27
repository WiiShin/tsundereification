
#!/usr/bin/env bash
# Plans releases against the pool and outputs how many there are.

set -euo pipefail
# shellcheck source=.github/scripts/lib.sh
. "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

bun run plan-releases --pool "$POOL_CHECKOUT/pool" --out "$PLAN"

# Only release Tsundere Messages.
tmp="${PLAN}.tmp"
jq '[.[] | select(.zip | contains("dev.tsundere.messages@"))]' "$PLAN" > "$tmp"
mv "$tmp" "$PLAN"

echo "count=$(jq 'length' "$PLAN")" >> "$GITHUB_OUTPUT"
