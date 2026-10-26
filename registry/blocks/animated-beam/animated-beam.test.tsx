import { render } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { createRef } from 'react'
import { AnimatedBeam } from './animated-beam'

function Diagram({ disabled }: { disabled?: boolean }) {
  const container = createRef<HTMLDivElement>()
  const a = createRef<HTMLDivElement>()
  const b = createRef<HTMLDivElement>()
  return (
    <div ref={container} style={{ position: 'relative' }}>
      <div ref={a} />
      <div ref={b} />
      <AnimatedBeam containerRef={container} fromRef={a} toRef={b} disabled={disabled} />
    </div>
  )
}

describe('AnimatedBeam', () => {
  it('renders a decorative svg with a resting path', () => {
    const { container } = render(<Diagram />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg.querySelectorAll('path').length).toBeGreaterThanOrEqual(1)
    expect(svg.querySelector('linearGradient')).not.toBeNull()
  })

  it('uses tokens, not literal colors, for the gradient', () => {
    const { container } = render(<Diagram />)
    expect(container.innerHTML).not.toMatch(/#[0-9a-f]{3,6}\b/i)
  })

  it('has no focusable elements', () => {
    const { container } = render(<Diagram />)
    expect(container.querySelector('svg')).toHaveAttribute('focusable', 'false')
    expect(container.querySelector('[tabindex]')).toBeNull()
  })

  it('draws no travelling gradient under reduced motion', () => {
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <Diagram />
      </MotionConfig>,
    )
    expect(container.querySelector('linearGradient')).toBeNull()
    expect(container.querySelectorAll('path')).toHaveLength(2)
  })

  it('draws no travelling gradient when disabled', () => {
    const { container } = render(<Diagram disabled />)
    expect(container.querySelector('linearGradient')).toBeNull()
  })
})
