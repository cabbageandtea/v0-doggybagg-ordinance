# DoggyBagg — Edge Tech Roadmap

Cutting-edge software, APIs, and programs to differentiate and scale. Research-backed, prioritized by impact and feasibility.

---

## 1. AI Agents & Automation

| Tech | What It Is | DoggyBagg Use | Effort | Cost |
|------|------------|---------------|--------|------|
| **Vercel AI SDK + Agents** | LLM-powered agents that call tools, loop, and act | "Ordinance Assistant" — answers questions about STRO, appeals, compliance using your docs + municipal data | Medium | Free tier (OpenAI/Anthropic credits) |
| **Twilio AI Assistants** | Voice + SMS autonomous agents with customer memory | After-hours compliance hotline; "Text your address, get standing" | High | Twilio usage |
| **Voiceflow / AgentVoice** | No-code AI voice for property mgmt | Leasing inquiries, maintenance, compliance FAQs by phone | Medium | SaaS subscription |
| **OpenAI Assistants API** | Thread-based agents with file search | Upload ordinance PDFs; agent answers user questions | Low | Pay-per-use |

**Recommendation:** Start with **Vercel AI SDK** — add an "Ask about San Diego ordinances" chat widget. Uses `ai` + `@ai-sdk/openai`, fits your Next.js stack, no new infra.

---

## 2. Data & Gov Tech

| Tech | What It Is | DoggyBagg Use | Effort | Cost |
|------|------------|---------------|--------|------|
| **SODA / Socrata API** | Gov open data API (SF, NYC, some counties) | If San Diego adopts: real-time API instead of CSV | Low (when available) | Free |
| **OpenCivicData scrapers** | GitHub: opencivicdata/scrapers-us-municipal | Community scrapers for city data | Medium | Free |
| **Parking citations CSV** | seshat.datasd.org — 2024/2025 data | Extend sync; match `location` to properties; fresher data | Low | Free |
| **STRO licenses dataset** | data.sandiego.gov — active licenses | Cross-reference user properties with license registry | Medium | Free |
| **Plaid / Pinwheel** | Income/employment verification | Optional: verify landlord/PM for higher tiers | High | Per-verification |

**Recommendation:** **Parking citations** are live 2024–2025. Add to sync now — fixes "stale 2015–2018" gap.

---

## 3. Communication & Alerts

| Tech | What It Is | DoggyBagg Use | Effort | Cost |
|------|------------|---------------|--------|------|
| **Twilio SMS** | Programmatic SMS | Violation alerts via text | Low | ~$0.01/SMS |
| **AWS SNS** | SMS + push | Same as Twilio; use if on AWS | Low | Similar |
| **Resend (you have)** | Email API | Already used; extend sequences | Low | Free tier |
| **Novu / Knock** | Notifications hub (email, SMS, push, in-app) | Centralize all alerts; multi-channel | Medium | Freemium |
| **OneSignal** | Push notifications | Browser push for critical alerts | Low | Free tier |

**Recommendation:** **Twilio** or **AWS SNS** for SMS — unblocks "SMS alerts" promise. Start with email-only; add SMS when you have budget.

---

## 4. Property & Compliance Intelligence

| Tech | What It Is | DoggyBagg Use | Effort | Cost |
|------|------------|---------------|--------|------|
| **Regrid / Loveland** | Parcel + property data API | Enrich addresses; APN, ownership, zoning | Medium | API subscription |
| **Attom / CoreLogic** | Property records, liens, violations | Deeper due diligence; enterprise tier | High | Enterprise |
| **Riskified / Sift** | Fraud/risk signals | Reduce chargebacks, fake signups | Medium | Per-transaction |
| **Jasper / Copy.ai** | AI copy for ads, email | Scale marketing copy variations | Low | SaaS |

---

## 5. Infra & DevOps

| Tech | What It Is | DoggyBagg Use | Effort | Cost |
|------|------------|---------------|--------|------|
| **Vercel Cron** | Scheduled serverless | Data sync (you have this) | Done | Free |
| **Workflow DevKit** | Durable workflows (sleep, steps) | $499 audit: Welcome email → 3d delay → Follow-up email | Done | Free (Vercel) |
| **Inngest** | Durable workflows, retries | Replace cron for complex pipelines | Low | Free tier |
| **Temporal** | Workflow orchestration | Multi-step compliance workflows | High | Self-host or cloud |
| **Supabase Edge Functions** | Deno at the edge | Lightweight webhooks, transforms | Low | Free tier |
| **Cloudflare Workers** | Edge compute | Geo-routing, A/B at edge | Medium | Free tier |

---

## 6. Implemented ✅

- **Parking citations in sync** — 2024/2025 data; match `location` to properties.
- **Workflow DevKit** — $499 purchase: Welcome email → sleep(3 days) → Follow-up email.
- **Municipal Docket Scraper** — City Council dockets; STRO/ordinance keyword search; 72h legislative alerts.
- **Honest SMS copy** — "Email alerts (SMS coming soon)" across UI.
- **Honest social proof** — "Code + Parking", "San Diego", "24/7" (no fake numbers).

## 7. Next Sprint

1. **Vercel AI SDK chat** — "/ask" or widget: "Ask about San Diego ordinances."

---

## 8. Stack Additions (Packages)

```bash
# AI chat (when ready)
pnpm add ai @ai-sdk/openai

# SMS (when ready)
pnpm add twilio
# or use Resend for email-only
```

---

## 9. APIs to Watch

| API | Status | Notes |
|-----|--------|-------|
| San Diego STRO licenses | data.sandiego.gov | CSV/export; no real-time API |
| San Diego code enforcement | 2015–2018 only | OpenDSD for newer; no public API |
| San Diego parking citations | seshat.datasd.org | CSV 2012–2025; has `location` |
| LA / Austin (expansion) | TBD | Research when expanding |

---

*Last updated: Feb 2026. Revisit quarterly as gov APIs and AI tooling evolve.*
