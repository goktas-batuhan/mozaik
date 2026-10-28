import { act, fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { afterEach, vi } from 'vitest'
import { ClickRipple } from './click-ripple'

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

const press = (el: Element, x = 40, y = 30, pointerType = 'mouse') =>
  act(async () => {
    fireEvent.pointerDown(el, { clientX: x, clientY: y, pointerType })
  })

describe('ClickRipple', () => {
  it('renders its children and no ripple layer without a fine pointer', () => {
    const { container } = render(
      <ClickRipple>
        <button type="button">Press</button>
      </ClickRipple>,
    )
    expect(screen.getByRole('button', { name: 'Press' })).toBeInTheDocument()
    expect(container.querySelector('[data-ripples]')).toBeNull()
  })

  it('puts the rings on a decorative, click-through layer', () => {
    mockFinePointer(true)
    const { container } = render(<ClickRipple>Area</ClickRipple>)
    const layer = container.querySelector('[data-ripples]')!
    expect(layer).toHaveAttribute('aria-hidden', 'true')
    expect(layer).toHaveClass('pointer-events-none')
  })

  it('sends the configured number of rings from the click point', async () => {
    mockFinePointer(true)
    const { container } = render(<ClickRipple rings={3}>Area</ClickRipple>)
    await press(container.firstElementChild!)
    const ripple = container.querySelector('[data-ripple]') as HTMLElement
    expect(ripple.style.left).toBe('40px')
    expect(ripple.style.top).toBe('30px')
    expect(ripple.children).toHaveLength(3)
  })

  it('keeps clicks reaching the content', async () => {
    mockFinePointer(true)
    const onClick = vi.fn()
    render(
      <ClickRipple>
        <button type="button" onClick={onClick}>
          Go
        </button>
      </ClickRipple>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('ignores touch and pen presses', async () => {
    mockFinePointer(true)
    const { container } = render(<ClickRipple>Area</ClickRipple>)
    await press(container.firstElementChild!, 10, 10, 'touch')
    expect(container.querySelector('[data-ripple]')).toBeNull()
  })

  it('stays off under reduced motion', async () => {
    mockFinePointer(true)
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <ClickRipple>Area</ClickRipple>
      </MotionConfig>,
    )
    await press(container.firstElementChild!)
    expect(container.querySelector('[data-ripples]')).toBeNull()
  })
})
