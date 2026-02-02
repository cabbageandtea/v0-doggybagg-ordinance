-- Docket alert history: prevent duplicate legislative alerts
-- Run in Supabase Dashboard → SQL Editor after 014.

CREATE TABLE IF NOT EXISTS public.sentinel_docket_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id text NOT NULL,
  meeting_date text,
  link text,
  alerted_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_docket_history_meeting ON public.sentinel_docket_history (meeting_id);

ALTER TABLE public.sentinel_docket_history ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.sentinel_docket_history IS 'Tracks City Council meetings we have already alerted on (Municipal Docket Scraper)';
