import { render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { DotGrid } from './dot-grid'

const originalMatchMedia = window.matchMedia

function mockMedia(matching: string[]) {
  window.matchMedia = ((query: string) => ({
    ...originalMatchMedia(query),
    matches: matching.includes(query),
    addEventListener() {},
    removeEventListener() {},
  })) as typeof window.matchMedia
}

const FINE = '(hover: hover) and (pointer: fine)'

describe('DotGrid', () => {
  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('renders its children above a hidden, non-interactive layer', () => {
    const { container } = render(
      <DotGrid>
        <h1>Grid</h1>
      </DotGrid>,
    )
    expect(screen.getByRole('heading', { name: 'Grid' })).toBeInTheDocument()
    const layer = container.querySelector('[data-dot-grid]')!
    expect(layer).toHaveAttribute('aria-hidden', 'true')
    expect(layer).toHaveClass('pointer-events-none')
  })

  it('spaces the dots by gap and can drop the grain', () => {
    const { container } = render(<DotGrid gap={32} noise={false} />)
    expect(container.querySelector<HTMLElement>('[data-dots]')!.style.backgroundSize).toBe('32px 32px')
    expect(container.querySelector('[data-noise]')).toBeNull()
  })

  it('adds the cursor glow only for a fine pointer', () => {
    const { container, unmount } = render(<DotGrid />)
    expect(container.querySelector('[data-glow]')).toBeNull()
    unmount()

    mockMedia([FINE])
    const fine = render(<DotGrid />)
    expect(fine.container.querySelector('[data-glow]')).not.toBeNull()
    fine.unmount()

    const off = render(<DotGrid glow={false} />)
    expect(off.container.querySelector('[data-glow]')).toBeNull()
  })

  it('stays static under reduced motion', () => {
    mockMedia([FINE])
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <DotGrid />
      </MotionConfig>,
    )
    expect(container.querySelector('[data-glow]')).toBeNull()
  })
})
