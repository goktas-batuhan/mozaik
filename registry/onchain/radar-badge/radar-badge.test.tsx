import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { RadarBadge } from './radar-badge'

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>()
  return { ...actual, useReducedMotion: vi.fn(() => false) }
})

const { useReducedMotion } = await import('motion/react')

describe('RadarBadge', () => {
  it('renders a status region with the default label', () => {
    render(<RadarBadge status="scanning" />)
    const badge = screen.getByRole('status')
    expect(badge).toHaveTextContent('Scanning')
    expect(badge).toHaveAttribute('data-status', 'scanning')
  })

  it('keeps the status name for screen readers when the label is custom', () => {
    render(<RadarBadge status="alert" label="3 signals" />)
    expect(screen.getByRole('status')).toHaveTextContent('Alert: 3 signals')
  })

  it('draws the sweep and rings when live, and only a dot when idle', () => {
    const { container, rerender } = render(<RadarBadge status="live" />)
    const radar = () => container.querySelector('[aria-hidden]')!
    expect(radar().children.length).toBe(5)
    rerender(<RadarBadge status="idle" />)
    expect(radar().children.length).toBe(2)
  })

  it('stops the sweep under reduced motion', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)
    const { container } = render(<RadarBadge status="alert" size="sm" />)
    expect(container.querySelector('[aria-hidden]')!.children.length).toBe(2)
  })
})
