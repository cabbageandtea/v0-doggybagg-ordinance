# Strategic Reality Check — What DoggyBagg Really Does (and What It Doesn't)

**Purpose:** Honest assessment of current capabilities, automation gaps, and how to stand out.

---

## What DoggyBagg ACTUALLY Does Today

| Capability | Status | How It Works |
|------------|--------|--------------|
| **User sign-up / auth** | ✅ Live | Supabase. Email confirmation. |
| **Add properties** | ✅ Live | User enters address, STRO tier, license ID. Stored in Supabase. |
| **Dashboard** | ✅ Live | Shows properties with status, risk score (from DB). |
| **Edit property status** | ✅ Live | User can set compliant / warning / violation. |
| **Stripe checkout** | ✅ Live | $29 Starter, $99 Pro, $499 Portfolio Audit. |
| **Email notifications** | ✅ Live | Welcome, Receipt, Payment Failed. Compliance violation email when user changes status to violation. |
| **Appeal letter generation** | ✅ Built | Uses `ordinances` table. Works if violation data exists. |
| **Compliance certificate** | ✅ Built | Uses property + ordinances. Works if data exists. |
| **Risk prediction** | ✅ Built | Uses ordinances by zip. Works if data exists. |
| **Property search (landing)** | ⚠️ Demo | Mock results. No municipal API. |
| **Neighborhood Watch** | ⚠️ Demo | Mock heat map. No live enforcement data. |
| **Automated violation detection** | ❌ Not built | No cron, no API, no scrape. Nothing pulls from San Diego. |

---

## The Critical Gap

**Risk score and reporting_status** are set when a user adds a property: `risk_score: 0`, `reporting_status: 'pending'`.  
**Nothing automatically updates them from city data.**

The `ordinances` table exists and powers appeal letters, compliance certs, risk prediction—but **nothing populates it**. No:
- Cron job
- Vercel cron
- Edge Function
- External API integration
- Scraper

San Diego has an **Open Data Portal** (data.sandiego.gov) with:
- Code Enforcement Violations (historical; recent via OpenDSD)
- Parking Citations
- Business Tax Certificates  
Data is downloadable CSV, not a live API. Someone has to build an ingestion pipeline.

---

## What Can Be Automated (Once Data Exists)

| Feature | Automation potential | Notes |
|---------|----------------------|-------|
| Add property | User does it | Could pre-fill from license lookup if city API exists |
| Check for violations | **Could be automated** | Cron: fetch CSV/API, match to user properties, update `ordinances`, set `reporting_status` |
| Alert on new violation | **Could be automated** | Already wired: when `reporting_status` → violation, email fires |
| Appeal letter | **Automated** | Template from violation type. Needs ordinances data. |
| Compliance certificate | **Automated** | Needs ordinances data. |
| Risk score | **Could be automated** | From area violations, Bayesian model. Needs ordinances. |

---

## Pain Points We Solve (When Data Flows)

1. **"I don't know if I have a violation until a letter arrives"** → Early alert when city files (once we ingest).
2. **"I have multiple properties and can't track them"** → Portfolio dashboard (built).
3. **"I got cited and don't know how to appeal"** → Appeal letter template (built; needs violation in DB).
4. **"I need proof of compliance for lenders/partners"** → Compliance certificate (built; needs data).
5. **"What could fines cost?"** → Fine calculator (built).

---

## How to Stand Out: Three Paths

### Path A: Build the Data Pipeline (Technical)
- Download / fetch San Diego Open Data (CSV or OpenDSD if available).
- Vercel Cron or external worker: daily sync into `ordinances` and `city_registry_cache`.
- Match to user properties by address / license ID.
- Update `reporting_status`, `risk_score`; trigger emails.
- **Result:** Real 24/7 monitoring. Full automation.
- **Effort:** Medium–high. Depends on data format, rate limits, matching logic.

### Path B: Human-Led Portfolio Audit (Service)
- $499 audit is a **concierge service**.
- User pays → you (or a team) manually research via City Treasurer, OpenDSD, public records.
- Deliver PDF/report. Optionally enter findings into DoggyBagg (ordinances, status) so they see it in the dashboard.
- **Result:** High-touch, high-value. You control quality.
- **Effort:** Per-audit labor. Scalable with contractors.

### Path C: Hybrid — Manual MVP, Automate Later
- Launch with Path B for $499 audits.
- Use audits to seed `ordinances` for paying customers (manual or semi-manual).
- Build Path A over 3–6 months as you validate demand.
- **Result:** Revenue now, automation later.

---

## What to Say to Customers (Honest Positioning)

**Today:**
- "DoggyBagg is your San Diego property compliance command center. Add your portfolio, track status, and get appeal and certificate tools when you need them."
- "Our $499 Portfolio Audit is a hands-on review of your portfolio—we research your properties and deliver a clear report and next steps."
- Avoid claiming "real-time automated monitoring" until the pipeline exists.

**Once data pipeline is live:**
- "We monitor San Diego municipal filings 24/7 and alert you within 24 hours of a new filing."
- "Add your properties once—we handle the rest."

---

## Implemented (Full Autonomy Pass)

- **$499 audit** — Now positioned as "Expert-led" in pricing copy
- **Overclaims softened** — FAQ, About, Trust bar, STR compliance page
- **Data ingestion scaffold** — `lib/ingestion/san-diego-sync.ts`, `app/api/cron/ingest`, `vercel.json` (daily 6am UTC). Wire San Diego Open Data when ready.
- **CRON_SECRET** — Added to .env.example for cron auth

## Immediate Action Options

1. ~~Clarify the $499 audit~~ — Done: "Expert-led"
2. ~~Add data ingestion scaffold~~ — Done: cron route + sync module
3. **Explore San Diego Open Data** — data.sandiego.gov, OpenDSD. See if CSV/API is viable for a weekly sync.
4. **Partner** — Property data vendors, permit/ordinance data providers.
5. **Position as portfolio manager first** — "Track, organize, and respond to compliance—with expert audits when you need them."

---

**Bottom line:** The product is strong as a portfolio + workflow tool. The missing piece is the data. You can ship now with human-led audits and honest positioning, then add automation as you build the pipeline.
