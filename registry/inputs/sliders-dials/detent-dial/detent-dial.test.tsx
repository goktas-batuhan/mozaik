import { act, fireEvent, render, screen } from '@testing-library/react'
import { DetentDial } from './detent-dial'

describe('DetentDial', () => {
  it('exposes a labelled slider with a formatted value', () => {
    render(<DetentDial label="Temperature" defaultValue={21} />)
    const dial = screen.getByRole('slider', { name: 'Temperature' })
    expect(dial).toHaveAttribute('aria-valuemin', '16')
    expect(dial).toHaveAttribute('aria-valuemax', '30')
    expect(dial).toHaveAttribute('aria-valuenow', '21')
    expect(dial).toHaveAttribute('aria-valuetext', '21.0°')
  })

  it('steps one notch per arrow key and reports it', () => {
    const onValueChange = vi.fn()
    render(<DetentDial defaultValue={21} onValueChange={onValueChange} />)
    const dial = screen.getByRole('slider')
    fireEvent.keyDown(dial, { key: 'ArrowUp' })
    expect(onValueChange).toHaveBeenLastCalledWith(21.5)
    expect(dial).toHaveAttribute('aria-valuenow', '21.5')
    fireEvent.keyDown(dial, { key: 'ArrowDown' })
    fireEvent.keyDown(dial, { key: 'ArrowDown' })
    expect(dial).toHaveAttribute('aria-valuenow', '20.5')
  })

  it('jumps to the ends with Home and End and never leaves the range', () => {
    render(<DetentDial min={0} max={10} step={1} defaultValue={5} formatValue={(v) => `${v}%`} />)
    const dial = screen.getByRole('slider')
    fireEvent.keyDown(dial, { key: 'End' })
    expect(dial).toHaveAttribute('aria-valuenow', '10')
    fireEvent.keyDown(dial, { key: 'ArrowUp' })
    expect(dial).toHaveAttribute('aria-valuenow', '10')
    fireEvent.keyDown(dial, { key: 'Home' })
    expect(dial).toHaveAttribute('aria-valuenow', '0')
    expect(dial).toHaveAttribute('aria-valuetext', '0%')
  })

  it('follows the value prop when controlled', () => {
    const { rerender } = render(<DetentDial value={18} />)
    const dial = screen.getByRole('slider')
    expect(dial).toHaveAttribute('aria-valuenow', '18')
    rerender(<DetentDial value={26} />)
    expect(dial).toHaveAttribute('aria-valuenow', '26')
  })

  it('turns with the mouse wheel only while focused', () => {
    render(<DetentDial defaultValue={21} />)
    const dial = screen.getByRole('slider')
    act(() => {
      dial.dispatchEvent(new WheelEvent('wheel', { deltaY: -40, bubbles: true, cancelable: true }))
    })
    expect(dial).toHaveAttribute('aria-valuenow', '21')
    act(() => dial.focus())
    act(() => {
      dial.dispatchEvent(new WheelEvent('wheel', { deltaY: -40, bubbles: true, cancelable: true }))
    })
    expect(dial).toHaveAttribute('aria-valuenow', '21.5')
  })

  it('ignores keys when disabled', () => {
    render(<DetentDial defaultValue={21} disabled />)
    const dial = screen.getByRole('slider')
    expect(dial).toHaveAttribute('aria-disabled', 'true')
    fireEvent.keyDown(dial, { key: 'ArrowUp' })
    expect(dial).toHaveAttribute('aria-valuenow', '21')
  })
})
