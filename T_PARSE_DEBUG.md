# t._parse Debug Guide

## Root Cause (from Runtime Logs)

`TypeError: t._parse is not a function` occurs inside minified server chunks (e.g. `__e4cf45fb._.js`). Zod's internal `_parse` method is being renamed by the minifier to `t`, which breaks when the SDK calls it. The error happens when the Workflow SDK processes a response from vercel-workflow.com.

## Fixes Applied

### 1. Server Minification Disabled

`next.config.ts` disables minification for the **server** build only:

```ts
webpack: (config, { isServer }) => {
  if (isServer && config.optimization) {
    config.optimization = { ...config.optimization, minimize: false }
  }
  return config
}
```

This prevents Terser/SWC from renaming `_parse` in server chunks. **If this fixes the error on Vercel, the cause is confirmed as a minifier bug.**

### 2. serverExternalPackages

`serverExternalPackages` lists `zod`, `workflow`, `@workflow/*` so they're loaded from `node_modules` at runtime instead of being bundled. This may not fully prevent the SDK's internal use of Zod from being bundled into workflow route chunks.

### 3. Zod 3 Ghost Check

**Result:** No Zod 3 in the tree. `pnpm why zod` shows all deps use zod 4.1.11. No `.pnpmfile.cjs` needed.

### 4. experimental.serverComponentsExternalPackages

Deprecated in Next.js 15+; use `serverExternalPackages` (already configured).

## Verification: pnpm dev vs Production

To confirm the error is minifier-specific:

1. **Local:** Run `pnpm dev` and trigger the Sentinel via `GET /api/cron/sentinel` (with `Authorization: Bearer YOUR_CRON_SECRET`). If it works locally, the issue is production minification.

2. **Production:** After deploying with server minification disabled, replay the workflow on the Vercel Workflows dashboard. If it succeeds, the fix is confirmed.

## Rollback

If disabling server minification causes other issues, revert the `webpack` block in `next.config.ts` and rely on `serverExternalPackages` alone.
