# START HERE — DoggyBagg Launch Guide

You're not lost. This guide is your single source of truth. Do these steps in order, and you'll be ready to launch.

---

## Where Things Stand

- **Site:** doggybagg.cc is live on Vercel
- **Tech:** Next.js, Supabase, Stripe, PostHog — all wired up
- **Brand:** DoggyBagg aligned across the project
- **Landing page:** Bento grid, tactile buttons, trust bar, pricing, testimonials
- **Dashboard:** Add property, portfolio view, risk scores, CSV export
- **Checkout:** Stripe subscriptions ($29, $99) + Portfolio Audit ($499) payment link

---

## Step 1: Stripe Webhook (Required for Payments)

Without this, payments won't complete correctly.

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. **Endpoint URL:** `https://doggybagg.cc/api/webhooks/stripe`
4. **Events to send:** Select `checkout.session.completed`
5. Click **Add endpoint**
6. Open the new webhook → **Reveal** signing secret
7. Copy the secret (starts with `whsec_`)

---

## Step 2: Vercel Environment Variables

1. Go to [Vercel](https://vercel.com) → your DoggyBagg project
2. **Settings** → **Environment Variables**
3. Add these (if not already set):

| Variable | Value | Where to get it |
|----------|-------|-----------------|
| `STRIPE_WEBHOOK_SECRET` | whsec_... | Step 1 above |
| `SUPABASE_SERVICE_ROLE_KEY` | eyJ... | Supabase → Project Settings → API → service_role |
| `NEXT_PUBLIC_POSTHOG_KEY` | phc_... | PostHog project (you said this is set ✓) |

4. Click **Save**
5. Go to **Deployments** → click **⋮** on latest → **Redeploy** (so new vars are used)

---

## Step 3: Supabase Database (One-Time)

1. Go to [Supabase](https://supabase.com) → your project → **SQL Editor**
2. Run each script **in order** (if you haven’t already):

   - `scripts/001_create_properties_schema.sql`
   - `scripts/005_onboarding_agent_schema.sql`
   - `scripts/008_stripe_webhook_events.sql`

   You can copy the contents of each file and paste into the SQL Editor, then Run.

---

## Step 4: Test the Flow

1. Visit https://doggybagg.cc
2. Click **Start Free** or **Sign Up**
3. Create an account
4. Add a property on the dashboard
5. Scroll to the risk/neighborhood section (this triggers onboarding)
6. Try a checkout (use Stripe test mode first if you prefer)

---

## Step 5 (Optional): Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://doggybagg.cc`
3. Choose **HTML tag** verification
4. Copy the content value (e.g. `abc123xyz`)
5. In Vercel → Environment Variables → add:
   - Name: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
   - Value: `abc123xyz`
6. Redeploy
7. In Search Console, click **Verify**
8. Submit sitemap: `https://doggybagg.cc/sitemap.xml`

---

## What I Fixed for You

- Google verification meta tag: only shows when you set the env var (no more placeholder)
- Brand alignment: DoggyBagg everywhere
- All docs consolidated into this one guide

---

## If Something Breaks

1. **Payments not completing:** Check Stripe webhook secret is set in Vercel and endpoint URL is correct
2. **"Service role" errors:** Add `SUPABASE_SERVICE_ROLE_KEY` in Vercel
3. **Build fails:** Check Vercel logs; usually a missing env var

---

## You’ve Got This

You don’t need to understand every detail. Do Steps 1–4, in order. That’s enough to go live.

When you’re ready for more — SEO, ads, support — come back and we’ll tackle it step by step.
