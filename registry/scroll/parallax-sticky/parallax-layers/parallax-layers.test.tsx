import { MotionConfig } from 'motion/react'
import { render, screen } from '@testing-library/react'
import { type ParallaxLayer, ParallaxLayers } from './parallax-layers'

const layers: ParallaxLayer[] = [
  { id: 'a', depth: 0.2, content: <span>back</span> },
  { id: 'b', depth: 1, content: <span>front</span>, blur: 3, opacity: 0.5 },
]

describe('ParallaxLayers', () => {
  it('renders every layer', () => {
    render(<ParallaxLayers layers={layers} />)
    expect(screen.getByText('back')).toBeInTheDocument()
    expect(screen.getByText('front')).toBeInTheDocument()
  })

  it('applies blur and opacity to a layer', () => {
    render(<ParallaxLayers layers={layers} />)
    const wrapper = screen.getByText('front').parentElement as HTMLElement
    expect(wrapper.style.filter).toBe('blur(3px)')
    expect(wrapper.style.opacity).toBe('0.5')
  })

  it('does not translate layers under reduced motion', () => {
    render(
      <MotionConfig reducedMotion="always">
        <ParallaxLayers layers={layers} />
      </MotionConfig>,
    )
    const wrapper = screen.getByText('front').parentElement as HTMLElement
    expect(wrapper.style.transform === '' || wrapper.style.transform === 'none').toBe(true)
  })

  it('passes className to the root', () => {
    const { container } = render(<ParallaxLayers layers={layers} className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })
})
