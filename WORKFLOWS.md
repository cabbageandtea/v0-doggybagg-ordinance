# DoggyBagg Workflows

Durable post-purchase and background workflows via [Workflow DevKit](https://useworkflow.dev).

## Purchase Audit Workflow

**File:** `app/workflows/purchase.ts`  
**Trigger:** Stripe `checkout.session.completed` for $499 Portfolio Audit  
**Function:** `purchaseAuditWorkflow(customerEmail: string)`

### Steps

1. **Welcome & Deliverable Specs** — Immediate email via Resend
2. **Sleep 3 days** — Durable pause (no compute used)
3. **Follow-up Audit Health Check** — Second email (scheduling reminder, dashboard link)

### Observability

- **Local:** `npx workflow web` to open the Workflow DevKit UI
- **Vercel:** Workflows Dashboard (if enabled for project)
- **Routes:** `/.well-known/workflow/v1/flow`, `/.well-known/workflow/v1/step`

### Env Requirements

- `RESEND_API_KEY` — For sending emails
- No extra env vars for Workflow DevKit (uses Vercel when deployed)

---

## Municipal Sentinel Workflow

**File:** `app/workflows/sentinel.ts`  
**Trigger:** Vercel Cron `/api/cron/sentinel` daily at 7:00 UTC  
**Function:** `municipalSentinelWorkflow()`

### Steps

1. **Enforcement Sniper** — Code enforcement (STR, noise) + parking citations from seshat.datasd.org
2. **License Sniper** — STRO CSV diff; new Tier 3/4 in 92109, 92037
3. **Enrich & Email** — Contact lookup (STRO has built-in; CE/parking: wire Google Search MCP), send targets to admin@doggybagg.cc

### Prerequisites

- Run `scripts/014_sniper_tables.sql` in Supabase
- `CRON_SECRET` in Vercel (same as ingest)
- `RESEND_API_KEY` for admin email

### Contact Search

Wire `lib/snipers/contact-search.ts` to Google Search MCP or SerpAPI for CE/parking address lookups:

```bash
npx -y @modelcontextprotocol/server-google-search
```
