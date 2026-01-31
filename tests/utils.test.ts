import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn util', () => {
  it('merges class names and deduplicates', () => {
    expect(cn('px-4', 'px-4')).toBe('px-4')
    const merged = cn('text-center', 'font-bold', 'text-center')
    expect(merged.split(' ').sort().join(' ')).toBe('font-bold text-center')
    expect(cn('a', 'b')).toBe('a b')
  })
})
