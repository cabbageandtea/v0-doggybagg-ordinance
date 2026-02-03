# DoggyBagg — Strategic Marketing & Ads Campaign

**Purpose:** Comprehensive marketing plan to acquire San Diego property investors, landlords, and STR hosts. Research-backed channel selection, keywords, and tactics.

---

## $100 Budget Mode (You Are Here)

**Reality:** With $100 total and AWS free tier, skip paid ads. Put every dollar into high-leverage, free-first tactics.

### What $100 Gets You

| Spend | Tactic | Expected Return |
|-------|--------|-----------------|
| **$0** | San Diego STRA membership or event fee | In-room access to STR hosts; 1–2 conversations → potential customers |
| **$0** | BiggerPockets San Diego forum | Value-first participation; 1 helpful post/week → trust + soft mentions |
| **$0** | Product Hunt launch | Free; needs prep + community push |
| **$0** | G2 / Capterra listing | Free profiles |
| **$0** | SEO + blog (you write) | Long-term traffic |
| **$0** | Referral program (existing /refer) | Ask every happy user; $0 cost |
| **$0** | AWS SES (free tier: 62k emails/mo from EC2) | Transactional + newsletter; no Resend cost if you switch |
| **$20–50** | 1–2 Google Search ads, $2–5/day for 1–2 weeks | Test intent; learn which keywords convert |
| **$50** | San Diego STRA sponsor/booth or event ticket | Face time with ideal customers |
| **$50** | Canva Pro (1 mo) or similar | Better ad creative if you test paid later |

### Recommended $100 Split

1. **$50** — San Diego STRA membership + 1 event (in-person or virtual). Highest ROI: you meet real STR hosts.
2. **$30** — Micro Google Ads test: 1 campaign, 5 keywords, $2/day for ~15 days. Learn what converts.
3. **$20** — Buffer for tools (Canva, etc.) or roll into more STRA/community.

### AWS Free Tier — Marketing Use

| Service | Free Tier | Marketing Use |
|---------|-----------|---------------|
| **SES** | 62k emails/mo (from EC2/Lambda) | Newsletter, onboarding sequences; replace or supplement Resend |
| **S3** | 5GB storage | Host lead magnets (PDFs), images for ads |
| **Lambda** | 1M requests/mo | Cron for email digests, simple automation |
| **CloudFront** | 1TB transfer | CDN for static assets (minor SEO/perf) |

You're on Vercel + Resend already; AWS is optional. Use SES only if you want to cut Resend cost at scale.

### Zero-Cost Priority Stack

1. **Join San Diego STRA** — sandiegostra.org. Attend one event. Talk to 5 people.
2. **BiggerPockets** — Create account. Answer 3 questions in San Diego forum. Mention DoggyBagg once where it helps.
3. **Product Hunt** — Launch (free). Ask friends/network for upvotes.
4. **G2 + Capterra** — Create profiles. Invite first 5 users to review.
5. **Referral ask** — Add "Know a landlord? Send them here" to your receipt/audit confirmation email.
6. **1 blog post** — "San Diego STRO Compliance Checklist 2025" — publish, share in STRA/BiggerPockets.

### When to Add Paid Ads

Once you have 5–10 paying customers and can afford $300–500/mo, add Google Search. Until then, community + organic + referral.

---

## 0. Current Blockers (Launch State)

| Platform | Status | Action |
|----------|--------|--------|
| **Facebook** | Account under review | No Meta ads until verified |
| **LinkedIn Company** | Pending (connection growth) | Use personal profile for now |
| **X (Twitter)** | @doggybagg_sd live | Use for organic + Product Hunt push |

See CONTACT_AND_ACCOUNTS.md for full status.

---

## 1. Channel Prioritization (Best for Your Platform)

| Channel | Best For | DoggyBagg Fit | Priority |
|---------|----------|---------------|----------|
| **Google Search Ads** | High-intent buyers searching for solutions | Strong — "San Diego STRO compliance", "ordinance monitoring" are active searches | **#1** |
| **Meta (FB/IG) Ads** | Awareness, retargeting, lookalikes | Medium — geo-target San Diego; creative for STR hosts | **#2** |
| **LinkedIn Ads** | Property managers, portfolio owners | Medium — job titles: Property Manager, Real Estate Investor | **#3** |
| **Organic SEO** | Long-term, low CAC | High — blog/learn content ranks for San Diego ordinance terms | **#4** |
| **Community/Events** | Trust, referrals | High — San Diego STRA, BiggerPockets meetups | **#5** |
| **Referral Program** | Word-of-mouth, 70% higher conversion | High — you have /refer; formalize structure | **#6** |
| **Product Hunt / G2** | Credibility, signups | Medium — one-time launch, listing | **#7** |

---

## 2. Google Ads Strategy

### Why Google First
- **Intent-based:** Users search "San Diego STRO compliance", "ordinance violation monitoring" — they’re already looking.
- **B2B SaaS benchmarks:** ~3% conversion rate, 14.6% close rate on Search.
- **CPL:** ~$116 for B2B services (higher quality than Meta’s ~$84 CPL).

### Recommended Keywords (San Diego-Focused)

