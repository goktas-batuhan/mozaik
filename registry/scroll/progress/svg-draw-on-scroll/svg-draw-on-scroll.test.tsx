import { MotionConfig } from 'motion/react'
import { render } from '@testing-library/react'
import { SvgDrawOnScroll } from './svg-draw-on-scroll'

describe('SvgDrawOnScroll', () => {
  it('renders one path per d string', () => {
    const { container } = render(<SvgDrawOnScroll paths={['M0 0 L10 10', 'M10 10 L20 0']} />)
    expect(container.querySelectorAll('path')).toHaveLength(2)
  })

  it('hides the drawing from assistive tech', () => {
    const { container } = render(<SvgDrawOnScroll paths={['M0 0 L10 10']} />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('uses the given viewBox', () => {
    const { container } = render(<SvgDrawOnScroll paths={['M0 0']} viewBox="0 0 200 50" />)
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 200 50')
  })

  it('draws the full stroke under reduced motion', () => {
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <SvgDrawOnScroll paths={['M0 0 L10 10']} />
      </MotionConfig>,
    )
    expect(container.querySelector('path')).toHaveAttribute('pathLength', '1')
  })
})
