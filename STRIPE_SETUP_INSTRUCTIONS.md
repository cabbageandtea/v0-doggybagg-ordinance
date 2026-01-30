# Stripe Product Setup Instructions

## Overview
You need to create 2 subscription products in your Stripe account to match the pricing tiers in the app. The $499 Portfolio Audit already exists as a one-time payment link.

## Products to Create

### 1. Starter Plan - $29/month

**Product Details:**
- **Name**: Starter Plan
- **Description**: Perfect for single property owners. 1 property monitored with daily violation checks and email alerts.

**Price Details:**
- **Amount**: $29.00
- **Billing**: Recurring monthly
- **Currency**: USD

**Steps in Stripe Dashboard:**
1. Go to Products → Create Product
2. Name: "Starter Plan"
3. Description: "Perfect for single property owners"
4. Add pricing: $29/month recurring
5. Save product
6. Copy the Price ID (starts with price_...)

### 2. Professional Plan - $99/month

**Product Details:**
- **Name**: Professional Plan
- **Description**: For serious real estate investors. Up to 10 properties with real-time monitoring and SMS alerts.

**Price Details:**
- **Amount**: $99.00
- **Billing**: Recurring monthly
- **Currency**: USD

**Steps in Stripe Dashboard:**
1. Go to Products → Create Product
2. Name: "Professional Plan"
3. Description: "For serious real estate investors"
4. Add pricing: $99/month recurring
5. Save product
6. Copy the Price ID (starts with price_...)

## After Creating Products

Once you've created both products in Stripe, you'll need to update the checkout code to use the actual Stripe Price IDs.

### Update Required Files:

**File: `/app/actions/stripe.ts`**

Replace the product lookup logic with actual Stripe Price IDs:

```typescript
// Map product IDs to Stripe Price IDs
const STRIPE_PRICE_IDS: Record<string, string> = {
  'starter-plan': 'price_YOUR_STARTER_PRICE_ID_HERE',
  'professional-plan': 'price_YOUR_PROFESSIONAL_PRICE_ID_HERE',
}
```

Then in the `startCheckoutSession` function, use:

```typescript
const stripePriceId = STRIPE_PRICE_IDS[productId]

if (!stripePriceId) {
  throw new Error('Invalid product ID')
}

const session = await stripe.checkout.sessions.create({
  line_items: [
    {
      price: stripePriceId,
      quantity: 1,
    },
  ],
  mode: 'subscription',
  success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/#pricing`,
  customer_email: user.email,
})
```

## Quick Command (if using Stripe CLI)

```bash
# Create Starter Plan
stripe products create \
  --name="Starter Plan" \
  --description="Perfect for single property owners"

# Get the product ID from above, then create price
stripe prices create \
  --product=YOUR_PRODUCT_ID \
  --unit-amount=2900 \
  --currency=usd \
  --recurring[interval]=month

# Create Professional Plan
stripe products create \
  --name="Professional Plan" \
  --description="For serious real estate investors"

# Get the product ID from above, then create price
stripe prices create \
  --product=YOUR_PRODUCT_ID \
  --unit-amount=9900 \
  --currency=usd \
  --recurring[interval]=month
```

## Verification

After setup, test each pricing tier:
1. Click "Start Free Trial" button → Should open Starter checkout
2. Click "Get Started" button → Should open Professional checkout
3. Click "$499 Portfolio Audit" button → Should open existing payment link
4. Complete a test purchase in Stripe test mode

## Environment Variables Required

Ensure these are set in your Vercel project:
- `STRIPE_SECRET_KEY` - Your Stripe secret key (already set)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key (already set)
- `NEXT_PUBLIC_SITE_URL` - Your production domain (e.g., https://doggybagg.cc)
