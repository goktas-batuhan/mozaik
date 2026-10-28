import { act, fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { afterEach, vi } from 'vitest'
import { DrawingCursor } from './drawing-cursor'

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

function stubContext() {
  const ctx = {
    clearRect: vi.fn(),
    setTransform: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    stroke: vi.fn(),
    lineCap: '',
    lineJoin: '',
    lineWidth: 1,
    strokeStyle: '',
    globalAlpha: 1,
  }
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D)
  vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, width: 300, height: 200 } as DOMRect)
  return ctx
}

afterEach(() => vi.restoreAllMocks())

const move = (el: Element, x: number) =>
  act(async () => {
    fireEvent.pointerMove(el, { clientX: x, clientY: 20, pointerType: 'mouse' })
  })

describe('DrawingCursor', () => {
  it('renders its children and no ink layer without a fine pointer', () => {
    const { container } = render(
      <DrawingCursor>
        <button type="button">Press</button>
      </DrawingCursor>,
    )
    expect(screen.getByRole('button', { name: 'Press' })).toBeInTheDocument()
    expect(container.querySelector('[data-ink]')).toBeNull()
  })

  it('adds a decorative, click-through ink layer with a fine pointer', () => {
    mockFinePointer(true)
    stubContext()
    const { container } = render(<DrawingCursor>Area</DrawingCursor>)
    const layer = container.querySelector('[data-ink]')!
    expect(layer).toHaveAttribute('aria-hidden', 'true')
    expect(layer).toHaveClass('pointer-events-none')
  })

  it('starts a loop only once the cursor moves, and strokes the ink', async () => {
    mockFinePointer(true)
    const ctx = stubContext()
    const raf = vi.spyOn(window, 'requestAnimationFrame')
    const { container } = render(<DrawingCursor>Area</DrawingCursor>)
    expect(raf).not.toHaveBeenCalled()
    await move(container.firstElementChild!, 10)
    await move(container.firstElementChild!, 30)
    await move(container.firstElementChild!, 60)
    expect(raf).toHaveBeenCalled()
    // Each pointer move queues one frame; run it.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 40))
    })
    expect(ctx.stroke).toHaveBeenCalled()
  })

  it('cancels its frame and wipes the canvas on unmount and on leave', async () => {
    mockFinePointer(true)
    const ctx = stubContext()
    const cancel = vi.spyOn(window, 'cancelAnimationFrame')
    const { container, unmount } = render(<DrawingCursor>Area</DrawingCursor>)
    await move(container.firstElementChild!, 10)
    ctx.clearRect.mockClear()
    await act(async () => {
      fireEvent.pointerLeave(container.firstElementChild!)
    })
    expect(ctx.clearRect).toHaveBeenCalled()
    unmount()
    expect(cancel).toHaveBeenCalled()
  })

  it('draws nothing under reduced motion', () => {
    mockFinePointer(true)
    stubContext()
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <DrawingCursor>Area</DrawingCursor>
      </MotionConfig>,
    )
    expect(container.querySelector('[data-ink]')).toBeNull()
  })
})
