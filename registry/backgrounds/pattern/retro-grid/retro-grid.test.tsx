import { render } from '@testing-library/react'
import { RetroGrid } from './retro-grid'

describe('RetroGrid', () => {
  it('is decorative and does not intercept the pointer', () => {
    const { container } = render(<RetroGrid />)
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveAttribute('aria-hidden', 'true')
    expect(root.className).toContain('pointer-events-none')
  })

  it('tilts the floor by the angle prop', () => {
    const { container } = render(<RetroGrid angle={50} />)
    const tilted = container.firstElementChild?.firstElementChild as HTMLElement
    expect(tilted.style.transform).toBe('rotateX(50deg)')
  })

  it('renders nothing when disabled', () => {
    const { container } = render(<RetroGrid disabled />)
    expect(container).toBeEmptyDOMElement()
  })
})
