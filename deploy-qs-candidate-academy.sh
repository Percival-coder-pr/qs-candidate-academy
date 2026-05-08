#!/usr/bin/env bash
set -euo pipefail

# Usage:
# 1) export GITHUB_TOKEN or GH_TOKEN
# 2) export GITHUB_OWNER (e.g., your username/org)
# 3) export VERCEL_TOKEN
# 4) bash ./deploy-qs-candidate-academy.sh
# Optional:
# - bash ./deploy-qs-candidate-academy.sh [repo-name]
# - set GIT_BRANCH and/or GIT_REMOTE_NAME

OWNER="${GITHUB_OWNER:-}"
REPO_NAME="${1:-qs-candidate-academy}"
REMOTE_NAME="${GIT_REMOTE_NAME:-origin}"
BRANCH="${GIT_BRANCH:-$(git symbolic-ref --short HEAD 2>/dev/null || echo main)}"

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

if ! command -v git >/dev/null 2>&1; then
  echo "git is missing. Install Git first."
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
    echo "node/npm missing. Install Node.js first."
    exit 1
  fi
  GH_CMD=(npx --yes gh)
else
  GH_CMD=(gh)
fi

if ! "${GH_CMD[@]}" api /user --method GET -H "Authorization: token $GITHUB_TOKEN" >/dev/null 2>&1; then
  echo "GitHub auth check failed. Ensure token is valid."
  echo "Set GITHUB_TOKEN or GH_TOKEN and try again."
  exit 1
fi

if [[ "$BRANCH" == "HEAD" || -z "$BRANCH" ]]; then
  BRANCH="main"
fi

if ! git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  echo "Branch '$BRANCH' does not exist locally. Set GIT_BRANCH explicitly to a valid branch."
  exit 1
fi

printf "Checking GitHub repository %s/%s...\n" "$OWNER" "$REPO_NAME"

if "${GH_CMD[@]}" api "/repos/$OWNER/$REPO_NAME" >/dev/null 2>&1; then
  echo "Repository already exists. Reusing it."
else
  if "${GH_CMD[@]}" api "/orgs/$OWNER" >/dev/null 2>&1; then
    CREATE_ENDPOINT="/orgs/$OWNER/repos"
  else
    CREATE_ENDPOINT="/user/repos"
  fi

  printf "Creating GitHub repo %s/%s via %s...\n" "$OWNER" "$REPO_NAME" "$CREATE_ENDPOINT"
  if ! "${GH_CMD[@]}" api \
    -X POST "$CREATE_ENDPOINT" \
    -H "Authorization: token $GITHUB_TOKEN" \
    -f name="$REPO_NAME" \
    -f private=false >/dev/null; then
    echo "Repo creation failed. Ensure token is valid and has repository creation permission."
    exit 1
  fi
fi

REPO_URL="https://github.com/$OWNER/$REPO_NAME.git"
if ! CURRENT_REMOTE_URL="$(git remote get-url "$REMOTE_NAME" 2>/dev/null)"; then
  git remote add "$REMOTE_NAME" "$REPO_URL"
else
  if [[ "$CURRENT_REMOTE_URL" != "$REPO_URL" ]]; then
    echo "Updating $REMOTE_NAME from $CURRENT_REMOTE_URL to $REPO_URL"
    git remote set-url "$REMOTE_NAME" "$REPO_URL"
  fi
fi

echo "Pushing branch '$BRANCH' to '$REMOTE_NAME'."
git push -u "$REMOTE_NAME" "$BRANCH"

echo "Push completed."

if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "Missing VERCEL_TOKEN; skipping deploy."
  exit 0
fi

npx --yes vercel --prod --yes --token "$VERCEL_TOKEN"
