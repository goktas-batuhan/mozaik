import { render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { FlickeringGrid } from './flickering-grid'

function stubContext() {
  const ctx = {
    clearRect: vi.fn(),
    setTransform: vi.fn(),
    fillRect: vi.fn(),
    fillStyle: '',
    globalAlpha: 1,
  }
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D)
  vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({ width: 100, height: 60 } as DOMRect)
  return ctx
}

describe('FlickeringGrid', () => {
  afterEach(() => vi.restoreAllMocks())

  it('renders children above a hidden, non-interactive layer', () => {
    stubContext()
    const { container } = render(
      <FlickeringGrid>
        <h1>Noise</h1>
      </FlickeringGrid>,
    )
    expect(screen.getByRole('heading', { name: 'Noise' })).toBeInTheDocument()
    const layer = container.querySelector('[data-flickering-grid]')!
    expect(layer).toHaveAttribute('aria-hidden', 'true')
    expect(layer).toHaveClass('pointer-events-none')
  })

  it('paints one square per grid cell without starting a loop under reduced motion', () => {
    const ctx = stubContext()
    const raf = vi.spyOn(window, 'requestAnimationFrame')
    render(
      <MotionConfig reducedMotion="always">
        <FlickeringGrid squareSize={4} gap={6} />
      </MotionConfig>,
    )
    // 100x60 at a 10px step is 10 columns by 6 rows.
    expect(ctx.fillRect).toHaveBeenCalledTimes(60)
    expect(raf).not.toHaveBeenCalled()
  })

  it('opens on the same pattern for the same seed', () => {
    const ctx = stubContext()
    const alphas: number[][] = []
    Object.defineProperty(ctx, 'globalAlpha', {
      set: (v: number) => alphas[alphas.length - 1].push(v),
      get: () => 1,
    })
    for (let run = 0; run < 2; run++) {
      alphas.push([])
      const { unmount } = render(
        <MotionConfig reducedMotion="always">
          <FlickeringGrid seed={3} />
        </MotionConfig>,
      )
      unmount()
    }
    expect(alphas[0].length).toBeGreaterThan(0)
    expect(alphas[0]).toEqual(alphas[1])
  })

  it('does not start a loop while off screen', () => {
    stubContext()
    const raf = vi.spyOn(window, 'requestAnimationFrame')
    render(<FlickeringGrid />)
    expect(raf).not.toHaveBeenCalled()
  })

  it('survives a browser without canvas', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const { container } = render(<FlickeringGrid />)
    expect(container.querySelector('[data-flickering-grid]')).not.toBeNull()
  })
})
