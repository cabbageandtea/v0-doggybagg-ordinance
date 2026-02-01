# Day 5: Money Path Audit — Checkout & Subscription

## 1. Stripe Integration Check

### Pricing Buttons → Checkout

| Plan | Button Target | Flow |
|------|---------------|------|
| Starter | `/checkout/starter-plan` | Next.js route → Embedded Stripe Checkout |
| Professional | `/checkout/professional-plan` | Next.js route → Embedded Stripe Checkout |
| Community (Free) | `/auth/sign-up?tier=community-free` | Sign up (no payment) |
| Enterprise | `mailto:support@doggybagg.cc` | Contact sales |

- **Stripe session:** Created via `startCheckoutSession` (server action) with env-configured Price IDs.
- **success_url / redirect:** `redirect_on_completion: 'never'` (embedded). `onComplete` callback redirects to `/checkout/success`.
- **PostHog conversion:** `checkout_completed` fired server-side in Stripe webhook with `userId` and `productId` (reliable attribution).

### Conversion Event Flow

1. User completes payment in Embedded Checkout.
2. Stripe sends `checkout.session.completed` to webhook.
3. Webhook calls `captureCheckoutCompletedServer(userId, { productId, value })` — PostHog identify + capture.
4. Client `onComplete` redirects to `/checkout/success`.

---

## 2. Auth-to-Payment Bridge

### Logged-Out User Clicks "Buy Now"

1. User clicks Starter or Professional on landing → navigates to `/checkout/starter-plan` or `/checkout/professional-plan`.
2. **Proxy** (`lib/supabase/proxy.ts`): `/checkout` is protected → redirects to `/auth/sign-in?redirect=/checkout/starter-plan` (or professional-plan).
3. User signs in (or clicks "Sign up" → `/auth/sign-up?redirect=...`).
4. **After sign-in:** `safeRedirect` → back to `/checkout/starter-plan`.
5. **After sign-up (no email confirm):** `router.push(safeRedirect)` → checkout.
6. **After sign-up (email confirm):** User verifies email → magic link goes to `/auth/callback?redirect=/checkout/...` → callback redirects to checkout.

Redirect passthrough is implemented in: `sign-in`, `sign-up`, `auth/callback`.

---

## 3. Post-Purchase State

### Dashboard Tier-Aware UI

| Tier | Behavior |
|------|----------|
| free | "Upgrade" button visible; no tier badge; property limit shown as X/1 |
| starter | Tier badge "Starter"; limit X/5; no Upgrade button |
| professional | Tier badge "Professional"; limit X/10; no Upgrade button |
| enterprise | Tier badge "Enterprise"; high limit; no Upgrade button |

- **Hook:** `useSubscriptionTier` fetches `profiles.subscription_tier`.
- **Limits:** `TIER_LIMITS` in `app/actions/onboarding.ts`.
- **Invalidation:** "Go to Dashboard" on success page invalidates subscription tier query so dashboard shows updated tier.

---

## Files Touched

| File | Change |
|------|--------|
| `components/checkout.tsx` | `onComplete` → `router.push('/checkout/success')` |
| `app/actions/onboarding.ts` | `getSubscriptionTier`, `TIER_LIMITS` |
| `lib/hooks/use-subscription-tier.ts` | New hook |
| `app/dashboard/page.tsx` | Tier badge, limit display, Upgrade prompt (free only) |
| `app/checkout/success/checkout-success-actions.tsx` | Invalidate tier on "Go to Dashboard" |
