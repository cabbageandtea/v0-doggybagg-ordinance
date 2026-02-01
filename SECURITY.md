# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

**Do not** open public issues for security vulnerabilities.

Email **hello@doggybagg.cc** with subject line `[SECURITY]` and include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We aim to acknowledge within 48 hours and provide an initial assessment within 7 days.

---

## Security Practices (SOC 2 Alignment)

### Access Control
- Authentication via Supabase Auth (email/password)
- Row Level Security (RLS) on all user data tables:
  - `profiles`, `properties`, `payment_transactions`: users can only access own rows
  - `user_onboarding`, `compliance_health_checks`, `onboarding_actions`: users can view/update own
  - `stripe_webhook_events`: RLS enabled, no policies (service role only)
  - `city_registry_cache`: RLS enabled; authenticated read; writes via service role (see `scripts/009_city_registry_cache_rls.sql`)
- Route protection (`lib/supabase/proxy.ts`): `/dashboard`, `/upload`, `/checkout` require auth; unauthenticated users redirected to sign-in
- Service role key used only server-side for webhooks; never exposed to client

### Data Protection
- Secrets stored in environment variables (Vercel, Supabase)
- No `NEXT_PUBLIC_*` prefix for sensitive keys
- Stripe webhook signature verification; idempotency to prevent replay

### Incident Response
- Logging for auth failures, webhook errors, and critical actions
- Vercel deployment logs and Supabase logs available for audit

### Change Management
- All changes via Git; deployments through Vercel
- See GOVERNANCE.md for release and freeze procedures
