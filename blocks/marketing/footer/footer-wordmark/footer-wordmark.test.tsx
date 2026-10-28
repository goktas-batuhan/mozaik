import { render, screen } from '@testing-library/react'
import { FooterWordmark } from './footer-wordmark'

describe('FooterWordmark', () => {
  it('hides the oversized wordmark from assistive tech', () => {
    render(<FooterWordmark wordmark="Northwind" />)
    const word = screen.getByText('Northwind')
    expect(word).toHaveAttribute('aria-hidden', 'true')
  })

  it('links the email with mailto', () => {
    render(<FooterWordmark wordmark="Acme" email="hi@example.com" />)
    expect(screen.getByRole('link', { name: 'hi@example.com' })).toHaveAttribute('href', 'mailto:hi@example.com')
  })

  it('renders address lines and social links only when given', () => {
    const { rerender } = render(<FooterWordmark wordmark="Acme" />)
    expect(screen.queryByText('Location')).toBeNull()
    expect(screen.queryByText('Social')).toBeNull()
    rerender(<FooterWordmark wordmark="Acme" address={['1 Main St']} links={[{ label: 'Dribbble', href: '/d' }]} />)
    expect(screen.getByText('1 Main St')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Dribbble' })).toHaveAttribute('href', '/d')
  })

  it('points back to top at the configured target', () => {
    render(<FooterWordmark wordmark="Acme" topHref="#hero" />)
    expect(screen.getByRole('link', { name: /Back to top/ })).toHaveAttribute('href', '#hero')
  })
})
