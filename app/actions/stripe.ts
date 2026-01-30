'use server'

import { stripe } from '@/lib/stripe'
import { PRODUCTS, getProductById } from '@/lib/products'
import { createClient } from '@/lib/supabase/server'

export async function startCheckoutSession(productId: string) {
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

  // Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    customer_email: user.email,
    line_items: [
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
    ],
    mode: product.priceInCents > 0 ? 'subscription' : 'payment',
    metadata: {
      userId: user.id,
      productId: product.id,
      subscriptionTier: product.subscriptionTier,
      searchCredits: product.searchCredits.toString(),
    },
  })

  // Log the transaction in the database
  const { error: insertError } = await supabase.from('payments').insert({
    user_id: user.id,
    stripe_session_id: session.id,
    amount_cents: product.priceInCents,
    status: 'pending',
    metadata: {
      product_id: product.id,
      product_name: product.name,
      subscription_tier: product.subscriptionTier,
      search_credits: product.searchCredits,
    },
  })

  if (insertError) {
    console.error('[v0] Failed to log payment transaction:', insertError)
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
