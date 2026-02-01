import { describe, it, expect } from 'vitest'
import { cn } from '../../lib/utils'

describe('cn', () => {
  it('returns a string and merges classes', () => {
    const out = cn('p-2', 'p-4', { 'text-red-500': true }, 'p-4')
    expect(typeof out).toBe('string')
    // merged classes should contain p-4 and text-red-500
    expect(out).toContain('p-4')
    expect(out).toContain('text-red-500')
  })
})
