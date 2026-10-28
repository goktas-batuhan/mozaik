import { render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { GlyphMatrix } from './glyph-matrix'

function stubContext() {
  const ctx = {
    clearRect: vi.fn(),
    setTransform: vi.fn(),
    fillText: vi.fn(),
    font: '',
    textBaseline: '',
    fillStyle: '',
    globalAlpha: 1,
  }
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D)
  vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({ width: 70, height: 42 } as DOMRect)
  return ctx
}

describe('GlyphMatrix', () => {
  afterEach(() => vi.restoreAllMocks())

  it('renders children above a hidden, non-interactive layer', () => {
    stubContext()
    const { container } = render(
      <GlyphMatrix>
        <h1>Matrix</h1>
      </GlyphMatrix>,
    )
    expect(screen.getByRole('heading', { name: 'Matrix' })).toBeInTheDocument()
    const layer = container.querySelector('[data-glyph-matrix]')!
    expect(layer).toHaveAttribute('aria-hidden', 'true')
    expect(layer).toHaveClass('pointer-events-none')
  })

  it('writes one glyph per cell and starts no loop under reduced motion', () => {
    const ctx = stubContext()
    const raf = vi.spyOn(window, 'requestAnimationFrame')
    render(
      <MotionConfig reducedMotion="always">
        <GlyphMatrix cellSize={14} />
      </MotionConfig>,
    )
    // 70x42 at 14px is 5 columns by 3 rows.
    expect(ctx.fillText).toHaveBeenCalledTimes(15)
    expect(raf).not.toHaveBeenCalled()
  })

  it('only draws characters from the glyph set', () => {
    const ctx = stubContext()
    render(
      <MotionConfig reducedMotion="always">
        <GlyphMatrix glyphs="AB" />
      </MotionConfig>,
    )
    const drawn = new Set(ctx.fillText.mock.calls.map((call) => call[0]))
    expect([...drawn].every((c) => c === 'A' || c === 'B')).toBe(true)
  })

  it('does not start a loop while off screen', () => {
    stubContext()
    const raf = vi.spyOn(window, 'requestAnimationFrame')
    render(<GlyphMatrix />)
    expect(raf).not.toHaveBeenCalled()
  })

  it('survives a browser without canvas', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const { container } = render(<GlyphMatrix />)
    expect(container.querySelector('[data-glyph-matrix]')).not.toBeNull()
  })
})
