import { fireEvent, render, screen } from '@testing-library/react'
import { BellButton } from './bell-button'

describe('BellButton', () => {
  it('is a toggle button reflecting its state with aria-pressed', () => {
    render(<BellButton />)
    const button = screen.getByRole('button', { name: 'Notifications' })
    expect(button).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(button).toHaveAttribute('data-state', 'on')
  })

  it('reports the new state through onPressedChange', () => {
    const onPressedChange = vi.fn()
    render(<BellButton defaultPressed onPressedChange={onPressedChange} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onPressedChange).toHaveBeenCalledWith(false)
  })

  it('stays controlled when pressed is given', () => {
    const onPressedChange = vi.fn()
    render(<BellButton pressed={false} onPressedChange={onPressedChange} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onPressedChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('shows the unread badge only while on and caps it at 99+', () => {
    const { container, rerender } = render(<BellButton pressed count={3} />)
    expect(container.querySelector('[data-slot="badge"]')).toHaveTextContent('3')
    rerender(<BellButton pressed count={140} />)
    expect(container.querySelector('[data-slot="badge"]')).toHaveTextContent('99+')
    rerender(<BellButton pressed={false} count={3} />)
    expect(container.querySelector('[data-slot="badge"]')).toBeNull()
  })

  it('does not toggle when disabled', () => {
    render(<BellButton disabled />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })
})
