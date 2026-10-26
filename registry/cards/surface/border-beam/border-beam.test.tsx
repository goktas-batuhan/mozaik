import { render } from '@testing-library/react'
import { BorderBeam } from './border-beam'

describe('BorderBeam', () => {
  it('is decorative and does not intercept the pointer', () => {
    const { container } = render(<BorderBeam />)
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveAttribute('aria-hidden', 'true')
    expect(root.className).toContain('pointer-events-none')
  })

  it('renders nothing when disabled', () => {
    const { container } = render(<BorderBeam disabled />)
    expect(container).toBeEmptyDOMElement()
  })

  it('passes colors and border width through as CSS variables', () => {
    const { container } = render(<BorderBeam colorFrom="red" borderWidth={3} />)
    const root = container.firstElementChild as HTMLElement
    expect(root.style.getPropertyValue('--beam-width')).toBe('3px')
    expect((root.firstElementChild as HTMLElement).style.getPropertyValue('--beam-from')).toBe('red')
  })
})
