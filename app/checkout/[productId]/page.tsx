import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/products'
import Checkout from '@/components/checkout'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params
  const product = getProductById(productId)

  if (!product) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/#pricing">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Pricing
            </Button>
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Complete Your Purchase
          </h1>
          <p className="text-muted-foreground">
            {product.name} - {product.description}
          </p>
        </div>

        <Suspense
          fallback={
            <div className="mx-auto w-full max-w-2xl space-y-4">
              <Skeleton className="h-96 w-full" />
            </div>
          }
        >
          <Checkout productId={productId} />
        </Suspense>
      </div>
    </main>
  )
}
