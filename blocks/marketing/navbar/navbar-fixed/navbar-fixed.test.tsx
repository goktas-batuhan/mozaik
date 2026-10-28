import { render, screen } from '@testing-library/react'
import { NavbarFixed } from './navbar-fixed'

const links = [
  { label: 'Product', href: '/product', current: true },
  { label: 'Pricing', href: '/pricing' },
]

describe('NavbarFixed', () => {
  it('renders a banner with a labelled nav', () => {
    render(<NavbarFixed brand="Acme" links={links} label="Primary" />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
  })

  it('marks only the current link with aria-current', () => {
    render(<NavbarFixed brand="Acme" links={links} />)
    expect(screen.getByRole('link', { name: 'Product' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Pricing' })).not.toHaveAttribute('aria-current')
  })

  it('links the brand to brandHref and renders both actions', () => {
    render(
      <NavbarFixed
        brand="Acme"
        brandHref="/home"
        links={links}
        secondaryAction={{ label: 'Sign in', href: '/login' }}
        primaryAction={{ label: 'Start', href: '/start' }}
      />,
    )
    expect(screen.getByRole('link', { name: 'Acme' })).toHaveAttribute('href', '/home')
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login')
    expect(screen.getByRole('link', { name: 'Start' })).toHaveAttribute('href', '/start')
  })

  it('applies the requested positioning', () => {
    const { rerender } = render(<NavbarFixed brand="Acme" links={links} />)
    expect(screen.getByRole('banner')).toHaveClass('sticky')
    rerender(<NavbarFixed brand="Acme" links={links} position="fixed" />)
    expect(screen.getByRole('banner')).toHaveClass('fixed')
    rerender(<NavbarFixed brand="Acme" links={links} position="static" />)
    expect(screen.getByRole('banner')).not.toHaveClass('sticky', 'fixed')
  })
})
