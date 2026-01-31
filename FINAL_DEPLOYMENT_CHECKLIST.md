# Final Deployment Checklist – Ordinance.ai → doggybagg.cc

Use this after the senior audit; gets you from 95% to production-ready.

---

## 1. Stripe Price IDs (fix “dead” $29 / $99 buttons)

- [ ] In Stripe Dashboard, open your **Starter** ($29/mo) product → copy its **Price ID** (starts with `price_`).
- [ ] Open your **Professional** ($99/mo) product → copy its **Price ID**.
- [ ] **Local:** In `.env.local` add or set:
  - `STRIPE_STARTER_PRICE_ID=<paste_starter_price_id>`
  - `STRIPE_PROFESSIONAL_PRICE_ID=<paste_professional_price_id>`
- [ ] **Vercel:** Project → Settings → Environment Variables → add the same two for **Production** (and Preview if you use it).

**Reference:** [STRIPE_MAPPING_AUDIT.md](./STRIPE_MAPPING_AUDIT.md) and [.env.example](./.env.example).

---

## 2. Database: Fix “Database error saving new user”

- [ ] In **Supabase Dashboard → SQL Editor**, run:
  - **`scripts/003_drop_profile_trigger_use_app_fallback.sql`**
- [ ] This drops the `auth.users` trigger so sign-up no longer fails with that error.
- [ ] Profiles are then created by the app:
  - **Auth callback** (`app/auth/callback/route.ts`) calls `ensureUserProfile()` after `exchangeCodeForSession`.
  - **Sign-up page** calls `ensureUserProfile()` when Supabase returns a session (e.g. email confirmation disabled).

**Verified:** `ensureUserProfile` is active in both flows; no code change needed.

---

## 3. Final audit (auth, loading, production)

| Check | Status |
|-------|--------|
| Auth redirects (sign-in → dashboard, callback → dashboard) | ✅ Implemented and documented in PRODUCTION_READINESS_AUDIT.md |
| Error boundaries (error.tsx, global-error.tsx) | ✅ In place |
| Fine Calculator loading | ✅ No async; no loading state required |
| Property Search loading | ✅ Has `isSearching` + spinner |
| Navigation (Features, Calculator, Pricing, Dashboard) | ✅ Verified in audit |

---

## 4. Environment variables (production)

Ensure these are set in **Vercel** for the production environment:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `STRIPE_SECRET_KEY` | Stripe server key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_STARTER_PRICE_ID` | $29 plan (from §1) |
| `STRIPE_PROFESSIONAL_PRICE_ID` | $99 plan (from §1) |
| `NEXT_PUBLIC_SITE_URL` | `https://doggybagg.cc` (recommended for auth redirects) |

---

## 5. Git push → production build

- [ ] Commit and push to `main` (or your production branch) of `cabbageandtea/v0-doggybagg-ordinance`.
- [ ] Confirm Vercel builds from that repo and deploys to doggybagg.cc.
- [ ] After deploy: test sign-up, sign-in, and “Start Free Trial” / “Get Started” checkout with your Stripe Price IDs.

---

**Summary:** Complete §1 (Stripe IDs) and §2 (run script 003); confirm §4 in Vercel; then push and test (§5).
