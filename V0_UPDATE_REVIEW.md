# v0 Update Review – New From v0

**Date:** January 2026  
**Commits pulled:** `aed7ccb` → `fcbb0f8`  
**Source:** Merge PR #5 from `v0/techtitan0187-8440-da2d1f9e`

---

## New Features (v0 Sync)

### Landing Page
- **NeighborhoodWatchWidget** – Neighborhood enforcement insights
- **TestimonialsSection** – Social proof
- **FAQSection** – Accordion FAQ
- **Community Alert** – New free tier in pricing (links to sign-up)

### Dashboard & Data
- **Real database connection** – Dashboard now uses `getUserProperties()` instead of mock data
- **Property CRUD** – Add, delete properties via `properties.ts` server actions
- **Dynamic stats** – Calculated from actual property data

### New Components
- `compliance-certificate.tsx` – Compliance health certificates
- `diy-appeal-guide.tsx` – Appeal letter guidance
- `guided-onboarding-tour.tsx` – User onboarding tour
- `onboarding-agent.tsx` / `ghost-cursor.tsx` – Onboarding agent
- `phone-verification-modal.tsx` – Phone verification UI
- `resolution-center.tsx` – Violation resolution
- `risk-prediction-card.tsx` – Risk scoring
- `neighborhood-watch-widget.tsx` – Neighborhood intelligence

### New App Structure
- `app/actions/agentic.ts` – Agentic compliance actions (738 lines)
- `app/actions/properties.ts` – Property CRUD
- `app/api/health/route.ts` – Health check endpoint
- `app/not-found.tsx` – 404 page
- `app/protected/page.tsx` – Protected route placeholder

### New Database Scripts
- `scripts/004_agentic_autonomous_expansion.sql` – Agent tables, neighborhood intelligence, appeal tracking
- `scripts/005_onboarding_agent_schema.sql` – User onboarding, compliance health checks

---

## Critical Issues Found

### 1. `.env.example` Deleted
**Impact:** New developers have no env template.  
**Fix:** Restored `.env.example` with required variables.

### 2. Stripe Uses Wrong Table
**Problem:** `stripe.ts` inserts into `payments` but schema defines `payment_transactions`.  
**Impact:** Checkout will fail when logging payments.  
**Fix:** Update `stripe.ts` to use `payment_transactions` and match schema (amount, product_id).

### 3. Properties Schema Mismatch
**Problem:** `properties.ts` expects `user_id`, `stro_tier`, `license_id`, `reporting_status`, `risk_score` but `001` schema has `address`, `city`, `state`, `zip_code` only (no `user_id`).  
**Impact:** Dashboard will fail; add/delete property will fail.  
**Fix:** Migration `006_properties_user_and_stro_columns.sql` to add missing columns.

---

## Stripe / Pricing (Unchanged)
- Starter: `price_1SvPwKKhlGbF8HFhb05TCvm6` → `/checkout/starter-plan`
- Professional: `price_1SvPxGKhlGbF8HFhBpsn4mMa` → `/checkout/professional-plan`
- Community Alert: Free → `/auth/sign-up?tier=community-free`

---

## Run Order (Supabase SQL Editor)
1. `001_create_properties_schema.sql`
2. `006_properties_user_and_stro_columns.sql` *(new – adds user_id, stro columns, RLS)*
3. `003_drop_profile_trigger_use_app_fallback.sql`
4. `004_agentic_autonomous_expansion.sql` *(requires handle_updated_at from 001)*
5. `005_onboarding_agent_schema.sql`

---

## Fixes Applied
- Restored `.env.example`
- Updated `stripe.ts` to use `payment_transactions` (was `payments`)
- Added `scripts/006_properties_user_and_stro_columns.sql`
