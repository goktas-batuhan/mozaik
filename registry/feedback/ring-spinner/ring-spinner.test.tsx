import { render, screen } from '@testing-library/react'
import { RingSpinner } from './ring-spinner'

let reduced = false
vi.mock('motion/react', async (orig) => ({
  ...(await orig<typeof import('motion/react')>()),
  useReducedMotion: () => reduced,
}))

describe('RingSpinner', () => {
  beforeEach(() => {
    reduced = false
  })

  it('announces itself as a status with a label', () => {
    render(<RingSpinner label="Saving" />)
    expect(screen.getByRole('status', { name: 'Saving' })).toBeInTheDocument()
  })

  it('defaults the label to Loading', () => {
    render(<RingSpinner />)
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
  })

  it('still renders its static arc under reduced motion', () => {
    reduced = true
    render(<RingSpinner size="lg" />)
    const status = screen.getByRole('status')
    expect(status.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(status.firstElementChild?.className).toContain('size-8')
  })
})
