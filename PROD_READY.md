# Production Ready – doggybagg.cc

**Phase 2 Verification Complete**

For a concise pre-launch checklist (OG image, Search Console, etc.), see **LAUNCH_CHECKLIST.md**.

---

## Manual Vercel Env Vars Checklist

Before the first customer payment, add these in **Vercel → Project → Settings → Environment Variables** (Production):

| Variable | Required | Where to Get | Notes |
|----------|----------|--------------|-------|
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe Dashboard → Developers → Webhooks → Add endpoint `https://doggybagg.cc/api/webhooks/stripe` → Reveal signing secret (whsec_...) | Enables signature verification and idempotency |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase Dashboard → Project Settings → API → service_role key | Server-only; never expose in client. Required for webhook to update payment_transactions and stripe_webhook_events |

**After adding:** Redeploy so the new env vars are picked up.

---

## Database Sync (Supabase)

**Script 008:** Run `scripts/008_stripe_webhook_events.sql` manually in **Supabase SQL Editor**. There is no Supabase CLI migration setup in this project.

**Audit:** `user_onboarding` and `stripe_webhook_events` are independent tables. No foreign key link—and none needed. Checkout updates `payment_transactions`; onboarding tracks milestones. No data orphans.

---

## Stripe Webhook Setup

1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://doggybagg.cc/api/webhooks/stripe`
3. Events: `checkout.session.completed`
4. Copy the signing secret → add as `STRIPE_WEBHOOK_SECRET` in Vercel

---

## Production Warning Log

If `STRIPE_WEBHOOK_SECRET` is missing in production, the webhook route logs:

```
[stripe-webhook] PRODUCTION WARNING: STRIPE_WEBHOOK_SECRET is not set. Webhook will reject all requests. Add this env var in Vercel before accepting payments.
```

Check Vercel Logs after deployment to confirm the secret is set.

---

## Full Env Vars Reference

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (client) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (webhook only) |
| `STRIPE_SECRET_KEY` | Stripe server key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (whsec_...) |
| `STRIPE_STARTER_PRICE_ID` | $29/mo plan |
| `STRIPE_PROFESSIONAL_PRICE_ID` | $99/mo plan |
| `NEXT_PUBLIC_STRIPE_PORTFOLIO_AUDIT_LINK` | $499 audit payment link |
| `NEXT_PUBLIC_SITE_URL` | `https://doggybagg.cc` |
