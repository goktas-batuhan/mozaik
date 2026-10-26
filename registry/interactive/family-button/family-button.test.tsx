import { fireEvent, render, screen } from '@testing-library/react'
import { FamilyButton } from './family-button'

describe('FamilyButton', () => {
  it('starts collapsed and hides its content', () => {
    render(<FamilyButton label="Menu">Inside</FamilyButton>)
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Inside')).not.toBeInTheDocument()
  })

  it('opens on click and closes with Escape', () => {
    render(<FamilyButton label="Menu">Inside</FamilyButton>)
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }))
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Inside')).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('reports changes and ignores clicks when disabled', () => {
    const onOpenChange = vi.fn()
    const { rerender } = render(<FamilyButton onOpenChange={onOpenChange}>x</FamilyButton>)
    fireEvent.click(screen.getByRole('button'))
    expect(onOpenChange).toHaveBeenCalledWith(true)
    rerender(<FamilyButton disabled onOpenChange={onOpenChange}>x</FamilyButton>)
    onOpenChange.mockClear()
    fireEvent.click(screen.getByRole('button'))
    expect(onOpenChange).not.toHaveBeenCalled()
  })
})
