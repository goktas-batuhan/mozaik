import { fireEvent, render, screen } from '@testing-library/react'
import { DepthChart } from './depth-chart'

const bids = [
  { price: 99, size: 5 },
  { price: 98, size: 10 },
  { price: 97, size: 20 },
]
const asks = [
  { price: 101, size: 4 },
  { price: 102, size: 6 },
  { price: 103, size: 30 },
]

describe('DepthChart', () => {
  it('summarises the best prices and the spread', () => {
    render(<DepthChart bids={bids} asks={asks} label="ETH" />)
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'ETH: best bid 99, best ask 101, spread 2')
    expect(screen.getByText('Spread 2')).toBeInTheDocument()
  })

  it('draws both sides', () => {
    const { container } = render(<DepthChart bids={bids} asks={asks} />)
    expect(container.querySelector('[data-part="bids"]')!.getAttribute('d')).toMatch(/^M.*Z$/)
    expect(container.querySelector('[data-part="asks"]')!.getAttribute('d')).toMatch(/^M.*Z$/)
  })

  it('walks the levels with the keyboard and shows cumulative depth', () => {
    render(<DepthChart bids={bids} asks={asks} formatSize={(v) => String(v)} />)
    const slider = screen.getByRole('slider')
    fireEvent.keyDown(slider, { key: 'ArrowRight' }) // first ask
    expect(slider).toHaveAttribute('aria-valuetext', 'ask 101, depth 4')
    fireEvent.keyDown(slider, { key: 'End' })
    expect(slider).toHaveAttribute('aria-valuetext', 'ask 103, depth 40')
    fireEvent.keyDown(slider, { key: 'Home' })
    expect(slider).toHaveAttribute('aria-valuetext', 'bid 97, depth 35')
    fireEvent.keyDown(slider, { key: 'Escape' })
    expect(slider).toHaveAttribute('aria-valuetext', 'No level selected')
  })

  it('counts bid depth from the best price downwards', () => {
    render(<DepthChart bids={bids} asks={asks} formatSize={(v) => String(v)} />)
    const slider = screen.getByRole('slider')
    fireEvent.keyDown(slider, { key: 'ArrowLeft' }) // best bid
    expect(slider).toHaveAttribute('aria-valuetext', 'bid 99, depth 5')
    fireEvent.keyDown(slider, { key: 'ArrowLeft' })
    expect(slider).toHaveAttribute('aria-valuetext', 'bid 98, depth 15')
  })

  it('handles an empty side', () => {
    render(<DepthChart bids={[]} asks={asks} label="Empty" />)
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Empty: no data')
  })
})
