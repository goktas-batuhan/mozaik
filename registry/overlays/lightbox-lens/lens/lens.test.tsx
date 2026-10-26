import { fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { afterEach, vi } from 'vitest'
import { Lens } from './lens'

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

describe('Lens', () => {
  it('renders its children as normal content', () => {
    render(
      <Lens>
        <h3>Card</h3>
      </Lens>,
    )
    expect(screen.getByRole('heading', { name: 'Card' })).toBeInTheDocument()
  })

  it('shows no lens on a touch (coarse) pointer', () => {
    mockFinePointer(false)
    const { container } = render(<Lens>Card</Lens>)
    fireEvent.pointerEnter(container.firstElementChild!, { pointerType: 'mouse' })
    expect(container.querySelector('[data-lens]')).toBeNull()
  })

  it('adds a hidden, inert, click-through magnified copy while hovered on a fine pointer', () => {
    mockFinePointer(true)
    const { container } = render(
      <Lens>
        <h3>Card</h3>
      </Lens>,
    )
    const root = container.firstElementChild!
    expect(container.querySelector('[data-lens]')).toBeNull()
    fireEvent.pointerEnter(root, { pointerType: 'mouse' })
    const lens = container.querySelector('[data-lens]')!
    expect(lens).toHaveAttribute('aria-hidden', 'true')
    expect(lens).toHaveAttribute('inert')
    expect(lens).toHaveClass('pointer-events-none')
    // the copy is invisible to the accessibility tree: still one heading
    expect(screen.getAllByRole('heading', { name: 'Card' })).toHaveLength(1)
  })

  it('has no lens when disabled or under reduced motion', () => {
    mockFinePointer(true)
    const off = render(<Lens disabled>Card</Lens>)
    fireEvent.pointerEnter(off.container.firstElementChild!, { pointerType: 'mouse' })
    expect(off.container.querySelector('[data-lens]')).toBeNull()
    off.unmount()

    const calm = render(
      <MotionConfig reducedMotion="always">
        <Lens>Card</Lens>
      </MotionConfig>,
    )
    fireEvent.pointerEnter(calm.container.firstElementChild!, { pointerType: 'mouse' })
    expect(calm.container.querySelector('[data-lens]')).toBeNull()
    expect(calm.container).toHaveTextContent('Card')
  })

  it('passes className to the root', () => {
    const { container } = render(<Lens className="p-4">Card</Lens>)
    expect(container.firstElementChild).toHaveClass('p-4')
  })
})
