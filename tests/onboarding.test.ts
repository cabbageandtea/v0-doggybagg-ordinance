import { describe, it, expect, vi } from 'vitest'
import { getOnboardingStatus, updateOnboardingProgress, generateFirstHealthCheck } from '@/app/actions/agentic'

// Helper to create a flexible supabase mock
function createSupabaseMock(overrides: any = {}) {
  return {
    auth: { getUser: async () => ({ data: { user: { id: 'u1' } } }) },
    from: (table: string) => {
      if (table === 'profiles') {
        return { select: async () => ({ data: [{ subscription_tier: overrides.subscription_tier || 'free' }], error: null }), eq: () => ({ single: async () => ({ data: { subscription_tier: overrides.subscription_tier || 'free' } }) }) }
      }
      if (table === 'user_onboarding') {
        return { select: async () => ({ data: [{ phone_verified: overrides.phone_verified || false, viewed_risk_score: overrides.viewed_risk_score || false }], error: null }), eq: () => ({ single: async () => ({ data: { phone_verified: overrides.phone_verified || false, viewed_risk_score: overrides.viewed_risk_score || false } }) }) }
      }
      if (table === 'properties') {
        return {
          select: async () => ({ data: overrides.properties || [], error: null }),
          eq: (_col: string, _val: any) => ({ order: () => ({ select: async () => ({ data: overrides.properties || [], error: null }) }) }),
        }
      }
      if (table === 'ordinances') {
        return {
          select: async () => ({ data: overrides.areaViolations || [], error: null }),
          in: async () => ({ data: overrides.areaViolations || [], error: null }),
          gte: async () => ({ data: overrides.areaViolations || [], error: null }),
        }
      }

      return { select: async () => ({ data: [], error: null }) }
    },
  }
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => createSupabaseMock()),
}))

describe('onboarding flows', () => {
  it('getOnboardingStatus returns complete when all steps done', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    // Replace mock with one that has properties and onboarding flags
    ;(createClient as any).mockImplementationOnce(async () => createSupabaseMock({ properties: [{ id: 'p1' }], phone_verified: true, viewed_risk_score: true, subscription_tier: 'starter' }))

    const res = await getOnboardingStatus()
    expect(res.success).toBe(true)
    expect(res.status).toBeDefined()
    expect(res.status?.isComplete).toBe(true)
    expect(res.status?.userTier).toBe('starter')
  })

  it('updateOnboardingProgress upserts progress and logs action', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    const mockSupabase = createSupabaseMock()
    // Spy on upsert/insert calls by providing methods that set flags
    let upsertCalled = false
    let insertCalled = false
    mockSupabase.from = (_table: string) => ({
      upsert: async () => { upsertCalled = true; return { error: null } },
      insert: async () => { insertCalled = true; return { error: null } },
    }) as any

    ;(createClient as any).mockImplementationOnce(async () => mockSupabase)

    const res = await updateOnboardingProgress('verify_phone')
    expect(res.success).toBe(true)
    expect(upsertCalled).toBe(true)
    expect(insertCalled).toBe(true)
  })

  it('generateFirstHealthCheck returns default report when no properties', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    ;(createClient as any).mockImplementationOnce(async () => createSupabaseMock({ properties: [] }))

    const res = await generateFirstHealthCheck()
    expect(res.success).toBe(true)
    expect(res.report).toBeDefined()
    expect(res.report?.propertiesMonitored).toBe(0)
    expect(res.report?.overallScore).toBe(100)
  })

  it('generateFirstHealthCheck computes reduced score with active violations', async () => {
    const props = [{ id: 'p1', ordinances: [{ status: 'active', fine_amount: 100 }] }]
    const { createClient } = await import('@/lib/supabase/server')
    ;(createClient as any).mockImplementationOnce(async () => createSupabaseMock({ properties: props, areaViolations: [] }))

    const res = await generateFirstHealthCheck()
    expect(res.success).toBe(true)
    expect(res.report).toBeDefined()
    expect(res.report?.propertiesMonitored).toBe(1)
    expect((res.report?.overallScore || 100) < 100).toBe(true)
  })
})
