// Ordinance.ai Product Catalog
// This is the source of truth for all products and pricing

export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  features: string[]
  searchCredits: number
  subscriptionTier: 'free' | 'starter' | 'professional' | 'enterprise'
}

export const PRODUCTS: Product[] = [
  {
    id: 'starter-plan',
    name: 'Starter',
    description: 'Perfect for individual property searches',
    priceInCents: 0, // Free
    searchCredits: 10,
    subscriptionTier: 'free',
    features: [
      '10 property searches',
      'Basic violation reports',
      'Email support',
      'Public data access',
    ],
  },
  {
    id: 'professional-plan',
    name: 'Professional',
    description: 'For real estate professionals and small teams',
    priceInCents: 4900, // $49.00/month
    searchCredits: 100,
    subscriptionTier: 'professional',
    features: [
      '100 property searches/month',
      'Advanced analytics',
      'PDF report exports',
      'Priority email support',
      'Historical violation data',
      'Bulk property searches',
    ],
  },
  {
    id: 'enterprise-plan',
    name: 'Enterprise',
    description: 'For large organizations and municipalities',
    priceInCents: 19900, // $199.00/month
    searchCredits: 1000,
    subscriptionTier: 'enterprise',
    features: [
      'Unlimited property searches',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      'White-label options',
      'Advanced reporting',
      '24/7 phone support',
      'Data export capabilities',
    ],
  },
]

// Helper function to get product by ID
export function getProductById(productId: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === productId)
}

// Helper function to format price for display
export function formatPrice(priceInCents: number): string {
  if (priceInCents === 0) return 'Free'
  const dollars = (priceInCents / 100).toFixed(2)
  return `$${dollars}`
}
