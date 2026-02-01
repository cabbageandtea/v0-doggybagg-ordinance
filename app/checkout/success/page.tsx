import { Suspense } from 'react'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckoutSuccessTracker } from './checkout-success-tracker'

export default function CheckoutSuccessPage() {
  return (
    <>
      <Suspense fallback={null}>
        <CheckoutSuccessTracker />
      </Suspense>
      <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
          </div>

          <h1 className="mb-4 text-3xl font-bold text-foreground">
            Payment Successful!
          </h1>
          
          <p className="mb-8 text-muted-foreground">
            Thank you for your purchase. You'll receive a confirmation email shortly
            with your receipt and subscription details.
          </p>

          <div className="space-y-3">
            <Link href="/dashboard">
              <Button size="lg" className="w-full gap-2 bg-primary hover:bg-primary/90">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full bg-transparent">
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="mt-8 rounded-lg border border-border bg-secondary/50 p-4">
            <p className="text-sm text-muted-foreground">
              Need help? Contact us at{' '}
              <a
                href="mailto:support@doggybagg.cc"
                className="text-primary hover:underline"
              >
                support@doggybagg.cc
              </a>
            </p>
          </div>
        </div>
      </div>
      </main>
    </>
  )
}
