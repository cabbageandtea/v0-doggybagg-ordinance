# Day 0: Public Marketing Launch — Status

## Production Launch Complete (Day 1–6)

| Item | Status |
|------|--------|
| Vercel Deployment 2CVmaDrbi | ✅ Ready |
| `NEXT_PUBLIC_STRIPE_PORTFOLIO_AUDIT_LINK` | ✅ Injected |
| Money Path (Stripe $499) | ✅ Active |
| Google Search Console (sitemap) | ✅ Submitted & processing |
| PostHog, Supabase, Proxy | ✅ Active |

---

## Portfolio Audit Button — Final Verification

**Expected destination:** `https://buy.stripe.com/14AaEYb1e3XhbUr1SJak000`  
**Stripe product:** San Diego STR Portfolio Audit — $499.00 USD

| Location | Component | Env Var Used | Fallback if Unset |
|----------|-----------|--------------|-------------------|
| Hero section | `hero-section.tsx` | `NEXT_PUBLIC_STRIPE_PORTFOLIO_AUDIT_LINK` | mailto:support@doggybagg.cc |
| Bento hero | `bento-grid.tsx` | `NEXT_PUBLIC_STRIPE_PORTFOLIO_AUDIT_LINK` | mailto:support@doggybagg.cc |
| Pricing CTA | `pricing-section.tsx` | `NEXT_PUBLIC_STRIPE_PORTFOLIO_AUDIT_LINK` | mailto:support@doggybagg.cc |

**Verification:** With `NEXT_PUBLIC_STRIPE_PORTFOLIO_AUDIT_LINK` set in Vercel (deployment 2CVmaDrbi), all three "Get My $499 Portfolio Audit" buttons resolve to Stripe Checkout. ✅

---

## Day 0: Public Marketing Launch Checklist

### Pre-launch (5 min)
- [ ] Open doggybagg.cc in incognito
- [ ] Click "Get My $499 Portfolio Audit" → confirm Stripe Checkout opens
- [ ] Click "See your risk" → confirm scroll to calculator
- [ ] Test sign-up flow (email → verify → dashboard)

### Launch
- [ ] Announce on LinkedIn / Twitter / relevant groups
- [ ] Share with 3–5 warm leads (landlords, PMs)
- [ ] Monitor PostHog for `signed_up`, `property_search`, `checkout_started`

### Post-launch (24–48h)
- [ ] Check Vercel logs for errors
- [ ] Verify first Stripe payment (if any) → webhook → profile update
- [ ] Review PostHog funnels

---

**Status:** Ready for Day 0 Public Marketing Launch. 🚀
