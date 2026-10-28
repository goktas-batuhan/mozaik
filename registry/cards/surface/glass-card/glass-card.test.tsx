import { fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { GlassCard } from './glass-card'

function stubHover(matches: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches, media: query, addEventListener() {}, removeEventListener() {} }))
}
afterEach(() => vi.unstubAllGlobals())

describe('GlassCard', () => {
  it('renders its children inside the pane', () => {
    render(<GlassCard>Hello glass</GlassCard>)
    expect(screen.getByText('Hello glass').closest('[data-slot="glass-card"]')).toBeInTheDocument()
  })

  it('applies blur, radius and tint', () => {
    render(<GlassCard blur={20} radius={12} tint="rgb(0 0 0 / 0.2)">x</GlassCard>)
    const pane = screen.getByText('x')
    expect(pane.style.borderRadius).toBe('12px')
    expect(pane.style.backdropFilter).toContain('blur(20px)')
    expect(pane.style.background).toContain('0.2')
  })

  it('moves the specular light with the pointer on hover devices', () => {
    stubHover(true)
    render(<GlassCard>x</GlassCard>)
    const pane = screen.getByText('x')
    pane.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100, x: 0, y: 0, toJSON() {} })
    fireEvent.pointerMove(pane, { clientX: 100, clientY: 50 })
    expect(pane.style.getPropertyValue('--glass-x')).toBe('50%')
    expect(pane.style.getPropertyValue('--glass-y')).toBe('50%')
    fireEvent.pointerLeave(pane)
    expect(pane.style.getPropertyValue('--glass-x')).toBe('30%')
  })

  it('keeps the light still on touch devices and under reduced motion', () => {
    stubHover(false)
    const { unmount } = render(<GlassCard>x</GlassCard>)
    fireEvent.pointerMove(screen.getByText('x'), { clientX: 80, clientY: 20 })
    expect(screen.getByText('x').style.getPropertyValue('--glass-x')).toBe('30%')
    unmount()
    stubHover(true)
    render(
      <MotionConfig reducedMotion="always">
        <GlassCard>y</GlassCard>
      </MotionConfig>,
    )
    fireEvent.pointerMove(screen.getByText('y'), { clientX: 80, clientY: 20 })
    expect(screen.getByText('y').style.getPropertyValue('--glass-x')).toBe('30%')
  })

  it('omits the specular layer when turned off', () => {
    const { container } = render(<GlassCard specular={false}>x</GlassCard>)
    expect(container.querySelector('[data-slot="specular"]')).toBeNull()
  })
})
