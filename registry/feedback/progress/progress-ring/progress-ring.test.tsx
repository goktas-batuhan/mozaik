import { render, screen } from '@testing-library/react'
import { ProgressRing } from './progress-ring'

let reduced = false
vi.mock('motion/react', async (orig) => ({
  ...(await orig<typeof import('motion/react')>()),
  useReducedMotion: () => reduced,
}))

describe('ProgressRing', () => {
  beforeEach(() => {
    reduced = false
  })

  it('exposes the value through progressbar semantics', () => {
    render(<ProgressRing value={42} label="Upload" />)
    const bar = screen.getByRole('progressbar', { name: 'Upload' })
    expect(bar).toHaveAttribute('aria-valuenow', '42')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
  })

  it('clamps values outside 0-100', () => {
    render(<ProgressRing value={250} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('shows the final value immediately under reduced motion', () => {
    reduced = true
    const { container } = render(<ProgressRing value={73} />)
    expect(container.textContent).toBe('73%')
  })

  it('renders custom children instead of the percentage', () => {
    reduced = true
    const { container } = render(<ProgressRing value={50}>Half</ProgressRing>)
    expect(container.textContent).toBe('Half')
  })
})
