# QS Candidate Academy

A static + serverless community site for candidates to share practical assessment and hiring insights.

Active folder (Windows): `B:\Subtle Projects\10_Active_Projects\qs-candidate-academy`

## Structure

- `index.html`: app shell and entrypoint
- `vercel.json`: Vercel config (static)
- `deploy-qs-candidate-academy.sh`: bootstrap deploy helper
- `public/`: static assets (logo and future media)
- `src/`: componentized frontend source
- `scripts/verify.js`: lightweight project quality checks
- `.github/workflows/ci.yml`: format/lint/build CI workflow
- `package.json`: scripts for local checks
- `api/submit-share.js`: Vercel backend endpoint for community submission forms

## Local deploy-ready steps

### 1) Setup

From WSL path:

`/mnt/b/Subtle Projects/10_Active_Projects/qs-candidate-academy`

From Windows path:

`B:\Subtle Projects\10_Active_Projects\qs-candidate-academy`

### 2) Set required tokens

```bash
export GITHUB_OWNER=<your-github-username-or-org>
export GH_TOKEN=<your-github-token>   # must have repo:create scope
export VERCEL_TOKEN=<your-vercel-token> # optional if you only want push
```

This app also uses optional Vercel environment variables for the shared form endpoint:

```bash
cp .env.example .env
export RESEND_API_KEY=your_resend_api_key
export RESEND_FROM="QS Academy <noreply@your-domain.com>"
export RESEND_TO=team@your-domain.com
```

### 3) Create repo, push, and deploy

```bash
cd "/mnt/b/Subtle Projects/10_Active_Projects/qs-candidate-academy"
./deploy-qs-candidate-academy.sh
```

The script will:
- Create GitHub repo `qs-candidate-academy` under your owner
- Add `origin` remote
- Push current branch (or `main` when current branch is unavailable)
- Deploy to Vercel production
- Keep the community app behavior with hash routes: `#home`, `#community`, `#resources`, `#events`, `#share`

### 3b) Run local quality checks

```bash
cd "/mnt/b/Subtle Projects/10_Active_Projects/qs-candidate-academy"
npm install
npm run format
npm run lint
npm run build
```

This runs:
- formatting guard for tracked files
- JavaScript syntax checks
- static build output generation into `dist/`

Note: the backend endpoint expects `RESEND_*` variables to send emails. If omitted, it returns a clear setup message and the submit form shows that status.

You can also customize the repo name/branch/env:

```bash
./deploy-qs-candidate-academy.sh my-repo-name
```

Optional environment overrides:

```bash
export GIT_BRANCH=main          # default: current branch or main
export GIT_REMOTE_NAME=origin   # default: origin
```

### 4) If you already have a repo and just want deploy

```bash
cd "/mnt/b/Subtle Projects/10_Active_Projects/qs-candidate-academy"
git remote add origin https://github.com/<owner>/qs-candidate-academy.git
git push -u origin main
npx --yes vercel --prod --yes --token "$VERCEL_TOKEN"
```

## 5) Production launch checklist

Before sharing the link with candidates, run:

```bash
cd "/mnt/b/Subtle Projects/10_Active_Projects/qs-candidate-academy"
npm run format
npm run lint
npm run build
```

Then verify:

- Hash routes load from browser URL: `#home`, `#community`, `#resources`, `#events`, `#share`
- Share form accepts entries and returns success after all required fields
- Share form shows a clear message when submissions are too frequent (anti-spam protection)
- Vercel environment variables are set for `RESEND_API_KEY`, `RESEND_FROM`, and `RESEND_TO`
- `Submit another insight` returns to ready state after each success

### 6) Ignore generated/runtime files

The project includes a `.gitignore` that excludes common local artifacts (node modules, env files, editor config, `.omx/`, logs, etc.).