import { render, screen } from '@testing-library/react'
import { AuroraBackground } from './aurora-background'

const motionState = vi.hoisted(() => ({ reduced: false }))

vi.mock('motion/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('motion/react')>()),
  useReducedMotion: () => motionState.reduced,
  useInView: () => true,
}))

function stubAnimate() {
  const animation = { play: vi.fn(), pause: vi.fn(), cancel: vi.fn() }
  const animate = vi.fn(() => animation as unknown as Animation)
  Object.defineProperty(HTMLElement.prototype, 'animate', { value: animate, configurable: true, writable: true })
  return { animate, animation }
}

describe('AuroraBackground', () => {
  afterEach(() => {
    motionState.reduced = false
    delete (HTMLElement.prototype as Partial<HTMLElement>).animate
  })

  it('renders its children above a hidden, non-interactive layer', () => {
    const { container } = render(
      <AuroraBackground>
        <h1>Hello</h1>
      </AuroraBackground>,
    )
    expect(screen.getByRole('heading', { name: 'Hello' })).toBeInTheDocument()
    const layer = container.querySelector('[data-aurora]')!
    expect(layer).toHaveAttribute('aria-hidden', 'true')
    expect(layer).toHaveClass('pointer-events-none')
  })

  it('clamps intensity into the layer opacity', () => {
    const { container, rerender } = render(<AuroraBackground intensity={2} />)
    const layer = container.querySelector<HTMLElement>('[data-aurora]')!
    expect(layer.style.opacity).toBe('1')
    rerender(<AuroraBackground intensity={0.4} />)
    expect(layer.style.opacity).toBe('0.4')
  })

  it('drifts every blob on the compositor and scales duration with speed', () => {
    const { animate, animation } = stubAnimate()
    const { unmount } = render(<AuroraBackground speed={2} />)
    expect(animate).toHaveBeenCalledTimes(4)
    const [, options] = animate.mock.calls[0] as unknown as [Keyframe[], KeyframeAnimationOptions]
    expect(options.duration).toBe(9000)
    unmount()
    expect(animation.cancel).toHaveBeenCalled()
  })

  it('holds still under reduced motion', () => {
    motionState.reduced = true
    const { animate } = stubAnimate()
    render(<AuroraBackground />)
    expect(animate).not.toHaveBeenCalled()
  })
})
