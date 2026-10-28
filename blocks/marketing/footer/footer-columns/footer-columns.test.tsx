import { render, screen, within } from '@testing-library/react'
import { FooterColumns } from './footer-columns'

const columns = [
  { title: 'Product', links: [{ label: 'Pricing', href: '/pricing' }, { label: 'Docs', href: '/docs' }] },
  { title: 'Company', links: [{ label: 'About', href: '/about' }] },
]

describe('FooterColumns', () => {
  it('renders a contentinfo landmark with a labelled nav', () => {
    render(<FooterColumns brand="Acme" columns={columns} />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Footer' })).toBeInTheDocument()
  })

  it('groups links under their column headings', () => {
    render(<FooterColumns brand="Acme" columns={columns} />)
    expect(screen.getByRole('heading', { name: 'Product' })).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Footer' })
    expect(within(nav).getByRole('link', { name: 'Pricing' })).toHaveAttribute('href', '/pricing')
    expect(within(nav).getAllByRole('list')).toHaveLength(2)
  })

  it('shows the description, copyright and legal links when given', () => {
    render(
      <FooterColumns
        brand="Acme"
        description="We build things."
        columns={columns}
        copyright="© 2026 Acme"
        legalLinks={[{ label: 'Terms', href: '/terms' }]}
      />,
    )
    expect(screen.getByText('We build things.')).toBeInTheDocument()
    expect(screen.getByText('© 2026 Acme')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms')
  })

  it('omits the bottom bar without copyright or legal links', () => {
    const { container } = render(<FooterColumns brand="Acme" columns={columns} />)
    expect(container.querySelector('.border-t.pt-6')).toBeNull()
  })
})
