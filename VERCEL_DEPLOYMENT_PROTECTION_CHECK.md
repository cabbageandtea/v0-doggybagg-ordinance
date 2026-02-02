# Vercel Deployment Protection Check

## Why This Matters

If **Deployment Protection** or **Vercel Authentication** is enabled for your production environment, it can intercept requests to `/.well-known/workflow/*` (or `/api/workflow/v1/*`) with a login/challenge page instead of JSON. That causes the Workflow engine to receive HTML instead of JSON when calling GET /v1/runs/..., leading to "Failed to parse server response" or invalid handshake errors.

## How to Check

1. Open the [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the project **v0-doggybagg-ordinance**
3. Go to **Settings** → **Deployment Protection**
4. For **Production**:
   - If **Vercel Authentication** or **Password Protection** is enabled, the Workflow engine may be challenged
   - Consider setting **Protection** to **None** for production, or use **Protection Bypass for Automation** for cron/webhook endpoints

## Alternate Path: /api/workflow/v1/*

A rewrite maps `/api/workflow/v1/*` → `/.well-known/workflow/v1/*`. If the Vercel engine prefers this path, it may bypass Deployment Protection or routing issues. Both paths skip the proxy (no auth/CSP) and have `trailingSlash: false` to avoid redirects.

## Debug Headers

Set `DEBUG_WORKFLOW_HEADERS=1` in Vercel to log `x-vercel-*` headers on workflow requests. Check Runtime Logs to verify Vercel is sending expected auth tokens.

## Quick Fix

If Deployment Protection is blocking the Workflow API:

- **Option A:** Disable protection for production (if acceptable)
- **Option B:** Add a [Protection Bypass for Automation](https://vercel.com/docs/security/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation) exception for `/.well-known/workflow/*` and `/api/workflow/*`
