# Deploy to doggybagg.cc

One-page guide. See [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md) for full context.

---

## 1. Supabase (2 min)

Open **Supabase Dashboard** → **SQL Editor** → Run:

```sql
-- From scripts/003_drop_profile_trigger_use_app_fallback.sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
```

This removes the trigger that caused "Database error saving new user." Profiles are now created by the app.

---

## 2. Vercel env vars (5 min)

**Vercel** → Project → **Settings** → **Environment Variables** → Add for **Production**:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase Dashboard → Project Settings → API |
| `STRIPE_SECRET_KEY` | From Stripe Dashboard → Developers → API keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | From Stripe Dashboard |
| `STRIPE_STARTER_PRICE_ID` | `price_1SvPwKKhlGbF8HFhb05TCvm6` |
| `STRIPE_PROFESSIONAL_PRICE_ID` | `price_1SvPxGKhIGbF8HFhBpsn4mMa` |
| `NEXT_PUBLIC_SITE_URL` | `https://doggybagg.cc` |

Detailed copy-paste: [VERCEL_ENV_SETUP.md](./VERCEL_ENV_SETUP.md)

---

## 3. Deploy

```bash
git add .
git commit -m "feat: production ready"
git push origin main
```

Vercel will build and deploy. Test at https://doggybagg.cc.

---

## Post-deploy checks

- [ ] Sign up → verify email → lands on dashboard
- [ ] "Start Free Trial" → Stripe checkout ($29)
- [ ] "Get Started" → Stripe checkout ($99)
- [ ] Navigation: Features, Calculator, Pricing, Dashboard
