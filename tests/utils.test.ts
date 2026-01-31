import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn util', () => {
  it('merges class names and deduplicates', () => {
    expect(cn('px-4', 'px-4')).toBe('px-4')
    expect(cn('text-center', 'font-bold', 'text-center')).toBe('text-center font-bold')
    expect(cn('a', 'b')).toBe('a b')
  })
})
