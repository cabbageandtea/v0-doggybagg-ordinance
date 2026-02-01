# Day 1: Final Smoke Test & Launch Deployment

## 1. Production Smoke Test

### E2E (Playwright) vs https://doggybagg.cc

```bash
PW_BASE_URL=https://doggybagg.cc pnpm test:e2e
```

| Test | Result |
|------|--------|
| home page has header and CTA | ✅ Pass |
| onboarding route loads | ✅ Pass |
| footer support mailto | ✅ Pass |
| help page loads | ✅ Pass |
| robots.txt serves | ✅ Pass |
| sitemap.xml (privacy, help) | ✅ Pass |
| privacy and help pages render | ✅ Pass |
| auth sign-in (skipped if no creds) | Skipped |

### robots.txt & sitemap.xml

- **robots.txt**: Served correctly; Disallow /dashboard, /auth, /checkout/, /api/; Sitemap URL present. Proxy matcher excludes these paths.
- **sitemap.xml**: Served; contains /privacy, /help. Proxy exclusion prevents auth redirect.

---

## 2. Error Boundary Audit

| Component | Boundary |
|-----------|----------|
| BentoGrid | ✅ SectionErrorBoundary |
| WhyDoggyBagg | ✅ SectionErrorBoundary |
| FineCalculator | ✅ SectionErrorBoundary |
| PropertySearch | ✅ SectionErrorBoundary |
| NeighborhoodWatchWidget | ✅ SectionErrorBoundary |
| TestimonialsSection | ✅ SectionErrorBoundary |
| PricingSection | ✅ SectionErrorBoundary |
| FAQSection | ✅ SectionErrorBoundary |
| Checkout | ✅ Suspense (skeleton fallback) |
| Route-level | ✅ app/error.tsx |
| Root | ✅ app/global-error.tsx |

---

## 3. PostHog Final Event Check

**Manual verification required:**

1. Open https://doggybagg.cc in incognito.
2. Trigger **Sign Up** (complete or abandon) → check PostHog live stream for `signed_up` or `$identify`.
3. Trigger **Property Search** (enter address, click Search) → check for `property_search`.
4. Confirm events appear in PostHog dashboard.

---

## 4. Final Deployment

- **Branch**: All changes on `main`.
- **Build**: ✅ Zero errors.
- **Security (pnpm audit)**: ✅ No known vulnerabilities (high/critical).
- **Merge**: N/A – already on main.

---

## Files Touched

| File | Change |
|------|--------|
| `components/section-error-boundary.tsx` | New – per-section ErrorBoundary |
| `app/page.tsx` | Wrap Bento, WhyDoggyBagg, Calculator, PropertySearch, etc. |
| `tests/e2e/support-funnel.spec.ts` | Add robots.txt test |
