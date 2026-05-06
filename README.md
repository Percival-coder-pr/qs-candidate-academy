# QS Candidate Academy

A static deployment scaffold created for quick GitHub + Vercel delivery.

Folder (Windows): `B:\\Documents\\Subtle Projects\\qs-candidate-academy`

## Structure

- `index.html`: landing page placeholder
- `vercel.json`: Vercel config (static)
- `deploy-qs-candidate-academy.sh`: one-command-ish bootstrap deploy helper

## Local deploy-ready steps

### 1) Setup

From WSL path:

`/mnt/b/Documents/Subtle Projects/qs-candidate-academy`

From Windows path:

`B:\\Documents\\Subtle Projects\\qs-candidate-academy`

### 2) Set required tokens

```bash
export GITHUB_OWNER=<your-github-username-or-org>
export GH_TOKEN=<your-github-token>   # must have repo:create scope
export VERCEL_TOKEN=<your-vercel-token>
```

### 3) Create repo, push, and deploy

```bash
cd "/mnt/b/Documents/Subtle Projects/qs-candidate-academy"
./deploy-qs-candidate-academy.sh
```

The script will:
- Create GitHub repo `qs-candidate-academy` under your owner
- Add `origin` remote
- Push `main`
- Deploy to Vercel production

### 4) If you already have a repo and just want deploy

```bash
cd "/mnt/b/Documents/Subtle Projects/qs-candidate-academy"
git remote add origin https://github.com/<owner>/qs-candidate-academy.git
git push -u origin main
npx --yes vercel --prod --yes --token "$VERCEL_TOKEN"
```
