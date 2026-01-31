import { describe, it, expect, vi } from 'vitest'
import { addProperty, deleteProperty } from '@/app/actions/properties'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: async () => ({ data: { user: { id: 'u1' } } }) },
    from: (table: string) => ({
      insert: async () => ({ error: { message: 'insert failed' } }),
      delete: () => ({ eq: () => ({ eq: (_c: string, _v: any) => ({ error: { message: 'delete failed' } }) }) }),
    }),
  })),
}))

describe('properties error paths', () => {
  it('addProperty returns failure when insert errors', async () => {
    const res = await addProperty({ address: 'x', stro_tier: 1, license_id: 'L' })
    expect(res.success).toBe(false)
    expect(res.error).toContain('insert failed')
  })

  it('deleteProperty returns failure when delete errors', async () => {
    const res = await deleteProperty('p1')
    expect(res.success).toBe(false)
    expect(res.error).toContain('delete failed')
  })
})
