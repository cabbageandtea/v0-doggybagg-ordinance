-- V21 Agentic Expansion Schema
-- AUTONOMOUS EDIT: Remove bottlenecks that limit agent choices

-- Agent Actions Log - Track all AI decisions for learning/optimization
create table if not exists public.agent_actions_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  property_id uuid references public.properties(id) on delete cascade,
  action_type text not null, -- 'appeal_letter', 'risk_prediction', 'next_action', 'certificate'
  input_data jsonb,
  output_data jsonb,
  confidence_score numeric(5, 2), -- 0-100 confidence in recommendation
  user_feedback text, -- Did user accept/reject suggestion?
  execution_time_ms integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Neighborhood Intelligence - Aggregate enforcement patterns
create table if not exists public.neighborhood_intelligence (
  id uuid primary key default gen_random_uuid(),
  zip_code text not null,
  neighborhood_name text,
  enforcement_score numeric(5, 2), -- 0-100 how aggressive is enforcement
  violation_frequency text, -- 'high', 'medium', 'low'
  most_common_violations jsonb, -- Array of {type, count}
  seasonal_patterns jsonb, -- When violations spike
  avg_fine_amount numeric(10, 2),
  data_last_updated timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(zip_code)
);

-- Appeal Success Tracking - Learn which strategies work
create table if not exists public.appeal_outcomes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  property_id uuid references public.properties(id) on delete cascade not null,
  violation_id uuid references public.ordinances(id) on delete cascade not null,
  appeal_letter_hash text, -- Hash of generated letter for tracking
  appeal_filed_date date,
  outcome text, -- 'approved', 'rejected', 'pending', 'partial_approval'
  fine_reduction_amount numeric(10, 2),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Property Monitoring Preferences - Agent learns user preferences
create table if not exists public.monitoring_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  property_id uuid references public.properties(id) on delete cascade not null,
  auto_generate_appeals boolean default false, -- Autonomous appeal generation
  risk_tolerance text default 'medium', -- 'high', 'medium', 'low'
  notification_channels jsonb, -- {sms, email, push, slack}
  escalation_triggers jsonb, -- Custom thresholds for alerts
  ai_autonomy_level text default 'assisted', -- 'autonomous', 'assisted', 'manual'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, property_id)
);

-- Municipal Code Knowledge Base - Dynamic citation library
create table if not exists public.municipal_codes (
  id uuid primary key default gen_random_uuid(),
  code_section text not null unique, -- e.g., "SDMC 143.0101"
  title text not null,
  description text,
  full_text text,
  effective_date date,
  category text, -- 'str', 'noise', 'trash', 'parking', etc.
  appeal_strategies jsonb, -- Common successful appeal angles
  precedent_cases jsonb, -- Historical outcomes
  last_verified timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.agent_actions_log enable row level security;
alter table public.neighborhood_intelligence enable row level security;
alter table public.appeal_outcomes enable row level security;
alter table public.monitoring_preferences enable row level security;
alter table public.municipal_codes enable row level security;

-- RLS Policies for agent_actions_log
create policy "agent_actions_select_own" on public.agent_actions_log for select using (auth.uid() = user_id);
create policy "agent_actions_insert_own" on public.agent_actions_log for insert with check (auth.uid() = user_id);

-- RLS Policies for neighborhood_intelligence (public read)
create policy "neighborhood_intelligence_select_all" on public.neighborhood_intelligence for select using (true);
create policy "neighborhood_intelligence_insert_authenticated" on public.neighborhood_intelligence for insert with check (auth.role() = 'authenticated');
create policy "neighborhood_intelligence_update_authenticated" on public.neighborhood_intelligence for update using (auth.role() = 'authenticated');

-- RLS Policies for appeal_outcomes
create policy "appeal_outcomes_select_own" on public.appeal_outcomes for select using (auth.uid() = user_id);
create policy "appeal_outcomes_insert_own" on public.appeal_outcomes for insert with check (auth.uid() = user_id);
create policy "appeal_outcomes_update_own" on public.appeal_outcomes for update using (auth.uid() = user_id);

-- RLS Policies for monitoring_preferences
create policy "monitoring_preferences_select_own" on public.monitoring_preferences for select using (auth.uid() = user_id);
create policy "monitoring_preferences_insert_own" on public.monitoring_preferences for insert with check (auth.uid() = user_id);
create policy "monitoring_preferences_update_own" on public.monitoring_preferences for update using (auth.uid() = user_id);
create policy "monitoring_preferences_delete_own" on public.monitoring_preferences for delete using (auth.uid() = user_id);

-- RLS Policies for municipal_codes (public read)
create policy "municipal_codes_select_all" on public.municipal_codes for select using (true);
create policy "municipal_codes_insert_authenticated" on public.municipal_codes for insert with check (auth.role() = 'authenticated');
create policy "municipal_codes_update_authenticated" on public.municipal_codes for update using (auth.role() = 'authenticated');

-- Indexes for performance
create index if not exists agent_actions_log_user_id_idx on public.agent_actions_log(user_id);
create index if not exists agent_actions_log_created_at_idx on public.agent_actions_log(created_at desc);
create index if not exists neighborhood_intelligence_zip_code_idx on public.neighborhood_intelligence(zip_code);
create index if not exists appeal_outcomes_user_id_idx on public.appeal_outcomes(user_id);
create index if not exists appeal_outcomes_property_id_idx on public.appeal_outcomes(property_id);
create index if not exists monitoring_preferences_user_id_idx on public.monitoring_preferences(user_id);
create index if not exists municipal_codes_code_section_idx on public.municipal_codes(code_section);
create index if not exists municipal_codes_category_idx on public.municipal_codes(category);

-- Triggers for updated_at
drop trigger if exists monitoring_preferences_updated_at on public.monitoring_preferences;
create trigger monitoring_preferences_updated_at
  before update on public.monitoring_preferences
  for each row
  execute function public.handle_updated_at();

-- Function to auto-populate neighborhood intelligence
create or replace function public.update_neighborhood_intelligence()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.neighborhood_intelligence (
    zip_code,
    enforcement_score,
    violation_frequency,
    most_common_violations,
    avg_fine_amount,
    data_last_updated
  )
  select 
    p.zip_code,
    least(100, count(o.id)::numeric * 5) as enforcement_score,
    case 
      when count(o.id) > 10 then 'high'
      when count(o.id) > 5 then 'medium'
      else 'low'
    end as violation_frequency,
    jsonb_agg(distinct jsonb_build_object('type', o.violation_type, 'count', 1)) as most_common_violations,
    avg(o.fine_amount) as avg_fine_amount,
    now() as data_last_updated
  from public.properties p
  left join public.ordinances o on o.property_id = p.id
  where p.zip_code = new.zip_code
  and o.created_at >= now() - interval '90 days'
  group by p.zip_code
  on conflict (zip_code) do update set
    enforcement_score = excluded.enforcement_score,
    violation_frequency = excluded.violation_frequency,
    most_common_violations = excluded.most_common_violations,
    avg_fine_amount = excluded.avg_fine_amount,
    data_last_updated = excluded.data_last_updated;
  
  return new;
end;
$$;

-- Trigger to update neighborhood intelligence when ordinances change
drop trigger if exists ordinances_update_neighborhood on public.ordinances;
create trigger ordinances_update_neighborhood
  after insert or update on public.ordinances
  for each row
  execute function public.update_neighborhood_intelligence();
