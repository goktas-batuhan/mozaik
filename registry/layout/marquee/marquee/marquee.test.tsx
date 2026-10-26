import { render, screen } from '@testing-library/react'
import { Marquee } from './marquee'

describe('Marquee', () => {
  it('renders the requested number of copies', () => {
    render(
      <Marquee repeat={3} data-testid="m">
        <span>item</span>
      </Marquee>,
    )
    expect(screen.getAllByText('item')).toHaveLength(3)
  })

  it('hides every copy after the first from assistive tech', () => {
    const { container } = render(
      <Marquee repeat={3}>
        <span>item</span>
      </Marquee>,
    )
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2)
  })

  it('stays mounted when disabled', () => {
    render(
      <Marquee disabled repeat={2}>
        <span>still</span>
      </Marquee>,
    )
    expect(screen.getAllByText('still').length).toBeGreaterThan(0)
  })
})
