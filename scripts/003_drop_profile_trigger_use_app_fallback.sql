-- Optional: Drop the auth.users trigger to fix "Database error saving new user"
-- when the trigger fails (e.g. RLS blocks the SECURITY DEFINER insert).
--
-- After running this:
-- - Sign-up will succeed (no trigger runs, so no DB error).
-- - Profiles are created by the app: auth callback and sign-up page call
--   ensureUserProfile() so the profile is created when the user gets a session.
--
-- Run in Supabase Dashboard → SQL Editor.

drop trigger if exists on_auth_user_created on auth.users;

-- Optional: keep the function for reference or drop it
-- drop function if exists public.handle_new_user();
