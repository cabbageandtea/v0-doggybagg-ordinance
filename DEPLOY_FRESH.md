# Force Fresh Deploy (Remove Cached "Book a Portfolio Strategy Call")

The "Book a Portfolio Strategy Call" button was removed from the codebase. If production still shows it, Vercel is serving a cached build.

## Fix: Redeploy with Cache Clear

1. Go to **Vercel Dashboard** → Your project (doggybagg.cc)
2. Open **Deployments**
3. Click the **⋯** menu on the latest deployment
4. Select **Redeploy**
5. Check **"Clear build cache"** (if shown)
6. Click **Redeploy**

Or trigger a new deployment by pushing any commit to `main`—the latest code has the button fully removed.

## Verify

After deploy completes, open https://doggybagg.cc in incognito. You should see only:
- "See your risk" (outline button)
- "Get My $499 Portfolio Audit" (primary button)

No "Book a Portfolio Strategy Call" anywhere.
