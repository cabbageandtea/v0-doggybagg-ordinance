# doggybagg.cc – Final Launch Checklist

Ordinance.ai by DoggyBagg LLC. Use this before going live.

---

## Critical: If You Exposed API Keys

If you pasted `sk_live_` or `pk_live_` keys anywhere (chat, docs, code):

1. **Revoke them immediately:** Stripe Dashboard → Developers → API keys → Roll keys  
2. **Create new keys** and add them only in Vercel → Settings → Environment Variables  
3. **Never** commit or paste live keys in chat, code, or docs

---

## Vercel Environment Variables

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `STRIPE_SECRET_KEY` | Yes | `sk_live_...` – Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | `pk_live_...` – **Use this exact name** (not `STRIPE_PUBLISHABLE_KEY`) |
| `STRIPE_STARTER_PRICE_ID` | Yes | `price_1SvPwKKhlGbF8HFhb05TCvm6` – $29/mo |
| `STRIPE_PROFESSIONAL_PRICE_ID` | Yes | `price_1SvPxGKhlGbF8HFhBpsn4mMa` – $99/mo |
| `NEXT_PUBLIC_STRIPE_PORTFOLIO_AUDIT_LINK` | Yes | Live $499 Payment Link – hero + pricing CTAs. Get from Stripe Dashboard → Payment links. Use live link (no `test_`). |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://doggybagg.cc` |

Supabase service role and POSTGRES_URL are optional for advanced admin operations.

---

## Code Sanitization Status

| Item | Status |
|------|--------|
| Test Stripe links removed | Done – hero & pricing use `NEXT_PUBLIC_STRIPE_PORTFOLIO_AUDIT_LINK` |
| Hardcoded localhost in production paths | Done – app uses `NEXT_PUBLIC_SITE_URL` / `doggybagg.cc` |
| Localhost in dev docs | Kept – `.env.example` and setup docs retain `localhost:3000` for local dev only |
| Debug console.log/warn removed | Done – only `console.error` kept for error boundaries and critical failures |
| API keys in code | None – all via `process.env` |

---

## Pre-Launch Tasks

1. **Merge PR #8** (mobile responsiveness and email fixes) into main.
2. **Add `NEXT_PUBLIC_STRIPE_PORTFOLIO_AUDIT_LINK`** to Vercel with your live $499 Payment Link.
3. **Confirm Stripe var names** – Vercel must use `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (not `STRIPE_PUBLISHABLE_KEY`).
4. **Redeploy** after env changes.

---

## Post-Deploy Checks

- [ ] Sign up → verify email → lands on dashboard  
- [ ] "Start Free Trial" (Starter) → Stripe checkout ($29)  
- [ ] "Get Started" (Professional) → Stripe checkout ($99)  
- [ ] "Get My $499 Portfolio Audit" → opens live Stripe Payment Link  
- [ ] Fine Calculator, Property Search, Dashboard navigation work
