import { fireEvent, render, screen } from '@testing-library/react'
import { ComparisonSlider } from './comparison-slider'

const setup = (props = {}) => render(<ComparisonSlider before={<i>B</i>} after={<i>A</i>} {...props} />)

describe('ComparisonSlider', () => {
  it('exposes the divider as a slider starting in the middle', () => {
    setup()
    const slider = screen.getByRole('slider', { name: 'Comparison position' })
    expect(slider).toHaveAttribute('aria-valuenow', '50')
    expect(slider.getAttribute('aria-valuetext')).toBe('50% Before, 50% After')
  })

  it('moves with the arrow, page and home/end keys and clamps', () => {
    setup({ step: 10 })
    const slider = screen.getByRole('slider')
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(slider).toHaveAttribute('aria-valuenow', '60')
    fireEvent.keyDown(slider, { key: 'ArrowLeft' })
    fireEvent.keyDown(slider, { key: 'ArrowLeft' })
    expect(slider).toHaveAttribute('aria-valuenow', '40')
    fireEvent.keyDown(slider, { key: 'End' })
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(slider).toHaveAttribute('aria-valuenow', '100')
    fireEvent.keyDown(slider, { key: 'Home' })
    expect(slider).toHaveAttribute('aria-valuenow', '0')
  })

  it('clips the before layer to the divider', () => {
    setup({ defaultPosition: 25 })
    expect(screen.getByTestId('before-layer').style.clipPath).toBe('inset(0 75% 0 0)')
  })

  it('jumps to the pointer position on press', () => {
    const { container } = setup()
    const root = container.firstElementChild as HTMLElement
    root.getBoundingClientRect = () => ({ left: 100, width: 200, top: 0, height: 100, right: 300, bottom: 100, x: 100, y: 0, toJSON: () => ({}) })
    fireEvent.pointerDown(root, { clientX: 250, pointerId: 1 })
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '75')
  })

  it('reports changes and stays put when controlled', () => {
    const onPositionChange = vi.fn()
    setup({ position: 30, onPositionChange })
    const slider = screen.getByRole('slider')
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(onPositionChange).toHaveBeenCalledWith(35)
    expect(slider).toHaveAttribute('aria-valuenow', '30')
  })
})
