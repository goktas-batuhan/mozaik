import { render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { FooterMinimal } from './footer-minimal'

describe('FooterMinimal', () => {
  it('renders brand, copyright and links', () => {
    render(<FooterMinimal brand="Acme" copyright="© 2026" links={[{ label: 'Privacy', href: '/privacy' }]} />)
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Acme')
    expect(screen.getByText('© 2026')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy')
  })

  it('names social icon links for assistive tech', () => {
    render(<FooterMinimal brand="Acme" social={[{ label: 'GitHub', href: '/gh', icon: <svg /> }]} />)
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', '/gh')
  })

  it('leaves out the nav and social list when empty', () => {
    render(<FooterMinimal brand="Acme" />)
    expect(screen.queryByRole('navigation')).toBeNull()
    expect(screen.queryByRole('list')).toBeNull()
  })

  it('renders under forced reduced motion', () => {
    render(
      <MotionConfig reducedMotion="always">
        <FooterMinimal brand="Acme" social={[{ label: 'Mail', href: '#', icon: <svg /> }]} />
      </MotionConfig>,
    )
    expect(screen.getByRole('link', { name: 'Mail' })).toBeInTheDocument()
  })
})
