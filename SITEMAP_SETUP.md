# Sitemap Setup — doggybagg.cc

## How It Works

- **Generator:** Next.js App Router `app/sitemap.ts` (no next-sitemap or /public file)
- **URL:** `https://doggybagg.cc/sitemap.xml`
- **Build:** Prerendered at build time (static)

## Routes Included

| Route | Status |
|-------|--------|
| `/` | ✓ |
| `/privacy` | ✓ |
| `/help` | ✓ |
| `/checkout/starter-plan` | ✓ |
| `/checkout/professional-plan` | ✓ |
| `/about`, `/blog`, `/docs`, `/terms`, `/careers`, `/status` | ✓ |
| `/auth/sign-in`, `/auth/sign-up` | ✓ |
| `/learn/str-compliance-san-diego` | ✓ |

## "Couldn't Fetch" Fix

If Google Search Console reports "Couldn't fetch" for sitemap.xml:

1. **Proxy exclusion:** `sitemap.xml` and `robots.txt` are excluded from the proxy matcher so they bypass auth/CSP and are served directly.

2. **Force fresh fetch:** In GSC, try resubmitting `https://doggybagg.cc/sitemap.xml` after deploying. GSC caches failed fetches; a redeploy + resubmit can clear it.

3. **Verify live:** Open `https://doggybagg.cc/sitemap.xml` in a browser or `curl` to confirm it returns valid XML.
