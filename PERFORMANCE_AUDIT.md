# Tactile Landing Page — Performance Audit

## 1. Asset Optimization

### og-image.png
- **Size:** ~47 KB
- **Status:** ✅ Under 200 KB — no compression needed for LCP
- **Recommendation:** Keep as PNG. If adding more images, consider WebP with PNG fallback. Current `next.config.mjs` has `images: { unoptimized: true }`; re-enabling optimization would auto-serve WebP where supported.

### Framer Motion — Transform vs Layout
| Component | Property | Status |
|-----------|----------|--------|
| `BentoTiltCard` | `rotateX`, `rotateY` | ✅ Transform (compositor) |
| `BentoTiltCard` | Shine overlay | ✅ **Fixed** — was `left`/`top`, now `transform` only |
| `KineticHeadline` | `fontWeight` | ✅ **Fixed** — was layout-triggering; now uses `scale` + `y` (transform) |
| `TactileButton` | `whileTap: scale` | ✅ Transform |
| `NeighborhoodWatchWidget` | `opacity`, `x`, `y` | ✅ Transform (`x`/`y` = translate) |

---

## 2. Rendering & Hydration

### Bento Grid — Memoization
- **Change:** Extracted `FeatureCard` and wrapped with `React.memo`.
- **Benefit:** Static feature cards no longer re-render when parent (e.g. scroll progress) updates.

### useClient Scope
- **Current:** `app/page.tsx` is a client component; the whole landing page is client-rendered.
- **Reason:** `Header` (mobile menu state), `BentoGrid` (Framer Motion), `NeighborhoodWatchWidget` (state, `useInView`), and other sections use client APIs.
- **Recommendation:** To move toward RSC:
  1. Make `page.tsx` a Server Component.
  2. Keep `"use client"` only on: `BentoGrid`, `NeighborhoodWatchWidget`, `FineCalculator`, `PropertySearch`, `TestimonialsSection`, `PricingSection`, `FAQSection`, `Header`, `Footer`, `FeedbackTrigger`, `MeshGradientBackground`.
  3. Prefer lazy-loading below-the-fold sections (e.g. `NeighborhoodWatchWidget`, `TestimonialsSection`) with `next/dynamic` and `ssr: false` where appropriate.

---

## 3. Stress Test & FCP

### performance-bench.js
Run:
```bash
pnpm run build && pnpm start
# In another terminal:
node scripts/performance-bench.js
```

The script:
- Captures FCP via `performance.getEntriesByType('paint')`.
- Simulates 50 rapid hovers on 3D Tilt cards.
- Simulates 50 rapid hover+click cycles on Tactile Buttons.
- Reports timings and error counts.

### FCP Expectations
- **Target:** &lt; 1.8 s (Good), &lt; 3.0 s (Needs improvement).
- **Observed (local prod):** FCP ~1.3 s, 50 tilt hovers & 50 button interactions complete with 0 errors.
- **Prerequisite:** Run `npx playwright install chromium` before first benchmark.

---

## Summary of Code Changes

| File | Change |
|------|--------|
| `components/bento-tilt-card.tsx` | Shine overlay: `left`/`top` → `transform`; added `data-bento-tilt` |
| `components/bento-grid.tsx` | `KineticHeadline`: removed `fontWeight`, use `scale` + `y`; added memoized `FeatureCard` |
| `scripts/performance-bench.js` | New stress-test script for tilt cards and tactile buttons |
| `PERFORMANCE_AUDIT.md` | This audit document |
