# Ordinance.ai / DoggyBagg – Audit Report

**Date:** February 2025  
**Scope:** Full codebase audit, security, UX, and production readiness

---

## Summary of Fixes Applied

### 1. Auth & Session

| Issue | Fix |
|-------|-----|
| **Auth callback profile creation** | Pass existing Supabase client to `ensureUserProfile()` so it sees the session immediately after `exchangeCodeForSession` (avoids null user) |
| **Route protection** | Proxy redirects unauthenticated users from `/dashboard` and `/upload` to sign-in with `?redirect=` param |
| **Sign-in redirect** | Honors `redirect` query param (validated to prevent open redirects) |
| **Dashboard header** | Replaced hardcoded "John Doe" with real user; wired Sign Out; removed non-functional notification badge |

### 2. Security

| Issue | Fix |
|-------|-----|
| **Open redirect** | Sign-in only redirects to paths starting with `/` and rejects `//` |
| **Input validation** | `addProperty` validates address (≤500 chars), license_id (≤100 chars), stro_tier (1–4) |
| **CSV limits** | 10MB max file size; 500 max rows per import |
| **Checkout** | Explicit error when Stripe `client_secret` is null |

### 3. TypeScript & Build

| Issue | Fix |
|-------|-----|
| **ignoreBuildErrors** | Set to `false` in next.config.mjs |
| **agentic.ts** | Explicit type for `portfolioHealth` |
| **Stripe API** | Updated to `2026-01-28.clover` |
| **checkout.tsx** | Stripe action throws when `client_secret` is null |
| **dashboard-header** | Async/await pattern to satisfy strict types |

### 4. UX

| Issue | Fix |
|-------|-----|
| **Dashboard header** | User initials from metadata or email; real Sign Out; "Settings" → Dashboard link |
| **Protected routes** | Unauthenticated users redirected to sign-in instead of seeing errors |

---

## Files Modified

- `app/actions/profile.ts` – Optional `supabaseInstance` param
- `app/actions/properties.ts` – `validatePropertyInput()`, trim on insert
- `app/actions/agentic.ts` – `portfolioHealth` type
- `app/actions/stripe.ts` – Null check for `client_secret`
- `app/auth/callback/route.ts` – Pass supabase to `ensureUserProfile`
- `app/auth/sign-in/page.tsx` – Safe redirect handling
- `app/upload/page.tsx` – 10MB and 500-row limits
- `lib/supabase/proxy.ts` – Route protection for `/dashboard` and `/upload`
- `lib/stripe.ts` – Stripe API version
- `components/dashboard-header.tsx` – Auth state, sign out, user display
- `next.config.mjs` – `ignoreBuildErrors: false`

---

## Recommendations (Not Implemented)

1. **baseline-browser-mapping** – Run `pnpm add -D baseline-browser-mapping@latest` to silence the warning.
2. **Settings page** – Add a real settings route and link it from the header.
3. **Notifications** – Replace hardcoded bell icon with real alerts when available.
4. **Rate limiting** – Add rate limits for property creation and CSV import (e.g. Supabase Edge Functions or Upstash).

---

## Build Status

✅ `pnpm build` passes with TypeScript strict mode.
