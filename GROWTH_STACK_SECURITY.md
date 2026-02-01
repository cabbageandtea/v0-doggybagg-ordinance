# Growth Stack Security Audit — CSP, E2E, Structured Data

## 1. CSP (Content Security Policy)

### Implementation

- **Location:** `lib/supabase/proxy.ts` — CSP headers and nonce injected per request
- **Nonce:** Passed via `x-nonce` header; `AdsScripts` receives it and adds to inline scripts (gtag, Meta Pixel)
- **Effect:** Avoids `unsafe-inline` for third‑party tracking scripts

### Allowed Domains

| Directive   | Domains |
|------------|---------|
| script-src | self, nonce, googletagmanager.com, connect.facebook.net, us-assets.i.posthog.com, *.posthog.com |
| connect-src | self, google-analytics, googletagmanager, *.google.com, *.facebook.net, *.facebook.com, us.i.posthog.com, *.posthog.com, vitals.vercel-insights.com, *.supabase.co |
| frame-src | self, js.stripe.com, hooks.stripe.com |

### If CSP Breaks the App

To relax or debug:

1. Change `response.headers.set("Content-Security-Policy", ...)` to `Content-Security-Policy-Report-Only` so violations are reported but not blocked
2. Add missing domains to the directives as needed
3. Check browser console and network tab for blocked resources

---

## 2. Support Funnel E2E

**File:** `tests/e2e/support-funnel.spec.ts`

| Test | Description |
|------|-------------|
| Footer support mailto | `mailto:support@doggybagg.cc` href in footer |
| Help page loads | /help returns 200, title includes Help |
| Sitemap | /privacy and /help in sitemap.xml |
| Privacy/Help render | Both pages load with expected headings |

Run: `pnpm test:e2e -- tests/e2e/support-funnel.spec.ts`

---

## 3. Structured Data Validation

**File:** `components/structured-data.tsx`

- **Organization:** @id, name, url, logo, description
- **WebSite:** publisher @id, description with "San Diego property compliance"
- **FAQPage:** mainEntity array of Question/Answer

**SEO keywords:** "San Diego property compliance" in Organization and WebSite descriptions.

Validate: [Google Rich Results Test](https://search.google.com/test/rich-results) or [Schema.org Validator](https://validator.schema.org/)

---

## 4. Build & Hydration

- Build: `pnpm run build` — passes
- Layout: `RootLayout` is async (for `headers()`) — compatible with React 19
- No `useEffect`/hydration issues introduced in tracking components
