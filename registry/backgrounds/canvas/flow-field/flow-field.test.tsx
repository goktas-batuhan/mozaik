import { render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { FlowField } from './flow-field'

function stubContext() {
  const ctx = {
    clearRect: vi.fn(),
    setTransform: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fillRect: vi.fn(),
    lineCap: '',
    lineWidth: 1,
    strokeStyle: '',
    fillStyle: '',
    globalAlpha: 1,
    globalCompositeOperation: '',
  }
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D)
  vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({ width: 800, height: 500 } as DOMRect)
  return ctx
}

describe('FlowField', () => {
  afterEach(() => vi.restoreAllMocks())

  it('renders children above a hidden, non-interactive layer', () => {
    stubContext()
    const { container } = render(
      <FlowField>
        <h1>Wind</h1>
      </FlowField>,
    )
    expect(screen.getByRole('heading', { name: 'Wind' })).toBeInTheDocument()
    const layer = container.querySelector('[data-flow-field]')!
    expect(layer).toHaveAttribute('aria-hidden', 'true')
    expect(layer).toHaveClass('pointer-events-none')
  })

  it('draws one still frame and starts no loop under reduced motion', () => {
    const ctx = stubContext()
    const raf = vi.spyOn(window, 'requestAnimationFrame')
    render(
      <MotionConfig reducedMotion="always">
        <FlowField />
      </MotionConfig>,
    )
    expect(ctx.lineTo).toHaveBeenCalled()
    expect(ctx.stroke).toHaveBeenCalled()
    expect(raf).not.toHaveBeenCalled()
  })

  it('draws the same still frame for the same seed', () => {
    const ctx = stubContext()
    const runs: unknown[][][] = []
    for (let i = 0; i < 2; i++) {
      ctx.lineTo.mockClear()
      const { unmount } = render(
        <MotionConfig reducedMotion="always">
          <FlowField seed={8} />
        </MotionConfig>,
      )
      runs.push(ctx.lineTo.mock.calls.slice(0, 50))
      unmount()
    }
    expect(runs[0].length).toBeGreaterThan(0)
    expect(runs[0]).toEqual(runs[1])
  })

  it('holds a still frame at speed 0', () => {
    const ctx = stubContext()
    const raf = vi.spyOn(window, 'requestAnimationFrame')
    render(<FlowField speed={0} />)
    expect(ctx.stroke).toHaveBeenCalled()
    expect(raf).not.toHaveBeenCalled()
  })

  it('does not start a loop while off screen', () => {
    stubContext()
    const raf = vi.spyOn(window, 'requestAnimationFrame')
    render(<FlowField />)
    expect(raf).not.toHaveBeenCalled()
  })

  it('survives a browser without canvas', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const { container } = render(<FlowField />)
    expect(container.querySelector('[data-flow-field]')).not.toBeNull()
  })
})
