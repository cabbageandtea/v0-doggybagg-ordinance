# Senior Lead Audit: Environment Variables & Supabase Client

**Scope:** Ordinance.ai repo (cloned). Audit of required env vars, Stripe Price ID mapping, and Supabase singleton implementation.

---

## 1. Required Environment Variables (Full Inventory)

### 1.1 Supabase

| Variable | Used In | Required | Notes |
|---------|---------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase/client.ts`, `server.ts`, `proxy.ts` | **Yes** | Project URL (e.g. `https://xxxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same three files | **Yes** | Public anon key (safe for client) |

**Note:** This codebase does **not** use a Supabase Service Role Key. Only URL + Anon Key are required. If you add server-side admin operations later, you would introduce `SUPABASE_SERVICE_ROLE_KEY` in a separate server-only module.

---

### 1.2 Stripe

| Variable | Used In | Required | Notes |
|----------|---------|----------|--------|
| `STRIPE_SECRET_KEY` | `lib/stripe.ts` | **Yes** | Server-only. App throws at runtime if missing. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `components/checkout.tsx` | **Yes** | Client-side Stripe.js; required for checkout UI. |
| `STRIPE_STARTER_PRICE_ID` | `app/actions/stripe.ts` | **Yes for production** | $29/month plan. See §2. |
| `STRIPE_PROFESSIONAL_PRICE_ID` | `app/actions/stripe.ts` | **Yes for production** | $99/month plan. See §2. |

---

## 2. Stripe Price ID Mapping ($29 and $99 Plans)

### 2.1 Product definitions (`lib/products.ts`)

- **`starter-plan`** – $29.00/month (`priceInCents: 2900`). Display/metadata only; no env var here.
- **`professional-plan`** – $99.00/month (`priceInCents: 9900`). Display/metadata only.
- **`enterprise-plan`** – Custom (no Stripe Price ID; contact sales).

`lib/products.ts` does **not** reference any environment variables. It is the source of truth for product IDs and display pricing; Stripe Price IDs are wired only in `app/actions/stripe.ts`.

### 2.2 Where Price IDs are wired (`app/actions/stripe.ts`)

| Product ID (from `lib/products.ts`) | Env Variable | Purpose |
|-------------------------------------|-------------|---------|
| `starter-plan` | `STRIPE_STARTER_PRICE_ID` | Stripe Price ID for $29/month recurring (e.g. `price_xxxxx`) |
| `professional-plan` | `STRIPE_PROFESSIONAL_PRICE_ID` | Stripe Price ID for $99/month recurring |

**Code reference (lines 9–11):**

\`\`\`ts
const STRIPE_PRICE_IDS: Record<string, string> = {
  'starter-plan': process.env.STRIPE_STARTER_PRICE_ID || 'REPLACE_WITH_STARTER_PRICE_ID',
  'professional-plan': process.env.STRIPE_PROFESSIONAL_PRICE_ID || 'REPLACE_WITH_PROFESSIONAL_PRICE_ID',
}
\`\`\`

**Behavior:**

- If the env var is set and does **not** contain `REPLACE_WITH`, the app uses that Stripe Price ID in Checkout (production path).
- If missing or placeholder, the app falls back to **dynamic pricing** (`price_data`) for development only; production should use real Price IDs.

**Action:** Create two Products in Stripe Dashboard (Starter $29/mo, Professional $99/mo), create a recurring Price for each, then set:

- `STRIPE_STARTER_PRICE_ID=<price_id_for_29>`
- `STRIPE_PROFESSIONAL_PRICE_ID=<price_id_for_99>`

---

## 3. Compare Required Variables vs Your `.env` (Checklist)

Your `.env` / `.env.local` is not in the repo (correctly gitignored). Use this checklist against your **current** `.env` or `.env.local`:

### Required (app will break or degrade without these)

| Variable | In your .env? | If missing |
|---------|----------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ☐ | Auth and DB client will fail. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ☐ | Same. |
| `STRIPE_SECRET_KEY` | ☐ | `lib/stripe.ts` throws at load. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ☐ | Checkout UI will not initialize. |

### Required for production pricing ($29 / $99 buttons)

| Variable | In your .env? | If missing |
|---------|----------------|------------|
| `STRIPE_STARTER_PRICE_ID` | ☐ | Checkout uses dynamic pricing (dev fallback); not suitable for production. |
| `STRIPE_PROFESSIONAL_PRICE_ID` | ☐ | Same. |

### Optional (documented in `.env.example`)

- `NEXT_PUBLIC_SITE_URL` – e.g. `https://doggybagg.cc`
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` – e.g. `http://localhost:3000/auth/callback`

**Exact list of what must be present for full production behavior:**

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_STARTER_PRICE_ID=
STRIPE_PROFESSIONAL_PRICE_ID=
\`\`\`

Compare your file to the above; any line you don’t have or that is empty/placeholder is **missing**.

---

## 4. Supabase Client: Singleton Pattern (GoTrueClient)

### 4.1 Browser client (`lib/supabase/client.ts`) – **Singleton enforced**

- A **single** browser client is stored on `globalThis` (as `globalForSupabase.supabaseClient`).
- Every call to `createClient()` returns that same instance; `createBrowserClient()` runs only once per process.
- This avoids multiple GoTrueClient instances in the browser and under Next.js dev HMR.

**Verdict:** Compliant. No change required for the “Multiple GoTrueClient instances” concern.

### 4.2 Server client (`lib/supabase/server.ts`) – **Per-request, by design**

- Creates a **new** `createServerClient()` per request, using the request’s cookies.
- Correct for Server Components / Route Handlers; no singleton intended here.

### 4.3 Middleware (`lib/supabase/proxy.ts`) – **Per-request, by design**

- Creates a **new** `createServerClient()` per request in middleware, with request/response cookies.
- Correct for session refresh in the middleware pipeline.

**Summary:** Only the **browser** client is a singleton; server and middleware correctly use per-request clients. The implementation is appropriate and should prevent the “Multiple GoTrueClient instances” errors when the browser client is used from app code.

---

## 5. Summary

| Area | Status |
|------|--------|
| **Supabase env** | Need: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. No Service Key in use. |
| **Stripe env** | Need: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_STARTER_PRICE_ID`, `STRIPE_PROFESSIONAL_PRICE_ID`. |
| **Stripe mapping** | `lib/products.ts` defines product IDs; `app/actions/stripe.ts` maps them to env (lines 9–11). |
| **Your .env** | Compare your file to the checklist in §3; add any missing or placeholder variables. |
| **Supabase singleton** | Browser client uses `globalThis` singleton; server/proxy are per-request. No change needed. |

Use `.env.example` in the repo as the template; copy to `.env.local`, fill in real values, and ensure the six variables above are set for production.
