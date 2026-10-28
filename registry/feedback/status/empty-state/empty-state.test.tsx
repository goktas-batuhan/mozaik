import { fireEvent, render, screen } from '@testing-library/react'
import { EmptyState } from './empty-state'

describe('EmptyState', () => {
  it('renders the title as a heading with its description', () => {
    render(<EmptyState title="No results" description="Try another search." />)
    expect(screen.getByRole('heading', { name: 'No results' })).toBeInTheDocument()
    expect(screen.getByText('Try another search.')).toBeInTheDocument()
  })

  it('renders an action that stays clickable', () => {
    const onClick = vi.fn()
    render(<EmptyState title="Nothing yet" action={<button onClick={onClick}>Create</button>} />)
    fireEvent.click(screen.getByRole('button', { name: 'Create' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('hides the icon from screen readers', () => {
    const { container } = render(<EmptyState title="Empty" icon={<svg />} />)
    expect(container.querySelector('[data-slot="empty-state-icon"]')).toHaveAttribute('aria-hidden', 'true')
  })

  it('omits the optional parts when they are not given', () => {
    const { container } = render(<EmptyState title="Empty" className="custom" />)
    expect(container.querySelector('[data-slot="empty-state-icon"]')).toBeNull()
    expect(container.querySelector('[data-slot="empty-state-description"]')).toBeNull()
    expect(container.querySelector('[data-slot="empty-state-action"]')).toBeNull()
    expect(container.firstElementChild).toHaveClass('custom')
  })
})
