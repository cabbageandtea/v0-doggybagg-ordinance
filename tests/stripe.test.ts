import { describe, it, expect, vi } from 'vitest'
import { startCheckoutSession } from '@/app/actions/stripe'

// Mock Stripe
vi.mock('@/lib/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: async (cfg: any) => ({ id: 'sess_123', client_secret: 'cs_test_123' }),
        retrieve: async (id: string) => ({ id, status: 'complete', payment_status: 'paid' }),
      },
    },
  },
}))

// Mock supabase createClient
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: async () => ({ data: { user: { id: 'u1', email: 'user@example.com' } } }) },
    from: (table: string) => ({ insert: async (data: any) => ({ error: null }) }),
  })),
}))

describe('stripe actions', () => {
  it('startCheckoutSession returns client secret for valid product', async () => {
    const secret = await startCheckoutSession('starter-plan')
    expect(secret).toBe('cs_test_123')
  })

  it('startCheckoutSession throws for invalid product id', async () => {
    await expect(startCheckoutSession('not-found')).rejects.toThrow()
  })
})
