import { fireEvent, render, screen } from '@testing-library/react'
import { ShimmerButton } from './shimmer-button'

describe('ShimmerButton', () => {
  it('renders an accessible button with its label', () => {
    render(<ShimmerButton>Launch</ShimmerButton>)
    expect(screen.getByRole('button', { name: 'Launch' })).toHaveAttribute('type', 'button')
  })

  it('fires onClick', () => {
    const onClick = vi.fn()
    render(<ShimmerButton onClick={onClick}>Go</ShimmerButton>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not fire when disabled', () => {
    const onClick = vi.fn()
    render(
      <ShimmerButton disabled onClick={onClick}>
        Go
      </ShimmerButton>,
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('keeps the decorative layers out of the accessibility tree', () => {
    const { container } = render(<ShimmerButton>Go</ShimmerButton>)
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0)
  })
})
