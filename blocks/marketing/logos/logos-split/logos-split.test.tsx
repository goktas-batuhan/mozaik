import { render, screen } from '@testing-library/react'
import { LogosSplit } from './logos-split'

const logos = [
  { name: 'Lumen', logo: <svg /> },
  { name: 'Orbit', logo: <svg /> },
  { name: 'Vertex', logo: <svg /> },
]

describe('LogosSplit', () => {
  it('renders the headline, copy and one tile per logo', () => {
    render(<LogosSplit title="Loved" description="By many." logos={logos} />)
    expect(screen.getByRole('heading', { name: 'Loved' })).toBeInTheDocument()
    expect(screen.getByText('By many.')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('renders the action as a link', () => {
    render(<LogosSplit title="T" action={{ label: 'Stories', href: '/stories' }} logos={logos} />)
    expect(screen.getByRole('link', { name: /Stories/ })).toHaveAttribute('href', '/stories')
  })

  it('names logos for screen readers', () => {
    render(<LogosSplit title="T" logos={logos} />)
    expect(screen.getByText('Orbit')).toHaveClass('sr-only')
  })

  it('has no link without an action', () => {
    render(<LogosSplit title="T" logos={logos} />)
    expect(screen.queryByRole('link')).toBeNull()
  })
})
