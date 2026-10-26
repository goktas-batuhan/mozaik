import { render, screen } from '@testing-library/react'
import { HoverSwapCard } from './hover-swap-card'

describe('HoverSwapCard', () => {
  it('is focusable and renders the title and description', () => {
    render(<HoverSwapCard title="Reports" description="Body" media={<div>media</div>} />)
    expect(screen.getByRole('article')).toHaveAttribute('tabindex', '0')
    expect(screen.getByText('Reports')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('hides the hover title and hover media from assistive tech', () => {
    render(<HoverSwapCard title="A" hoverTitle="B" media="m" hoverMedia={<span>h</span>} />)
    expect(screen.getByText('B')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('h').parentElement).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders the badge only when given', () => {
    const { rerender } = render(<HoverSwapCard title="A" media="m" />)
    expect(screen.queryByText('New')).not.toBeInTheDocument()
    rerender(<HoverSwapCard title="A" media="m" badge="New" />)
    expect(screen.getByText('New')).toBeInTheDocument()
  })
})
