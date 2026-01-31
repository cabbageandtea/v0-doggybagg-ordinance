-- Auto-create user profile when a new user signs up
-- This trigger ensures every new user gets a profile with default settings.
--
-- IMPORTANT: Run this script in Supabase Dashboard → SQL Editor (as the project
-- owner / postgres) so the function runs with privileges that can insert into
-- public.profiles. If the trigger was created by a role that is subject to RLS,
-- you get "Database error saving new user" on sign-up. If that happens, either
-- re-run this script as postgres, or run 003_drop_profile_trigger_use_app_fallback.sql
-- and rely on the app to create profiles (callback + sign-up page).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, subscription_tier, search_credits)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    'free',
    10  -- Free tier gets 10 search credits
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
