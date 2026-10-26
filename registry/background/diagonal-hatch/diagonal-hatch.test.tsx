import { render } from '@testing-library/react'
import { DiagonalHatch } from './diagonal-hatch'

describe('DiagonalHatch', () => {
  it('is decorative and never intercepts pointer events', () => {
    const { container } = render(<DiagonalHatch />)
    const el = container.firstElementChild as HTMLElement
    expect(el).toHaveAttribute('aria-hidden', 'true')
    expect(el.className).toContain('pointer-events-none')
  })

  it('uses the requested angle and spacing', () => {
    const { container } = render(<DiagonalHatch angle={135} spacing={16} />)
    const bg = (container.firstElementChild as HTMLElement).style.backgroundImage
    expect(bg).toContain('135deg')
    expect(bg).toContain('16px')
  })

  it('drops the edge mask when fade is off', () => {
    const { container } = render(<DiagonalHatch fade={false} />)
    expect((container.firstElementChild as HTMLElement).style.maskImage).toBeFalsy()
  })
})
