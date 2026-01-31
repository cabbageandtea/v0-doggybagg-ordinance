# Ordinance.ai / doggybagg.cc

Property ordinance monitoring platform. Next.js + Supabase + Stripe.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://doggybagg.cc)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app)
[![Coverage](https://img.shields.io/codecov/c/gh/cabbageandtea/v0-doggybagg-ordinance?style=for-the-badge)](https://codecov.io/gh/cabbageandtea/v0-doggybagg-ordinance)

## Codecov (optional)
To enable Codecov uploads from CI for private repos, add a `CODECOV_TOKEN` secret in your GitHub repository settings and connect the repository to Codecov. The GitHub Action will read the token from `secrets.CODECOV_TOKEN` and upload `coverage/lcov.info` after tests run.

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
