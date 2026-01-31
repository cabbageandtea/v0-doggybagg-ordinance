import { describe, it, expect } from 'vitest'
import {
  calculateNextBestAction,
  calculateBayesianRisk,
  generateBlockchainHash,
  calculateComplianceScore,
  calculateNeighborhoodRisk,
  generateHealthRecommendations,
  getMunicipalCitations,
} from '@/app/actions/agentic'

describe('agentic helper functions', () => {
  it('calculateNextBestAction returns low priority when no violations', () => {
    const action = calculateNextBestAction([])
    expect(action.priority).toBe('low')
  })

  it('calculateNextBestAction returns high priority for large fines', () => {
    const action = calculateNextBestAction([{ id: 'v1', fine_amount: 2000 } as any])
    expect(action.priority).toBe('high')
    expect(action.title).toContain('Schedule Immediate Remediation')
  })

  it('calculateBayesianRisk summarizes violations', () => {
    const res = calculateBayesianRisk([
      { violation_type: 'Trash Violation' },
      { violation_type: 'Trash Violation' },
      { violation_type: 'Noise Complaint' },
    ], '92101')

    expect(res.areaViolations.count).toBe(3)
    expect(Array.isArray(res.reasons)).toBe(true)
    expect(res.areaViolations.types).toContain('Trash Violation')
  })

  it('generateBlockchainHash starts with 0x and returns fixed length hex', () => {
    const h = generateBlockchainHash({ id: 'p1', address: '123 Main St' })
    expect(h.startsWith('0x')).toBe(true)
    expect(h.length).toBeGreaterThan(10)
  })

  it('calculateComplianceScore accounts for active violations', () => {
    const score = calculateComplianceScore({ ordinances: [{ status: 'active' }, { status: 'inactive' }] as any })
    expect(score).toBe(85)
  })

  it('calculateNeighborhoodRisk and generateHealthRecommendations', () => {
    expect(calculateNeighborhoodRisk(0)).toBe('Low')
    expect(calculateNeighborhoodRisk(7)).toBe('Medium')
    const recs = generateHealthRecommendations(1, 1200, 'High', 1)
    expect(recs.length).toBeGreaterThan(0)
  })

  it('getMunicipalCitations returns defaults and known mapping', () => {
    const known = getMunicipalCitations('Trash Violation')
    expect(known.length).toBeGreaterThan(0)
    const def = getMunicipalCitations('Unknown Type')
    expect(def[0]).toContain('General Compliance Standards')
  })
})
