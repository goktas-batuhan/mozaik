import { act, fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { CurrencyTransfer } from './currency-transfer'

const still = (ui: React.ReactNode) => render(<MotionConfig reducedMotion="always">{ui}</MotionConfig>)
const live = (ui: React.ReactNode) => render(ui)

describe('CurrencyTransfer', () => {
  it('shows the converted amount and an arrived status when completed', () => {
    still(<CurrencyTransfer status="completed" />)
    expect(screen.getByText('460.00 EUR')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Transfer arrived. 460.00 EUR to Lena Fischer.')
    expect(screen.getByText('Arrived', { selector: 'p span' })).toBeInTheDocument()
    expect(screen.getByText('Lena Fischer can use it now')).toBeInTheDocument()
  })

  it('starts processing with the payment done and the amount still in the source currency', () => {
    live(<CurrencyTransfer status="processing" />)
    expect(screen.getByText('500.00 USD')).toBeInTheDocument()
    expect(screen.getByText('Payment received')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Converted to EUR')
    expect(screen.getByText('1 USD = 0.9200 EUR')).toBeInTheDocument()
  })

  it('walks through the steps on a timer while processing', () => {
    vi.useFakeTimers()
    try {
      live(<CurrencyTransfer status="processing" />)
      act(() => {
        vi.advanceTimersByTime(1100)
      })
      expect(screen.getByText('460.00 EUR')).toBeInTheDocument()
      expect(screen.getByRole('status')).toHaveTextContent('Sent to Deutsche Bank')
      act(() => {
        vi.advanceTimersByTime(3300)
      })
      // It waits on the last step instead of arriving by itself when controlled.
      expect(screen.getByRole('status')).toHaveTextContent('Arriving')
    } finally {
      vi.useRealTimers()
    }
  })

  it('offers a retry on failure and reports the refund', () => {
    const onRetry = vi.fn()
    still(<CurrencyTransfer status="failed" onRetry={onRetry} />)
    expect(screen.getByRole('status')).toHaveTextContent('Transfer failed. Refunded to Chase ••4589.')
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('copies the reference and confirms in place', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    still(<CurrencyTransfer status="completed" txnId="TXN-TEST1" />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy reference TXN-TEST1' }))
    expect(writeText).toHaveBeenCalledWith('TXN-TEST1')
    expect(await screen.findByRole('button', { name: 'Reference copied' })).toBeInTheDocument()
  })

  it('holds still under reduced motion and shows the finished demo', () => {
    still(<CurrencyTransfer />)
    expect(screen.getByRole('status')).toHaveTextContent('Transfer arrived')
  })
})
