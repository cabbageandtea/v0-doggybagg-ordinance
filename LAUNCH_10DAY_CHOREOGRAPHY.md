# 10-Day Launch Choreography

**Project:** Ordinance.ai (doggybagg.cc)  
**Target:** Top 1% SaaS Launch

---

## Day 10 – Feature Freeze & Hardening

### Feature Freeze Checklist

| Item | Status |
|------|--------|
| No new features merged to `main` | ☐ |
| Dependency freeze: `pnpm-lock.yaml` committed, no `pnpm add` | ☐ |
| Library versions locked: Next.js 16.1.6, React 19.2.0, Stripe 20.3.0, Supabase latest | ☐ |
| All env vars documented in `.env.example` | ☐ |

### Actions
- [ ] Merge any in-flight PRs
- [ ] Run `pnpm build` – must pass
- [ ] Run `pnpm test:coverage` – must pass
- [ ] Run `pnpm test:e2e` – must pass

---

## Day 9 – Security & RLS Audit

- [ ] Verify `scripts/006` RLS applied: `properties_select_own`, `properties_select_null_user`
- [ ] Run `scripts/008_stripe_webhook_events.sql` if not already run
- [ ] Confirm `city_registry_cache` RLS (if table exists)
- [ ] Review SECURITY.md; confirm hello@doggybagg.cc for vuln reports

---

## Day 8 – TTFV Optimization

- [ ] Add `/checkout` to protected routes in `lib/supabase/proxy.ts`
- [ ] (Optional) Make full name optional on sign-up for faster TTFV
- [ ] Smoke test: Sign up → Sign in → Add property → View dashboard (target <2 min)

---

## Day 7 – Analytics Instrumentation

- [ ] Wire `trackSignedUp` in `app/auth/sign-up/page.tsx`
- [ ] Wire `trackSignedIn` in `app/auth/sign-in/page.tsx`
- [ ] Wire `trackCheckoutStarted` in `components/checkout.tsx`
- [ ] Wire `trackCheckoutCompleted` in `app/checkout/success/page.tsx`
- [ ] Wire `trackOnboardingTourCompleted` in `components/guided-onboarding-tour.tsx`
- [ ] Wire `trackHealthCheckGenerated` in `components/guided-onboarding-tour.tsx`
- [ ] Wire `trackPhoneVerified` in `components/phone-verification-modal.tsx`
- [ ] Add `FeedbackTrigger` to dashboard layout or footer (optional)

---

## Day 6 – E2E & Regression

- [ ] Run full E2E: `pnpm test:e2e`
- [ ] Manual: Sign up, add property, scroll to stats, verify PostHog events
- [ ] Manual: Checkout flow (Starter plan) – verify webhook, profile update
- [ ] Verify `https://doggybagg.cc/robots.txt` and `sitemap.xml`

---

## Day 5 – Documentation & Compliance

- [ ] Update CHANGELOG.md with any changes since Day 10
- [ ] Confirm Stripe Tax (PA) and business verification
- [ ] Confirm DNS (SPF, DKIM, DMARC) for doggybagg.cc
- [ ] Review PROD_READY.md env checklist

---

## Day 4 – Performance & Monitoring

- [ ] Lighthouse audit on homepage and dashboard
- [ ] Verify Vercel Analytics and PostHog receiving events
- [ ] Confirm Stripe webhook logs (no 4xx/5xx on production)

---

## Day 3 – Soft Launch Prep

- [ ] Announce to internal/beta users (if any)
- [ ] Prepare status page or incident comms (optional)
- [ ] Final `pnpm build` and deploy to production

---

## Day 2 – Staging Validation

- [ ] Full flow on staging/preview: sign up → add property → checkout
- [ ] Verify webhook idempotency (replay same event – no duplicate processing)
- [ ] Verify PostHog events in project

---

## Day 1 – Launch

- [ ] Merge final PRs; deploy to production
- [ ] Monitor Vercel deployment; confirm Ready
- [ ] Monitor Stripe Dashboard for first live transaction
- [ ] Monitor PostHog for `signed_up`, `add_property`, `checkout_completed`
- [ ] Announce launch

---

## Day 0 – Post-Launch

- [ ] First 24h: Monitor error rates, webhook failures, auth issues
- [ ] Collect first 10 user feedback responses (FeedbackTrigger)
- [ ] Update CHANGELOG.md with launch version

---

## Feature Freeze Dependency Snapshot

```
Next.js: 16.1.6
React: 19.2.0
@supabase/supabase-js: latest
stripe: 20.3.0
posthog-js: ^1.336.4
@tanstack/react-query: ^5.90.20
```

Do **not** run `pnpm update` or `pnpm add` during freeze without explicit approval.
