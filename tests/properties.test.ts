import { describe, it, expect, vi } from 'vitest'
import { getUserProperties, addProperty, deleteProperty } from '@/app/actions/properties'

// Mock supabase createClient
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: async () => ({ data: { user: { id: 'u1' } } }) },
    from: (table: string) => ({
      select: async () => ({ data: [{ id: 'p1', address: '123 Main St' }], error: null }),
      insert: async () => ({ error: null }),
      delete: async () => ({ error: null }),
      order: () => ({ select: async () => ({ data: [], error: null }) }),
    }),
  })),
}))

describe('properties actions', () => {
  it('getUserProperties returns properties list when authenticated', async () => {
    const res = await getUserProperties()
    expect(res.properties).toBeDefined()
    expect(res.error).toBeNull()
  })

  it('addProperty returns success when insert succeeds', async () => {
    const res = await addProperty({ address: '123 Main St', stro_tier: 1, license_id: 'L1' })
    expect(res.success).toBe(true)
    expect(res.error).toBeNull()
  })

  it('deleteProperty returns success when delete succeeds', async () => {
    const res = await deleteProperty('p1')
    expect(res.success).toBe(true)
    expect(res.error).toBeNull()
  })
})
