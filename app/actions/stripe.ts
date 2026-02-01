'use server'

import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { getProductById } from '@/lib/products'
import { createClient } from '@/lib/supabase/server'

// Live Stripe Price IDs – set in .env.local and Vercel. See DEPLOY.md.
const STRIPE_PRICE_IDS: Record<string, string> = {
  'starter-plan': process.env.STRIPE_STARTER_PRICE_ID || 'REPLACE_WITH_STARTER_PRICE_ID',
  'professional-plan': process.env.STRIPE_PROFESSIONAL_PRICE_ID || 'REPLACE_WITH_PROFESSIONAL_PRICE_ID',
}

export async function startCheckoutSession(productId: string): Promise<string> {
  const product = getProductById(productId)
  
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  // Get the current user
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated to purchase')
  }

  // Get Stripe Price ID for this product
  const stripePriceId = STRIPE_PRICE_IDS[productId]

  // If no Stripe Price ID is configured, use dynamic pricing (for development)
  const sessionConfig: Stripe.Checkout.SessionCreateParams = {
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    customer_email: user.email,
    mode: product.priceInCents > 0 ? 'subscription' : 'payment',
    metadata: {
      userId: user.id,
      productId: product.id,
      subscriptionTier: product.subscriptionTier,
      searchCredits: product.searchCredits.toString(),
    },
  }

  // Use actual Stripe Price ID if configured, otherwise use dynamic pricing
  if (stripePriceId && !stripePriceId.includes('REPLACE_WITH')) {
    sessionConfig.line_items = [
      {
        price: stripePriceId,
        quantity: 1,
      },
    ]
  } else {
    // Fallback to dynamic pricing when Price IDs not configured
    sessionConfig.line_items = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
          recurring: product.priceInCents > 0 ? { interval: 'month' } : undefined,
        },
        quantity: 1,
      },
    ]
  }

  // Create Checkout Session
  const session = await stripe.checkout.sessions.create(sessionConfig)

  // Log the transaction in the database (payment_transactions table)
  const { error: insertError } = await supabase.from('payment_transactions').insert({
    user_id: user.id,
    stripe_session_id: session.id,
    amount: product.priceInCents / 100,
    status: 'pending',
    product_id: product.id,
    metadata: {
      product_name: product.name,
      subscription_tier: product.subscriptionTier,
      search_credits: product.searchCredits,
    },
  })

  if (insertError) {
    console.error('[v0] Failed to log payment transaction:', insertError)
  }

  if (!session.client_secret) {
    throw new Error('Failed to create checkout session')
  }
  return session.client_secret
}

export async function getPaymentStatus(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return {
    status: session.status,
    paymentStatus: session.payment_status,
  }
}
