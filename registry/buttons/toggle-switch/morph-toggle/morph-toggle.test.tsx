import { fireEvent, render, screen } from '@testing-library/react'
import { MorphToggle } from './morph-toggle'

describe('MorphToggle', () => {
  it('is a switch that starts off', () => {
    render(<MorphToggle label="Wi-Fi" />)
    expect(screen.getByRole('switch', { name: 'Wi-Fi' })).toHaveAttribute('aria-checked', 'false')
  })

  it('flips on click and reports the new value', () => {
    const onChange = vi.fn()
    render(<MorphToggle label="Wi-Fi" onChange={onChange} />)
    fireEvent.click(screen.getByRole('switch'))
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('follows the checked prop when controlled', () => {
    const onChange = vi.fn()
    const { rerender } = render(<MorphToggle label="x" checked={false} onChange={onChange} />)
    fireEvent.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
    rerender(<MorphToggle label="x" checked onChange={onChange} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('does not flip when disabled', () => {
    const onChange = vi.fn()
    render(<MorphToggle label="x" disabled onChange={onChange} />)
    fireEvent.click(screen.getByRole('switch'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('shows the matching icon in the icon variant', () => {
    render(
      <MorphToggle
        label="Theme"
        variant="icon"
        defaultChecked
        icons={{ on: <i data-testid="on" />, off: <i data-testid="off" /> }}
      />,
    )
    expect(screen.getByTestId('on')).toBeInTheDocument()
    expect(screen.queryByTestId('off')).toBeNull()
  })
})
