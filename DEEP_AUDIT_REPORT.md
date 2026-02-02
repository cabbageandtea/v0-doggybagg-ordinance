# Deep Audit Report — DoggyBagg

**Date:** February 2026  
**Methodology:** Multi-perspective team debate + web research + codebase audit  
**Scope:** Launch readiness, gaps, consistency, best practices

---

## 🔬 Research Synthesis (Web)

### SaaS Launch Readiness (2025)
- **Pre-launch:** Feature freeze, QA, transactional email (SPF/DKIM), analytics, error monitoring (Sentry), security audit
- **Core areas:** Security, infrastructure, feature set, documentation, support, UX
- **Technical:** Error monitoring, source maps, final security pass

### Next.js Production
- **SEO:** Metadata API, sitemap, canonical URLs, Core Web Vitals (LCP, CLS, INP)
- **Performance:** `next/image` priority, Server Components, code-splitting
- **Rendering:** SSG/ISR/SSR strategy per page type

### Stripe Checkout
- Brand alignment (light mode ✓)
- Stripe Link for accelerated checkout
- Tax automation, payment method optimization

### San Diego STRO
- License, TOT, reporting, guest/safety requirements
- DoggyBagg positioning: ordinance oversight, timely updates, resolution support ✓

---

## 🗳️ Team Debate & Votes

### 1. Help Page Billing Copy Mismatch

| Role | Position | Vote |
|------|----------|------|
| **Product** | Starter shows "5 properties," pricing shows 1. Professional shows 25, pricing shows 10. Misleading. Fix. | ✅ Fix |
| **Engineering** | Single source of truth: pricing-section.tsx. Help is documentation; must match. | ✅ Fix |
| **Support** | Wrong info = support tickets. Align to avoid confusion. | ✅ Fix |

**Verdict:** Fix Help page billing to match pricing (Starter: 1 property, Professional: 10).

---

### 2. Property Search — Demo / Mock Labeling

| Role | Position | Vote |
|------|----------|------|
| **Product** | Users may think results are real. "Sample results" + "demo mode" exist but could be clearer. | ✅ Clarify |
| **Design** | Add small "Demo" badge to header. Low effort, high clarity. | ✅ Add badge |
| **QA** | Existing copy ("Sample results. Live municipal data coming soon.") is OK. Optional enhancement. | ⚪ Optional |

**Verdict:** Strengthen demo labeling with a subtle badge. Already has "Sample results" and "demo mode"—ensure both visible.

---

### 3. Sitemap: Keep or Remove De-emphasized Pages?

Pages removed from footer: `/blog`, `/careers`, `/docs`, `/learn/data-sources`. Still in sitemap.

| Role | Position | Vote |
|------|----------|------|
| **SEO** | Pages exist, have content. Removing from sitemap = less crawl budget, weaker indexing. Keep. | ✅ Keep |
| **Product** | We're not promoting them, but they're valid. Sitemap ≠ navigation. | ✅ Keep |
| **Engineering** | No harm. Pages render. Keep for SEO. | ✅ Keep |

**Verdict:** Keep blog, careers, docs, learn/data-sources in sitemap. Footer ≠ sitemap.

---

### 4. Help Page Tone (Elevated Sentinel)

| Role | Position | Vote |
|------|----------|------|
| **Content** | "active violations" → "ordinance standing" for brand consistency. | ✅ Align |
| **Support** | "violations" is still accurate for support context. Soft change only. | ✅ Soft |

**Verdict:** Update "risk scores and any active violations" → "health scores and ordinance standing."

---

### 5. Error Monitoring (Sentry)

| Role | Position | Vote |
|------|----------|------|
| **Engineering** | Vercel + PostHog cover basics. Sentry adds stack traces, grouping. Valuable post-launch. | ⚪ Later |
| **Product** | Not launch-blocking. Add when we have bandwidth. | ⚪ Later |
| **QA** | Error boundaries exist. Good enough for Day 0. | ⚪ Later |

**Verdict:** Document as post-launch enhancement. Not in scope for this pass.

---

### 6. Help Page Metadata

| Role | Position | Vote |
|------|----------|------|
| **SEO** | "San Diego property compliance" → "Precision ordinance oversight" for brand alignment. | ✅ Update |

**Verdict:** Update Help page metadata description.

---

## ✅ Gaps Addressed (This Pass)

| Gap | Action | Status |
|-----|--------|--------|
| Help billing copy wrong | Starter 1, Pro 10 | ✅ |
| Property search demo clarity | Strengthen labeling | ✅ |
| Help page tone | Ordinance standing | ✅ |
| Help metadata | Precision oversight | ✅ |
| Sitemap | Keep de-emphasized pages | ✅ No change |

---

## 📋 Post-Launch Enhancements (Not Blocking)

| Item | Notes |
|------|-------|
| Sentry | Error monitoring, source maps, Vercel integration |
| Status page | Real uptime (Statuspage.io) vs static |
| Referral automation | Beyond mailto |
| Build cache | Vercel warning for faster rebuilds |

---

## 🔐 Security & Env Verification

- **robots.txt:** Disallows /dashboard, /auth, /checkout, /api ✓
- **CSP:** Proxy nonce for ads scripts ✓
- **RLS:** Supabase policies ✓
- **Stripe:** Webhook verification, idempotency ✓
- **.env.example:** Comprehensive, documented ✓

---

## 📊 Link Integrity

All footer, header, and CTA links verified. No broken hrefs. Removed pages (Data Sources, API, Blog, Careers) no longer in footer; /docs remains in Support column. Help page links to /docs ✓.

---

## 🔄 Sentinel & Snipers Sync (Feb 2026)

### Verified

| Component | Status |
|-----------|--------|
| Sentinel workflow (6 steps) | ✅ Docket, Enforcement, License, Integrity, Renewal, Enrich+Email |
| Cron `/api/cron/sentinel` | ✅ CRON_SECRET, starts municipalSentinelWorkflow |
| Email template | ✅ Integrity, Renewal, Legislative, Targets sections |
| Types (SentinelResult) | ✅ expiringLicenses added |
| log-run | ✅ integrityRisksCount, expiringCount |
| Data sources page | ✅ STRO Licenses added |
| WORKFLOWS.md | ✅ 016_stro_expiration in prerequisites |
| RUNBOOK | ✅ Section 4b: Sentinel manual trigger & troubleshooting |

### Migrations

- **014** sniper_tables, **015** docket_logs, **016** stro_expiration, **017** docket_unique_meeting

### Env Vars

- `CRON_SECRET`, `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (required)
- `APIFY_API_TOKEN`, `APIFY_AIRBNB_ACTOR_ID` (optional; Integrity returns [] without)

---

**Audit complete. Fixes applied.**
