# Product & Feature Debate Log

Tradeoffs, pros/cons, and decisions for DoggyBagg features.

---

## 1. Portfolio Audit Lead Form (Qualification)

**What we did:** Added optional "Properties" dropdown and "Email" field above the $499 Audit CTA. Data is tracked via PostHog on click; user still goes straight to Stripe/mailto.

| Side | Argument |
|------|----------|
| **Pro form** | Qualifies leads. Property count helps tailor outreach. Email capture without friction (optional). |
| **Anti form** | Any extra field can drop conversion. $499 is a considered purchase—many will research first. One-click is cleaner. |
| **Decision** | Optional fields only. No blocking. Track when provided; don't require. |

**A/B test idea:** Run variant with no form vs. with form. Measure: CTA click-through, Stripe conversion, lead quality.

---

## 2. Rate Limiting on Property Search

**What we did:** Client-side 3-second cooldown between searches. Error message if user clicks too fast.

| Side | Argument |
|------|----------|
| **Pro** | Reduces spam when API is live. Prevents accidental double-clicks. Free, no backend. |
| **Anti** | Adds friction. User may think "why can't I search again?" 3s might feel long. |
| **Decision** | 3s is conservative. When API exists, add server-side rate limit; keep client throttle as UX aid. |

---

## 3. San Diego SEO Content

**What we did:** Created `/learn/str-compliance-san-diego` — STR compliance guide. Linked from blog.

| Side | Argument |
|------|----------|
| **Pro** | Targets "STR compliance San Diego" intent. Establishes authority. Long-tail SEO. |
| **Anti** | One page won't move the needle. Competes with city/official content. Needs backlinks. |
| **Decision** | Ship it. Add more /learn/* pages over time (e.g. La Jolla, North Park, TOT). Consistency beats one big push. |

---

## 4. "Powered by DoggyBagg" on Exports

**What we did:** Added footer row to CSV export: "Exported from DoggyBagg — doggybagg.cc"

| Side | Argument |
|------|----------|
| **Pro** | Free distribution. Investors share CSVs with PMs, lenders. Brand visibility. |
| **Anti** | Could feel promotional. Some users may strip it. |
| **Decision** | Keep it. Subtle, informational. Compliance certificate already branded. |

---

## 5. Optional: Dark/Light Toggle

**Not implemented.** Site is dark by default.

| Side | Argument |
|------|----------|
| **Pro** | Accessibility. Some users prefer light. Common expectation. |
| **Anti** | Dark fits "command center" brand. Extra code paths. Most property dashboards are dark. |
| **Decision** | Defer. Revisit if users request or a11y audit recommends. |

---

## 6. Optional: Real Property Search API

**Not implemented.** Search uses mock data.

| Side | Argument |
|------|----------|
| **Pro** | Core value prop. Converts visitors. Differentiator. |
| **Anti** | Depends on data access (city, third-party). Rate limits, cost, maintenance. |
| **Decision** | Prioritize when data pipeline exists. Add "Request early access" CTA to demo. |
