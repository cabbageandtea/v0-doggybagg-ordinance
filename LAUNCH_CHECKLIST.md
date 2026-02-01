# Launch Checklist – doggybagg.cc

Quick reference for final manual steps before and after launch.

---

## Before Launch

### 1. OG Image (Required for social shares)
- [x] **Done:** `public/images/og-image.png` – DoggyBagg 3D logo + “Take it with you” tagline
- Recommended size: 1200×630px for best social previews

### 2. Google Search Console
- [ ] Add property at [search.google.com/search-console](https://search.google.com/search-console)
- [ ] Copy the meta tag verification code
- [ ] Add env var in Vercel: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-code`
- [ ] Redeploy to apply

### 3. Environment Variables (Vercel)
Confirm these are set for production:
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (after verification)

---

## After Launch

- [ ] Submit sitemap in Search Console: `https://doggybagg.cc/sitemap.xml`
- [ ] Test a full checkout flow (Stripe live mode)
- [ ] Verify PostHog events (add_property, consent_given, etc.)
- [ ] Clear `cookie-consent` from localStorage and confirm cookie banner reappears
- [ ] Visit `/privacy` and `/nonexistent` to confirm pages render
