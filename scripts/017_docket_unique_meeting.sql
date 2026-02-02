-- Prevent duplicate docket alerts: unique on meeting_id
-- Run in Supabase Dashboard → SQL Editor after 016.

CREATE UNIQUE INDEX IF NOT EXISTS idx_sentinel_docket_meeting_unique
  ON public.sentinel_docket_history (meeting_id);
