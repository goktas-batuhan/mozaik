import { render, screen, within } from '@testing-library/react'
import { LogosGrid } from './logos-grid'

const logos = [
  { name: 'Lumen', logo: <svg /> },
  { name: 'Orbit', logo: <svg />, href: '/orbit' },
  { name: 'Vertex', logo: <svg /> },
]

describe('LogosGrid', () => {
  it('renders one list item per logo with its name', () => {
    render(<LogosGrid logos={logos} />)
    const items = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(screen.getByText('Vertex')).toBeInTheDocument()
  })

  it('turns a cell into a link only when it has an href', () => {
    render(<LogosGrid logos={logos} />)
    expect(screen.getAllByRole('link')).toHaveLength(1)
    expect(screen.getByRole('link', { name: 'Orbit' })).toHaveAttribute('href', '/orbit')
  })

  it('shows the title and description', () => {
    render(<LogosGrid title="Customers" description="Some of them." logos={logos} />)
    expect(screen.getByRole('heading', { name: 'Customers' })).toBeInTheDocument()
    expect(screen.getByText('Some of them.')).toBeInTheDocument()
  })

  it('picks the wide column count', () => {
    render(<LogosGrid logos={logos} columns={3} />)
    expect(screen.getByRole('list')).toHaveClass('@2xl:grid-cols-3')
  })
})
