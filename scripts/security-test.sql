-- SQL Security Stress Test
-- Run in Supabase SQL Editor for manual RLS verification.
-- Uses anon key context (no auth session) to simulate unauthenticated access.
-- Expected: all SELECTs should return 0 rows or error due to RLS.

-- =============================================================================
-- 1. properties_select_null_user policy test
-- =============================================================================
-- The policy "properties_select_null_user" allows: SELECT WHERE user_id IS NULL
-- This means orphaned rows (user_id IS NULL) are readable by anyone.
-- Test: as authenticated/anon, can we see null-user rows?

-- Switch to anon role (simulates unauthenticated API request)
set role anon;

-- Attempt to SELECT properties with a dummy user_id (should return 0 - RLS blocks)
-- Note: auth.uid() is NULL when role is anon, so:
--   - properties_select_own: auth.uid() = user_id -> NULL = user_id -> false for all
--   - properties_select_null_user: user_id IS NULL -> true for orphaned rows only
select id, address, user_id
from public.properties
where user_id = '00000000-0000-0000-0000-000000000000'::uuid;
-- Expected: 0 rows (no such user_id)

-- Attempt to SELECT orphaned properties (user_id IS NULL)
select id, address, user_id
from public.properties
where user_id is null;
-- Expected: If properties_select_null_user exists, rows may be returned.
-- This confirms the policy allows reading orphaned rows (migration legacy).
-- To lock down: DROP POLICY "properties_select_null_user" after backfill.

-- Reset role
reset role;

-- =============================================================================
-- 2. city_registry_cache access without session
-- =============================================================================
set role anon;

-- Attempt to SELECT from city_registry_cache without auth
select *
from public.city_registry_cache
limit 1;
-- Expected: 0 rows or "permission denied" if RLS policy requires authenticated.
-- With scripts/009: authenticated can read; anon cannot (no policy for anon).

reset role;

-- =============================================================================
-- 3. stripe_webhook_events (service-role only)
-- =============================================================================
set role anon;

select count(*) from public.stripe_webhook_events;
-- Expected: permission denied (no policies = anon cannot access)

reset role;

-- =============================================================================
-- 4. webhook_logs (service-role only)
-- =============================================================================
set role anon;

select count(*) from public.webhook_logs;
-- Expected: permission denied (RLS enabled, no policies for anon)

reset role;

-- =============================================================================
-- Summary
-- =============================================================================
-- After running, verify:
-- - properties: anon sees only rows where user_id IS NULL (if policy exists)
-- - city_registry_cache: anon sees 0 rows or gets denied
-- - stripe_webhook_events, webhook_logs: anon gets permission denied
