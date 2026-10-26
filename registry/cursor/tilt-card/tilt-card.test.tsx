import { render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { afterEach, vi } from 'vitest'
import { TiltCard } from './tilt-card'

function mockFinePointer(matches: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches,
        media: query,
        addEventListener() {},
        removeEventListener() {},
      }) as unknown as MediaQueryList,
  )
}

afterEach(() => vi.restoreAllMocks())

describe('TiltCard', () => {
  it('renders its children', () => {
    render(
      <TiltCard>
        <h3>Card</h3>
      </TiltCard>,
    )
    expect(screen.getByRole('heading', { name: 'Card' })).toBeInTheDocument()
  })

  it('is a flat card without glare on a coarse pointer', () => {
    const { container } = render(<TiltCard>Card</TiltCard>)
    const root = container.firstElementChild as HTMLElement
    expect(root.style.transform).toBe('')
    expect(container.querySelector('[aria-hidden]')).toBeNull()
  })

  it('adds a decorative, click-through glare layer on a fine pointer', () => {
    mockFinePointer(true)
    const { container, rerender } = render(<TiltCard>Card</TiltCard>)
    const glare = container.querySelector('[aria-hidden="true"]')
    expect(glare).toHaveClass('pointer-events-none')
    rerender(<TiltCard glare={false}>Card</TiltCard>)
    expect(container.querySelector('[aria-hidden]')).toBeNull()
  })

  it('stays flat when disabled or under reduced motion', () => {
    mockFinePointer(true)
    const off = render(<TiltCard disabled>Card</TiltCard>)
    expect(off.container.querySelector('[aria-hidden]')).toBeNull()
    expect((off.container.firstElementChild as HTMLElement).style.transform).toBe('')
    off.unmount()

    const calm = render(
      <MotionConfig reducedMotion="always">
        <TiltCard>Card</TiltCard>
      </MotionConfig>,
    )
    expect(calm.container.querySelector('[aria-hidden]')).toBeNull()
    expect((calm.container.firstElementChild as HTMLElement).style.transform).toBe('')
  })

  it('passes className to the card', () => {
    const { container } = render(<TiltCard className="p-4">Card</TiltCard>)
    expect(container.firstElementChild).toHaveClass('p-4')
  })
})
