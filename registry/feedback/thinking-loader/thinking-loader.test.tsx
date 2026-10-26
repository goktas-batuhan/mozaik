import { render, screen } from '@testing-library/react'
import { ThinkingLoader } from './thinking-loader'

let reduced = false
vi.mock('motion/react', async (orig) => ({
  ...(await orig<typeof import('motion/react')>()),
  useReducedMotion: () => reduced,
}))

describe('ThinkingLoader', () => {
  beforeEach(() => {
    reduced = false
  })

  it('announces the label as a status', () => {
    render(<ThinkingLoader label="Searching" />)
    expect(screen.getByRole('status')).toHaveTextContent('Searching')
  })

  it('hides the decorative indicator from assistive tech', () => {
    const { container } = render(<ThinkingLoader variant="grid" />)
    expect(container.querySelector('[aria-hidden="true"]')?.children.length).toBe(1)
    expect(container.querySelectorAll('[aria-hidden="true"] .grid > span')).toHaveLength(9)
  })

  it('falls back to a Loading announcement without a label', () => {
    render(<ThinkingLoader label="" />)
    expect(screen.getByRole('status')).toHaveTextContent('Loading')
  })

  it('does not tick an elapsed counter under reduced motion', () => {
    reduced = true
    render(<ThinkingLoader showElapsed />)
    expect(screen.getByRole('status').textContent).not.toMatch(/\d\.\ds/)
  })
})
