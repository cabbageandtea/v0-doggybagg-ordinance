# Gaps & Reminders – DoggyBagg

Quick audit of what’s done vs. what’s pending or optional.

---

## ✅ Fixed (Deep Audit Feb 2026)

- **Help page billing:** Starter 1 property, Pro 10 properties
- **Help page tone:** "health scores and ordinance standing"
- **Property search:** Added "Demo" badge
- **Footer:** Removed Data Sources, API, Blog, Careers

---

## 📋 Manual / Pending (from LAUNCH_CHECKLIST)

| Item | Status |
|------|--------|
| Google Search Console verification | Add `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel |
| Env vars: `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY` | Confirm in Vercel |
| Submit sitemap in Search Console | After launch |
| Full checkout test (Stripe live) | After launch |
| **Stripe $499 Payment Link** | Set Success URL to `https://doggybagg.cc/checkout/success?product=audit` (Stripe Dashboard → Payment links → Edit) |
| PostHog event verification | After launch |

---

## 📄 Optional Additions

| Item | Notes |
|------|-------|
| **Terms of Service page** | Footer uses mailto. Add `/terms` when you have legal copy. |
| **Cookie Policy page** | Currently mailto. Can add `/cookies` or fold into `/privacy`. |
| **Property Search** | Still mock/demo. Wire to real API or add “Demo” label when ready. |

---

**See `DEEP_AUDIT_REPORT.md` for full team debate and research synthesis.**
