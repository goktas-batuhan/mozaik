import { render } from '@testing-library/react'
import { ProgressiveBlur } from './progressive-blur'

describe('ProgressiveBlur', () => {
  it('renders one layer per blur level', () => {
    const { container } = render(<ProgressiveBlur blurLevels={[1, 2, 4]} />)
    expect(container.querySelectorAll('[aria-hidden="true"] > div')).toHaveLength(3)
  })

  it('is decorative: aria-hidden and not clickable', () => {
    const { container } = render(<ProgressiveBlur />)
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveAttribute('aria-hidden', 'true')
    expect(root).toHaveClass('pointer-events-none')
  })

  it('puts the edge where position says', () => {
    const top = render(<ProgressiveBlur position="top" />).container
    expect(top.querySelectorAll('[data-position]')).toHaveLength(1)
    expect(top.firstElementChild).toHaveClass('top-0')

    const bottom = render(<ProgressiveBlur position="bottom" />).container
    expect(bottom.firstElementChild).toHaveClass('bottom-0')

    const both = render(<ProgressiveBlur position="both" />).container
    expect(both.querySelectorAll('[data-position]')).toHaveLength(2)
  })

  it('applies height and className', () => {
    const { container } = render(<ProgressiveBlur height="4rem" className="custom" />)
    const root = container.firstElementChild as HTMLElement
    expect(root.style.height).toBe('4rem')
    expect(root).toHaveClass('custom')
  })
})
