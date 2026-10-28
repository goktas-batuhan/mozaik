import { fireEvent, render, screen } from '@testing-library/react'
import { WheelPicker } from './wheel-picker'

describe('WheelPicker', () => {
  it('renders one labelled wheel per column inside a named group', () => {
    render(<WheelPicker label="Alarm time" />)
    expect(screen.getByRole('group', { name: 'Alarm time' })).toBeInTheDocument()
    expect(screen.getAllByRole('spinbutton')).toHaveLength(3)
    const hours = screen.getByRole('spinbutton', { name: 'Hours' })
    expect(hours).toHaveAttribute('aria-valuetext', '9')
    expect(screen.getByRole('spinbutton', { name: 'Minutes' })).toHaveAttribute('aria-valuetext', '41')
    expect(screen.getByRole('spinbutton', { name: 'AM or PM' })).toHaveAttribute('aria-valuetext', 'AM')
  })

  it('moves a wheel with the arrow keys and reports the whole selection', () => {
    const onValueChange = vi.fn()
    render(<WheelPicker onValueChange={onValueChange} />)
    fireEvent.keyDown(screen.getByRole('spinbutton', { name: 'Hours' }), { key: 'ArrowUp' })
    expect(onValueChange).toHaveBeenLastCalledWith({ hour: '9', minute: '41', period: 'am' })
    fireEvent.keyDown(screen.getByRole('spinbutton', { name: 'Minutes' }), { key: 'ArrowDown' })
    expect(onValueChange).toHaveBeenLastCalledWith({ hour: '9', minute: '40', period: 'am' })
    expect(screen.getByRole('spinbutton', { name: 'Minutes' })).toHaveAttribute('aria-valuetext', '40')
  })

  it('wraps looping wheels and stops at the ends of the others', () => {
    render(<WheelPicker defaultValue={{ hour: '11', minute: '41', period: 'pm' }} />)
    const hours = screen.getByRole('spinbutton', { name: 'Hours' })
    fireEvent.keyDown(hours, { key: 'ArrowUp' })
    expect(hours).toHaveAttribute('aria-valuetext', '1')
    const period = screen.getByRole('spinbutton', { name: 'AM or PM' })
    fireEvent.keyDown(period, { key: 'ArrowUp' })
    expect(period).toHaveAttribute('aria-valuetext', 'PM')
  })

  it('jumps to the first and last option with Home and End', () => {
    render(<WheelPicker />)
    const minutes = screen.getByRole('spinbutton', { name: 'Minutes' })
    fireEvent.keyDown(minutes, { key: 'Home' })
    expect(minutes).toHaveAttribute('aria-valuetext', '00')
    fireEvent.keyDown(minutes, { key: 'End' })
    expect(minutes).toHaveAttribute('aria-valuetext', '59')
  })

  it('follows the value prop when controlled and accepts custom columns', () => {
    const columns = [{ id: 'size', label: 'Size', options: [{ value: 's', label: 'Small' }, { value: 'm', label: 'Medium' }, { value: 'l', label: 'Large' }] }]
    const onValueChange = vi.fn()
    const { rerender } = render(<WheelPicker columns={columns} value={{ size: 's' }} onValueChange={onValueChange} />)
    const size = screen.getByRole('spinbutton', { name: 'Size' })
    fireEvent.keyDown(size, { key: 'ArrowUp' })
    expect(onValueChange).toHaveBeenLastCalledWith({ size: 'm' })
    expect(size).toHaveAttribute('aria-valuetext', 'Small')
    rerender(<WheelPicker columns={columns} value={{ size: 'l' }} onValueChange={onValueChange} />)
    expect(size).toHaveAttribute('aria-valuetext', 'Large')
  })
})
