import { render, screen } from '@testing-library/react'
import { SparklesText } from './sparkles-text'

let reduced = false
vi.mock('motion/react', async (orig) => ({
  ...(await orig<typeof import('motion/react')>()),
  useReducedMotion: () => reduced,
}))

describe('SparklesText', () => {
  beforeEach(() => {
    reduced = false
  })

  it('exposes the full text once and hides the decoration', () => {
    const { container } = render(<SparklesText text="Shine" sparkles={4} />)
    expect(screen.getByText('Shine', { selector: '.sr-only' })).toBeInTheDocument()
    expect(container.querySelectorAll('[data-sparkle][aria-hidden="true"]')).toHaveLength(4)
  })

  it('renders plain text when disabled', () => {
    const { container } = render(<SparklesText as="h2" text="Plain" disabled />)
    expect(screen.getByRole('heading', { name: 'Plain' })).toBeInTheDocument()
    expect(container.querySelectorAll('[data-sparkle]')).toHaveLength(0)
  })

  it('places the same sparkles for the same seed', () => {
    const positions = () =>
      Array.from(document.querySelectorAll('[data-sparkle]')).map((el) => (el as SVGElement).getAttribute('style'))
    const first = render(<SparklesText text="A" seed={4} />)
    const a = positions()
    first.unmount()
    render(<SparklesText text="A" seed={4} />)
    expect(positions()).toEqual(a)
  })

  it('alternates the two colors', () => {
    const { container } = render(<SparklesText text="A" sparkles={4} colors={['red', 'blue']} />)
    const fills = Array.from(container.querySelectorAll('path')).map((p) => p.getAttribute('fill'))
    expect(fills).toEqual(['red', 'blue', 'red', 'blue'])
  })

  it('shows still sparkles under reduced motion', () => {
    reduced = true
    const { container } = render(<SparklesText text="Calm" sparkles={3} />)
    const star = container.querySelector('[data-sparkle]') as SVGElement
    expect(star.style.opacity).toBe('1')
  })
})
