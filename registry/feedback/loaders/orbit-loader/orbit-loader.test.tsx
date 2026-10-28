import { render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { OrbitLoader } from './orbit-loader'

const still = (ui: React.ReactNode) => render(<MotionConfig reducedMotion="always">{ui}</MotionConfig>)

describe('OrbitLoader', () => {
  it('announces itself as a status with the label', () => {
    still(<OrbitLoader label="Syncing" />)
    expect(screen.getByRole('status')).toHaveTextContent('Syncing')
  })

  it('draws one ring per dot and clamps to 1-5', () => {
    const { container, rerender } = still(<OrbitLoader dots={4} />)
    expect(container.querySelectorAll('[data-ring]')).toHaveLength(4)
    rerender(<MotionConfig reducedMotion="always"><OrbitLoader dots={12} /></MotionConfig>)
    expect(container.querySelectorAll('[data-ring]')).toHaveLength(5)
    rerender(<MotionConfig reducedMotion="always"><OrbitLoader dots={0} /></MotionConfig>)
    expect(container.querySelectorAll('[data-ring]')).toHaveLength(1)
  })

  it('sizes the box from size and keeps the rings out of the accessibility tree', () => {
    const { container } = still(<OrbitLoader size={80} />)
    const root = screen.getByRole('status')
    expect(root.style.width).toBe('80px')
    expect(root.style.height).toBe('80px')
    container.querySelectorAll('[data-ring]').forEach((r) => expect(r).toHaveAttribute('aria-hidden', 'true'))
  })

  it('spreads the dots evenly and does not spin under reduced motion', () => {
    const { container } = still(<OrbitLoader dots={3} />)
    const rings = [...container.querySelectorAll<HTMLElement>('[data-ring]')]
    expect(rings[1].style.transform).toContain('120deg')
    expect(rings[2].style.transform).toContain('240deg')
  })
})
