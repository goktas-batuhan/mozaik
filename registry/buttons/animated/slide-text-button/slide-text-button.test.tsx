import { fireEvent, render, screen } from '@testing-library/react'
import { SlideTextButton } from './slide-text-button'

describe('SlideTextButton', () => {
  it('renders a button named by the resting label', () => {
    render(<SlideTextButton text="Go" hoverText="Let's go" />)
    expect(screen.getByRole('button', { name: 'Go' })).toBeInTheDocument()
  })

  it('renders a link when href is set', () => {
    render(<SlideTextButton text="Docs" href="/docs" />)
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs')
  })

  it('does not fire clicks when disabled', () => {
    const onClick = vi.fn()
    render(<SlideTextButton text="Go" disabled onClick={onClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
