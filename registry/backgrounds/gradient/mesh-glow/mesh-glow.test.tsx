import { render } from '@testing-library/react'
import { MeshGlow } from './mesh-glow'

let reduced = false
vi.mock('motion/react', async (orig) => ({
  ...(await orig<typeof import('motion/react')>()),
  useReducedMotion: () => reduced,
}))

describe('MeshGlow', () => {
  beforeEach(() => {
    reduced = false
  })

  it('is decorative and never intercepts pointer events', () => {
    const { container } = render(<MeshGlow />)
    const el = container.firstElementChild as HTMLElement
    expect(el).toHaveAttribute('aria-hidden', 'true')
    expect(el.className).toContain('pointer-events-none')
  })

  it('renders three glows', () => {
    const { container } = render(<MeshGlow animated={false} />)
    expect(container.querySelectorAll('.rounded-full')).toHaveLength(3)
  })

  it('still renders under reduced motion', () => {
    reduced = true
    const { container } = render(<MeshGlow intensity={0.5} />)
    expect(container.querySelectorAll('.rounded-full')).toHaveLength(3)
  })
})
