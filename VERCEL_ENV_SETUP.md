# Vercel Environment Variables Setup – doggybagg.cc

Copy-paste guide for setting environment variables in Vercel.

---

## Access Vercel Settings

1. Go to: https://vercel.com/dashboard
2. Select your project: **v0-doggybagg-ordinance** (or the project linked to doggybagg.cc)
3. Click **Settings** → **Environment Variables**

---

## Required Variables (Production)

Add these for the **Production** environment. Click **Add** for each:

### Supabase

| Name | Value | Notes |
|------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | From Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` | From Supabase Dashboard → Project Settings → API (anon/public key) |

### Stripe

| Name | Value | Notes |
|------|-------|-------|
| `STRIPE_SECRET_KEY` | `sk_live_...` (or `sk_test_...` for testing) | From Stripe Dashboard → Developers → API keys (Secret key) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` (or `pk_test_...`) | From Stripe Dashboard → Developers → API keys (Publishable key) |

### Stripe Price IDs (Your Live Products)

| Name | Value | Notes |
|------|-------|-------|
| `STRIPE_STARTER_PRICE_ID` | `price_1SvPwKKhlGbF8HFhb05TCvm6` | Starter plan ($29/month) |
| `STRIPE_PROFESSIONAL_PRICE_ID` | `price_1SvPxGKhlGbF8HFhBpsn4mMa` | Professional plan ($99/month) |

### Site URL & Portfolio Audit

| Name | Value | Notes |
|------|-------|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://doggybagg.cc` | Used for auth redirects |
| `NEXT_PUBLIC_STRIPE_PORTFOLIO_AUDIT_LINK` | `https://buy.stripe.com/...` | Live Stripe Payment Link for $499 Portfolio Audit (hero + pricing CTAs). Get from Stripe Dashboard → Payment links. Use live link, not `test_` URL. |

---

## Optional (for Preview/Development)

If you use Vercel Preview deployments or want a dev redirect:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | `http://localhost:3000/auth/callback` | Development only |

---

## After Adding Variables

1. Click **Save** for each variable
2. **Redeploy** your project:
   - Go to **Deployments** tab
   - Click the **...** menu on the latest deployment → **Redeploy**
   - Or push a new commit to trigger a build

---

## Verification

After deploy completes:
1. Visit https://doggybagg.cc
2. Open browser DevTools → Console
3. Check for errors related to missing env vars
4. Test sign-up and pricing buttons

If you see "STRIPE_SECRET_KEY is not set" or similar, double-check the variable names match exactly (case-sensitive).
