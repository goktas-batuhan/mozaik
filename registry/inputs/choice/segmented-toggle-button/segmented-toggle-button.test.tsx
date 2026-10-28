import { fireEvent, render, screen } from '@testing-library/react'
import { SegmentedToggleButton } from './segmented-toggle-button'

describe('SegmentedToggleButton', () => {
  it('marks the default segment as checked', () => {
    render(<SegmentedToggleButton defaultValue={1} />)
    expect(screen.getByRole('radio', { name: 'Week' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Day' })).not.toBeChecked()
  })

  it('selects a segment on click and reports index and label', () => {
    const onChange = vi.fn()
    render(<SegmentedToggleButton onChange={onChange} />)
    fireEvent.click(screen.getByRole('radio', { name: 'Month' }))
    expect(onChange).toHaveBeenCalledWith(2, 'Month')
    expect(screen.getByRole('radio', { name: 'Month' })).toBeChecked()
  })

  it('moves with the arrow keys, wrapping around', () => {
    const onChange = vi.fn()
    render(<SegmentedToggleButton onChange={onChange} />)
    const day = screen.getByRole('radio', { name: 'Day' })
    fireEvent.keyDown(day, { key: 'ArrowLeft' })
    expect(onChange).toHaveBeenLastCalledWith(2, 'Month')
    expect(screen.getByRole('radio', { name: 'Month' })).toHaveFocus()
  })

  it('is controlled when value is given', () => {
    const { rerender } = render(<SegmentedToggleButton value={0} />)
    fireEvent.click(screen.getByRole('radio', { name: 'Week' }))
    expect(screen.getByRole('radio', { name: 'Day' })).toBeChecked()
    rerender(<SegmentedToggleButton value={1} />)
    expect(screen.getByRole('radio', { name: 'Week' })).toBeChecked()
  })

  it('does nothing when disabled', () => {
    const onChange = vi.fn()
    render(<SegmentedToggleButton disabled onChange={onChange} />)
    fireEvent.click(screen.getByRole('radio', { name: 'Week' }))
    expect(onChange).not.toHaveBeenCalled()
  })
})
