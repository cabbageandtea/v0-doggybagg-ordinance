# PostHog Telemetry Verification

Use this checklist to confirm events fire in production.

## Setup

1. Open PostHog → Your project → Live events (or Activity)
2. Open doggybagg.cc in an incognito tab
3. Perform each action below
4. Confirm the event appears in PostHog within ~10 seconds

## Events to Verify

| Event | Action | Where to Trigger |
|-------|--------|------------------|
| `cta_click` (cta: start_free) | Click "Start Free" in header | Landing page |
| `cta_click` (cta: see_your_risk) | Click "See your risk" | Hero section |
| `cta_click` (cta: portfolio_audit) | Click "Get My $499 Portfolio Audit" | Hero or pricing |
| `property_search` | Enter address, click Search | Calculator section |
| `calculator_used` | Select violation type | Fine Calculator |
| `signed_up` | Complete sign-up | /auth/sign-up |
| `signed_in` | Log in | /auth/sign-in |
| `add_property` | Add a property | Dashboard or upload |
| `checkout_started` | Start checkout | Pricing → plan button |
| `checkout_completed` | Complete payment | Server-side (Stripe webhook) |
| `consent_given` | Accept cookie banner | Cookie consent |
| `feedback_clicked` | Click feedback widget | Floating feedback |

## Identity Bridge

When logged in, `posthog.identify(userId)` is called via `PostHogIdentifyBridge`. Events from authenticated users should show `distinct_id` = Supabase user UUID.

## Troubleshooting

- **No events:** Check `NEXT_PUBLIC_POSTHOG_KEY` is set in Vercel
- **Events but no identity:** Verify `PostHogIdentifyBridge` is in layout and user is logged in
- **Ad blockers:** May block PostHog; test in incognito without extensions
