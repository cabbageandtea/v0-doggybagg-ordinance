-- Inbound leads from property page CTAs (Unlock Full 2026 Audit)
-- Run in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS public.inbound_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  address text,
  status text DEFAULT 'Inbound_Lead',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inbound_leads_email ON public.inbound_leads (email);
CREATE INDEX IF NOT EXISTS idx_inbound_leads_created ON public.inbound_leads (created_at DESC);

ALTER TABLE public.inbound_leads ENABLE ROW LEVEL SECURITY;

-- No policies = service role only (API writes); anon cannot read/write
COMMENT ON TABLE public.inbound_leads IS 'Inbound leads from property page CTAs (Full 2026 Audit)';
