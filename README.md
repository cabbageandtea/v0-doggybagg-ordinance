# Ordinance.ai / doggybagg.cc

Property ordinance monitoring platform. Next.js + Supabase + Stripe.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://doggybagg.cc)
[![Coverage](https://img.shields.io/codecov/c/gh/cabbageandtea/v0-doggybagg-ordinance?style=for-the-badge)](https://codecov.io/gh/cabbageandtea/v0-doggybagg-ordinance)

## Codecov (optional)
To enable Codecov uploads from CI for private repos, add a `CODECOV_TOKEN` secret in your GitHub repository settings and connect the repository to Codecov. The GitHub Action will read the token from `secrets.CODECOV_TOKEN` and upload `coverage/lcov.info` after tests run.

Notes:
- For public repositories, Codecov uploads often work without a token, but adding a token is recommended.
- If you want comments on PRs or additional configuration, you can configure it in your Codecov repository settings or adjust `.codecov.yml`.

## Testing & E2E
- Run unit tests with coverage:

```bash
pnpm test:coverage
```

- Run Playwright E2E locally (requires a running app):

```bash
pnpm build
pnpm start &
pnpm test:e2e
```

- CI note: The workflow runs unit tests, uploads coverage, attempts to upload to Codecov, posts a coverage summary comment on PRs (fallback), and runs Playwright E2E on PRs/main. Coverage thresholds are enforced in CI and will fail the checks if coverage drops below configured levels.

## Production deploy

**→ [DEPLOY.md](./DEPLOY.md)** — 3 steps: Supabase script, Vercel env vars, push.

## Overview

- **Production:** https://doggybagg.cc
- **Stack:** Next.js, Supabase (auth + DB), Stripe (checkout)
- **Plans:** Starter $29/mo · Professional $99/mo

## Developer setup (local)

| Task | Doc |
|------|-----|
| **Deploy to production** | [DEPLOY.md](./DEPLOY.md) · 3-step guide |
| **Environment variables** | [.env.example](./.env.example) → copy to `.env.local` · [ENV_AUDIT.md](./ENV_AUDIT.md) |
| **MCP** (Cursor) | [MCP_SETUP.md](./MCP_SETUP.md) |
| **Vercel env setup** | [VERCEL_ENV_SETUP.md](./VERCEL_ENV_SETUP.md) |

\`\`\`bash
pnpm install
pnpm dev
pnpm build
\`\`\`
