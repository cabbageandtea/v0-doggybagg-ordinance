# Supabase Setup – Ordinance.ai

Configure Supabase for doggybagg.cc auth and database.

---

## 1. Get Your Credentials

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and open your project
2. **Settings** → **API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 2. Add to Environment

**Local (.env.local):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Vercel (Production):**  
Project → **Settings** → **Environment Variables** → add the same two for **Production**

---

## 3. Auth Redirect URLs

In Supabase: **Authentication** → **URL Configuration**

| Setting | Value |
|---------|-------|
| **Site URL** | `https://doggybagg.cc` |
| **Redirect URLs** | Add: `https://doggybagg.cc/auth/callback` |

For local dev, add: `http://localhost:3000/auth/callback`

---

## 4. Fix "Database error saving new user"

Run in **SQL Editor**:

```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
```

See [SUPABASE_DATABASE_FIX.md](./SUPABASE_DATABASE_FIX.md) for details.

---

## 5. Database Schema

Run these in order (SQL Editor):

1. `scripts/001_create_properties_schema.sql` – tables and RLS
2. `scripts/003_drop_profile_trigger_use_app_fallback.sql` – remove legacy trigger

Profiles are created by the app via `ensureUserProfile()` in auth callback and sign-up.
