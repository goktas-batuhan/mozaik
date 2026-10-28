import { fireEvent, render, screen } from '@testing-library/react'
import { ClipCornersButton } from './clip-corners-button'

describe('ClipCornersButton', () => {
  it('renders a button with its label and defaults to type button', () => {
    render(<ClipCornersButton>Initialize</ClipCornersButton>)
    expect(screen.getByRole('button', { name: 'Initialize' })).toHaveAttribute('type', 'button')
  })

  it('cuts the corners deeper on hover', () => {
    render(<ClipCornersButton cut={10} hoverCut={20}>Go</ClipCornersButton>)
    const button = screen.getByRole('button')
    expect(button.style.clipPath).toContain('10px')
    fireEvent.pointerEnter(button)
    expect(button).toHaveAttribute('data-active', 'true')
    expect(button.style.clipPath).toContain('20px')
    fireEvent.pointerLeave(button)
    expect(button).not.toHaveAttribute('data-active')
  })

  it('cuts deeper on keyboard focus too', () => {
    render(<ClipCornersButton cut={10} hoverCut={20}>Go</ClipCornersButton>)
    const button = screen.getByRole('button')
    fireEvent.focus(button)
    expect(button).toHaveAttribute('data-active', 'true')
    fireEvent.blur(button)
    expect(button).not.toHaveAttribute('data-active')
  })

  it('fires onClick but not when disabled', () => {
    const onClick = vi.fn()
    const { rerender } = render(<ClipCornersButton onClick={onClick}>Go</ClipCornersButton>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
    rerender(<ClipCornersButton disabled onClick={onClick}>Go</ClipCornersButton>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
