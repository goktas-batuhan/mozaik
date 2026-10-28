import { render, screen } from '@testing-library/react'
import { SpinningText } from './spinning-text'

let reduced = false
vi.mock('motion/react', async (orig) => ({
  ...(await orig<typeof import('motion/react')>()),
  useReducedMotion: () => reduced,
}))

describe('SpinningText', () => {
  beforeEach(() => {
    reduced = false
  })

  it('exposes the full text once and hides the letters', () => {
    const { container } = render(<SpinningText text="round" />)
    expect(screen.getByText('round', { selector: '.sr-only' })).toBeInTheDocument()
    // five letters plus the gap where the ring closes
    expect(container.querySelectorAll('[data-letter][aria-hidden="true"]')).toHaveLength(6)
  })

  it('spaces the letters evenly around the circle', () => {
    const { container } = render(<SpinningText text="abc" />)
    const angles = Array.from(container.querySelectorAll<HTMLElement>('[data-letter]')).map((el) =>
      Number(/rotate\(([\d.]+)deg\)/.exec(el.style.transform)![1]),
    )
    expect(angles).toEqual([0, 90, 180, 270])
  })

  it('sizes the ring from the radius', () => {
    const { container } = render(<SpinningText text="abc" radius={4} />)
    expect((container.firstElementChild as HTMLElement).style.width).toBe('calc(8ch + 1.5em)')
  })

  it('holds the ring still under reduced motion', () => {
    reduced = true
    const { container } = render(<SpinningText text="calm" />)
    expect((container.firstElementChild as HTMLElement).style.transform).toMatch(/^(none|rotate\(0deg\))?$/)
  })
})
