import { fireEvent, render, screen } from '@testing-library/react'
import { Scrubber } from './scrubber'

describe('Scrubber', () => {
  it('exposes a labelled slider with its range', () => {
    render(<Scrubber label="Opacity" defaultValue={0.5} />)
    const slider = screen.getByRole('slider', { name: 'Opacity' })
    expect(slider).toHaveAttribute('aria-valuemin', '0')
    expect(slider).toHaveAttribute('aria-valuemax', '1')
    expect(slider).toHaveAttribute('aria-valuenow', '0.5')
    expect(screen.getByText('0.50')).toBeInTheDocument()
  })

  it('steps with arrow keys and jumps with Home and End', () => {
    const onValueChange = vi.fn()
    render(<Scrubber label="Blur" min={0} max={10} step={1} decimals={0} defaultValue={5} onValueChange={onValueChange} />)
    const slider = screen.getByRole('slider')
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(onValueChange).toHaveBeenLastCalledWith(6)
    expect(slider).toHaveAttribute('aria-valuenow', '6')
    fireEvent.keyDown(slider, { key: 'End' })
    expect(slider).toHaveAttribute('aria-valuenow', '10')
    fireEvent.keyDown(slider, { key: 'ArrowUp' })
    expect(slider).toHaveAttribute('aria-valuenow', '10')
    fireEvent.keyDown(slider, { key: 'Home' })
    expect(slider).toHaveAttribute('aria-valuenow', '0')
  })

  it('stays on the value prop when controlled', () => {
    const onValueChange = vi.fn()
    const { rerender } = render(<Scrubber label="Mix" value={0.2} onValueChange={onValueChange} />)
    const slider = screen.getByRole('slider')
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(onValueChange).toHaveBeenCalledWith(0.21)
    expect(slider).toHaveAttribute('aria-valuenow', '0.2')
    rerender(<Scrubber label="Mix" value={0.7} onValueChange={onValueChange} />)
    expect(slider).toHaveAttribute('aria-valuenow', '0.7')
  })

  it('sets the value from the pointer position on the track', () => {
    const onValueChange = vi.fn()
    render(<Scrubber label="Level" min={0} max={100} step={1} decimals={0} onValueChange={onValueChange} />)
    const slider = screen.getByRole('slider')
    slider.setPointerCapture = vi.fn()
    slider.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 36, right: 200, bottom: 36, x: 0, y: 0, toJSON: () => ({}) })
    fireEvent.pointerDown(slider, { clientX: 50, pointerId: 1 })
    expect(onValueChange).toHaveBeenLastCalledWith(25)
    fireEvent.pointerMove(slider, { clientX: 150, pointerId: 1 })
    expect(onValueChange).toHaveBeenLastCalledWith(75)
  })

  it('draws the requested number of tick marks', () => {
    const { container } = render(<Scrubber label="Ticks" ticks={4} />)
    expect(container.querySelectorAll('.bg-foreground\\/25')).toHaveLength(4)
  })
})
