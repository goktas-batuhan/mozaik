import { render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { NavbarFloating } from './navbar-floating'

const links = [
  { label: 'Product', href: '/product', current: true },
  { label: 'Docs', href: '/docs' },
]

describe('NavbarFloating', () => {
  it('renders brand, labelled nav and links', () => {
    render(<NavbarFloating brand="Acme" links={links} label="Primary" />)
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs')
  })

  it('marks the current page', () => {
    render(<NavbarFloating brand="Acme" links={links} />)
    expect(screen.getByRole('link', { name: 'Product' })).toHaveAttribute('aria-current', 'page')
  })

  it('renders the call to action as a link', () => {
    render(<NavbarFloating brand="Acme" links={links} action={{ label: 'Start', href: '/start' }} />)
    expect(screen.getByRole('link', { name: 'Start' })).toHaveAttribute('href', '/start')
  })

  it('is fully visible from the first frame when disabled or reduced', () => {
    const { rerender } = render(<NavbarFloating brand="Acme" links={links} disabled />)
    const pill = () => screen.getByRole('link', { name: 'Acme' }).parentElement as HTMLElement
    expect(pill().style.opacity).not.toBe('0')
    rerender(
      <MotionConfig reducedMotion="always">
        <NavbarFloating brand="Acme" links={links} />
      </MotionConfig>,
    )
    expect(pill().style.opacity).not.toBe('0')
  })
})
