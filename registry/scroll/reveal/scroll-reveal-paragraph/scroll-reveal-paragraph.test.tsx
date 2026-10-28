import { MotionConfig } from 'motion/react'
import { render, screen } from '@testing-library/react'
import { ScrollRevealParagraph } from './scroll-reveal-paragraph'

describe('ScrollRevealParagraph', () => {
  it('keeps the full sentence for screen readers', () => {
    render(<ScrollRevealParagraph text="Hello brave new world" />)
    expect(screen.getByText('Hello brave new world', { selector: '.sr-only' })).toBeInTheDocument()
  })

  it('splits the text into one layered word per word', () => {
    const { container } = render(<ScrollRevealParagraph text="one two three" />)
    expect(container.querySelectorAll('[aria-hidden="true"] > span')).toHaveLength(3)
  })

  it('hides the animated words from the accessibility tree', () => {
    const { container } = render(<ScrollRevealParagraph text="one two" />)
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('shows every word at full strength under reduced motion', () => {
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <ScrollRevealParagraph text="one two" />
      </MotionConfig>,
    )
    const overlays = container.querySelectorAll<HTMLElement>('span.absolute')
    expect(overlays).toHaveLength(2)
    overlays.forEach((el) => expect(el.style.opacity).toBe('1'))
  })

  it('passes className to the paragraph', () => {
    const { container } = render(<ScrollRevealParagraph text="x" className="custom" />)
    expect(container.querySelector('p')).toHaveClass('custom')
  })
})
