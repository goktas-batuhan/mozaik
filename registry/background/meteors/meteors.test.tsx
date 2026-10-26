import { render } from '@testing-library/react'
import { Meteors } from './meteors'

describe('Meteors', () => {
  it('is decorative and does not intercept the pointer', () => {
    const { container } = render(<Meteors />)
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveAttribute('aria-hidden', 'true')
    expect(root.className).toContain('pointer-events-none')
  })

  it('renders the requested number of meteors', () => {
    const { container } = render(<Meteors number={7} />)
    expect(container.firstElementChild?.children).toHaveLength(7)
  })

  it('renders nothing when disabled', () => {
    const { container } = render(<Meteors disabled />)
    expect(container).toBeEmptyDOMElement()
  })
})
