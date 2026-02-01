-- DoggyBagg Property Data Schema
-- Creates tables for storing property information, ordinance violations, and user searches

-- Properties table - stores basic property information
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  address text not null,
  city text not null,
  state text not null,
  zip_code text not null,
  county text,
  parcel_id text,
  property_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ordinances table - stores ordinance violation data for properties
create table if not exists public.ordinances (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete cascade not null,
  violation_type text not null,
  violation_date date,
  description text,
  fine_amount numeric(10, 2),
  status text default 'active',
  resolution_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User searches table - tracks user property searches
create table if not exists public.user_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  search_query text not null,
  search_results jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User profiles table - extended user information
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  company_name text,
  subscription_tier text default 'free',
  search_credits integer default 10,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Payment transactions table - tracks Stripe payments
create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  amount numeric(10, 2) not null,
  currency text default 'usd',
  status text not null,
  product_id text not null,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security on all tables
alter table public.properties enable row level security;
alter table public.ordinances enable row level security;
alter table public.user_searches enable row level security;
alter table public.profiles enable row level security;
alter table public.payment_transactions enable row level security;

-- RLS Policies for properties (public read, admin write)
create policy "properties_select_all" on public.properties for select using (true);
create policy "properties_insert_authenticated" on public.properties for insert with check (auth.role() = 'authenticated');
create policy "properties_update_authenticated" on public.properties for update using (auth.role() = 'authenticated');

-- RLS Policies for ordinances (public read)
create policy "ordinances_select_all" on public.ordinances for select using (true);
create policy "ordinances_insert_authenticated" on public.ordinances for insert with check (auth.role() = 'authenticated');
create policy "ordinances_update_authenticated" on public.ordinances for update using (auth.role() = 'authenticated');

-- RLS Policies for user_searches (users can only see their own)
create policy "user_searches_select_own" on public.user_searches for select using (auth.uid() = user_id);
create policy "user_searches_insert_own" on public.user_searches for insert with check (auth.uid() = user_id);
create policy "user_searches_delete_own" on public.user_searches for delete using (auth.uid() = user_id);

-- RLS Policies for profiles (users can only manage their own)
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- RLS Policies for payment_transactions (users can only see their own)
create policy "payment_transactions_select_own" on public.payment_transactions for select using (auth.uid() = user_id);
create policy "payment_transactions_insert_own" on public.payment_transactions for insert with check (auth.uid() = user_id);

-- Create indexes for better query performance
create index if not exists properties_address_idx on public.properties(address);
create index if not exists properties_city_idx on public.properties(city);
create index if not exists properties_zip_code_idx on public.properties(zip_code);
create index if not exists ordinances_property_id_idx on public.ordinances(property_id);
create index if not exists ordinances_status_idx on public.ordinances(status);
create index if not exists user_searches_user_id_idx on public.user_searches(user_id);
create index if not exists payment_transactions_user_id_idx on public.payment_transactions(user_id);
create index if not exists payment_transactions_stripe_session_id_idx on public.payment_transactions(stripe_session_id);

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Triggers to automatically update updated_at
drop trigger if exists properties_updated_at on public.properties;
create trigger properties_updated_at
  before update on public.properties
  for each row
  execute function public.handle_updated_at();

drop trigger if exists ordinances_updated_at on public.ordinances;
create trigger ordinances_updated_at
  before update on public.ordinances
  for each row
  execute function public.handle_updated_at();

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

drop trigger if exists payment_transactions_updated_at on public.payment_transactions;
create trigger payment_transactions_updated_at
  before update on public.payment_transactions
  for each row
  execute function public.handle_updated_at();
