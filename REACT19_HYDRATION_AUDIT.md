# React 19 / Next.js 16 Hydration Audit

**Date:** February 2026  
**Scope:** `useEffect`, `useLayoutEffect`, and Server Component boundary risks

---

## Summary

All components using `useEffect` are **client components** (`"use client"`). No telemetry or `window`/`document`/`localStorage` access occurs during the initial render—only inside `useEffect`. This pattern is compatible with React 19's hydration model.

---

## Component-by-Component Audit

### Low Risk (Safe)

| File | Hook | Risk | Notes |
|------|------|------|-------|
| `app/auth/sign-in/page.tsx` | `useEffect` | Low | Reads `searchParams` in effect; sets error state. Initial render has `error=null` for both server and client. |
| `components/dashboard-header.tsx` | `useEffect` | Low | Fetches user in effect; initial `user=null` for both. Placeholder "?" shown until load. |
| `providers/onboarding-provider.tsx` | `useEffect` | Low | Fetches onboarding in effect; initial `progress=null`. |
| `components/guided-onboarding-tour.tsx` | `useEffect` | Low | Async health check in effect; no DOM differences. |
| `app/checkout/success/checkout-success-tracker.tsx` | — | None | Now returns `null`; no effects. |
| `lib/hooks/use-onboarding-view-trigger.ts` | `useEffect` | Low | SSR guard `typeof document === "undefined"`; all DOM access inside effect. |
| `components/neighborhood-watch-widget.tsx` | `useEffect` | Low | Sets mock data after timeout; initial `isLoading=true` for both. |
| `components/mesh-gradient-background.tsx` | `useEffect` | Low | Canvas drawing in effect; initial canvas is empty for both. |
| `components/risk-prediction-card.tsx` | `useEffect` | Low | Fetches prediction; initial `isLoading=true` for both. |
| `app/global-error.tsx` | `useEffect` | Low | `console.error` only; no DOM. |
| `app/error.tsx` | `useEffect` | Low | Same as above. |
| `components/posthog-identify-bridge.tsx` | `useEffect` | Low | Fetches user and identifies; no DOM. |

### Medium Risk (Suggested Fix)

| File | Hook | Risk | Suggested Fix |
|------|------|------|---------------|
| `components/admt-modal.tsx` | `useEffect` | Medium | Reads `localStorage` in effect. Initial state `isOpen=false` for both; effect may set `isOpen=true` after mount. **Current pattern is safe** (no localStorage during render). To avoid any flash: use `useSyncExternalStore` for localStorage, or delay modal render until `mounted` state is true. |

**Recommended fix for ADMTModal** (optional, for zero-flash):

```tsx
// components/admt-modal.tsx
const [mounted, setMounted] = useState(false)
useEffect(() => {
  setMounted(true)
}, [])

// Only read localStorage after mount
useEffect(() => {
  if (!mounted) return
  if (!localStorage.getItem(ADMT_STORAGE_KEY)) setIsOpen(true)
}, [mounted])
```

Current implementation is already correct—localStorage is never read during initial render.

---

## Telemetry & `window` Access

All telemetry calls use `posthog-js`, which depends on `window`. These are invoked only from:

- Client components (all have `"use client"`)
- Inside event handlers (e.g. `onClick`, `onSubmit`) or `useEffect`

**No Server Component** imports or calls `lib/analytics.ts`. Safe.

---

## Server Component Boundaries

- `app/layout.tsx`: Server component; wraps with `PostHogProvider` (client) and `PostHogIdentifyBridge` (client). No telemetry in layout itself.
- `app/checkout/success/page.tsx`: Server component; renders `CheckoutSuccessTracker` (client) inside `Suspense`. No direct telemetry.

---

## Recommendations

1. **No changes required** for current hydration safety.
2. **Optional:** Add `suppressHydrationWarning` to any `<time>` or date elements that render server vs client timezones differently.
3. **Optional:** For `ADMTModal`, consider the `mounted` pattern above if a brief flash of closed-then-open is undesirable.
