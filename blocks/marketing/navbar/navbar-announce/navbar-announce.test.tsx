import { fireEvent, render, screen } from '@testing-library/react'
import { NavbarAnnounce } from './navbar-announce'

const links = [{ label: 'Product', href: '/product', current: true }, { label: 'Docs', href: '/docs' }]

describe('NavbarAnnounce', () => {
  it('shows the announcement with its link', () => {
    render(
      <NavbarAnnounce
        brand="Acme"
        links={links}
        announcement="Version 2 is out."
        announcementAction={{ label: 'Read more', href: '/v2' }}
      />,
    )
    expect(screen.getByText(/Version 2 is out/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Read more' })).toHaveAttribute('href', '/v2')
  })

  it('dismisses the strip and calls onDismiss once', () => {
    const onDismiss = vi.fn()
    render(<NavbarAnnounce brand="Acme" links={links} announcement="News" onDismiss={onDismiss} />)
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss announcement' }))
    expect(screen.queryByText('News')).toBeNull()
    expect(screen.queryByRole('button', { name: 'Dismiss announcement' })).toBeNull()
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('renders no strip without an announcement', () => {
    render(<NavbarAnnounce brand="Acme" links={links} />)
    expect(screen.queryByRole('button', { name: 'Dismiss announcement' })).toBeNull()
  })

  it('marks the current page and renders both actions', () => {
    render(
      <NavbarAnnounce
        brand="Acme"
        links={links}
        secondaryAction={{ label: 'Sign in', href: '/login' }}
        primaryAction={{ label: 'Start', href: '/start' }}
      />,
    )
    expect(screen.getByRole('link', { name: 'Product' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login')
    expect(screen.getByRole('link', { name: 'Start' })).toHaveAttribute('href', '/start')
  })
})
