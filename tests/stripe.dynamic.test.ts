import { describe, it, expect, vi, beforeEach } from 'vitest'

// We'll reset modules and set env before importing
describe('stripe dynamic vs price id branch', () => {
  it('uses configured price id when available', async () => {
    vi.resetModules()
    process.env.STRIPE_STARTER_PRICE_ID = 'price_ABC123'

    // Mock stripe to capture create call
    const createMock = vi.fn(async (cfg: any) => ({ id: 'sess_x', client_secret: 'cs_x' }))
    vi.doMock('@/lib/stripe', () => ({ stripe: { checkout: { sessions: { create: createMock } } } }))

    // Mock supabase to return a user
    vi.doMock('@/lib/supabase/server', () => ({ createClient: vi.fn(async () => ({ auth: { getUser: async () => ({ data: { user: { id: 'u1', email: 'u@example.com' } } }) }, from: () => ({ insert: async () => ({ error: null }) }) })), }))

    const { startCheckoutSession } = await import('@/app/actions/stripe')
    const secret = await startCheckoutSession('starter-plan')
    expect(secret).toBe('cs_x')
    // ensure create called with price (not price_data)
    expect(createMock).toHaveBeenCalled()
    const arg = createMock.mock.calls[0][0]
    expect(arg.line_items[0].price).toBe('price_ABC123')

    delete process.env.STRIPE_STARTER_PRICE_ID
  })

  it('falls back to dynamic pricing when price id is not configured', async () => {
    vi.resetModules()
    // Ensure price id not set
    delete process.env.STRIPE_STARTER_PRICE_ID

    const createMock = vi.fn(async (cfg: any) => ({ id: 'sess_y', client_secret: 'cs_y' }))
    vi.doMock('@/lib/stripe', () => ({ stripe: { checkout: { sessions: { create: createMock } } } }))

    vi.doMock('@/lib/supabase/server', () => ({ createClient: vi.fn(async () => ({ auth: { getUser: async () => ({ data: { user: { id: 'u1', email: 'u@example.com' } } }) }, from: () => ({ insert: async () => ({ error: null }) }) })), }))

    const { startCheckoutSession } = await import('@/app/actions/stripe')
    const secret = await startCheckoutSession('starter-plan')
    expect(secret).toBe('cs_y')
    expect(createMock).toHaveBeenCalled()
    const arg = createMock.mock.calls[0][0]
    expect(arg.line_items[0].price_data).toBeDefined()
  })
})
