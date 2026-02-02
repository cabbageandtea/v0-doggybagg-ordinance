# Changelog

All notable changes to DoggyBagg (doggybagg.cc) are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [0.2.2] - 2026-02-02

### Fixes

- **Zod 4 alignment** — Upgrade zod to 4.1.11 + pnpm override to fix `TypeError: t._parse is not a function` with Workflow DevKit on Vercel.
- **stripe-webhook validation** — Update return type for Zod 4 compatibility.
- **Proxy exclusion for workflow** — Exclude `/.well-known/*` from proxy matcher so Workflow DevKit API responses are not modified (fixes "Failed to parse server response").
- **Workflow SDK pin** — Pin workflow to 4.0.1-beta.30 for stability.
- **Force Webpack over Turbopack** — Use `next build --webpack` to avoid Turbopack minifying Zod-based SDK incorrectly.
- **Deep dependency resolution** — zod + workflow at top of deps; clean pnpm-lock slate; pnpm override zod 4.1.11 for all transitive deps.
- **Durable object verification** — Documented that sentinel workflow has no top-level world handler init (routes via withWorkflow).
- **Advanced t._parse fixes** — serverExternalPackages for zod/workflow/@workflow/*; webpack() in next.config; /api/workflow proxy exclusion; strict zod 4.1.11 override.
- **Strict proxy termination** — Early return for /.well-known/workflow at top of proxy handler (defense in depth).
- **Vercel Deployment Protection** — Added VERCEL_DEPLOYMENT_PROTECTION_CHECK.md; Zod 3.x not viable (workflow SDK requires Zod 4).

## [0.2.1] - 2026-02-01

### TOT Gap Sniper

- **lib/snipers/tot.ts** — Cross-reference sniper_stro_snapshots with San Diego TOT certificate registry; identify STRO licenses missing TOT
- **Sentinel Step 6** — stepTotSniper; FINANCIAL RISK section in admin email (Red Alert for $499 Portfolio Audit)

## [0.2.0] - 2026-02-01

### Renewal Sentinel

- **lib/snipers/renewal.ts** — Licenses expiring in 10–45 days from sniper_stro_snapshots
- **scripts/016_stro_expiration.sql** — Add expiration_date column
- **licenses.ts** — Parse expiration_date / expiration_year from STRO CSV
- **Sentinel Step 5** — Upcoming Renewals section in admin email (Revenue Protection)

### Integrity Gap Sniper

- **lib/snipers/integrity.ts** — AirBnB listings in 92109/92037; cross-reference displayed permit vs sniper_stro_snapshots; flag listings not in registry
- **Sentinel workflow** — Step 4: Integrity sniper; CRITICAL Integrity Gap section in admin email
- **Env:** `APIFY_API_TOKEN`, `APIFY_AIRBNB_ACTOR_ID` (optional; returns [] without)

### Municipal Docket Scraper

- **lib/snipers/dockets.ts** — Scrapes San Diego City Council dockets; keyword search (STRO, ordinance, enforcement); alerts 72h before meetings
- **scripts/015_docket_logs.sql** — `sentinel_docket_history` for dedupe
- **Sentinel workflow** — Step 0: Docket scraper; legislative alerts section in admin email
- **Data sources page** — City Council Dockets added

### Sentinel Improvements (Team Debate)

- Prioritize new entrants first in email (have contact info)
- Dedupe by normalized address (prefer STRO over CE)
- Softer subject when 0 targets: "Daily Report"
- Log runs to sniper_runs for observability
- Resilient license sniper: return [] on fetch/Supabase failure

### Durable Post-Purchase Workflow

- **Workflow DevKit** — `workflow` package; `app/workflows/purchase.ts`
- **$499 Audit sequence:** Welcome email → sleep(3 days) → Follow-up email
- **Stripe webhook:** Starts `purchaseAuditWorkflow` on checkout.session.completed for audit
- **Emails:** `sendWelcomeAuditEmail`, `sendFollowUpAuditEmail` in `lib/emails.ts`
- **Docs:** WORKFLOWS.md; EDGE_TECH_ROADMAP updated

### Final Hour Polish

- **Metadata:** DoggyBagg title, 160-char description, OpenGraph/Twitter images (`/images/og-image.jpg` + logo fallback)
- **Google Search Console:** `verification.google` meta tag; set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel
- **Custom 404:** Tactile Framer Motion style, liquid-glass card, TactileButton
- **Loading skeleton:** Branded liquid-glass layout
- **CookieConsent:** localStorage-gated, links to `/privacy`, PostHog `consent_given`, TactileButton, a11y (role, aria-live)
- **Privacy page:** `/privacy` with MeshGradientBackground, liquid-glass card, sitemap entry
- **LAUNCH_CHECKLIST.md:** Manual steps (OG image, Search Console, env vars)

### Top 1% Resiliency (Pre-Launch)

#### Stripe Webhook Fail-Safe
- **Zod schema** (`lib/validation/stripe-webhook.ts`) for checkout metadata validation; case-insensitive key mapping
- **Dead letter logging** to `webhook_logs` on validation failure or processing error (run `scripts/010_webhook_logs.sql` first)
- **Server-side `checkout_completed`** in webhook via PostHog Node SDK (`lib/analytics-server.ts`)

#### Telemetry & Identification
- **PostHogIdentifyBridge** (`components/posthog-identify-bridge.tsx`) in root layout; identifies user on auth
- **Client analytics** (`lib/analytics.ts`): optional `userId` param on all track helpers; `identifyUser()` exported
- **Sign-in/Sign-up**: pass `data.user?.id` to `trackSignedIn` / `trackSignedUp`

#### Security
- **scripts/security-test.sql** – Manual RLS stress test for `properties`, `city_registry_cache`, `stripe_webhook_events`, `webhook_logs`

#### React 19 / Next.js 16
- **REACT19_HYDRATION_AUDIT.md** – Audit of `useEffect` usage; no hydration mismatch risks identified

### Pre-Launch Prep

#### Telemetry Wiring (Day 7)
- **Already implemented:** `add_property`, `has_viewed_risk_score`
- **Wired:** `trackSignedUp` → `app/auth/sign-up/page.tsx` (after success)
- **Wired:** `trackSignedIn` → `app/auth/sign-in/page.tsx` (after success)
- **Wired:** `trackCheckoutStarted` → `components/checkout.tsx` (once per fetchClientSecret)
- **Wired:** `trackCheckoutCompleted` → `app/checkout/success/checkout-success-tracker.tsx` (once on mount)
- **Wired:** `trackHealthCheckGenerated` → `components/guided-onboarding-tour.tsx` (when health check modal shown)
- **Wired:** `trackOnboardingTourCompleted` → `components/guided-onboarding-tour.tsx` (Skip, Start Monitoring, overlay dismiss)
- **Wired:** `trackPhoneVerified` → `components/phone-verification-modal.tsx` (on verify success)

#### Stripe Webhook
- Case-insensitive metadata lookup for `userId`, `subscription_tier` / `subscriptionTier`
- `logWebhookFailure()` for delivery failure tracking (first-24h launch monitoring)

#### Security & RLS
- `scripts/009_city_registry_cache_rls.sql` – RLS for `city_registry_cache` (run if table exists)
- `lib/supabase/proxy.ts` – Blocks `/checkout`, `/dashboard`, `/upload` when unauthenticated

### Added
- SECURITY.md, GOVERNANCE.md, CHANGELOG.md for procurement readiness
- LAUNCH_AUDIT_AND_PLAN.md – Top 1% SaaS launch audit
- LAUNCH_10DAY_CHOREOGRAPHY.md – 10-day countdown plan
- `components/feedback-trigger.tsx` – Reusable feedback button (PostHog + mailto)
- `app/checkout/success/checkout-success-tracker.tsx` – Fires `trackCheckoutCompleted` once on success page mount
- Analytics helpers: `trackSignedUp`, `trackSignedIn`, `trackCheckoutStarted`, `trackCheckoutCompleted`, `trackOnboardingTourCompleted`, `trackHealthCheckGenerated`, `trackPhoneVerified`, `trackFeedbackClicked`

### Changed
- `lib/supabase/proxy.ts` – Protect `/checkout` routes (redirect unauthenticated users to sign-in)
- `app/api/webhooks/stripe/route.ts` – Case-insensitive metadata, webhook failure logging

### Fixed
- Stripe metadata keys (`subscription_tier` / `subscriptionTier`) now resolved case-insensitively

---

## [0.1.0] - 2026-01

### Added
- Auth (sign-in, sign-up, callback, profile creation)
- Properties CRUD with React Query
- Stripe embedded checkout + webhook idempotency
- Onboarding milestones (add property, verify phone, view risk, health check)
- PostHog analytics (add_property, has_viewed_risk_score)
- SEO: OpenGraph, robots.txt, sitemap.xml
- Dashboard, upload, checkout flows
- Guided onboarding tour
- Intersection Observer for zero-effort risk-score milestone
