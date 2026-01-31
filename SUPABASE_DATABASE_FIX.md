# Database Error Fix – "Database error saving new user"

If sign-up fails with **"Database error saving new user"**, a legacy trigger on `auth.users` is conflicting with profile creation. Run this in Supabase to fix it.

---

## Fix (2 minutes)

1. Open **Supabase Dashboard** → your project → **SQL Editor**
2. Paste and run:

```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
```

3. Confirm: **"Success. No rows returned"**

---

## What This Does

- **Removes** the old trigger that was failing (often due to RLS on `public.profiles`)
- **Profiles are now created by the app** via `ensureUserProfile()` in:
  - `app/auth/callback/route.ts` (after email confirmation)
  - `app/auth/sign-up/page.tsx` (when session is returned immediately)

---

## After Running

Sign-up will succeed. New users get a profile automatically when they receive a session.
