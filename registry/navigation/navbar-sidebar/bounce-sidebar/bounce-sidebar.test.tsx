import { fireEvent, render, screen } from '@testing-library/react'
import { BounceSidebar } from './bounce-sidebar'

const items = [
  { id: 'overview', label: 'Overview' },
  { id: 'projects', label: 'Projects' },
  { id: 'team', label: 'Team', href: '#team' },
  { id: 'billing', label: 'Billing', disabled: true },
]

describe('BounceSidebar', () => {
  it('renders a labelled nav and marks the first item current by default', () => {
    render(<BounceSidebar items={items} />)
    expect(screen.getByRole('navigation', { name: 'Sidebar navigation' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Overview' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Projects' })).not.toHaveAttribute('aria-current')
  })

  it('selects an item on click and reports it', () => {
    const onValueChange = vi.fn()
    render(<BounceSidebar items={items} onValueChange={onValueChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Projects' }))
    expect(onValueChange).toHaveBeenCalledWith('projects')
    expect(screen.getByRole('button', { name: 'Projects' })).toHaveAttribute('aria-current', 'page')
  })

  it('stays controlled when value is passed', () => {
    const onValueChange = vi.fn()
    render(<BounceSidebar items={items} value="projects" onValueChange={onValueChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Overview' }))
    expect(onValueChange).toHaveBeenCalledWith('overview')
    expect(screen.getByRole('button', { name: 'Projects' })).toHaveAttribute('aria-current', 'page')
  })

  it('renders items with href as links and ignores disabled items', () => {
    const onValueChange = vi.fn()
    render(<BounceSidebar items={items} onValueChange={onValueChange} />)
    expect(screen.getByRole('link', { name: 'Team' })).toHaveAttribute('href', '#team')
    fireEvent.click(screen.getByRole('button', { name: 'Billing' }))
    expect(onValueChange).not.toHaveBeenCalled()
  })
})
