-- Add expiration_date to sniper_stro_snapshots for Renewal Sentinel
-- Run in Supabase Dashboard → SQL Editor after 015.

ALTER TABLE public.sniper_stro_snapshots
  ADD COLUMN IF NOT EXISTS expiration_date date;

CREATE INDEX IF NOT EXISTS idx_sniper_stro_expiration
  ON public.sniper_stro_snapshots (expiration_date)
  WHERE expiration_date IS NOT NULL;

COMMENT ON COLUMN public.sniper_stro_snapshots.expiration_date IS 'STRO license expiration; used by Renewal Sentinel for 10-45 day window';
