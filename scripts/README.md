# Database scripts

Run in **Supabase Dashboard → SQL Editor** in this order.

## Order

1. **001_create_properties_schema.sql** – Tables (`profiles`, `properties`, `payment_transactions`, etc.) and RLS.
2. **006_properties_user_and_stro_columns.sql** – Adds `user_id`, `stro_tier`, `license_id`, `reporting_status`, `risk_score` for dashboard.
3. **002_create_profile_trigger.sql** – Trigger on `auth.users` to create a profile on sign-up.
4. **003_drop_profile_trigger_use_app_fallback.sql** – Optional. Run if you get "Database error saving new user".
5. **004_agentic_autonomous_expansion.sql** – Agent tables, neighborhood intelligence (requires 001).
6. **005_onboarding_agent_schema.sql** – Onboarding, compliance health checks.

## "Database error saving new user"

This usually means the trigger on `auth.users` is failing (often due to RLS on `public.profiles`).

- **Option A:** Re-run **002** in the SQL Editor so it runs as the project owner (postgres). The trigger then runs with privileges that can insert into `public.profiles`.
- **Option B:** Run **003** to drop the trigger. Sign-up will succeed, and the app will create profiles when the user gets a session (callback after email confirm, or right after sign-up if email confirmation is disabled).

The app now has a fallback: it creates/upserts the profile in the auth callback and on sign-up when a session is returned, so profiles are created even if the trigger is missing or failing.