**High Intent (Exact/Phrase)**
- San Diego STRO compliance
- San Diego ordinance violations property
- STRO license San Diego
- San Diego short-term rental compliance
- Code enforcement San Diego property
- San Diego municipal ordinance monitoring

**Medium Intent (Broad Match, negative keywords for non-SD)**
- Property compliance software
- Ordinance monitoring
- STR compliance tool
- Real estate investor compliance San Diego

**Negative Keywords**
- Free, DIY, how to do it yourself (if you want paid signups)
- Jobs, career, hiring
- Other cities (LA, Austin — unless you expand)

### Campaign Structure
1. **Search — Branded:** "DoggyBagg", "DoggyBagg San Diego"
2. **Search — STRO/Compliance:** San Diego ordinance keywords
3. **Search — Portfolio Audit:** "portfolio audit San Diego", "property compliance audit"
4. **Performance Max (optional):** Retargeting + Display, after you have site traffic

### Budget Guidance (Starting)
- **$500–1,500/mo** to test; allocate 60% to Search, 40% to retargeting/audience expansion once you have conversions.

---

## 3. Meta (Facebook / Instagram) Ads

### Why Meta
- **Geo-targeting:** San Diego County, specific zip codes (STR-heavy areas).
- **Audience:** Interest in short-term rentals, real estate investing, Airbnb, property management.
- **Creative:** Carousel (features), video testimonial, "Avoid fines" benefit-focused ads.
- **Retargeting:** Website visitors, landing page engagers.

### Audience Ideas
- **Interests:** Real estate investing, Airbnb, short-term rental, property management, San Diego
- **Lookalike:** 1% of site visitors or email list (when you have 1k+)
- **Custom:** Upload San Diego STR license holders (from open data) for matched audiences

### Ad Format
- **Carousel:** 3–5 cards — Problem (ordinance fines) → Solution (DoggyBagg) → Social proof → CTA
- **Single image/video:** "Stay ahead of San Diego ordinance changes. $29/mo."
- **Lead gen form:** Optional for Portfolio Audit ($499) to capture qualified leads before Stripe

### Budget
- **$300–800/mo** for awareness + retargeting. Meta CPL is lower but lead quality is weaker — use for top-of-funnel.

---

## 4. LinkedIn Ads

### Why LinkedIn
- **B2B targeting:** Job titles = Property Manager, Real Estate Investor, Portfolio Manager, Operations Manager.
- **Geo:** San Diego metro.
- **Formats:** Sponsored Content, Message Ads (InMail) for high-ticket $499 audit.

### Best Use
- **$499 Portfolio Audit** — Target decision-makers (portfolio owners, PMs) with Message Ads or lead gen forms.
- **Lower volume, higher intent** than Meta.

### Budget
- **$200–500/mo** — LinkedIn CPM is high; use for $499 audit and Pro plan leads, not Community signups.

---

## 5. Organic & SEO

### Content Topics (Blog / Learn)
- "San Diego STRO License Requirements 2025"
- "How to Avoid Ordinance Violations for San Diego STRs"
- "Code Enforcement: What San Diego Property Investors Need to Know"
- "Portfolio Compliance Checklist for San Diego Landlords"

