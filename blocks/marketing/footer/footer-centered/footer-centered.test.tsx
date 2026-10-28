import { render, screen } from '@testing-library/react'
import { FooterCentered } from './footer-centered'

describe('FooterCentered', () => {
  it('renders the link row inside a labelled nav', () => {
    render(<FooterCentered brand="Acme" links={[{ label: 'Docs', href: '/docs' }, { label: 'Blog', href: '/blog' }]} />)
    const nav = screen.getByRole('navigation', { name: 'Footer' })
    expect(nav).toContainElement(screen.getByRole('link', { name: 'Docs' }))
    expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog')
  })

  it('names the icon links', () => {
    render(<FooterCentered brand="Acme" social={[{ label: 'Mail', href: 'mailto:a@b.co', icon: <svg /> }]} />)
    expect(screen.getByRole('link', { name: 'Mail' })).toHaveAttribute('href', 'mailto:a@b.co')
  })

  it('shows tagline and copyright', () => {
    render(<FooterCentered brand="Acme" tagline="Ship calm." copyright="© 2026" />)
    expect(screen.getByText('Ship calm.')).toBeInTheDocument()
    expect(screen.getByText('© 2026')).toBeInTheDocument()
  })

  it('renders no nav or list without links', () => {
    render(<FooterCentered brand="Acme" />)
    expect(screen.queryByRole('navigation')).toBeNull()
  })
})
