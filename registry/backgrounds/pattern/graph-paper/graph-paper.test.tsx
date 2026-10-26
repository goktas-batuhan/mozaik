import { render } from '@testing-library/react'
import { GraphPaper } from './graph-paper'

describe('GraphPaper', () => {
  it('is decorative and never intercepts pointer events', () => {
    const { container } = render(<GraphPaper />)
    const el = container.firstElementChild as HTMLElement
    expect(el).toHaveAttribute('aria-hidden', 'true')
    expect(el.className).toContain('pointer-events-none')
  })

  it('draws the major grid only when majorEvery is above zero', () => {
    const { container, rerender } = render(<GraphPaper size={20} majorEvery={5} />)
    expect((container.firstElementChild as HTMLElement).style.backgroundSize).toContain('100px 100px')
    rerender(<GraphPaper size={20} majorEvery={0} />)
    expect((container.firstElementChild as HTMLElement).style.backgroundSize).not.toContain('100px')
  })

  it('merges extra classes', () => {
    const { container } = render(<GraphPaper className="opacity-50" />)
    expect(container.firstElementChild?.className).toContain('opacity-50')
  })
})
