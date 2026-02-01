'use client'

import { useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { startCheckoutSession } from '@/app/actions/stripe'
import { trackCheckoutStarted } from '@/lib/analytics'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
)

interface CheckoutProps {
  productId: string
}

export default function Checkout({ productId }: CheckoutProps) {
  const router = useRouter()
  const hasTrackedStarted = useRef(false)

  const startCheckoutSessionForProduct = useCallback(async () => {
    if (!hasTrackedStarted.current) {
      hasTrackedStarted.current = true
      trackCheckoutStarted({ productId })
    }
    return startCheckoutSession(productId)
  }, [productId])

  const handleComplete = useCallback(() => {
    router.push('/checkout/success')
  }, [router])

  return (
    <div id="checkout" className="w-full max-w-2xl mx-auto">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret: startCheckoutSessionForProduct,
          onComplete: handleComplete,
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
