# Phase 2: Production Hardening Summary

## 1. Zero-Effort Onboarding Trigger

**Problem:** `has_viewed_risk_score` was a dead field—no functional trigger.

**Solution:** Intersection Observer hook that fires on scroll-to-view.

**Code changes:**
- **`lib/hooks/use-onboarding-view-trigger.ts`** (new)
  - Observes `#neighborhood-watch` with `IntersectionObserver`
  - Fires `updateOnboardingMilestone("has_viewed_risk_score")` when ≥20% visible
  - Single fire (ref guard + disconnect)
  - Optional `onFired` callback to refresh onboarding UI
- **`app/dashboard/page.tsx`**
  - Calls `useOnboardingViewTrigger("neighborhood-watch", () => void onboarding.refetch())`

**Flow:** User scrolls to stats section → milestone recorded in DB → no click required.

---

## 2. v0 Ghost Purge

**Deleted:**
- `components/onboarding/onboarding-agent.tsx`
- `components/onboarding/ghost-cursor.tsx`

**Verification:** No remaining imports of `OnboardingAgent` or `GhostCursor`. `GuidedOnboardingTour` is the active onboarding flow.

---

## 3. Stripe Webhook: Idempotency & Security

**Created:**
- **`app/api/webhooks/stripe/route.ts`**
  - Verifies `stripe-signature` via `stripe.webhooks.constructEvent()`
  - Returns 400 if signature missing or invalid
  - Idempotency: checks `stripe_webhook_events` before processing
  - Returns 200 + `{ duplicate: true }` for already-processed events
  - Handles `checkout.session.completed`: updates `payment_transactions`, optionally `profiles.subscription_tier`
  - Requires `STRIPE_WEBHOOK_SECRET` and `SUPABASE_SERVICE_ROLE_KEY`
- **`scripts/008_stripe_webhook_events.sql`**
  - `stripe_webhook_events(event_id, event_type, processed_at)` for deduplication
  - RLS enabled, no policies → service role only

**Env vars (add to Vercel):**
- `STRIPE_WEBHOOK_SECRET` (whsec_... from Stripe Dashboard)
- `SUPABASE_SERVICE_ROLE_KEY` (from Supabase → Project Settings → API)

**Stripe Dashboard:** Add endpoint `https://doggybagg.cc/api/webhooks/stripe`, subscribe to `checkout.session.completed`.

---

## 4. Namecheap & Deliverability

**Created:** `NAMEcheap_DNS_DELIVERABILITY.md`

**Records to add:**
- **SPF:** `v=spf1 include:resend.com ~all` (customize for your providers)
- **DKIM:** CNAME records from your email provider (Resend, SendGrid, SES)
- **DMARC:** `v=DMARC1; p=none; rua=mailto:admin@doggybagg.cc` (start in monitor mode)

---

## Deployment Checklist

- [ ] Run `scripts/008_stripe_webhook_events.sql` in Supabase SQL Editor
- [ ] Add `STRIPE_WEBHOOK_SECRET` and `SUPABASE_SERVICE_ROLE_KEY` to Vercel
- [ ] Configure Stripe webhook: `https://doggybagg.cc/api/webhooks/stripe`
- [ ] Add SPF, DKIM, DMARC in Namecheap DNS per `NAMEcheap_DNS_DELIVERABILITY.md`
