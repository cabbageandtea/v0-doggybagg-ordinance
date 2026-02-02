# Database scripts

Run in **Supabase Dashboard → SQL Editor** in this order.

## Order

1. **001_create_properties_schema.sql** – Tables (`profiles`, `properties`, `payment_transactions`, etc.) and RLS.
2. **006_properties_user_and_stro_columns.sql** – Adds `user_id`, `stro_tier`, `license_id`, `reporting_status`, `risk_score` for dashboard.
3. **007_properties_crud_complete.sql** – Optional. Index for faster single-property lookups.
4. **008_stripe_webhook_events.sql** – Required for Stripe webhook idempotency. Run before enabling webhooks.
5. **009_city_registry_cache_rls.sql** – RLS for `city_registry_cache` (run only if table exists).
6. **010_webhook_logs.sql** – Dead letter table for webhook validation failures. Required for Stripe webhook fail-safe.
7. **013_ordinances_municipal_case_id.sql** – Adds `municipal_case_id` for idempotent San Diego data sync. Required for `/api/cron/ingest`.
8. **014_sniper_tables.sql** – `sniper_stro_snapshots`, `sniper_runs` for Lead Sniper / Municipal Sentinel. Required for `/api/cron/sentinel`.

**security-test.sql** – Manual RLS verification. Run as `anon` role to test policies.

**How to run:** No Supabase CLI in this project. Run each script manually in **Supabase Dashboard → SQL Editor**. Paste the file contents and Execute.

## Performance Benchmark

**performance-bench.js** — Stress-tests the Tactile landing page (3D Tilt cards, Tactile Buttons), reports FCP.

```bash
pnpm run build && pnpm start
# In another terminal:
pnpm run perf:bench
```

Requires `npx playwright install chromium` on first run.
4. **002_create_profile_trigger.sql** – Trigger on `auth.users` to create a profile on sign-up.
5. **003_drop_profile_trigger_use_app_fallback.sql** – Optional. Run if you get "Database error saving new user".
6. **004_agentic_autonomous_expansion.sql** – Agent tables, neighborhood intelligence (requires 001).
7. **005_onboarding_agent_schema.sql** – Onboarding, compliance health checks.

## "Database error saving new user"

This usually means the trigger on `auth.users` is failing (often due to RLS on `public.profiles`).

- **Option A:** Re-run **002** in the SQL Editor so it runs as the project owner (postgres). The trigger then runs with privileges that can insert into `public.profiles`.
- **Option B:** Run **003** to drop the trigger. Sign-up will succeed, and the app will create profiles when the user gets a session (callback after email confirm, or right after sign-up if email confirmation is disabled).

The app now has a fallback: it creates/upserts the profile in the auth callback and on sign-up when a session is returned, so profiles are created even if the trigger is missing or failing.
