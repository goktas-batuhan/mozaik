import { fireEvent, render, screen } from '@testing-library/react'
import { LiquidSlider } from './liquid-slider'

describe('LiquidSlider', () => {
  it('exposes a labelled vertical slider with a formatted value', () => {
    render(<LiquidSlider label="Water" unit="ml" defaultValue={1250} />)
    const slider = screen.getByRole('slider', { name: 'Water' })
    expect(slider).toHaveAttribute('aria-orientation', 'vertical')
    expect(slider).toHaveAttribute('aria-valuenow', '1250')
    expect(slider).toHaveAttribute('aria-valuetext', '1,250 ml')
  })

  it('steps with the keyboard and clamps at the ends', () => {
    const onValueChange = vi.fn()
    render(<LiquidSlider min={0} max={200} step={50} defaultValue={150} onValueChange={onValueChange} />)
    const slider = screen.getByRole('slider')
    fireEvent.keyDown(slider, { key: 'ArrowUp' })
    expect(onValueChange).toHaveBeenLastCalledWith(200)
    fireEvent.keyDown(slider, { key: 'ArrowUp' })
    expect(onValueChange).toHaveBeenCalledTimes(1)
    fireEvent.keyDown(slider, { key: 'Home' })
    expect(slider).toHaveAttribute('aria-valuenow', '0')
    fireEvent.keyDown(slider, { key: 'End' })
    expect(slider).toHaveAttribute('aria-valuenow', '200')
  })

  it('stays on the value prop when controlled', () => {
    const onValueChange = vi.fn()
    const { rerender } = render(<LiquidSlider value={500} onValueChange={onValueChange} />)
    const slider = screen.getByRole('slider')
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(onValueChange).toHaveBeenCalledWith(550)
    expect(slider).toHaveAttribute('aria-valuenow', '500')
    rerender(<LiquidSlider value={900} onValueChange={onValueChange} />)
    expect(slider).toHaveAttribute('aria-valuenow', '900')
  })

  it('sets the level from where the surface is dragged', () => {
    const onValueChange = vi.fn()
    const { container } = render(<LiquidSlider min={0} max={2000} step={50} defaultValue={0} onValueChange={onValueChange} />)
    const svg = container.querySelector('svg') as SVGSVGElement
    svg.setPointerCapture = vi.fn()
    svg.getBoundingClientRect = () => ({ left: 0, top: 0, width: 280, height: 360, right: 280, bottom: 360, x: 0, y: 0, toJSON: () => ({}) })
    fireEvent.pointerDown(svg, { clientX: 140, clientY: 216, pointerId: 1 })
    expect(onValueChange).toHaveBeenLastCalledWith(1000)
    fireEvent.pointerMove(svg, { clientX: 140, clientY: 120, pointerId: 1 })
    expect(onValueChange).toHaveBeenLastCalledWith(2000)
    fireEvent.pointerUp(svg, { pointerId: 1 })
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '2000')
  })

  it('keeps the drawing out of the accessibility tree', () => {
    const { container } = render(<LiquidSlider />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})
