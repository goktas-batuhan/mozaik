import { fireEvent, render, screen } from '@testing-library/react'
import { FeaturesHoverExpand } from './features-hover-expand'

const panels = [
  { id: 'a', title: 'Alpha', description: 'Alpha copy.', icon: <svg data-testid="icon" /> },
  { id: 'b', title: 'Beta', description: 'Beta copy.' },
  { id: 'c', title: 'Gamma', description: 'Gamma copy.' },
]

describe('FeaturesHoverExpand', () => {
  it('labels the section with its headline', () => {
    render(<FeaturesHoverExpand title="Explore" panels={panels} />)
    expect(screen.getByRole('region', { name: 'Explore' })).toBeInTheDocument()
  })

  it('opens the first panel by default', () => {
    render(<FeaturesHoverExpand title="Explore" panels={panels} />)
    expect(screen.getByRole('button', { name: /Alpha/ })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: /Beta/ })).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens a panel on click and closes the previous one', () => {
    render(<FeaturesHoverExpand title="Explore" panels={panels} />)
    fireEvent.click(screen.getByRole('button', { name: /Gamma/ }))
    expect(screen.getByRole('button', { name: /Gamma/ })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: /Alpha/ })).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens a panel on keyboard focus', () => {
    render(<FeaturesHoverExpand title="Explore" panels={panels} />)
    fireEvent.focus(screen.getByRole('button', { name: /Beta/ }))
    expect(screen.getByRole('button', { name: /Beta/ })).toHaveAttribute('aria-expanded', 'true')
  })

  it('opens on mouse hover only when openOnHover is on, never for touch', () => {
    const { rerender } = render(<FeaturesHoverExpand title="Explore" panels={panels} />)
    fireEvent.pointerEnter(screen.getByRole('button', { name: /Beta/ }), { pointerType: 'touch' })
    expect(screen.getByRole('button', { name: /Beta/ })).toHaveAttribute('aria-expanded', 'false')
    fireEvent.pointerEnter(screen.getByRole('button', { name: /Beta/ }), { pointerType: 'mouse' })
    expect(screen.getByRole('button', { name: /Beta/ })).toHaveAttribute('aria-expanded', 'true')
    rerender(<FeaturesHoverExpand title="Explore" panels={panels} openOnHover={false} defaultValue="a" />)
    fireEvent.pointerEnter(screen.getByRole('button', { name: /Gamma/ }), { pointerType: 'mouse' })
    expect(screen.getByRole('button', { name: /Gamma/ })).toHaveAttribute('aria-expanded', 'false')
  })
})
