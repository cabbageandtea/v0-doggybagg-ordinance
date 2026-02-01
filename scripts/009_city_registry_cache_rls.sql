-- city_registry_cache RLS (run only if table exists and RLS is not yet enabled)
-- From Supabase list_tables: city_registry_cache has license_id, address, expiration_date, tot_number, last_sync_at
-- This table appears to be a cache for city registry lookups; restrict to service/authenticated as needed.

-- city_registry_cache RLS – run in Supabase SQL Editor only if table exists.
-- Check first: SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='city_registry_cache');

do $$
begin
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='city_registry_cache') then
    alter table public.city_registry_cache enable row level security;
  end if;
end $$;

-- Policy: Allow authenticated users to read (for property/license lookups)
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='city_registry_cache') then
    drop policy if exists "city_registry_cache_select_authenticated" on public.city_registry_cache;
    create policy "city_registry_cache_select_authenticated"
      on public.city_registry_cache
      for select
      to authenticated
      using (true);
  end if;
end $$;

-- No insert/update/delete for authenticated = only service role can write (bypasses RLS).
