import { render, screen } from '@testing-library/react'
import { LineShadowText } from './line-shadow-text'

let reduced = false
vi.mock('motion/react', async (orig) => ({
  ...(await orig<typeof import('motion/react')>()),
  useReducedMotion: () => reduced,
}))

describe('LineShadowText', () => {
  beforeEach(() => {
    reduced = false
  })

  it('renders the text in the chosen element', () => {
    render(<LineShadowText as="h2" text="Lines" />)
    expect(screen.getByRole('heading', { name: 'Lines' })).toBeInTheDocument()
  })

  it('keeps the decorative copy out of the accessibility tree', () => {
    const { container } = render(<LineShadowText as="h2" text="Lines" />)
    const shadow = container.querySelector('[data-shadow]')!
    expect(shadow).toHaveAttribute('aria-hidden', 'true')
    expect(shadow).toHaveTextContent('Lines')
  })

  it('passes the shadow color on as a custom property', () => {
    const { container } = render(<LineShadowText text="Lines" shadowColor="var(--success)" />)
    expect((container.firstElementChild as HTMLElement).style.getPropertyValue('--shadow-color')).toBe('var(--success)')
  })

  it('holds the hatching still under reduced motion', () => {
    reduced = true
    const { container } = render(<LineShadowText text="Calm" />)
    const shadow = container.querySelector('[data-shadow]') as HTMLElement
    expect(shadow.style.backgroundPosition).toBe('0em 0em')
  })
})
