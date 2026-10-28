import { fireEvent, render, screen } from '@testing-library/react'
import { DurationPicker, formatDuration } from './duration-picker'

describe('DurationPicker', () => {
  it('shows the default value split into hours, minutes and seconds', () => {
    render(<DurationPicker defaultValue={3725} />)
    expect(screen.getByRole('spinbutton', { name: 'hour' })).toHaveAttribute('aria-valuenow', '1')
    expect(screen.getByRole('spinbutton', { name: 'minute' })).toHaveAttribute('aria-valuenow', '2')
    expect(screen.getByRole('spinbutton', { name: 'second' })).toHaveAttribute('aria-valuenow', '5')
  })

  it('steps the focused segment with the arrow keys and reports seconds', () => {
    const onChange = vi.fn()
    render(<DurationPicker defaultValue={0} onChange={onChange} />)
    const minutes = screen.getByRole('spinbutton', { name: 'minute' })
    fireEvent.keyDown(minutes, { key: 'ArrowUp' })
    expect(onChange).toHaveBeenLastCalledWith(60)
    expect(minutes).toHaveAttribute('aria-valuenow', '1')
    fireEvent.keyDown(minutes, { key: 'ArrowDown' })
    expect(onChange).toHaveBeenLastCalledWith(0)
  })

  it('clamps to min and max', () => {
    const onChange = vi.fn()
    render(<DurationPicker defaultValue={59} max={60} onChange={onChange} />)
    fireEvent.keyDown(screen.getByRole('spinbutton', { name: 'second' }), { key: 'ArrowUp', shiftKey: true })
    expect(onChange).toHaveBeenLastCalledWith(60)
  })

  it('follows the controlled value and does not change by itself', () => {
    const { rerender } = render(<DurationPicker value={10} />)
    const seconds = screen.getByRole('spinbutton', { name: 'second' })
    fireEvent.keyDown(seconds, { key: 'ArrowUp' })
    expect(seconds).toHaveAttribute('aria-valuenow', '10')
    rerender(<DurationPicker value={42} />)
    expect(seconds).toHaveAttribute('aria-valuenow', '42')
  })

  it('takes typed digits and ignores input when disabled', () => {
    const onChange = vi.fn()
    const { rerender } = render(<DurationPicker onChange={onChange} />)
    const seconds = screen.getByRole('spinbutton', { name: 'second' })
    fireEvent.keyDown(seconds, { key: '4' })
    fireEvent.keyDown(seconds, { key: '5' })
    expect(onChange).toHaveBeenLastCalledWith(45)
    onChange.mockClear()
    rerender(<DurationPicker disabled onChange={onChange} />)
    fireEvent.keyDown(screen.getByRole('spinbutton', { name: 'second' }), { key: 'ArrowUp' })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('formats durations', () => {
    expect(formatDuration(3725)).toBe('01:02:05')
    expect(formatDuration(90, ['minutes', 'seconds'])).toBe('01:30')
  })
})
