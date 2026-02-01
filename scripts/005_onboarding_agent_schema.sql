-- DoggyBagg Onboarding Agent Schema
-- Tracks user onboarding progress and milestones

-- User Onboarding State
create table if not exists public.user_onboarding (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  
  -- Onboarding steps completion
  has_completed_tour boolean default false,
  has_added_property boolean default false,
  has_verified_phone boolean default false,
  has_viewed_risk_score boolean default false,
  has_generated_health_check boolean default false,
  
  -- Timestamps
  tour_started_at timestamptz,
  tour_completed_at timestamptz,
  first_property_added_at timestamptz,
  phone_verified_at timestamptz,
  risk_score_viewed_at timestamptz,
  health_check_generated_at timestamptz,
  
  -- User tier at onboarding
  onboarding_tier text default 'free',
  
  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.user_onboarding enable row level security;

-- RLS Policies
create policy "Users can view own onboarding"
  on public.user_onboarding
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can update own onboarding"
  on public.user_onboarding
  for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own onboarding"
  on public.user_onboarding
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Compliance Health Checks
create table if not exists public.compliance_health_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  
  -- Health check results
  overall_score integer not null check (overall_score >= 0 and overall_score <= 100),
  total_properties integer default 0,
  compliant_properties integer default 0,
  at_risk_properties integer default 0,
  
  -- Detailed metrics
  average_risk_score numeric,
  active_violations_count integer default 0,
  pending_actions_count integer default 0,
  
  -- Recommendations (server-generated)
  recommendations jsonb,
  
  -- Report metadata
  generated_at timestamptz default now(),
  report_type text default 'initial' check (report_type in ('initial', 'monthly', 'on_demand')),
  
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.compliance_health_checks enable row level security;

-- RLS Policies
create policy "Users can view own health checks"
  on public.compliance_health_checks
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "System can insert health checks"
  on public.compliance_health_checks
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Onboarding Action Log (for analytics)
create table if not exists public.onboarding_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  
  action_type text not null,
  step_number integer,
  completed boolean default false,
  time_spent_seconds integer,
  
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.onboarding_actions enable row level security;

-- RLS Policy
create policy "Users can view own onboarding actions"
  on public.onboarding_actions
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own onboarding actions"
  on public.onboarding_actions
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Indexes for performance
create index if not exists idx_user_onboarding_user_id on public.user_onboarding(user_id);
create index if not exists idx_health_checks_user_id on public.compliance_health_checks(user_id);
create index if not exists idx_health_checks_generated_at on public.compliance_health_checks(generated_at desc);
create index if not exists idx_onboarding_actions_user_id on public.onboarding_actions(user_id);

-- Trigger to auto-update updated_at (uses centralized handle_updated_at from 001)
drop trigger if exists user_onboarding_updated_at on public.user_onboarding;
create trigger user_onboarding_updated_at
  before update on public.user_onboarding
  for each row
  execute function public.handle_updated_at();
