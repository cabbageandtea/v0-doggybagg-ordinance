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
    description: 'Perfect for single property owners',
    priceInCents: 2900, // $29.00/month
    searchCredits: 1,
    subscriptionTier: 'starter',
    features: [
      '1 property monitored',
      'Daily violation checks',
      'Email alerts',
      'Basic analytics',
      '7-day history',
    ],
  },
  {
    id: 'professional-plan',
    name: 'Professional',
    description: 'For serious real estate investors',
    priceInCents: 9900, // $99.00/month
    searchCredits: 10,
    subscriptionTier: 'professional',
    features: [
      'Up to 10 properties',
      'Real-time monitoring',
      'SMS + Email alerts',
      'Advanced analytics',
      '90-day history',
      'Priority support',
      'API access',
    ],
  },
  {
    id: 'enterprise-plan',
    name: 'Enterprise',
    description: 'Custom solutions for portfolios',
    priceInCents: 0, // Custom pricing
    searchCredits: 999999,
    subscriptionTier: 'enterprise',
    features: [
      'Unlimited properties',
      '24/7 monitoring',
      'Custom integrations',
      'Dedicated account manager',
      'Full history access',
      'Custom reporting',
      'White-label options',
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
