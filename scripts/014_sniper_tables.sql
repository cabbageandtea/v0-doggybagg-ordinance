-- Sniper tables for Lead Sniper / Municipal Sentinel
-- Run in Supabase Dashboard → SQL Editor after 013.

-- STRO license snapshots: daily fetch for diffing (new Tier 3/4 in target zips)
CREATE TABLE IF NOT EXISTS public.sniper_stro_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id text NOT NULL,
  address text,
  zip text,
  tier text,
  local_contact_name text,
  local_contact_phone text,
  host_contact_name text,
  ingested_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sniper_stro_ingested ON public.sniper_stro_snapshots (ingested_at DESC);
CREATE INDEX IF NOT EXISTS idx_sniper_stro_license ON public.sniper_stro_snapshots (license_id, ingested_at);

-- Snapshot runs: one row per daily run (for dedup and observability)
CREATE TABLE IF NOT EXISTS public.sniper_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_type text NOT NULL, -- 'stro_snapshot' | 'sentinel_full'
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  status text DEFAULT 'running', -- 'running' | 'completed' | 'failed'
  result_json jsonb
);

-- RLS: service role only (cron/workflow)
ALTER TABLE public.sniper_stro_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sniper_runs ENABLE ROW LEVEL SECURITY;

-- No policies = service role bypasses RLS; anon/authenticated cannot access
COMMENT ON TABLE public.sniper_stro_snapshots IS 'Daily STRO license snapshots for Lead Sniper diff';
COMMENT ON TABLE public.sniper_runs IS 'Sniper/Sentinel run audit log';
