# Vercel Deployment Protection Check

## Why This Matters

If **Deployment Protection** or **Vercel Authentication** is enabled for your production environment, it can intercept requests to `/.well-known/workflow/*` with a login/challenge page instead of JSON. That causes the Workflow SDK to receive HTML instead of JSON, leading to "Failed to parse server response" errors.

## How to Check

1. Open the [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the project **v0-doggybagg-ordinance**
3. Go to **Settings** → **Deployment Protection**
4. For **Production**:
   - If **Vercel Authentication** or **Password Protection** is enabled, the Workflow engine may be challenged
   - Consider setting **Protection** to **None** for production, or use **Protection Bypass for Automation** for cron/webhook endpoints

## Quick Fix

If Deployment Protection is blocking the Workflow API:

- **Option A:** Disable protection for production (if acceptable)
- **Option B:** Add a [Protection Bypass for Automation](https://vercel.com/docs/security/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation) exception for `/.well-known/workflow/*` or for requests with your `CRON_SECRET` header
