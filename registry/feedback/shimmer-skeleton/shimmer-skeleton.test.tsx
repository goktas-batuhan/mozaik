import { render, screen } from '@testing-library/react'
import { ShimmerSkeleton } from './shimmer-skeleton'

let reduced = false
vi.mock('motion/react', async (orig) => ({
  ...(await orig<typeof import('motion/react')>()),
  useReducedMotion: () => reduced,
}))

describe('ShimmerSkeleton', () => {
  beforeEach(() => {
    reduced = false
  })

  it('announces a busy status while loading', () => {
    render(<ShimmerSkeleton label="Loading profile" />)
    const el = screen.getByRole('status', { name: 'Loading profile' })
    expect(el).toHaveAttribute('aria-busy', 'true')
  })

  it('renders the children untouched when loading is false', () => {
    render(
      <ShimmerSkeleton loading={false}>
        <p>Real content</p>
      </ShimmerSkeleton>,
    )
    expect(screen.getByText('Real content')).toBeVisible()
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('hides children while loading but keeps them for layout', () => {
    render(
      <ShimmerSkeleton>
        <p>Hidden text</p>
      </ShimmerSkeleton>,
    )
    expect(screen.getByText('Hidden text').parentElement).toHaveAttribute('aria-hidden', 'true')
  })

  it('drops the shimmer under reduced motion', () => {
    reduced = true
    const { container } = render(<ShimmerSkeleton />)
    expect(container.querySelectorAll('[aria-hidden]')).toHaveLength(0)
  })
})
