import { render, screen } from '@testing-library/react'
import { OrbitingCircles } from './orbiting-circles'

describe('OrbitingCircles', () => {
  it('renders every child', () => {
    render(
      <OrbitingCircles>
        <span>a</span>
        <span>b</span>
        <span>c</span>
      </OrbitingCircles>,
    )
    expect(screen.getAllByText(/^[abc]$/)).toHaveLength(3)
  })

  it('draws the ring only when path is on', () => {
    const { container, rerender } = render(
      <OrbitingCircles>
        <span>a</span>
      </OrbitingCircles>,
    )
    expect(container.querySelector('circle')).not.toBeNull()
    rerender(
      <OrbitingCircles path={false}>
        <span>a</span>
      </OrbitingCircles>,
    )
    expect(container.querySelector('circle')).toBeNull()
  })

  it('places items at rest when disabled', () => {
    const { container } = render(
      <OrbitingCircles disabled radius={100}>
        <span>a</span>
      </OrbitingCircles>,
    )
    expect(container.querySelector('[style*="translateX(100px)"]')).not.toBeNull()
  })
})
