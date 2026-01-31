# Production Sanitization Audit – doggybagg.cc

**Date:** January 2026  
**Status:** Complete

---

## 1. Environment Variable Check ✅

| Variable | Location | Hardcoded? |
|----------|----------|------------|
| `STRIPE_SECRET_KEY` | `lib/stripe.ts` | No – via `process.env.STRIPE_SECRET_KEY` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `components/checkout.tsx` | No – via `process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |
| `STRIPE_STARTER_PRICE_ID` | `app/actions/stripe.ts` | No – via `process.env` |
| `STRIPE_PROFESSIONAL_PRICE_ID` | `app/actions/stripe.ts` | No – via `process.env` |

**Result:** No API keys hardcoded in code. All Stripe credentials referenced via `process.env`. Ensure `.env.local` (local) and Vercel env vars (production) are set.

---

## 2. Domain Cleanup ✅

| File | Change |
|------|--------|
| `STRIPE_SETUP_INSTRUCTIONS.md` | Fallback URLs updated from `http://localhost:3000` to `https://doggybagg.cc` |
| `.env.example` | `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` left as `localhost:3000` (intentionally for local dev) |
| `app/layout.tsx` | Already uses `https://doggybagg.cc` as fallback for `NEXT_PUBLIC_SITE_URL` |

**Result:** Production defaults use `https://doggybagg.cc`. Local dev instructions retain `localhost:3000` where appropriate.

---

## 3. Payment Link Update ✅

| Component | Before | After |
|-----------|--------|-------|
| `hero-section.tsx` | Hardcoded `https://buy.stripe.com/test_28E6oAd3ka4ecIQbNX7Re00` | `process.env.NEXT_PUBLIC_STRIPE_PORTFOLIO_AUDIT_LINK` with `mailto:support@doggybagg.cc` fallback |
| `pricing-section.tsx` | Same test link | Same env-driven approach |

**Action required:** Add your **live** Stripe Payment Link ($499 Portfolio Audit) to Vercel:

- Variable: `NEXT_PUBLIC_STRIPE_PORTFOLIO_AUDIT_LINK`
- Value: From Stripe Dashboard → Payment links → copy the **live** link (no `test_` in the path)

---

## 4. Logging & Debug Removal ✅

| File | Removed |
|------|---------|
| `app/auth/sign-up/page.tsx` | `console.warn("[sign-up] ensureUserProfile:", profileError)` |

**Note:** `console.error` in `app/actions/profile.ts` and `app/actions/stripe.ts` retained for critical error tracking.

---

## 5. Stripe Action Verification ✅

`app/actions/stripe.ts` correctly:

- Maps `starter-plan` → `process.env.STRIPE_STARTER_PRICE_ID` (e.g. `price_1SvPwKKhlGbF8HFhb05TCvm6`)
- Maps `professional-plan` → `process.env.STRIPE_PROFESSIONAL_PRICE_ID` (e.g. `price_1SvPxGKhlGbF8HFhBpsn4mMa`)
- Uses `STRIPE_PRICE_IDS` at runtime; falls back to dynamic pricing only when Price IDs are missing

**Vercel env vars to confirm:**

- `STRIPE_STARTER_PRICE_ID` – $29/mo
- `STRIPE_PROFESSIONAL_PRICE_ID` – $99/mo

---

## Summary

| Check | Status |
|-------|--------|
| Secrets via process.env only | ✅ |
| Domain cleanup | ✅ |
| Live payment links via env | ✅ (set `NEXT_PUBLIC_STRIPE_PORTFOLIO_AUDIT_LINK`) |
| console.log/warn removed | ✅ |
| Stripe Price ID logic | ✅ |
