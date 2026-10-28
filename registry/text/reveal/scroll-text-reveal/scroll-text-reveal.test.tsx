import { render, screen } from '@testing-library/react'
import { ScrollTextReveal } from './scroll-text-reveal'

let reduced = false
vi.mock('motion/react', async (orig) => ({
  ...(await orig<typeof import('motion/react')>()),
  useReducedMotion: () => reduced,
}))

describe('ScrollTextReveal', () => {
  beforeEach(() => {
    reduced = false
  })

  it('exposes the full text once and hides the words', () => {
    const { container } = render(<ScrollTextReveal text="one two three" />)
    expect(screen.getByText('one two three', { selector: '.sr-only' })).toBeInTheDocument()
    expect(container.querySelectorAll('span[aria-hidden="true"]').length).toBeGreaterThanOrEqual(3)
  })

  it('renders one lit layer per word, in order', () => {
    const { container } = render(<ScrollTextReveal text="alpha beta gamma delta" />)
    const lit = Array.from(container.querySelectorAll('span.absolute')).map((el) => el.textContent)
    expect(lit).toEqual(['alpha', 'beta', 'gamma', 'delta'])
  })

  it('uses the element it is given', () => {
    render(<ScrollTextReveal as="h2" text="Heading words" />)
    expect(screen.getByRole('heading', { name: 'Heading words' })).toBeInTheDocument()
  })

  it('lights every word under reduced motion', () => {
    reduced = true
    const { container } = render(<ScrollTextReveal text="calm and clear" />)
    const lit = Array.from(container.querySelectorAll<HTMLElement>('span.absolute'))
    expect(lit).toHaveLength(3)
    expect(lit.every((el) => el.style.opacity === '1')).toBe(true)
  })
})
