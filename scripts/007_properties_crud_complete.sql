-- Properties CRUD – ensures full update support for Ordinance.ai
-- Run after 001 and 006. Idempotent (safe to re-run).

-- Ensure address can be updated (no constraint blocking)
-- Schema from 001/006 already supports: address, stro_tier, license_id, reporting_status, risk_score

-- Add index for faster single-property lookups by user + id
create index if not exists properties_user_id_id_idx on public.properties(user_id, id);
