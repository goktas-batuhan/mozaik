import { render } from '@testing-library/react'
import { ScrollProgress } from './scroll-progress'

describe('ScrollProgress', () => {
  it('is decorative and does not intercept the pointer', () => {
    const { container } = render(<ScrollProgress />)
    const bar = container.firstElementChild as HTMLElement
    expect(bar).toHaveAttribute('aria-hidden', 'true')
    expect(bar.className).toContain('pointer-events-none')
  })

  it('merges className so position can be overridden', () => {
    const { container } = render(<ScrollProgress className="absolute h-1" />)
    const bar = container.firstElementChild as HTMLElement
    expect(bar).toHaveClass('absolute', 'h-1')
    expect(bar).not.toHaveClass('fixed')
  })

  it('renders nothing when disabled', () => {
    const { container } = render(<ScrollProgress disabled />)
    expect(container).toBeEmptyDOMElement()
  })
})
