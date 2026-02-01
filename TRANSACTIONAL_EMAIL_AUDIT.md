# Day 4: Transactional Email & Alert Hardening

## 1. Transactional Email Audit

### Templates Implemented (Resend + lib/emails.ts)

| Template | Trigger | reply-to |
|----------|---------|----------|
| **Welcome** | First auth callback (after email verification) | support@doggybagg.cc |
| **Receipt** | Stripe `checkout.session.completed` | support@doggybagg.cc |
| **Payment Failed** | Stripe `invoice.payment_failed` | support@doggybagg.cc |
| **Compliance Violation** | Property `reporting_status` → `violation` (via `updateProperty`) | support@doggybagg.cc |

All emails use `support@doggybagg.cc` as reply-to.

### Branding (Email Headers)

- **Logo**: `{SITE_URL}/images/darkdoggylogo.jpg` (circular, 80×80)
- **Tagline**: "Take it with you"

### Setup Required

1. **Resend**: Add `RESEND_API_KEY` and `EMAIL_FROM` (e.g. `DoggyBagg <notifications@doggybagg.cc>`) to Vercel.
2. **Domain**: Verify `doggybagg.cc` in Resend Dashboard for production delivery.
3. **Migration**: Run `scripts/011_notification_preferences.sql` (adds `email_notifications`, `welcome_email_sent_at` to profiles).

---

## 2. Compliance Notification Logic

### Flow

1. When `updateProperty` sets `reporting_status` to `violation`, `sendEmailNotification` is called.
2. `sendEmailNotification` checks `profiles.email_notifications`; if `false`, no email is sent.
3. Default: `email_notifications = true` (opt-in behavior for existing users).

### Integration Points

- **App**: `app/actions/properties.ts` → `updateProperty` (when `reporting_status` changes to `violation`)
- **External sync**: If a cron/Edge Function updates properties directly, add a call to `sendEmailNotification` or a DB trigger.

### Preferences Schema (011)

```sql
email_notifications boolean default true
welcome_email_sent_at timestamptz
```

---

## 3. Stripe Payment Failed Email

- **Event**: `invoice.payment_failed`
- **Handler**: Fetches customer email (from `invoice.customer_email` or `stripe.customers.retrieve`)
- **Action**: Sends branded "Payment issue" email with link to dashboard

**Note**: Add `invoice.payment_failed` to Stripe Webhook events in Dashboard if not already subscribed.

---

## 4. Branding Check

| Item | Location |
|------|----------|
| 3D DoggyBagg logo | `public/images/darkdoggylogo.jpg` (used in email header) |
| Tagline | "Take it with you" in `lib/emails.ts` `emailHeader()` |

---

## Files Touched

| File | Change |
|------|--------|
| `lib/emails.ts` | New – Resend client, templates, reply-to |
| `app/auth/callback/route.ts` | Welcome email on first verification |
| `app/api/webhooks/stripe/route.ts` | Receipt on checkout, Payment Failed on `invoice.payment_failed` |
| `app/actions/notifications.ts` | `sendEmailNotification` (respects preferences) |
| `app/actions/properties.ts` | Trigger notification when `reporting_status` → violation |
| `scripts/011_notification_preferences.sql` | `email_notifications`, `welcome_email_sent_at` |
| `.env.example` | `RESEND_API_KEY`, `EMAIL_FROM` |
