import { render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { SkeletonBar, SkeletonReveal } from './skeleton-reveal'

const still = (ui: React.ReactNode) => render(<MotionConfig reducedMotion="always">{ui}</MotionConfig>)
const wrap = (loading: boolean, extra = {}) => (
  <MotionConfig reducedMotion="always">
    <SkeletonReveal loading={loading} {...extra}><p>Profile ready</p></SkeletonReveal>
  </MotionConfig>
)

describe('SkeletonReveal', () => {
  it('announces loading and hides the content while loading', () => {
    const { container } = still(<SkeletonReveal loading label="Fetching profile"><p>Profile ready</p></SkeletonReveal>)
    expect(screen.getByRole('status')).toHaveTextContent('Fetching profile')
    expect(container.firstElementChild).toHaveAttribute('aria-busy', 'true')
    expect(container.querySelector('[data-content]')).toHaveAttribute('aria-hidden', 'true')
  })

  it('reveals the content and drops the status once loaded', () => {
    const { container, rerender } = still(<SkeletonReveal loading><p>Profile ready</p></SkeletonReveal>)
    rerender(wrap(false))
    expect(screen.queryByRole('status')).toBeNull()
    expect(container.querySelector('[data-content]')).toHaveAttribute('aria-hidden', 'false')
    expect(container.querySelector('[data-content]')).not.toHaveAttribute('inert')
    expect(container.firstElementChild).toHaveAttribute('aria-busy', 'false')
  })

  it('keeps the content laid out while loading so the box keeps its size', () => {
    const { container } = still(<SkeletonReveal loading><p>Profile ready</p></SkeletonReveal>)
    expect(container.querySelector('[data-content]')).toContainElement(screen.getByText('Profile ready', { selector: 'p' }))
  })

  it('renders a custom placeholder', () => {
    still(<SkeletonReveal loading placeholder={<b data-testid="mine" />}><p>x</p></SkeletonReveal>)
    expect(screen.getByTestId('mine')).toBeInTheDocument()
  })

  it('SkeletonBar is decorative and pulses only when motion is allowed', () => {
    const { container } = still(<SkeletonBar />)
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.firstElementChild).not.toHaveClass('animate-pulse')
  })
})
