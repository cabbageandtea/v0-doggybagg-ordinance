import { describe, it, expect, vi } from 'vitest'
import { generateAppealLetter, predictPropertyRisk, generateComplianceCertificate } from '@/app/actions/agentic'

// Reusable supabase mock factory
function createSupabaseMock(overrides: any = {}) {
  return {
    auth: { getUser: async () => ({ data: { user: { id: 'u1', email: 'user@example.com' } } }) },
    from: (table: string) => {
      if (table === 'ordinances') {
        return {
          select: (_cols?: string) => ({
            eq: (_col: string, _val: any) => ({
              single: async () => ({ data: overrides.ordinance || null, error: null }),
              gte: (_col2: string, _val2: any) => ({ data: overrides.areaViolations || [], error: null }),
            }),
            gte: (_col: string, _val: any) => ({ data: overrides.areaViolations || [], error: null }),
          }),
        }
      }

      if (table === 'properties') {
        return {
          select: (_cols?: string) => ({
            eq: (_col: string, _val: any) => ({
              eq: (_col2: string, _val2: any) => ({ single: async () => ({ data: overrides.property || null, error: null }) }),
              single: async () => ({ data: overrides.property || null, error: null }),
            }),
          }),
        }
      }

      return { select: async () => ({ data: [], error: null }) }
    },
    // allow inserts without side effects
    insert: async () => ({ error: null }),
  }
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => createSupabaseMock()),
}))

describe('agentic server-side flows', () => {
  it('generateAppealLetter returns letter and citations for known violation', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    ;(createClient as any).mockImplementationOnce(async () => createSupabaseMock({
      ordinance: {
        id: 'v1',
        violation_type: 'Trash Violation',
        violation_date: new Date().toISOString(),
        properties: { address: '123 Main St', city: 'San Diego', state: 'CA', zip_code: '92101' },
      },
    }))

    const res = await generateAppealLetter('v1')
    expect(res.success).toBe(true)
    expect(res.letter).toContain('Trash Violation')
    expect(Array.isArray(res.citations)).toBe(true)
  })

  it('predictPropertyRisk returns prediction summary', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    ;(createClient as any).mockImplementationOnce(async () => createSupabaseMock({
      areaViolations: [
        { violation_type: 'Trash Violation' },
        { violation_type: 'Noise Complaint' },
        { violation_type: 'Trash Violation' },
        { violation_type: 'Short-Term Rental' },
      ],
    }))

    const res = await predictPropertyRisk('p1', '92101')
    expect(res.success).toBe(true)
    expect(res.prediction).toBeDefined()
    expect(res.prediction?.areaViolations.count).toBeGreaterThan(0)
    expect(res.prediction?.reasons.length).toBeGreaterThanOrEqual(1)
  })

  it('generateComplianceCertificate returns a certificate for a valid property', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    ;(createClient as any).mockImplementationOnce(async () => createSupabaseMock({
      property: {
        id: 'p1',
        address: '123 Main St',
        ordinances: [{ status: 'inactive' }, { status: 'active' }],
      },
    }))

    const res = await generateComplianceCertificate('p1')
    expect(res.success).toBe(true)
    expect(res.certificate).toBeDefined()
    expect(res.certificate?.certificateId).toMatch(/^CERT-/)
  })
})
