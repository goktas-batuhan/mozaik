import { render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { LightRays } from './light-rays'

describe('LightRays', () => {
  it('renders children above a hidden, non-interactive layer', () => {
    const { container } = render(
      <LightRays>
        <h1>Light</h1>
      </LightRays>,
    )
    expect(screen.getByRole('heading', { name: 'Light' })).toBeInTheDocument()
    const layer = container.querySelector('[data-light-rays]')!
    expect(layer).toHaveAttribute('aria-hidden', 'true')
    expect(layer).toHaveClass('pointer-events-none')
  })

  it('draws as many rays as asked for', () => {
    const { container, rerender } = render(<LightRays count={4} />)
    expect(container.querySelectorAll('[data-ray]')).toHaveLength(4)
    rerender(<LightRays count={0} />)
    expect(container.querySelectorAll('[data-ray]')).toHaveLength(0)
  })

  it('lays the rays out the same way for the same seed', () => {
    const layout = () =>
      Array.from(document.querySelectorAll('[data-ray]')).map((el) => (el as HTMLElement).style.getPropertyValue('--ray-left'))
    const first = render(<LightRays seed={9} />)
    const a = layout()
    first.unmount()
    render(<LightRays seed={9} />)
    expect(layout()).toEqual(a)
  })

  it('passes the color and blur to the rays as custom properties', () => {
    const { container } = render(<LightRays color="var(--success)" blur={20} />)
    const root = container.firstElementChild as HTMLElement
    expect(root.style.getPropertyValue('--rays-color')).toBe('var(--success)')
    expect(root.style.getPropertyValue('--rays-blur')).toBe('20px')
  })

  it('holds still under reduced motion', () => {
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <LightRays count={3} />
      </MotionConfig>,
    )
    const ray = container.querySelector('[data-ray]') as HTMLElement
    expect(Number(ray.style.opacity)).toBeGreaterThan(0)
  })
})
