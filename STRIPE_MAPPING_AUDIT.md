# Stripe Price ID Mapping Audit – Ordinance.ai

**Purpose:** Map your Stripe Price IDs into the app so the $29 and $99 pricing buttons work on doggybagg.cc.

---

## 1. Audit: `lib/products.ts`

- **Role:** Product catalog only. Defines product **ids** and display pricing; **no environment variables**.
- **Starter:** `id: 'starter-plan'`, `priceInCents: 2900` ($29/month).
- **Professional:** `id: 'professional-plan'`, `priceInCents: 9900` ($99/month).
- **Enterprise:** `id: 'enterprise-plan'`, custom (no Stripe Price ID; contact sales).

**Conclusion:** No changes needed here. Stripe Price IDs are **not** stored in this file; they are read from the environment in `app/actions/stripe.ts`.

---

## 2. Audit: Where Price IDs Are Used – `app/actions/stripe.ts`

**Lines 9–11:** The only place Stripe Price IDs are wired:

\`\`\`ts
const STRIPE_PRICE_IDS: Record<string, string> = {
  'starter-plan': process.env.STRIPE_STARTER_PRICE_ID || 'REPLACE_WITH_STARTER_PRICE_ID',
  'professional-plan': process.env.STRIPE_PROFESSIONAL_PRICE_ID || 'REPLACE_WITH_PROFESSIONAL_PRICE_ID',
}
\`\`\`

**Mapping:**

| Product (from `lib/products.ts`) | Env variable                     | Your Stripe Price ID |
|----------------------------------|-----------------------------------|------------------------|
| `starter-plan` ($29/mo)          | `STRIPE_STARTER_PRICE_ID`         | Paste from Stripe      |
| `professional-plan` ($99/mo)     | `STRIPE_PROFESSIONAL_PRICE_ID`    | Paste from Stripe      |

**Behavior:**

- If the env var is set and does **not** contain `REPLACE_WITH`, checkout uses that Stripe Price ID (production path).
- If missing or placeholder, checkout uses dynamic `price_data` (dev fallback); pricing buttons are “dead” for real subscriptions until the env vars are set.

---

## 3. Your `.env` File – What to Add

Your real `.env` / `.env.local` is gitignored, so it wasn’t read. Add or update these two lines with the **exact** Price IDs from your Stripe Dashboard (they start with `price_`):

**Local (`.env.local`):**

\`\`\`env
STRIPE_STARTER_PRICE_ID=price_xxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_PROFESSIONAL_PRICE_ID=price_xxxxxxxxxxxxxxxxxxxxxxxx
\`\`\`

**Production (Vercel → Settings → Environment Variables):**

- Add the same two variables with the same values for the Production environment.

**Check:**

- Names must be exactly: `STRIPE_STARTER_PRICE_ID` and `STRIPE_PROFESSIONAL_PRICE_ID`.
- Values must be the full Price ID (e.g. `price_1ABC...`). No quotes needed in `.env`; in Vercel, paste the value only.

No code changes are required; the app already reads these variables. Once they are set, the “Start Free Trial” (Starter) and “Get Started” (Professional) buttons will use your live Stripe prices.

---

## 4. Button → Checkout Flow (Verified)

- **Pricing section** links:
  - Starter → `/checkout/starter-plan`
  - Professional → `/checkout/professional-plan`
- **Checkout page** `app/checkout/[productId]/page.tsx` calls `startCheckoutSession(productId)`.
- **startCheckoutSession** uses `STRIPE_PRICE_IDS[productId]` (from env) when present; otherwise falls back to dynamic pricing.

Setting the two env vars above is sufficient to make the landing-page pricing buttons production-ready.
