-- DoggyBagg: Notification preferences and welcome email tracking
-- Run after 001, 006. Adds profile columns for email preferences and welcome state.

-- Email notification preferences (opt-in; default true for existing users)
alter table public.profiles
  add column if not exists email_notifications boolean default true;

-- Track welcome email to avoid duplicates
alter table public.profiles
  add column if not exists welcome_email_sent_at timestamptz;

-- Comment for documentation
comment on column public.profiles.email_notifications is 'User opt-in for compliance/violation email alerts. Default true.';
comment on column public.profiles.welcome_email_sent_at is 'When welcome email was sent; null = not yet sent.';
