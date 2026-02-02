# Incident Runbook

**Purpose:** What to do when things break. Top teams have this; so do we.

---

## 1. Site Down (doggybagg.cc unreachable)

1. **Check Vercel** – [vercel.com/dashboard](https://vercel.com) → Project → Deployments. Look for failed builds or runtime errors.
2. **Check status pages** – [status.vercel.com](https://www.vercel-status.com), [status.supabase.com](https://status.supabase.com).
3. **Redeploy** – If last deploy is broken, rollback to previous or trigger a fresh deploy.
4. **Notify** – If user-facing, post to status (if you have one) or support channel.

---

## 2. Checkout / Stripe Failures

1. **Stripe Dashboard** – [dashboard.stripe.com](https://dashboard.stripe.com) → Logs, Events. Look for failed payments or webhook errors.
2. **Vercel logs** – Check `/api/webhooks/stripe` for 4xx/5xx.
3. **Webhook secret** – Ensure `STRIPE_WEBHOOK_SECRET` is set in Vercel env (production).
4. **Idempotency** – `stripe_webhook_events` table prevents duplicate processing. If a specific event is stuck, check that table.

---

## 3. Auth / Sign-In Issues

1. **Supabase Auth** – Dashboard → Authentication → Users. Confirm user exists and email is confirmed.
2. **Redirect URLs** – Supabase → Auth → URL Configuration. Ensure `https://doggybagg.cc/auth/callback` and `http://localhost:3000/auth/callback` (dev) are allowed.
3. **Session** – Clear cookies and try again. Check for CORS or cookie domain issues.

---

## 4. San Diego Data Sync (Cron) Not Running

1. **Manual trigger** – `curl -H "Authorization: Bearer $CRON_SECRET" https://doggybagg.cc/api/cron/ingest`
2. **Vercel Cron** – Runs daily 6am UTC. Check Vercel → Logs for `/api/cron/ingest` errors.
3. **Supabase** – Ensure `SUPABASE_SERVICE_ROLE_KEY` is set. Sync needs it for ordinances insert.
4. **Data source** – `seshat.datasd.org` may be down. Check [data.sandiego.gov](https://data.sandiego.gov).

---

## 4b. Municipal Sentinel (Admin Email) Not Running

1. **Manual trigger** – `curl -H "Authorization: Bearer $CRON_SECRET" https://doggybagg.cc/api/cron/sentinel`
2. **Vercel Cron** – Runs daily 7am UTC. Check Vercel → Logs for `/api/cron/sentinel` errors.
3. **Prerequisites** – Run `scripts/014_sniper_tables.sql`, `015_docket_logs.sql`, `016_stro_expiration.sql` in Supabase.
4. **RESEND_API_KEY** – Required for admin@doggybagg.cc alerts. Verify domain in Resend Dashboard.
5. **Workflows** – If using Vercel Workflows, check the Workflows Dashboard for run status.
6. **500 / `t._parse is not a function`** – Zod version conflict. Ensure `zod@4.1.11` and pnpm override in package.json. Redeploy with **Reset Build Cache** checked.
7. **Failed to parse server response** – Proxy must not run on `/.well-known/workflow/*`. Ensure `proxy.ts` matcher excludes `\\.well-known`. Pin workflow to 4.0.1-beta.30.
8. **Turbopack / Zod minification** – Use `next build --webpack` to force Webpack (avoids Turbopack minifying Zod incorrectly). zod + workflow at top of deps; pnpm override zod 4.1.11.

---

## 5. High Error Rate / Sentry Alerts

1. **Sentry** – [sentry.io](https://sentry.io) → Issues. Group by error type, identify top offenders.
2. **Fix or mitigate** – Deploy a fix, or add error boundary / fallback to reduce user impact.
3. **Source maps** – Ensure `SENTRY_AUTH_TOKEN` is set in Vercel for readable stack traces.

---

## 6. Database / Supabase Issues

1. **Supabase Dashboard** – Project → Database. Check connection, logs, query performance.
2. **RLS** – If users can't see data, verify RLS policies. Run `scripts/security-test.sql` for sanity checks.
3. **Migrations** – If schema is out of sync, run pending scripts from `scripts/` in SQL Editor.

---

## Contacts

- **Vercel** – [vercel.com/support](https://vercel.com/support)
- **Supabase** – [supabase.com/dashboard/support](https://supabase.com/dashboard/support)
- **Stripe** – [support.stripe.com](https://support.stripe.com)
- **DoggyBagg support** – support@doggybagg.cc

---

*Last updated: Top-teams upgrade pass*
