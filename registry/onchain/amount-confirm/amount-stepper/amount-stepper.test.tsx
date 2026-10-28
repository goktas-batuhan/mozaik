import { fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { AmountStepper } from './amount-stepper'

const still = (ui: React.ReactNode) => render(<MotionConfig reducedMotion="always">{ui}</MotionConfig>)

describe('AmountStepper', () => {
  it('steps by a decimal without float drift', () => {
    still(<AmountStepper step={0.1} defaultValue={0.2} max={1} unit="ETH" />)
    fireEvent.click(screen.getByRole('button', { name: 'Increase amount' }))
    expect(screen.getByRole('status')).toHaveTextContent('0.3 ETH')
    fireEvent.click(screen.getByRole('button', { name: 'Increase amount' }))
    expect(screen.getByRole('status')).toHaveTextContent('0.4 ETH')
  })

  it('stops at min and max and disables the matching button', () => {
    const onChange = vi.fn()
    still(<AmountStepper step={1} defaultValue={2} min={1} max={3} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Increase amount' }))
    expect(screen.getByRole('button', { name: 'Increase amount' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Decrease amount' }))
    fireEvent.click(screen.getByRole('button', { name: 'Decrease amount' }))
    expect(screen.getByRole('button', { name: 'Decrease amount' })).toBeDisabled()
    expect(screen.getByRole('status')).toHaveTextContent('1')
    expect(onChange.mock.calls.map((c) => c[0])).toEqual([3, 2, 1])
  })

  it('follows a controlled value', () => {
    const onChange = vi.fn()
    const { rerender } = still(<AmountStepper value={1} step={0.5} decimals={2} onChange={onChange} />)
    expect(screen.getByRole('status')).toHaveTextContent('1.00')
    fireEvent.click(screen.getByRole('button', { name: 'Increase amount' }))
    expect(onChange).toHaveBeenCalledWith(1.5)
    expect(screen.getByRole('status')).toHaveTextContent('1.00')
    rerender(
      <MotionConfig reducedMotion="always">
        <AmountStepper value={1.5} step={0.5} decimals={2} onChange={onChange} />
      </MotionConfig>,
    )
    expect(screen.getByRole('status')).toHaveTextContent('1.50')
  })

  it('names the group and disables both keys when disabled', () => {
    still(<AmountStepper label="Amount to stake" disabled />)
    expect(screen.getByRole('group', { name: 'Amount to stake' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Increase amount' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Decrease amount' })).toBeDisabled()
  })
})
