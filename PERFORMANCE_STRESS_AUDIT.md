# Day 3: Performance & Load Stress-Test

## 1. Database Query Audit

### getUserProperties

| Query | Index Required | Status |
|-------|----------------|--------|
| `.eq('user_id', user.id).order('created_at', { ascending: false })` | `idx_properties_user_id`, `idx_properties_user_created` | ✅ Added in `012_properties_performance_indexes.sql` |

### RLS (Row Level Security)

- **properties**: `auth.uid() = user_id` — simple equality, index-friendly. No deep scan.
- **006** replaced `properties_select_all` with `properties_select_own`; RLS uses `user_id`, which is now indexed.

### Compliance / Agentic Queries

| Action | Table | Index |
|--------|-------|-------|
| `predictPropertyRisk` | ordinances (zip_code via properties join) | `idx_ordinances_property_violation_date` |
| `generateComplianceCertificate` | properties + ordinances | property_id, violation_date |
| `getUserProperties` | properties | user_id, created_at |

**Migration**: Run `scripts/012_properties_performance_indexes.sql` in Supabase.

---

## 2. Animation Frame-Rate Check

### Liquid Glass & 3D Tilt

| Change | File | Detail |
|--------|------|--------|
| **Mobile blur** | `app/globals.css` | `blur(20px)` → `blur(12px)` on viewport ≤768px |
| **will-change** | `components/bento-tilt-card.tsx` | `willChange: "transform"` on motion.div |
| **-webkit-backdrop-filter** | `app/globals.css` | Ensures Safari supports backdrop-filter |

### BentoTiltCard

- Uses `useTransform` for rotateX/rotateY — transform-only, no layout repaints.
- Inner div has `transform: translateZ(0)` for GPU layer promotion.

---

## 3. Edge Function / Compliance Latency

### api/compliance

There is no `/api/compliance` route. Compliance/risk logic lives in server actions:

- `predictPropertyRisk` — ordinances + Bayesian risk
- `generateComplianceCertificate` — property + ordinances join
- `generateFirstHealthCheck` — aggregates properties and violations

### Loading States (Non-Blocking UI)

| Component | Action | Loading State |
|-----------|--------|---------------|
| `RiskPredictionCard` | predictPropertyRisk | ✅ "Analyzing risk factors..." spinner |
| `ComplianceCertificate` | generateComplianceCertificate | ✅ Loading in dialog |
| `GuidedOnboardingTour` | generateFirstHealthCheck | ✅ Async with loading |
| `PropertySearch` | Mock (1.5s) | ✅ "Searching" disabled button + spinner |

If real compliance checks exceed 2s, consider:

- Skeletons instead of spinners
- Optimistic UI (show cached/placeholder, then update)
- Background job + polling for heavy checks

---

## 4. Vercel Usage Audit

### Proxy Matcher Exclusions

```ts
// proxy.ts matcher excludes:
// _next/static, _next/image, favicon.ico, sitemap.xml, robots.txt, *.svg|png|jpg|jpeg|gif|webp
```

Static assets, sitemap, and robots are excluded from proxy execution, reducing middleware invocations.

### Middleware Cost

- **Per request**: `supabase.auth.getUser()` + CSP header + optional redirect
- **Excluded**: ~40%+ of traffic (static, images, sitemap, robots) does not run proxy

### Vercel Limits (Reference)

| Plan | Function Duration (default) | Max Duration | Middleware |
|------|----------------------------|--------------|------------|
| Hobby | 10s | 60s | Counts as Edge invocations |
| Pro | 15s | 300s | Higher included |
| Enterprise | 15s | 900s | Custom |

- Monitor **Function Duration** and **Edge Invocations** in Vercel Dashboard.
- For traffic spikes, the proxy’s `getUser()` is the main cost; exclusions help avoid running it on static content.

---

## Files Touched

| File | Change |
|------|--------|
| `scripts/012_properties_performance_indexes.sql` | New — user_id, reporting_status, ordinances indexes |
| `app/globals.css` | Mobile blur 12px, -webkit-backdrop-filter |
| `components/bento-tilt-card.tsx` | willChange: "transform" |
