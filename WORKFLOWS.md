# DoggyBagg Cron Jobs

Background jobs run via **Vercel Cron** (standard API route handlers). No Workflow DevKit.

---

## Municipal Sentinel Cron

**Route:** `app/api/cron/sentinel/route.ts`  
**Trigger:** Vercel Cron `GET /api/cron/sentinel` daily at **00:00 UTC**  
**Auth:** `Authorization: Bearer <CRON_SECRET>`

### Steps (run sequentially in a single request)

0. **Docket Scraper** — San Diego City Council dockets; STRO/ordinance keyword search; alerts 72h before meetings
1. **Enforcement Sniper** — Code enforcement (STR, noise) + parking citations from seshat.datasd.org
2. **License Sniper** — STRO CSV diff; new Tier 3/4 in 92109, 92037
3. **Integrity Sniper** — AirBnB listings in 92109/92037; cross-reference displayed permit vs STRO registry; flag mismatches
4. **Renewal Sniper** — Licenses expiring in 10–45 days; highest-conversion for $499 Portfolio Audit
5. **TOT Sniper** — STRO licenses missing TOT certificate; Red Alert for $499 Portfolio Audit
6. **Enrich & Email** — Contact lookup, send targets + legislative alerts + integrity gaps + TOT gaps + upcoming renewals to admin@doggybagg.cc
7. **Log Run** — Insert into `sniper_runs` for observability

### Prerequisites

- Run `scripts/014_sniper_tables.sql`, `015_docket_logs.sql`, `016_stro_expiration.sql`, `017_docket_unique_meeting.sql` in Supabase
- `CRON_SECRET` in Vercel (for ingest + sentinel)
- `RESEND_API_KEY` for admin email

### Integrity Gap (AirBnB)

Wire `lib/snipers/integrity.ts` via Apify:

- `APIFY_API_TOKEN` — Apify API token
- `APIFY_AIRBNB_ACTOR_ID` — e.g. `curious_coder/airbnb-scraper` or actor ID from Apify Store

Without these, the integrity sniper returns `[]` (placeholder).

### Manual Trigger

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://doggybagg.cc/api/cron/sentinel
```

---

## Purchase Audit Email

**Trigger:** Stripe `checkout.session.completed` for $499 Portfolio Audit  
**Handler:** `app/api/webhooks/stripe/route.ts`

Sends `sendWelcomeAuditEmail` immediately after payment. (The former 3-day follow-up email was removed when migrating from Workflow DevKit.)
