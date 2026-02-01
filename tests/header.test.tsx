import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// Mock next/image to avoid Next's special behaviour in tests
vi.mock('next/image', () => ({
  default: (props: any) => {
    // strip Next's special props like `fill` which are not valid on <img>
    const { fill, ...rest } = props
    return <img {...rest} />
  },
}))

import { Header } from '@/components/header'

describe('Header component', () => {
  it('renders logo and links', () => {
    render(<Header />)
    expect(screen.getByText(/DoggyBagg/i)).toBeInTheDocument()
    expect(screen.getByText(/Get Started/i)).toBeInTheDocument()
  })

  it('toggles mobile menu when button clicked', () => {
    const { container } = render(<Header />)
    const button = screen.getByRole('button', { name: /toggle menu/i })
    // Menu is closed initially (mobile menu container not rendered)
    expect(container.querySelector('.mt-4.md\\:hidden')).toBeNull()
    fireEvent.click(button)
    // After click, the mobile menu container should be present
    expect(container.querySelector('.mt-4.md\\:hidden')).not.toBeNull()
  })
})
