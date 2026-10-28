import { render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { Particles } from './particles'

function stubContext() {
  const ctx = {
    clearRect: vi.fn(),
    setTransform: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    fillStyle: '',
    globalAlpha: 1,
  }
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D)
  vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({ width: 300, height: 200 } as DOMRect)
  return ctx
}

describe('Particles', () => {
  afterEach(() => vi.restoreAllMocks())

  it('renders children above a hidden, non-interactive layer', () => {
    stubContext()
    const { container } = render(
      <Particles>
        <h1>Dust</h1>
      </Particles>,
    )
    expect(screen.getByRole('heading', { name: 'Dust' })).toBeInTheDocument()
    const layer = container.querySelector('[data-particles]')!
    expect(layer).toHaveAttribute('aria-hidden', 'true')
    expect(layer).toHaveClass('pointer-events-none')
  })

  it('draws one particle per quantity and no loop under reduced motion', () => {
    const ctx = stubContext()
    const raf = vi.spyOn(window, 'requestAnimationFrame')
    render(
      <MotionConfig reducedMotion="always">
        <Particles quantity={25} />
      </MotionConfig>,
    )
    expect(ctx.arc).toHaveBeenCalledTimes(25)
    expect(raf).not.toHaveBeenCalled()
  })

  it('places the same field for the same seed', () => {
    const ctx = stubContext()
    const runs: unknown[][][] = []
    for (let i = 0; i < 2; i++) {
      ctx.arc.mockClear()
      const { unmount } = render(
        <MotionConfig reducedMotion="always">
          <Particles quantity={10} seed={5} />
        </MotionConfig>,
      )
      runs.push([...ctx.arc.mock.calls])
      unmount()
    }
    expect(runs[0]).toEqual(runs[1])
  })

  it('does not start a loop while off screen', () => {
    stubContext()
    const raf = vi.spyOn(window, 'requestAnimationFrame')
    render(<Particles />)
    expect(raf).not.toHaveBeenCalled()
  })

  it('survives a browser without canvas', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const { container } = render(<Particles />)
    expect(container.querySelector('[data-particles]')).not.toBeNull()
  })
})
