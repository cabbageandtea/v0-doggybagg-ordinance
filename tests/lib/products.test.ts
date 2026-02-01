import { describe, it, expect } from 'vitest'
import { getProductById, formatPrice, PRODUCTS } from '../../lib/products'

describe('products', () => {
  it('getProductById returns the correct product', () => {
    const p = getProductById('starter-plan')
    expect(p).toBeDefined()
    expect(p?.id).toBe('starter-plan')
  })

  it('getProductById returns undefined for unknown', () => {
    expect(getProductById('nope')).toBeUndefined()
  })

  it('formatPrice returns Free for zero', () => {
    expect(formatPrice(0)).toBe('Free')
  })

  it('formatPrice formats dollars', () => {
    expect(formatPrice(2900)).toBe('$29.00')
  })

  it('PRODUCTS contains expected tiers and ids', () => {
    const ids = PRODUCTS.map(p => p.id)
    expect(ids).toContain('community-free')
    expect(ids).toContain('starter-plan')
    expect(ids).toContain('professional-plan')
  })
})
