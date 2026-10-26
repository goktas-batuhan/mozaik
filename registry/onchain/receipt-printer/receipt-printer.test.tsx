import { fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { ReceiptPrinter, type ReceiptTx } from './receipt-printer'

const tx: ReceiptTx = {
  hash: '0x8f3a1c52d9e47b60a1f3c8d25e9b7a4c6d01f2e3b4a5968778695a4b3c2d1e0f',
  from: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  to: '0x2a9fB1c0E5d3a7C8b4F6e1D2c9A0b3E7f5d4C6B8',
  amount: '0.2500',
  symbol: 'ETH',
  fee: '0.00042',
  status: 'confirmed',
}

const still = (ui: React.ReactNode) => render(<MotionConfig reducedMotion="always">{ui}</MotionConfig>)

describe('ReceiptPrinter', () => {
  it('renders the receipt with the full hash for screen readers', () => {
    still(<ReceiptPrinter tx={tx} />)
    const receipt = screen.getByRole('article', { name: 'Transaction receipt' })
    expect(receipt).toHaveTextContent('Confirmed')
    expect(receipt).toHaveTextContent('0.2500 ETH')
    expect(receipt).toHaveTextContent('0.00042 ETH')
    expect(screen.getByText(tx.hash)).toHaveClass('sr-only')
    expect(receipt).toHaveTextContent('0x8f3a…1e0f')
  })

  it('shows the failed status', () => {
    still(<ReceiptPrinter tx={{ ...tx, status: 'failed' }} />)
    expect(screen.getByText('Failed')).toHaveClass('text-destructive')
  })

  it('shows the whole receipt right away under reduced motion', () => {
    const { container } = still(<ReceiptPrinter tx={tx} />)
    expect(container.querySelector('[data-printing]')).toHaveAttribute('data-printing', 'false')
    expect(screen.getByRole('status')).toHaveTextContent('Receipt printed')
  })

  it('waits for the button when autoPrint is off, then calls onPrint', () => {
    const onPrint = vi.fn()
    still(<ReceiptPrinter tx={tx} autoPrint={false} onPrint={onPrint} />)
    expect(onPrint).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Print receipt' }))
    expect(onPrint).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Print again' })).toBeInTheDocument()
  })
})
