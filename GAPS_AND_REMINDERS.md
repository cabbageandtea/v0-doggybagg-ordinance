# Gaps & Reminders – DoggyBagg

Quick audit of what’s done vs. what’s pending or optional.

---

## ✅ Fixed This Pass

- **Privacy page:** Removed Ordinance.ai reference
- **Footer:** Privacy link now goes to `/privacy` instead of mailto
- **.env.example:** Header updated to DoggyBagg

---

## 📋 Manual / Pending (from LAUNCH_CHECKLIST)

| Item | Status |
|------|--------|
| Google Search Console verification | Add `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel |
| Env vars: `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY` | Confirm in Vercel |
| Submit sitemap in Search Console | After launch |
| Full checkout test (Stripe live) | After launch |
| PostHog event verification | After launch |

---

## 📄 Optional Additions

| Item | Notes |
|------|-------|
| **Terms of Service page** | Footer uses mailto. Add `/terms` when you have legal copy. |
| **Cookie Policy page** | Currently mailto. Can add `/cookies` or fold into `/privacy`. |
| **Property Search** | Still mock/demo. Wire to real API or add “Demo” label when ready. |

---

## 🚀 Uncommitted Changes

- Mobile: menu close on nav, safe-area insets, 44px touch targets
- Motion: slower springs, smaller offsets, gentler scroll
- `GAPS_AND_REMINDERS.md` (this file)

Run `git add -A && git commit -m "..." && git push` when ready.
