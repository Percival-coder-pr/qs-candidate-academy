#!/usr/bin/env bash
set -euo pipefail

# Usage:
# 1) export GITHUB_TOKEN or GH_TOKEN
# 2) export GITHUB_OWNER (e.g., your username/org)
# 3) export VERCEL_TOKEN
# 4) bash ./scripts/deploy-qs-candidate-academy.sh

REPO_NAME="qs-candidate-academy"
OWNER="${GITHUB_OWNER}"
REPO="${GITHUB_TOKEN:+${OWNER}/${REPO_NAME}}"

if [[ -z "$OWNER" ]]; then
  echo "Missing GITHUB_OWNER."
  echo "Set e.g. export GITHUB_OWNER=percival-coder"
  exit 1
fi

if [[ -z "${GITHUB_TOKEN:-}" ]] && [[ -z "${GH_TOKEN:-}" ]]; then
  echo "Missing GITHUB_TOKEN or GH_TOKEN."
  exit 1
fi

: "${GITHUB_TOKEN:=${GH_TOKEN:-}}"

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "node/npm missing. Install Node.js first."
  exit 1
fi

printf "Creating GitHub repo %s/%s...\n" "$OWNER" "$REPO_NAME"
npx --yes gh api \
  -X POST /user/repos \
  -H "Authorization: token $GITHUB_TOKEN" \
  -f name="$REPO_NAME" -f private=false >/tmp/qs_create_repo.json

git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$OWNER/$REPO_NAME.git"
git push -u origin main

echo "Pushing completed. Deploying to Vercel..."
if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "Missing VERCEL_TOKEN; skipping deploy."
  exit 1
fi

npx --yes vercel --prod --yes --token "$VERCEL_TOKEN"
