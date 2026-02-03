# DoggyBagg — Launch Campaign

**Single source of truth for launch.** Aligns with CONTACT_AND_ACCOUNTS, TONE_OF_VOICE, and MARKETING_CAMPAIGN_STRATEGY.

---

## Current Status (Live)

| Item | Status |
|------|--------|
| **Production** | doggybagg.cc on Vercel |
| **Backend** | Sentinel cron, Stripe, Supabase, Resend |
| **X (Twitter)** | @doggybagg_sd — live |
| **LinkedIn (Personal)** | Malik Lomax — live |
| **Facebook** | ⏳ Under review (no Meta ads until verified) |
| **LinkedIn (Company)** | ⏳ Pending (unlocks with connection growth) |
| **Budget** | $100 total (see MARKETING_CAMPAIGN_STRATEGY § $100 Mode) |

---

## Launch Checklist

### Week 1 — Zero-Cost (Do Now)

- [ ] **San Diego STRA** — Join sandiegostra.org; attend one event
- [ ] **BiggerPockets** — Create account; answer 3 questions in San Diego forum (value-first)
- [ ] **Product Hunt** — Schedule launch; prep tagline, description, screenshots (see AD_COPY_EXAMPLES)
- [ ] **G2 + Capterra** — Create profiles
- [x] **Referral CTA** — Added to checkout success page + receipt/welcome emails
- [ ] **1 blog post** — "San Diego STRO Compliance Checklist 2025" → publish, share in STRA/BiggerPockets

### Week 2–3 — Micro Paid ($30–50)

- [ ] **Google Ads** — 1 campaign, 5–10 San Diego keywords, $2/day for ~15 days
- [ ] **San Diego STRA event** — $50 ticket or sponsor if available

### Hold Until Verified

- [ ] **Meta (Facebook/IG) Ads** — Wait for Facebook account review
- [ ] **LinkedIn Company Page** — Wait for connection growth to unlock

---

## Tone & Copy Rules

From TONE_OF_VOICE: Confident, clear, human. No fear-mongering. Premium invitation, not government command.

| ✅ Use | ❌ Avoid |
|--------|----------|
| "Precision ordinance oversight" | "Avoid fines" (fear-based) |
| "Request Portfolio Audit" | "Get My $499 Audit" (salesy) |
| "Timely municipal intelligence" | "Comprehensive solution" (filler) |
| Social proof when verified | Unverified numbers ("12,000+ investors") |

---

## Ad Copy Quick Reference

See **AD_COPY_EXAMPLES.md** for full copy. Key:

- **Google:** San Diego ordinance keywords, 30-char headlines
- **Meta:** Hold until Facebook verified
- **Product Hunt:** Tagline + description ready

---

## Contact Alignment

| Use Case | Email |
|----------|-------|
| General / Business | hello@doggybagg.cc |
| Support / Help | support@doggybagg.cc |
| Referrals / Partnerships | maliklomax@doggybagg.cc |
| Admin (Sentinel) | admin@doggybagg.cc |
| Privacy / Legal | privacy@doggybagg.cc |

---

## AI Agent Nudge (Implemented)

- **Agent Card** — `/.well-known/agent.json` — Brand, mission, keywords, API link for AI crawlers
- **Intel API** — `/api/intel` — Machine-readable capabilities, endpoints, topics
- **FAQ Schema** — Organization + FAQPage JSON-LD with San Diego ADU height limits, STR permit monitoring
- **Reddit drafts** → REDDIT_EXPERT_REPLIES.md — 5 value-first replies for r/SanDiegan

---

## Cross-References

- **Strategy & budget** → MARKETING_CAMPAIGN_STRATEGY.md
- **Ad copy** → AD_COPY_EXAMPLES.md
- **Tone** → TONE_OF_VOICE.md
- **Accounts** → CONTACT_AND_ACCOUNTS.md
- **Growth stack** → GROWTH_GUIDE.md
