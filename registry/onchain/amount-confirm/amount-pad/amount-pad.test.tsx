import { fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { AmountPad } from './amount-pad'

class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
beforeAll(() => {
  vi.stubGlobal('ResizeObserver', RO)
})

const still = (ui: React.ReactNode) => render(<MotionConfig reducedMotion="always">{ui}</MotionConfig>)

describe('AmountPad', () => {
  it('renders real buttons for every key and announces the value', () => {
    still(<AmountPad symbol="ETH" symbolPosition="suffix" balance={3} />)
    for (const name of ['0', '1', '9', 'Decimal point', 'Delete']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument()
    }
    expect(screen.getByRole('status')).toHaveTextContent('0 ETH')
    expect(screen.getByText('Balance 3 ETH')).toBeInTheDocument()
  })

  it('types with the buttons and updates the live region', () => {
    still(<AmountPad symbol="$" />)
    fireEvent.click(screen.getByRole('button', { name: '1' }))
    fireEvent.click(screen.getByRole('button', { name: '2' }))
    fireEvent.click(screen.getByRole('button', { name: 'Decimal point' }))
    fireEvent.click(screen.getByRole('button', { name: '5' }))
    expect(screen.getByRole('status')).toHaveTextContent('$12.5')
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.getByRole('status')).toHaveTextContent('$12')
  })

  it('takes physical keyboard input', () => {
    still(<AmountPad symbol="$" />)
    const group = screen.getByRole('group', { name: 'Amount' })
    fireEvent.keyDown(group, { key: '4' })
    fireEvent.keyDown(group, { key: '2' })
    fireEvent.keyDown(group, { key: ',' })
    fireEvent.keyDown(group, { key: '5' })
    expect(screen.getByRole('status')).toHaveTextContent('$42.5')
    fireEvent.keyDown(group, { key: 'Backspace' })
    expect(screen.getByRole('status')).toHaveTextContent('$42')
  })

  it('refuses amounts above max and extra decimals', () => {
    still(<AmountPad symbol="$" max={100} />)
    const group = screen.getByRole('group', { name: 'Amount' })
    for (const k of ['2', '5', '0']) fireEvent.keyDown(group, { key: k })
    expect(screen.getByRole('status')).toHaveTextContent('$25')
    expect(screen.getByText('Up to $100 per transfer')).toBeInTheDocument()
    fireEvent.keyDown(group, { key: '.' })
    for (const k of ['1', '2', '3']) fireEvent.keyDown(group, { key: k })
    expect(screen.getByRole('status')).toHaveTextContent('$25.12')
  })

  it('submits the amount and fills presets', () => {
    const onSubmit = vi.fn()
    still(<AmountPad symbol="$" presets={[20, 50]} onSubmit={onSubmit} />)
    fireEvent.click(screen.getByRole('button', { name: '$50' }))
    fireEvent.click(screen.getByRole('button', { name: 'Send $50' }))
    expect(onSubmit).toHaveBeenCalledWith(50)
  })

  it('does nothing when disabled', () => {
    const onSubmit = vi.fn()
    still(<AmountPad disabled onSubmit={onSubmit} />)
    const group = screen.getByRole('group', { name: 'Amount' })
    fireEvent.keyDown(group, { key: '7' })
    expect(screen.getByRole('status')).toHaveTextContent('$0')
    expect(screen.getByRole('button', { name: '7' })).toBeDisabled()
  })
})
