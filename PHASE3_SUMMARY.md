# Phase 3: Conversion & Scale – doggybagg.cc

## 1. Infrastructure Sync (Supabase MCP)

### Executed SQL (via Supabase MCP)

**Project:** doggybagg-ordinance (`peyvcznhifizmknuxmfj`)

| Table | Status | RLS |
|-------|--------|-----|
| `user_onboarding` | ✅ Created | Enabled (select/update/insert for authenticated, own row) |
| `compliance_health_checks` | ✅ Created | Enabled (select/insert for authenticated, own row) |
| `onboarding_actions` | ✅ Created | Enabled (select/insert for authenticated, own row) |
| `stripe_webhook_events` | ✅ Created | Enabled (no policies = service role only) |
| `handle_updated_at()` | ✅ Created | N/A |
| `user_onboarding_updated_at` trigger | ✅ Created | N/A |

**Policies:** `user_onboarding` has "Users can view/update/insert own onboarding". `stripe_webhook_events` has RLS with no policies—only service role can access.

---

## 2. Hardened Logic (Already in Place)

- **Intersection Observer:** `useOnboardingViewTrigger` on `#neighborhood-watch` triggers `has_viewed_risk_score` in `user_onboarding`.
- **Stripe idempotency:** Webhook uses `stripe_webhook_events` to avoid duplicate processing; `stripe-signature` verified with `STRIPE_WEBHOOK_SECRET`.
- **Context cleanup:** Legacy `onboarding-agent.tsx` and `ghost-cursor.tsx` previously removed (not present in codebase).

---

## 3. Phase 3: Growth & Analytics

### SEO

- **Metadata API:** `app/layout.tsx` updated with:
  - OpenGraph (type, locale, url, siteName, title, description, images)
  - Twitter card (summary_large_image)
  - robots (index/follow)
  - Template title: `%s | Ordinance.ai`
- **robots.txt:** `app/robots.ts` – allows `/`, disallows `/dashboard`, `/upload`, `/checkout/`, `/auth/`, `/protected`, `/api/`; references sitemap.
- **sitemap.xml:** `app/sitemap.ts` – includes `/`, `/auth/sign-in`, `/auth/sign-up`, `/checkout/starter-plan`, `/checkout/professional-plan`.

### Analytics

- **PostHog:** `posthog-js` + `PostHogProvider` in layout.
- **Add Property tracking:** `trackAddProperty({ source: "dialog" | "upload", count?: number })` called from:
  - `PropertyForm` (create mode) → `source: "dialog"`
  - Upload page quick add → `source: "upload"`
  - Upload page CSV bulk → `source: "upload"`, `count: result.success`

**Env vars:** `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` (optional, default `https://us.i.posthog.com`).

---

## Next Steps Before Push

1. Add `NEXT_PUBLIC_POSTHOG_KEY` in Vercel (optional) for conversion tracking.
2. Run build locally: `pnpm build` – passes.
3. Push to GitHub for production deployment.
