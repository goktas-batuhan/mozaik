import { fireEvent, render, screen } from '@testing-library/react'
import { LinenTabButton } from './linen-tab-button'

describe('LinenTabButton', () => {
  it('renders a button with the default label and type="button"', () => {
    render(<LinenTabButton />)
    expect(screen.getByRole('button', { name: 'View details' })).toHaveAttribute('type', 'button')
  })

  it('renders custom children as the accessible name', () => {
    render(<LinenTabButton>Open file</LinenTabButton>)
    expect(screen.getByRole('button', { name: 'Open file' })).toBeInTheDocument()
  })

  it('fires onClick, but not when disabled', () => {
    const onClick = vi.fn()
    const { rerender } = render(<LinenTabButton onClick={onClick}>Go</LinenTabButton>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
    rerender(
      <LinenTabButton disabled onClick={onClick}>
        Go
      </LinenTabButton>,
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('hides the decorative linen layers from assistive tech', () => {
    const { container } = render(<LinenTabButton>Go</LinenTabButton>)
    const layers = container.querySelectorAll('[data-layer^="linen-"]:not([data-layer="linen-label"])')
    expect(layers.length).toBe(4)
    layers.forEach((layer) => expect(layer).toHaveAttribute('aria-hidden', 'true'))
  })
})
