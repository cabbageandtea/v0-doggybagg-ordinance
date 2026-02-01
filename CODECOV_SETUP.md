# Codecov setup

To enable Codecov uploads for this repository and get PR coverage reports and the badge in `README.md`:

1. Create an account at https://codecov.io and add your GitHub repository (or use the GitHub integration).
2. In the Codecov project settings, get the **Repository Upload Token** (for private repos this is required).
3. In your GitHub repo, go to Settings → Secrets → Actions and add a new secret named `CODECOV_TOKEN` with the token value.
4. Codecov uploads are already configured in `.github/workflows/ci.yml`. When the CI runs, coverage will be uploaded automatically and the Codecov Action will add a report to the PR when a token is present.

Notes:
- For public repositories, Codecov uploads often work without a token, but adding a token is recommended.
- If you want comments on PRs or additional configuration, you can configure it in your Codecov repository settings or adjust `.codecov.yml`.
