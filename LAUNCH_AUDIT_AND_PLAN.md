# Top 1% SaaS Launch – Technical Audit & Plan

**Project:** Ordinance.ai (doggybagg.cc)  
**Date:** February 2026

---

## 1. Technical Audit & Refinement

### 1.1 Existing Flows (Do Not Duplicate)

| Flow | Location | Summary |
|------|----------|---------|
| **Auth** | `app/auth/sign-in/page.tsx`, `app/auth/sign-up/page.tsx`, `app/auth/callback/route.ts`, `lib/supabase/proxy.ts` | Sign-in with password; sign-up with email redirect; callback creates profile via `ensureUserProfile()`; proxy protects `/dashboard`, `/upload` |
| **Payments** | `app/actions/stripe.ts`, `components/checkout.tsx`, `app/api/webhooks/stripe/route.ts` | Embedded Stripe Checkout; webhook has idempotency + signature verification; `startCheckoutSession` requires auth |
| **Onboarding** | `providers/onboarding-provider.tsx`, `app/actions/onboarding.ts`, `lib/hooks/use-onboarding-view-trigger.ts`, `components/guided-onboarding-tour.tsx` | Milestones: add_property, verify_phone, view_risk, generate_health_check; Intersection Observer fires `has_viewed_risk_score` |

### 1.2 Time-to-First-Value (TTFV) – 2-Minute Target

**Current path:** Sign up → Verify email (if enabled) → Sign in → Dashboard → Add property → View stats.

| Optimization | File | Change |
|--------------|------|--------|
| **Skip verify-email for immediate session** | `app/auth/sign-up/page.tsx` | Already handles `data.session` → `ensureUserProfile()`; consider Supabase: Auth → Providers → disable "Confirm email" for faster TTFV in dev/staging |
| **Redirect unauthenticated checkout** | `lib/supabase/proxy.ts` | Add `/checkout` to protected routes so users are redirected to sign-in with `?redirect=/checkout/...` instead of seeing a failed checkout |
| **Preload onboarding context** | `app/dashboard/layout.tsx` | `OnboardingProvider` already wraps dashboard; ensure it fetches immediately—no change if already fast |
| **Property quick-add above fold** | `app/dashboard/page.tsx` | "Add Property" CTA is prominent; consider showing `PropertyCreateDialog` or inline form on empty state without extra click |
| **Reduce auth form fields** | `app/auth/sign-up/page.tsx` | Full name is optional for TTFV; consider making it optional (already quick) |

**Recommended (highest impact):** Add `/checkout` to protected routes in `lib/supabase/proxy.ts` so anonymous users get a clear sign-in flow instead of a broken checkout.

### 1.3 Launch-Blocking Issues

| Issue | Severity | File / Location | Action |
|-------|----------|-----------------|--------|
| **properties_select_null_user** | Medium | `scripts/006_properties_user_and_stro_columns.sql` | Policy allows `SELECT` where `user_id IS NULL`—orphaned rows readable. Tighten or remove after migration if no longer needed |
| **city_registry_cache RLS** | Medium | Not in scripts; Supabase may have this table | If `city_registry_cache` exists, verify RLS. List tables via Supabase MCP |
| **Checkout not protected** | Low | `lib/supabase/proxy.ts` L38 | `isProtected` only includes `/dashboard`, `/upload`. Add `pathname.startsWith('/checkout')` |
| **payment_transactions update** | Low | Webhook updates by `stripe_session_id` | Webhook uses service role; no RLS on update. Ensure `payment_transactions` has no UPDATE policy blocking service role (profiles has update_own—service role bypasses RLS) |
| **subscription_tier metadata** | Low | `app/actions/stripe.ts` L42, `app/api/webhooks/stripe/route.ts` L104 | Metadata uses `subscriptionTier` (camelCase); webhook reads `session.metadata?.subscription_tier`. Stripe normalizes to lowercase—verify webhook receives `subscription_tier` |

### 1.4 API Route Edge Cases

| Route | File | Edge Case | Status |
|-------|------|-----------|--------|
| `/api/health` | `app/api/health/route.ts` | No auth; returns JSON. Safe for uptime checks | OK |
| `/api/webhooks/stripe` | `app/api/webhooks/stripe/route.ts` | Missing `stripe-signature` → 400; missing secret → 500; duplicate event → 200 idempotent | OK |
| Auth callback | `app/auth/callback/route.ts` | Missing `code` → redirect to `/`; exchange failure → redirect to sign-in with error | OK |

---

## 2. Documentation Gaps

| Document | Exists | Action |
|----------|--------|--------|
| SECURITY.md | No | Create (see below) |
| GOVERNANCE.md | No | Create (see below) |
| CHANGELOG.md | No | Create (see below) |

---

## 3. Telemetry & Feedback

### 3.1 Current Analytics

- **Provider:** PostHog (`providers/posthog-provider.tsx`, `lib/analytics.ts`)
- **Initialization:** `NEXT_PUBLIC_POSTHOG_KEY` + `apiKey` in `PostHogProvider`; do **not** re-initialize

### 3.2 Existing Events

| Event | File |
|-------|------|
| `add_property` | `lib/analytics.ts`, fired from `components/property-form.tsx`, `app/upload/page.tsx` |
| `has_viewed_risk_score` | `lib/analytics.ts`, fired from `lib/hooks/use-onboarding-view-trigger.ts` |

### 3.3 Missing "Aha!" Moments (Add to `lib/analytics.ts`)

| Event | When to Fire | File to Instrument |
|-------|--------------|--------------------|
| `signed_up` | After successful sign-up | `app/auth/sign-up/page.tsx` |
| `signed_in` | After successful sign-in | `app/auth/sign-in/page.tsx` |
| `checkout_started` | When EmbeddedCheckout mounts or client secret fetched | `components/checkout.tsx` |
| `checkout_completed` | After successful payment (redirect or status poll) | `app/checkout/success/page.tsx` or checkout component |
| `onboarding_tour_completed` | When user completes GuidedOnboardingTour | `components/guided-onboarding-tour.tsx` |
| `health_check_generated` | When first health check modal shown | `components/guided-onboarding-tour.tsx` |
| `phone_verified` | When phone verification succeeds | `components/phone-verification-modal.tsx` |
| `csv_upload_completed` | When bulk CSV import finishes | `app/upload/page.tsx` (already has `trackAddProperty` for bulk—add dedicated event with count) |

### 3.4 Feedback Component

- **Status:** No existing feedback/survey component in `components/`
- **Action:** Create `components/feedback-trigger.tsx` (reusable; triggers PostHog event + optional mailto)

---

## 4. File Reference Index

| Purpose | Path |
|---------|------|
| Auth sign-in | `app/auth/sign-in/page.tsx` |
| Auth sign-up | `app/auth/sign-up/page.tsx` |
| Auth callback | `app/auth/callback/route.ts` |
| Route protection | `lib/supabase/proxy.ts` |
| Stripe checkout action | `app/actions/stripe.ts` |
| Stripe webhook | `app/api/webhooks/stripe/route.ts` |
| Onboarding provider | `providers/onboarding-provider.tsx` |
| Onboarding actions | `app/actions/onboarding.ts` |
| Analytics | `lib/analytics.ts` |
| PostHog provider | `providers/posthog-provider.tsx` |
| RLS scripts | `scripts/001_create_properties_schema.sql`, `scripts/006_properties_user_and_stro_columns.sql` |
