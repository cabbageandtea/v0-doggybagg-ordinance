-- Idempotency table for Stripe webhook events
-- Prevents double-processing of checkout.session.completed and other events

create table if not exists public.stripe_webhook_events (
  id uuid primary key default gen_random_uuid(),
  event_id text not null unique,
  event_type text not null,
  processed_at timestamptz default now() not null,
  created_at timestamptz default now() not null
);

create index if not exists idx_stripe_webhook_events_event_id on public.stripe_webhook_events(event_id);

-- RLS enabled: no policies = only service role can access (anon/authenticated denied)
alter table public.stripe_webhook_events enable row level security;
