# Playwright E2E setup

To run the authenticated E2E tests you need a test user and several secrets set in GitHub Actions or locally.

1. Create a test user in your Supabase project or use a fixture: email + password.
2. Add the following repository secrets in GitHub (Settings → Secrets → Actions):
   - `PW_TEST_EMAIL` - test user email
   - `PW_TEST_PASSWORD` - test user password
   - `PW_BASE_URL` - optional base URL if you want Playwright to hit a deployed environment (defaults to http://localhost:3000)
   - `SUPABASE_SERVICE_ROLE_KEY` - **service role** key for your Supabase project (used to programmatically create/delete the test user in CI)
3. The CI `e2e` job already runs on PRs and main. To enable auth tests, ensure the secrets are available to Actions. The workflow will create a test user from the `SUPABASE_SERVICE_ROLE_KEY` and `PW_TEST_EMAIL`/`PW_TEST_PASSWORD` before running E2E and will attempt to delete that user afterwards.

Local helper scripts:
- `node scripts/create_test_user.js` — creates the test user and writes `.test_user.json` (reads `SUPABASE_SERVICE_ROLE_KEY`, `PW_TEST_EMAIL`, `PW_TEST_PASSWORD` env vars).
- `node scripts/delete_test_user.js` — deletes the test user recorded in `.test_user.json` (reads `SUPABASE_SERVICE_ROLE_KEY`).

Run locally (example):

```bash
SUPABASE_URL=https://your.supabase.url SUPABASE_SERVICE_ROLE_KEY=service_role_key PW_TEST_EMAIL=you@example.com PW_TEST_PASSWORD=pass node scripts/create_test_user.js
pnpm run e2e:ci
node scripts/delete_test_user.js
```

Local run:

```bash
PW_TEST_EMAIL=you@example.com PW_TEST_PASSWORD=pass pnpm -s e2e:ci
```

Notes:
- Consider creating a dedicated test user in Supabase and resetting its state between runs to keep tests deterministic.
- If you prefer not to hit the real backend, we can wire MSW or stub network responses within Playwright tests.
