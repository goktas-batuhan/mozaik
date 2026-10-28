import { fireEvent, render, screen } from '@testing-library/react'
import { DimpleSwitch } from './dimple-switch'

describe('DimpleSwitch', () => {
  it('renders an accessible switch with its label', () => {
    render(<DimpleSwitch label="Dark mode" />)
    expect(screen.getByRole('switch', { name: 'Dark mode' })).not.toBeChecked()
  })

  it('toggles on click and reports the new state', () => {
    const onCheckedChange = vi.fn()
    render(<DimpleSwitch onCheckedChange={onCheckedChange} />)
    const sw = screen.getByRole('switch')
    fireEvent.click(sw)
    expect(onCheckedChange).toHaveBeenLastCalledWith(true)
    expect(sw).toBeChecked()
    fireEvent.click(sw)
    expect(onCheckedChange).toHaveBeenLastCalledWith(false)
  })

  it('starts on with defaultChecked', () => {
    const { container } = render(<DimpleSwitch defaultChecked />)
    expect(screen.getByRole('switch')).toBeChecked()
    expect(container.querySelector('label')).toHaveAttribute('data-state', 'on')
  })

  it('follows the controlled value', () => {
    const { rerender } = render(<DimpleSwitch checked={false} />)
    const sw = screen.getByRole('switch')
    fireEvent.click(sw)
    expect(sw).not.toBeChecked()
    rerender(<DimpleSwitch checked />)
    expect(sw).toBeChecked()
  })

  it('does not toggle when disabled', () => {
    const onCheckedChange = vi.fn()
    render(<DimpleSwitch disabled onCheckedChange={onCheckedChange} />)
    fireEvent.click(screen.getByRole('switch'))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})
