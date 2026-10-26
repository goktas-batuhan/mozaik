import { render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { TopoBackground } from './topo-background'

function stubContext() {
  const ctx = {
    clearRect: vi.fn(),
    setTransform: vi.fn(),
    stroke: vi.fn(),
    lineCap: '',
    globalAlpha: 1,
    lineWidth: 1,
    strokeStyle: '',
  }
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D)
  vi.stubGlobal(
    'Path2D',
    class {
      moveTo() {}
      lineTo() {}
    },
  )
  return ctx
}

describe('TopoBackground', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('renders its children above a hidden, non-interactive layer', () => {
    stubContext()
    const { container } = render(
      <TopoBackground>
        <h1>Map</h1>
      </TopoBackground>,
    )
    expect(screen.getByRole('heading', { name: 'Map' })).toBeInTheDocument()
    const layer = container.querySelector('[data-topo]')!
    expect(layer).toHaveAttribute('aria-hidden', 'true')
    expect(layer).toHaveClass('pointer-events-none')
    expect(container.querySelector('canvas')).not.toBeNull()
  })

  it('draws one still frame and starts no loop under reduced motion', () => {
    const ctx = stubContext()
    const raf = vi.spyOn(window, 'requestAnimationFrame')
    render(
      <MotionConfig reducedMotion="always">
        <TopoBackground />
      </MotionConfig>,
    )
    expect(ctx.stroke).toHaveBeenCalled()
    expect(raf).not.toHaveBeenCalled()
  })

  it('does not start a loop while off screen', () => {
    stubContext()
    const raf = vi.spyOn(window, 'requestAnimationFrame')
    render(<TopoBackground />)
    expect(raf).not.toHaveBeenCalled()
  })

  it('survives a browser without canvas', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const { container } = render(<TopoBackground />)
    expect(container.querySelector('[data-topo]')).not.toBeNull()
  })
})
