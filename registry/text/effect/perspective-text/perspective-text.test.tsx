import { fireEvent, render, screen } from '@testing-library/react'
import { PerspectiveText } from './perspective-text'

let reduced = false
vi.mock('motion/react', async (orig) => ({
  ...(await orig<typeof import('motion/react')>()),
  useReducedMotion: () => reduced,
}))

describe('PerspectiveText', () => {
  beforeEach(() => {
    reduced = false
  })

  it('exposes the full text once and hides the pieces', () => {
    const { container } = render(<PerspectiveText text="deep thoughts here" />)
    expect(screen.getByText('deep thoughts here', { selector: '.sr-only' })).toBeInTheDocument()
    expect(container.querySelectorAll('[data-piece][aria-hidden="true"]')).toHaveLength(3)
  })

  it('layers the pieces around the middle of the depth axis', () => {
    const { container } = render(<PerspectiveText text="a b c" depth={10} />)
    const z = Array.from(container.querySelectorAll<HTMLElement>('[data-piece]')).map((el) => el.style.transform)
    expect(z).toEqual(['translateZ(-10px)', 'translateZ(0px)', 'translateZ(10px)'])
  })

  it('splits on line breaks when asked to', () => {
    const { container } = render(<PerspectiveText split="lines" text={'first line\nsecond line'} />)
    const pieces = Array.from(container.querySelectorAll('[data-piece]')).map((el) => el.textContent)
    expect(pieces).toEqual(['first line', 'second line'])
  })

  it('ignores the cursor under reduced motion', () => {
    reduced = true
    const { container } = render(<PerspectiveText text="calm words" />)
    const plane = container.querySelector('[data-piece]')!.parentElement as HTMLElement
    const before = plane.style.transform
    fireEvent.pointerMove(container.firstElementChild!, { pointerType: 'mouse', clientX: 10, clientY: 10 })
    expect(plane.style.transform).toBe(before)
  })
})
