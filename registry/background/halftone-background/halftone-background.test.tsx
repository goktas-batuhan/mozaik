import { render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { HalftoneBackground } from './halftone-background'

function stubContext() {
  const ctx = {
    clearRect: vi.fn(),
    setTransform: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: [20, 20, 20, 255] })),
    fillStyle: '',
  }
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D)
  return ctx
}

describe('HalftoneBackground', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders its children above a hidden, non-interactive layer', () => {
    stubContext()
    const { container } = render(
      <HalftoneBackground>
        <h1>Print</h1>
      </HalftoneBackground>,
    )
    expect(screen.getByRole('heading', { name: 'Print' })).toBeInTheDocument()
    const layer = container.querySelector('[data-halftone]')!
    expect(layer).toHaveAttribute('aria-hidden', 'true')
    expect(layer).toHaveClass('pointer-events-none')
    expect(container.querySelector('canvas')).not.toBeNull()
  })

  it('draws one still frame and starts no loop under reduced motion', () => {
    const ctx = stubContext()
    const raf = vi.spyOn(window, 'requestAnimationFrame')
    render(
      <MotionConfig reducedMotion="always">
        <HalftoneBackground />
      </MotionConfig>,
    )
    expect(ctx.fill).toHaveBeenCalled()
    expect(raf).not.toHaveBeenCalled()
  })

  it('does not start a loop while off screen', () => {
    stubContext()
    const raf = vi.spyOn(window, 'requestAnimationFrame')
    render(<HalftoneBackground />)
    expect(raf).not.toHaveBeenCalled()
  })

  it('survives a browser without canvas', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const { container } = render(<HalftoneBackground />)
    expect(container.querySelector('[data-halftone]')).not.toBeNull()
  })
})