### Technical
- Sitemap submitted (done)
- Structured data (done)
- Internal links from /learn/* to /#pricing, /refer
- Schema for FAQ, Organization

---

## 6. Community & Event Marketing

### San Diego STRA (Short-Term Rental Alliance)
- **sandiegostra.org** — Primary STR host org in San Diego
- **Action:** Join as a member or sponsor; present at events; newsletter mention
- **Value:** Regulatory updates, hosting best practices — align DoggyBagg as the compliance partner

### BiggerPockets
- **San Diego forum:** biggerpockets.com/forums/617
- **Beers & Deals:** Local meetup — attend, network, soft pitch
- **Action:** Participate in threads (helpful, not salesy); mention DoggyBagg when relevant

### Facebook Groups
- Search "San Diego short-term rental", "San Diego landlords", "San Diego real estate investors"
- **Action:** Provide value (answer questions about STRO, ordinances); link to /learn or / when appropriate per group rules

---

## 7. Signup & Directory Platforms

| Platform | What to Do | Effort |
|----------|------------|--------|
| **Product Hunt** | Launch "DoggyBagg – San Diego Ordinance Oversight" | 1 day |
| **G2** | Create profile; invite early users to leave reviews | Ongoing |
| **Capterra** | Same as G2 (now under G2 umbrella) | Ongoing |
| **Crozdesk / SaaS directories** | Submit for backlinks + discovery | Low |
| **Google Business Profile** | If you have a physical address or service area | Low |

### Product Hunt Launch Tips
- Prepare tagline, description, images, demo video
- Launch Tuesday–Thursday for best visibility
- Mobilize email list, Slack, Twitter for upvotes
- Follow PH Launch Guide: producthunt.com/launch

---

## 8. Referral Program Enhancement

**Current state:** /refer page with mailto for "Referral Partner Inquiry"

**Recommendations:**
1. **Formalize commission structure** — e.g., $X per paid signup, or % of first month
2. **Referral tracking** — Use PostHog, FirstPromoter, or Rewardful for unique links + attribution
3. **Self-serve signup** — Let referral partners get a link without emailing (reduces friction)
4. **Promote in email signatures, invoices** — "Refer a landlord, earn" CTA
5. **Partner with:** Property management companies, STR cleaners, insurance agents who serve San Diego hosts

---

## 9. Social Media Content Calendar (Organic)

| Platform | Post Frequency | Content Ideas |
|----------|----------------|---------------|
| **LinkedIn** | 2–3x/week | Compliance tips, San Diego ordinance updates, customer story (anonymized) |
| **Facebook** | 3–4x/week | Same + community questions, local STR news |
| **Instagram** | 2–3x/week | Carousel tips, quote graphics, behind-the-scenes |
| **X (Twitter)** | Daily | Short tips, links to blog, engage with San Diego RE/STR accounts |

### Content Pillars
1. **Education** — Ordinance/STRO how-tos
2. **Social proof** — "12,000+ properties monitored", testimonials
3. **Urgency** — "New filing? Get notified within 24 hours"
4. **Premium** — "Expert-led $499 audit" for high-intent

---

## 10. Email List Building

- **Lead magnets:** "San Diego STRO Compliance Checklist" (PDF) — gated by email
- **Newsletter:** Monthly "Ordinance Update" for San Diego — signup on site
- **Pop-up / footer:** "Get San Diego ordinance updates" — soft opt-in
- **Tools:** Resend (you have it), or ConvertKit/Mailchimp for sequences

---

## 11. Campaign Timeline (90 Days)

| Phase | Weeks | Focus |
|-------|-------|-------|
| **Setup** | 1–2 | Google Ads account, Meta Business Manager, LinkedIn Campaign Manager; keyword research; creative (images, copy) |
| **Launch** | 3–4 | Google Search live; Meta awareness campaign; Product Hunt launch; G2/Capterra profiles |
| **Optimize** | 5–8 | Pause low performers; scale winners; add retargeting; start LinkedIn for $499 |
| **Expand** | 9–12 | Lookalike audiences; referral program automation; community/event presence |

---

## 12. Budget Allocation (Example $2,000/mo)

| Channel | % | $ | Notes |
|---------|---|---|------|
| Google Search | 50% | $1,000 | Primary driver |
| Meta Ads | 25% | $500 | Awareness + retarget |
| LinkedIn | 15% | $300 | $499 audit focus |
| Content/SEO | 5% | $100 | Tools, freelance copy |
| Events/Sponsors | 5% | $100 | STRA membership, etc. |

---

## 13. KPIs to Track

| Metric | Target | Tool |
|--------|--------|------|
| Google Ads CPA (signup) | <$80 | Google Ads |
| Meta CPL | <$50 | Meta Ads Manager |
| Conversion rate (landing → signup) | >2% | PostHog |
| $499 audit leads/mo | 2–5 | PostHog + Stripe |
| Referral signups | Track trend | Referral tool |
| Organic traffic (sessions) | +10%/mo | GA4 / Vercel |

---

## 14. Creative Assets Needed

- [ ] **Google:** 3–5 ad headlines, 2–3 descriptions, 1 responsive ad
- [ ] **Meta:** 3–5 image/video creatives (1080x1080, 1080x1920), carousel
- [ ] **LinkedIn:** 1–2 single-image ads, 1 Message Ad copy
- [ ] **Landing page:** Dedicated /lp/google or /lp/meta for ad traffic (optional; homepage can work)
- [ ] **Product Hunt:** Logo, cover image, 1–2 screenshots or short video

---

## 15. Quick Wins (This Week)

**$100 Budget Mode:** Focus on zero-cost first. See LAUNCH_CAMPAIGN.md for aligned checklist.

1. **San Diego STRA:** Join or reach out for partnership/sponsorship ($0 or $50 for event)
2. **BiggerPockets:** Create account; introduce yourself in San Diego forum (value-first)
3. **Product Hunt:** Schedule launch; prep assets
4. **G2 + Capterra:** Create profiles (free)
5. **Referral:** Add "Refer a landlord" CTA to post-purchase/checkout success email
6. **Google Ads (optional):** If budget allows, 1 campaign, 5–10 keywords, $2/day for ~15 days

**Hold:** Meta/Facebook ads until account verification complete (see CONTACT_AND_ACCOUNTS.md).

---

## 16. Where to Sell (Best Fit)

**Best channels for conversions (in order):**
1. **Google Search** — Highest intent, best for $29/$99 subs and $499 audit
2. **Direct/Referral** — Word-of-mouth from PMs and investors
3. **Community (STRA, BiggerPockets)** — Trust-based; slower but high quality
4. **Meta retargeting** — After someone visited site
5. **LinkedIn** — For $499 audit and Pro plan

**Avoid or deprioritize:**
- Cold outbound/DM spam — Hurts brand
- Generic real estate forums outside San Diego — Low relevance until you expand

---

*Last updated: Feb 2026. Adjust budgets and tactics based on actual CPA and conversion data. See LAUNCH_CAMPAIGN.md for launch checklist and current blockers.*
