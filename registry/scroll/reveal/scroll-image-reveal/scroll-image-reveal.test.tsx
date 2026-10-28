import { MotionConfig } from 'motion/react'
import { render, screen } from '@testing-library/react'
import { ScrollImageReveal } from './scroll-image-reveal'

describe('ScrollImageReveal', () => {
  it('renders its children inside the frame', () => {
    render(
      <ScrollImageReveal>
        <p>Picture</p>
      </ScrollImageReveal>,
    )
    expect(screen.getByText('Picture')).toBeInTheDocument()
  })

  it('clips the frame while it has not scrolled into view', () => {
    const { container } = render(<ScrollImageReveal mask="wipe">x</ScrollImageReveal>)
    expect((container.firstChild as HTMLElement).style.clipPath).toContain('inset(')
  })

  it('uses a circle clip for the circle mask', () => {
    const { container } = render(<ScrollImageReveal mask="circle">x</ScrollImageReveal>)
    expect((container.firstChild as HTMLElement).style.clipPath).toContain('circle(')
  })

  it('is fully open and unshifted under reduced motion', () => {
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <ScrollImageReveal mask="circle">x</ScrollImageReveal>
      </MotionConfig>,
    )
    const frame = container.firstChild as HTMLElement
    expect(frame.style.clipPath).toBe('inset(0% 0% 0% 0%)')
    expect((frame.firstChild as HTMLElement).style.top).toBe('0px')
  })

  it('passes className to the frame', () => {
    const { container } = render(<ScrollImageReveal className="custom">x</ScrollImageReveal>)
    expect(container.firstChild).toHaveClass('custom')
  })
})
