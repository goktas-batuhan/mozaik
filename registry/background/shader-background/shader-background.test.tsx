import { render, screen } from '@testing-library/react'
import { ShaderBackground } from './shader-background'

describe('ShaderBackground', () => {
  beforeEach(() => {
    // jsdom has no WebGL; this is the same path as a browser without it.
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders its children above a hidden, non-interactive layer', () => {
    const { container } = render(
      <ShaderBackground>
        <h1>Weather</h1>
      </ShaderBackground>,
    )
    expect(screen.getByRole('heading', { name: 'Weather' })).toBeInTheDocument()
    const layer = container.querySelector('[data-shader]')!
    expect(layer).toHaveAttribute('aria-hidden', 'true')
    expect(layer).toHaveClass('pointer-events-none')
  })

  it('falls back to a CSS gradient without WebGL and never starts a loop', () => {
    const raf = vi.spyOn(window, 'requestAnimationFrame')
    const { container } = render(<ShaderBackground />)
    expect(container.querySelector('canvas')).toBeNull()
    expect(container.querySelector('[data-fallback]')).not.toBeNull()
    expect(raf).not.toHaveBeenCalled()
  })

  it('scales the fallback with intensity', () => {
    const { container } = render(<ShaderBackground intensity={0.3} speed={0} />)
    expect(container.querySelector<HTMLElement>('[data-fallback]')!.style.opacity).toBe('0.5')
  })
})
