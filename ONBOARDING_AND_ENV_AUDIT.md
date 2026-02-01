# Onboarding Integration & Environment Audit

**Date:** February 2025

## 1. Onboarding State Integration

### user_onboarding table (Supabase)
- `has_completed_tour`, `has_added_property`, `has_verified_phone`, `has_viewed_risk_score`, `has_generated_health_check`
- Schema: `scripts/005_onboarding_agent_schema.sql`

### Implemented
- **`app/actions/onboarding.ts`**: `getUserOnboardingProgress()`, `updateOnboardingMilestone()`, `ensureOnboardingRow()`
- **`providers/onboarding-provider.tsx`**: Fetches progress, provides `primaryCta` for highlighting
- **Dashboard layout**: Wraps with `OnboardingProvider`
- **GuidedOnboardingTour**: Uses `useOnboarding()` and `updateOnboardingMilestone()`; steps driven by real DB milestones
- **Add Property**: Highlights when `primaryCta === "add_property"`; `has_added_property` synced on insert (in `addProperty` action)
- **Verify Phone**: Highlights when `primaryCta === "verify_phone"`; calls `updateOnboardingMilestone("has_verified_phone")` on success
- **View Risk**: Step 3 scrolls to stats (`id="neighborhood-watch"`); updates `has_viewed_risk_score`

### Flow
1. User lands on dashboard → `OnboardingProvider` fetches `user_onboarding`
2. Next incomplete milestone drives `primaryCta` → UI highlights that CTA (Add Property, Verify Phone, etc.)
3. Actions update milestones via server actions → `refetch()` keeps UI in sync

---

## 2. Environment Variable Audit

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Used in: `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/proxy.ts`
- **Status:** All use `process.env`; no hardcoded keys

### Stripe
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_STARTER_PRICE_ID`, `STRIPE_PROFESSIONAL_PRICE_ID`, `NEXT_PUBLIC_STRIPE_PORTFOLIO_AUDIT_LINK`
- Used in: `lib/stripe.ts`, `app/actions/stripe.ts`, `components/checkout.tsx`, `components/hero-section.tsx`, `components/pricing-section.tsx`
- **Status:** All use `process.env`; no hardcoded keys

### Production (doggybagg.cc)
- `NEXT_PUBLIC_SITE_URL` defaults to `https://doggybagg.cc` in `app/layout.tsx`
- Auth callback uses `process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin`
- **Action:** Confirm in Vercel project settings that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set for the doggybagg.cc deployment

---

## 3. Tree Shake Candidates (Unused Components)

| Component | Status | Action |
|-----------|--------|--------|
| `RiskPredictionCard` | Import removed from dashboard | Done |
| `onboarding-agent.tsx`, `ghost-cursor.tsx` | Unused (replaced by GuidedOnboardingTour) | Safe to delete |
| `theme-provider.tsx` | Not used in layout | Safe to delete if not needed |
| `resolution-center.tsx` | Not imported anywhere | Safe to delete |
| `compliance-certificate.tsx`, `diy-appeal-guide.tsx` | Only used by resolution-center | Safe to delete if removing resolution-center |

To remove: delete files and run `pnpm build` to verify no broken imports.
