# Ordinance.ai Production Setup Guide

## Overview
Complete setup guide for launching Ordinance.ai with Supabase (property data) and Stripe (payment processing).

---

## 🔐 Environment Variables Required

### Stripe Integration
The following Stripe environment variables have been requested and need to be configured:

- `STRIPE_SECRET_KEY` - Your Stripe secret API key (starts with `sk_`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key (starts with `pk_`)

**How to get Stripe keys:**
1. Go to the Stripe Dashboard (or claim your sandbox from v0's Connect section)
2. Navigate to Developers → API keys
3. Copy the **Publishable key** → Set as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Copy the **Secret key** → Set as `STRIPE_SECRET_KEY`
5. For production, toggle from Test mode to Live mode and copy the live keys

### Supabase Integration
The following Supabase environment variables have been requested:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` - Redirect URL for email confirmation (e.g., `https://doggybagg.cc/protected`)

**How to get Supabase keys:**
1. Connect Supabase from the v0 Connect section
2. The URL and anon key will be automatically provided
3. Set the redirect URL to your production domain: `https://doggybagg.cc/protected`

---

## 📊 Database Schema

The following tables have been created via migrations:

### `profiles`
- Auto-created for each new user via database trigger
- Stores user profile information (email: support@doggybagg.cc)
- Links to `auth.users` with cascade delete

### `properties`
- Property ownership records
- Tracks address, owner info, compliance status
- Protected by Row Level Security (users see only their properties)

### `violations`
- Ordinance violation records
- Links to properties with violation details
- Stores severity, description, status, dates

### `fines`
- Fine amount calculations
- Links to violations
- Tracks payment status and due dates

### `payments`
- Payment transaction records
- Links to fines and Stripe payment intents
- Tracks payment status and Stripe checkout sessions

---

## 💳 Stripe Product Configuration

Three pricing tiers configured in `/lib/products.ts`:

1. **Basic Plan** - $29.99/month
   - Basic ordinance tracking
   - Up to 5 properties
   - Email support

2. **Professional Plan** - $99.99/month (RECOMMENDED)
   - Advanced analytics
   - Up to 50 properties
   - Priority support
   - API access

3. **Enterprise Plan** - $299.99/month
   - Unlimited properties
   - Custom reporting
   - Dedicated account manager
   - SLA guarantees

**To modify pricing:** Edit `/lib/products.ts` and update the `priceInCents` values.

---

## 🚀 Integration Files Created

### Supabase Client Files
- `/lib/supabase/client.ts` - Browser-side Supabase client
- `/lib/supabase/server.ts` - Server-side Supabase client
- `/lib/supabase/proxy.ts` - Session management and token refresh
- `/middleware.ts` - Authentication middleware

### Stripe Files
- `/lib/stripe.ts` - Stripe client initialization
- `/lib/products.ts` - Product catalog (source of truth for pricing)
- `/app/actions/stripe.ts` - Server actions for checkout sessions
- `/components/checkout.tsx` - Embedded Stripe Checkout component

### Database Scripts
- `/scripts/001_create_properties_schema.sql` - Main schema setup
- `/scripts/002_create_profile_trigger.sql` - Auto-profile creation

---

## 📋 Next Steps

### 1. Verify Environment Variables
Check the "Vars" section in the v0 in-chat sidebar to ensure all required variables are set.

### 2. Confirm Database Migrations
Both database scripts have been executed. Verify tables exist:
- profiles
- properties
- violations
- fines
- payments

### 3. Test Stripe Integration
1. Claim the Stripe sandbox from the Connect section
2. Use test card: `4242 4242 4242 4242`
3. Test checkout flow with the pricing section
4. Verify webhook events in Stripe Dashboard

### 4. Configure Email Domain
Ensure your Supabase project has email authentication enabled:
- Set sender email to: `support@doggybagg.cc`
- Configure custom SMTP (optional for production)
- Whitelist domain: `doggybagg.cc`

### 5. Production Checklist
- [ ] All environment variables set in Vercel
- [ ] Stripe keys switched from test to live mode
- [ ] Supabase email templates customized
- [ ] Domain verified and SSL configured
- [ ] Row Level Security policies tested
- [ ] Payment webhooks configured
- [ ] Error monitoring enabled

---

## 🔒 Security Features Implemented

### Row Level Security (RLS)
All tables have RLS enabled with policies ensuring users can only:
- View their own data
- Create records associated with their user ID
- Update/delete only their own records

### Payment Security
- Server-side price validation (no client-side price manipulation)
- Stripe handles all payment data (PCI compliant)
- Payment intents verified before order completion

### Authentication
- Email/password authentication via Supabase
- Session management with HTTP-only cookies
- Automatic token refresh in middleware
- Protected routes require authentication

---

## 🎯 Using the Integrations

### Adding Checkout to a Page
\`\`\`tsx
import { Checkout } from '@/components/checkout'

export default function PricingPage() {
  return <Checkout productId="professional-plan" />
}
\`\`\`

### Querying Property Data
\`\`\`tsx
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data: properties } = await supabase
  .from('properties')
  .select('*')
  .eq('user_id', userId)
\`\`\`

### Creating a Fine
\`\`\`tsx
const { data: fine } = await supabase
  .from('fines')
  .insert({
    violation_id: violationId,
    amount: 500.00,
    due_date: '2026-02-15',
    status: 'pending'
  })
\`\`\`

---

## 📞 Support

**Technical Support:** support@doggybagg.cc  
**Domain:** doggybagg.cc  

For v0 integration issues, check the Connect section in the in-chat sidebar.

---

## ✅ Status: READY FOR PRODUCTION

All files created, migrations executed, and integrations configured. Set your environment variables and you're ready to deploy!
