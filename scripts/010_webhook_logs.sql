-- Dead letter table for webhook validation failures and delivery errors
-- Run in Supabase SQL Editor. Only service role writes; no RLS policies for anon/authenticated.

create table if not exists public.webhook_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now() not null,
  source text not null default 'stripe',
  event_id text,
  event_type text,
  context text not null,
  error_message text,
  payload jsonb,
  raw_body text
);

create index if not exists idx_webhook_logs_created_at on public.webhook_logs(created_at desc);
create index if not exists idx_webhook_logs_source on public.webhook_logs(source);
create index if not exists idx_webhook_logs_event_id on public.webhook_logs(event_id) where event_id is not null;

alter table public.webhook_logs enable row level security;

-- No policies: only service role can insert/select (bypasses RLS)
-- Anon and authenticated cannot access this table