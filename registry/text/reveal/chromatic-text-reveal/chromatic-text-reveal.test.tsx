import { render, screen } from '@testing-library/react'
import { ChromaticTextReveal } from './chromatic-text-reveal'

let reduced = false
vi.mock('motion/react', async (orig) => ({
  ...(await orig<typeof import('motion/react')>()),
  useReducedMotion: () => reduced,
}))

describe('ChromaticTextReveal', () => {
  beforeEach(() => {
    reduced = false
  })

  it('keeps the prefix and the active word readable', () => {
    const { container } = render(<ChromaticTextReveal prefix="Feels" words={['calm', 'fast']} />)
    expect(container.textContent).toContain('Feels')
    expect(screen.getAllByText('calm').length).toBeGreaterThan(0)
    expect(container.querySelector('.sr-only')?.textContent).toBe('calm')
  })

  it('renders one plain sentence under reduced motion', () => {
    reduced = true
    const { container } = render(<ChromaticTextReveal prefix="Feels" words={['calm', 'fast']} />)
    expect(container.textContent).toBe('Feels calm')
    expect(container.querySelectorAll('[aria-hidden]')).toHaveLength(0)
  })

  it('renders only the prefix when there are no words', () => {
    const { container } = render(<ChromaticTextReveal prefix="Alone" words={[]} />)
    expect(container.textContent).toBe('Alone')
  })
})
