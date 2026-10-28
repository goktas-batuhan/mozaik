import { fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { WalletCard, type WalletAccount } from './wallet-card'

const still = (ui: React.ReactNode) => render(<MotionConfig reducedMotion="always">{ui}</MotionConfig>)

const accounts: WalletAccount[] = [
  { id: 'a', label: 'Main', balance: 1234.5, currency: 'USD', last4: '1111' },
  { id: 'b', label: 'Vault', balance: 99, currency: 'EUR', last4: '2222' },
]

describe('WalletCard', () => {
  it('renders every card as an option and selects the first', () => {
    still(<WalletCard accounts={accounts} />)
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(2)
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(options[1]).toHaveAttribute('aria-selected', 'false')
    expect(screen.getAllByText('$1,234.50').length).toBeGreaterThan(0)
  })

  it('selects a card on click and reports it', () => {
    const onActiveChange = vi.fn()
    still(<WalletCard accounts={accounts} onActiveChange={onActiveChange} />)
    fireEvent.click(screen.getAllByRole('option')[1])
    expect(onActiveChange).toHaveBeenCalledWith('b')
  })

  it('moves the selection with the arrow keys and wraps around', () => {
    still(<WalletCard accounts={accounts} />)
    const list = screen.getByRole('listbox', { name: 'Cards' })
    fireEvent.keyDown(list, { key: 'ArrowRight' })
    expect(screen.getAllByRole('option')[1]).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(list, { key: 'ArrowRight' })
    expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('masks the balance when hidden', () => {
    still(<WalletCard accounts={accounts} />)
    expect(screen.queryByText('Balance hidden')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Hide balance' }))
    expect(screen.getAllByText('Balance hidden').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Show balance' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('collapses extra members behind a toggle', () => {
    const members = ['A One', 'B Two', 'C Three', 'D Four', 'E Five', 'F Six'].map((name) => ({ id: name, name }))
    still(<WalletCard accounts={accounts} members={members} />)
    const toggle = screen.getByRole('button', { name: 'Show 2 more members' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(toggle)
    expect(screen.getByRole('list', { name: 'Additional members' })).toHaveTextContent('F Six')
  })
})
