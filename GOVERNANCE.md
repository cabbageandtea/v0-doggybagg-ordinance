# Governance

## Release Process

1. **Feature Freeze** – See LAUNCH_10DAY_CHOREOGRAPHY.md for pre-launch freeze checklist
2. **Branch Strategy** – `main` is production; feature branches merge via PR
3. **Deployments** – Automatic on push to `main` via Vercel

## Procurement-Ready Checklist

- [x] SECURITY.md – Vulnerability reporting
- [x] GOVERNANCE.md – Release and change management
- [x] CHANGELOG.md – Version history
- [x] Row Level Security on user data
- [x] No secrets in client bundle
- [ ] SOC 2 Type I/II (as applicable for your compliance requirements)

## Dependencies

- See `package.json` for current versions
- Lockfile: `pnpm-lock.yaml` (pnpm)
- No `npm audit` critical/high unresolved before launch
