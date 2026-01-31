# Environment Variables Audit – Stripe & Pricing

**Purpose**: Exact list of env vars used for Stripe Price IDs and where they are read in code. Use this when adding new Stripe Price IDs so the pricing table works.

---

## Stripe Price IDs (fixes “dead” pricing buttons)

| Variable | Used in | Purpose |
|----------|---------|---------|
| `STRIPE_STARTER_PRICE_ID` | `app/actions/stripe.ts` (line 10) | $29/month Starter plan checkout |
| `STRIPE_PROFESSIONAL_PRICE_ID` | `app/actions/stripe.ts` (line 11) | $99/month Professional plan checkout |

**Code reference** (`app/actions/stripe.ts`):

```ts
const STRIPE_PRICE_IDS: Record<string, string> = {
  'starter-plan': process.env.STRIPE_STARTER_PRICE_ID || 'REPLACE_WITH_STARTER_PRICE_ID',
  'professional-plan': process.env.STRIPE_PROFESSIONAL_PRICE_ID || 'REPLACE_WITH_PROFESSIONAL_PRICE_ID',
}
```

**What to do**:

1. In Stripe Dashboard create two Products with recurring Prices: $29/month and $99/month.
2. Copy each Price ID (starts with `price_...`).
3. Add to `.env.local` (local) and to Vercel Environment Variables (production):

   ```
   STRIPE_STARTER_PRICE_ID=price_xxxxxxxxxxxxx
   STRIPE_PROFESSIONAL_PRICE_ID=price_xxxxxxxxxxxxx
   ```

No code changes are required; the app already reads these variables. Until they are set, checkout falls back to dynamic pricing (development only); in production you should set the Price IDs.

---

## Other Stripe / Supabase vars (already documented)

- `STRIPE_SECRET_KEY` – `lib/stripe.ts`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` – `components/checkout.tsx`
- `NEXT_PUBLIC_SUPABASE_URL` – `lib/supabase/client.ts`, `server.ts`, `proxy.ts`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – same files

See `.env.example` for a full template.
