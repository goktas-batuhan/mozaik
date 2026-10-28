import { render, screen } from '@testing-library/react'
import { Breadcrumb } from './breadcrumb'

const items = [
  { label: 'Home', href: '/' },
  { label: 'Docs', href: '/docs' },
  { label: 'Navigation' },
]

describe('Breadcrumb', () => {
  it('renders a labelled nav landmark with an ordered list', () => {
    render(<Breadcrumb items={items} />)
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(nav.querySelector('ol')).not.toBeNull()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('links earlier items and marks the last one as the current page', () => {
    render(<Breadcrumb items={items} />)
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs')
    const current = screen.getByText('Navigation')
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('link', { name: 'Navigation' })).toBeNull()
  })

  it('renders an earlier item without href as plain text', () => {
    render(<Breadcrumb items={[{ label: 'Group' }, { label: 'Page' }]} />)
    expect(screen.queryByRole('link')).toBeNull()
    expect(screen.getByText('Group')).toBeInTheDocument()
  })

  it('uses a custom separator and hides separators from assistive tech', () => {
    const { container } = render(<Breadcrumb items={items} separator={<span>/</span>} />)
    expect(screen.getAllByText('/')).toHaveLength(2)
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2)
  })
})
