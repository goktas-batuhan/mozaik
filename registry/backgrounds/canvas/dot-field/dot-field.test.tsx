import { fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { DotField } from './dot-field'

function stubContext() {
  const ctx = {
    clearRect: vi.fn(),
    setTransform: vi.fn(),
    fill: vi.fn(),
    fillStyle: '',
    globalAlpha: 1,
  }
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D)
  vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({ width: 300, height: 200, left: 0, top: 0 } as DOMRect)
  vi.stubGlobal(
    'Path2D',
    class {
      moveTo() {}
      arc() {}
    },
  )
  return ctx
}

describe('DotField', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('renders children above a hidden, non-interactive layer', () => {
    stubContext()
    const { container } = render(
      <DotField>
        <h1>Dots</h1>
      </DotField>,
    )
    expect(screen.getByRole('heading', { name: 'Dots' })).toBeInTheDocument()
    const layer = container.querySelector('[data-dot-field]')!
    expect(layer).toHaveAttribute('aria-hidden', 'true')
    expect(layer).toHaveClass('pointer-events-none')
  })

  it('draws one still frame and starts no loop under reduced motion', () => {
    const ctx = stubContext()
    const raf = vi.spyOn(window, 'requestAnimationFrame')
    render(
      <MotionConfig reducedMotion="always">
        <DotField />
      </MotionConfig>,
    )
    expect(ctx.fill).toHaveBeenCalled()
    expect(raf).not.toHaveBeenCalled()
  })

  it('does not start a loop while off screen, even after a click', () => {
    stubContext()
    const raf = vi.spyOn(window, 'requestAnimationFrame')
    const { container } = render(<DotField />)
    fireEvent.pointerDown(container.firstElementChild as Element, { pointerType: 'mouse', clientX: 40, clientY: 40 })
    expect(raf).not.toHaveBeenCalled()
  })

  it('draws the same halftone for the same seed', () => {
    const ctx = stubContext()
    const sizes: number[][] = []
    for (let i = 0; i < 2; i++) {
      const arcs: number[] = []
      vi.stubGlobal(
        'Path2D',
        class {
          moveTo() {}
          arc(_x: number, _y: number, r: number) {
            arcs.push(r)
          }
        },
      )
      const { unmount } = render(
        <MotionConfig reducedMotion="always">
          <DotField seed={2} />
        </MotionConfig>,
      )
      sizes.push(arcs)
      unmount()
    }
    expect(ctx.fill).toHaveBeenCalled()
    expect(sizes[0].length).toBeGreaterThan(0)
    expect(sizes[0]).toEqual(sizes[1])
  })

  it('survives a browser without canvas', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const { container } = render(<DotField />)
    expect(container.querySelector('[data-dot-field]')).not.toBeNull()
  })
})
