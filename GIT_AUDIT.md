# Git audit – v0-doggybagg-ordinance

**Last audit:** Applied with “link MCP, audit git, fix all.”

---

## Repo summary

| Item | Status |
|------|--------|
| **Remote** | `origin` → `https://github.com/cabbageandtea/v0-doggybagg-ordinance.git` |
| **Branch** | `main` (tracking `origin/main`) |
| **Other remotes** | `v0/techtitan0187-8440-*` (v0 sync branches) |

---

## Fixes applied

### 1. `.gitignore` – env files

- **Before:** `.env*` ignored everything, including `.env.example`.
- **After:** Only real env files are ignored; `.env.example` is **tracked** as the template:
  - Ignored: `.env`, `.env.local`, `.env.development.local`, `.env.test.local`, `.env.production.local`
  - Tracked: `.env.example` (via `!.env.example`)

Use `.env.example` as the reference; copy to `.env.local` and fill in secrets (never commit `.env.local`).

### 2. MCP

- **Config:** Global MCP is in `~/.cursor/mcp.json` (outside this repo). No project-level MCP file committed.
- **Docs:** [MCP_SETUP.md](./MCP_SETUP.md) links official MCP docs (Cursor, Vercel, v0, GitHub) and auth steps.
- **GitHub server:** Uses env var `GITHUB_PERSONAL_ACCESS_TOKEN` only (no token in config file).

### 3. Docs and references

- **README:** “Developer setup” section added with links to ENV_AUDIT, MCP_SETUP, Stripe, and deployment docs.
- **next.config.mjs:** Comment added for `ignoreBuildErrors` (can set to `false` for strict builds).

---

## Recommended next steps (manual)

1. **Commit the fixes** (from repo root):
   \`\`\`bash
   git add .gitignore README.md next.config.mjs MCP_SETUP.md ENV_AUDIT.md GIT_AUDIT.md .env.example
   git add components/dashboard-footer.tsx lib/supabase/client.ts
   git status   # review
   git commit -m "chore: git audit, MCP links, env template, README developer setup"
   git push origin main
   \`\`\`
2. **Ensure `.env.example` is tracked:** If it was previously ignored, run `git add -f .env.example` before committing.
3. **Do not commit:** `.env`, `.env.local`, or any file containing real secrets or API keys.

---

## Branch hygiene

- `main` is the primary branch; v0 sync pushes to `v0/techtitan0187-*`. No change needed unless you want to prune old v0 branches.
