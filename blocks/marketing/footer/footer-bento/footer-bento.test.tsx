import { render, screen } from '@testing-library/react'
import { FooterBento } from './footer-bento'

describe('FooterBento', () => {
  it('renders the call to action as links', () => {
    render(
      <FooterBento
        title="Start today"
        primaryAction={{ label: 'Get started', href: '/start' }}
        secondaryAction={{ label: 'Demo', href: '/demo' }}
      />,
    )
    expect(screen.getByRole('heading', { name: 'Start today' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '/start')
    expect(screen.getByRole('link', { name: 'Demo' })).toHaveAttribute('href', '/demo')
  })

  it('shows social pills and a labelled company nav', () => {
    render(
      <FooterBento
        title="T"
        social={[{ label: 'GitHub', href: '/gh' }]}
        links={[{ label: 'About', href: '/about' }]}
      />,
    )
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', '/gh')
    expect(screen.getByRole('navigation', { name: 'Footer' })).toContainElement(screen.getByRole('link', { name: 'About' }))
  })

  it('hides the decorative mark from assistive tech', () => {
    const { container } = render(<FooterBento title="T" mark={<svg data-testid="mark" />} />)
    expect(container.querySelector('[aria-hidden="true"] [data-testid="mark"]')).not.toBeNull()
  })

  it('skips cards that have no content', () => {
    render(<FooterBento title="T" />)
    expect(screen.queryByText('Connect')).toBeNull()
    expect(screen.queryByRole('navigation')).toBeNull()
  })
})
