import { render, screen } from '@testing-library/react'
import { Spotlight } from './spotlight'

const layers = (root: Element) => root.querySelectorAll('[aria-hidden]')

describe('Spotlight', () => {
  it('renders its children', () => {
    render(
      <Spotlight>
        <h3>Card</h3>
      </Spotlight>,
    )
    expect(screen.getByRole('heading', { name: 'Card' })).toBeInTheDocument()
  })

  it('draws decorative, click-through light layers', () => {
    const { container } = render(<Spotlight>Card</Spotlight>)
    expect(layers(container)).toHaveLength(2)
    layers(container).forEach((layer) => expect(layer).toHaveClass('pointer-events-none'))
  })

  it('rests as a static light without a fine pointer', () => {
    // jsdom reports no fine pointer, the same path touch devices and reduced motion take.
    const { container } = render(<Spotlight>Card</Spotlight>)
    const root = container.firstElementChild as HTMLElement
    expect(root.style.getPropertyValue('--spot-fill')).toBe('1')
    expect(root.style.getPropertyValue('--spot-y')).toBe('0%')
  })

  it('drops the edge glow with border={false} and every layer when disabled', () => {
    const { container, rerender } = render(<Spotlight border={false}>Card</Spotlight>)
    expect(layers(container)).toHaveLength(1)
    rerender(<Spotlight disabled>Card</Spotlight>)
    expect(layers(container)).toHaveLength(0)
  })
})
