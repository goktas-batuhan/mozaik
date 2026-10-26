import { fireEvent, render, screen, within } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { OrderBook } from './order-book'

const bids = [
  { price: 99, size: 2 },
  { price: 98, size: 3 },
  { price: 97, size: 5 },
]
const asks = [
  { price: 101, size: 1 },
  { price: 102, size: 4 },
  { price: 103, size: 2 },
]

const still = (ui: React.ReactNode) => render(<MotionConfig reducedMotion="always">{ui}</MotionConfig>)

describe('OrderBook', () => {
  it('renders asks and bids as labelled tables with real text prices', () => {
    still(<OrderBook bids={bids} asks={asks} baseSymbol="ETH" />)
    expect(screen.getByRole('region', { name: 'Order book' })).toBeInTheDocument()
    const askTable = screen.getByRole('table', { name: /Asks/ })
    const bidTable = screen.getByRole('table', { name: /Bids/ })
    expect(within(askTable).getAllByRole('row')).toHaveLength(4) // header + 3
    expect(within(bidTable).getByText('99.00')).toBeInTheDocument()
    // Asks are listed from the furthest price down to the best one.
    const askRows = within(askTable).getAllByRole('row')
    expect(askRows[1]).toHaveTextContent('103.00')
    expect(askRows[3]).toHaveTextContent('101.00')
  })

  it('shows the spread and the midpoint when there is no last price', () => {
    still(<OrderBook bids={bids} asks={asks} />)
    expect(screen.getByText('100.00')).toBeInTheDocument()
    expect(screen.getByText(/Spread 2\.00 · 2\.000%/)).toBeInTheDocument()
  })

  it('combines equal prices and drops invalid rows', () => {
    still(<OrderBook bids={[...bids, { price: 99, size: 1 }, { price: 0, size: 4 }, { price: 50, size: 0 }]} asks={asks} />)
    const bidTable = screen.getByRole('table', { name: /Bids/ })
    expect(within(bidTable).getAllByRole('row')).toHaveLength(4)
    expect(within(bidTable).getAllByRole('row')[1]).toHaveTextContent('3')
  })

  it('hides the depth bars from assistive tech and handles an empty side', () => {
    const { container } = still(<OrderBook bids={[]} asks={asks} />)
    expect(screen.getByText('No bids')).toBeInTheDocument()
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0)
    expect(screen.getByText('Spread unavailable')).toBeInTheDocument()
  })

  it('totals the cost of filling up to a hovered level, announced politely', () => {
    still(<OrderBook bids={bids} asks={asks} baseSymbol="ETH" quoteSymbol="USDC" />)
    const row = screen.getByText('102.00').closest('tr')!
    fireEvent.pointerEnter(row)
    const readout = screen.getByText(/Avg/).closest('p')!
    expect(readout).toHaveAttribute('aria-live', 'polite')
    expect(readout).toHaveTextContent('Avg 101.80') // (101*1 + 102*4) / 5
    expect(readout).toHaveTextContent('5 ETH')
  })

  it('makes prices keyboard-reachable buttons when onLevelSelect is set', () => {
    const onLevelSelect = vi.fn()
    still(<OrderBook bids={bids} asks={asks} onLevelSelect={onLevelSelect} />)
    const button = screen.getByRole('button', { name: '98.00' })
    fireEvent.focus(button)
    fireEvent.click(button)
    expect(onLevelSelect).toHaveBeenCalledWith({ price: 98, size: 3, total: 5 }, 'bid')
  })
})
