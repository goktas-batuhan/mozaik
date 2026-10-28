import { MotionConfig } from 'motion/react'
import { render, screen } from '@testing-library/react'
import { ScrollVelocityMarquee } from './scroll-velocity-marquee'

describe('ScrollVelocityMarquee', () => {
  it('repeats the content to fill the row', () => {
    render(
      <ScrollVelocityMarquee>
        <span>hello</span>
      </ScrollVelocityMarquee>,
    )
    expect(screen.getAllByText('hello').length).toBeGreaterThanOrEqual(3)
  })

  it('keeps only the first copy visible to assistive tech', () => {
    const { container } = render(
      <ScrollVelocityMarquee>
        <span>hello</span>
      </ScrollVelocityMarquee>,
    )
    const copies = screen.getAllByText('hello').length
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(copies - 1)
  })

  it('does not translate under reduced motion', () => {
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <ScrollVelocityMarquee>
          <span>hello</span>
        </ScrollVelocityMarquee>
      </MotionConfig>,
    )
    const track = container.firstElementChild?.firstElementChild as HTMLElement
    expect(track.style.transform === '' || track.style.transform === 'none').toBe(true)
  })

  it('passes className to the root', () => {
    const { container } = render(
      <ScrollVelocityMarquee className="custom">
        <span>x</span>
      </ScrollVelocityMarquee>,
    )
    expect(container.firstChild).toHaveClass('custom')
  })
})
