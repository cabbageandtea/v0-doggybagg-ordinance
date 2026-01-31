import { describe, it, expect } from 'vitest'
import { getProductById, formatPrice } from '@/lib/products'

describe('products helpers', () => {
  it('formats prices correctly', () => {
    expect(formatPrice(0)).toBe('Free')
    expect(formatPrice(2900)).toBe('$29.00')
    expect(formatPrice(9900)).toBe('$99.00')
  })

  it('gets product by id', () => {
    const starter = getProductById('starter-plan')
    expect(starter).toBeDefined()
    expect(starter?.name).toBe('Starter')
    expect(getProductById('does-not-exist')).toBeUndefined()
  })
})
