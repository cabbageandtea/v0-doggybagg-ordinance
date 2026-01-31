# Pre-Deploy Security & Cleanup Audit

**Date:** January 2026  
**Status:** Summary of findings and fixes applied.

---

## 1. Secrets Exposure

### ✅ SUPABASE_SERVICE_ROLE_KEY
- **Not used** in this codebase. ENV_AND_SUPABASE_AUDIT.md notes only URL + Anon Key are required.
- No `NEXT_PUBLIC_*` prefixed service role key found.

### ✅ STRIPE_SECRET_KEY
- **Server-only.** Used only in `lib/stripe.ts` (has `import 'server-only'`) and `app/actions/stripe.ts` (has `'use server'`).
- No `NEXT_PUBLIC_STRIPE_SECRET_KEY` or client-side exposure.
- `components/checkout.tsx` uses `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (correct for client).

---

## 2. Stripe Webhook Endpoint

- **No webhook API route exists.** Only `/api/health` is present.
- Docs (DEPLOYMENT_SUMMARY, PRODUCTION_AUDIT_REPORT) note webhooks are not implemented.
- **Action:** When adding Stripe webhooks later, use production URL:  
  `https://doggybagg.cc/api/webhooks/stripe` (or similar), not localhost.

---

## 3. Test Stripe Payment Links (Non-production)

| File | Link | Issue |
|------|------|-------|
| `components/hero-section.tsx` | `https://buy.stripe.com/test_28E6oAd3ka4ecIQbNX7Re00` | **Test** payment link |
| `components/pricing-section.tsx` | `https://buy.stripe.com/test_28E6oAd3ka4ecIQbNX7Re00` | **Test** payment link |

**Note:** These are Portfolio Audit ($499) CTAs. For production, replace with a live Stripe Payment Link or app-based checkout.

---

## 4. console.log / console.warn (Cleared for Deployment)

| File | Line | Original | Fix |
|------|------|----------|-----|
| `app/actions/stripe.ts` | 57 | `console.log('[v0] Using dynamic pricing...')` | Removed |
| `app/dashboard/page.tsx` | 278 | `console.log('[v0] Phone verified successfully')` | Removed |
| `app/auth/sign-up/page.tsx` | 47 | `console.warn("[sign-up] ensureUserProfile:", ...)` | Kept – useful for debugging failed profile creation |

---

## 5. TODO / FIXME Comments

- **None found** in `.ts`, `.tsx`, `.js`, `.jsx` files.

---

## Summary

| Check | Result |
|-------|--------|
| Secrets in frontend | ✅ None exposed |
| Stripe webhook URL | ⚪ No webhook yet – N/A |
| Test Stripe links | ⚠️ Hero + Pricing use test links – update for production |
| console.log | ✅ Removed from stripe + dashboard |
| TODO comments | ✅ None in code |
