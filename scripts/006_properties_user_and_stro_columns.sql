-- Add user_id and STR/risk columns to properties for dashboard compatibility
-- Required for app/actions/properties.ts and dashboard. Run after 001.

-- Add user_id (required for per-user property lists)
alter table public.properties
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Allow address-only inserts (properties.ts omits city/state/zip)
alter table public.properties alter column city drop not null;
alter table public.properties alter column state drop not null;
alter table public.properties alter column zip_code drop not null;
alter table public.properties alter column city set default '';
alter table public.properties alter column state set default '';
alter table public.properties alter column zip_code set default '';

-- Add STR/compliance columns
alter table public.properties
  add column if not exists stro_tier integer default 0,
  add column if not exists license_id text default '',
  add column if not exists reporting_status text default 'pending',
  add column if not exists risk_score integer default 0,
  add column if not exists last_checked timestamptz default now();

-- Backfill user_id: if properties exist without user_id, leave null (orphaned)
-- New inserts from properties.ts will include user_id

-- RLS: users see only their own properties
drop policy if exists "properties_select_all" on public.properties;
drop policy if exists "properties_insert_authenticated" on public.properties;
drop policy if exists "properties_update_authenticated" on public.properties;

create policy "properties_select_own" on public.properties for select using (auth.uid() = user_id);
create policy "properties_insert_own" on public.properties for insert with check (auth.uid() = user_id);
create policy "properties_update_own" on public.properties for update using (auth.uid() = user_id);
create policy "properties_delete_own" on public.properties for delete using (auth.uid() = user_id);

-- Allow properties without user_id to be readable during migration (optional)
create policy "properties_select_null_user" on public.properties for select using (user_id is null);
