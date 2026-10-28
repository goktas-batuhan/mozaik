import { fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { CandlestickChart, type Candle } from './candlestick-chart'

const still = (ui: React.ReactNode) => render(<MotionConfig reducedMotion="always">{ui}</MotionConfig>)

const candles: Candle[] = [
  { id: 'a', label: '09:00', open: 100, high: 110, low: 95, close: 108, volume: 1000 },
  { id: 'b', label: '09:05', open: 108, high: 112, low: 100, close: 102, volume: 2000 },
  { id: 'c', label: '09:10', open: 102, high: 106, low: 99, close: 105, volume: 1500 },
]

describe('CandlestickChart', () => {
  it('summarises the series in an accessible image', () => {
    still(<CandlestickChart candles={candles} label="ETH/USD" />)
    const img = screen.getByRole('img')
    const text = img.getAttribute('aria-label')!
    expect(text).toContain('ETH/USD: 3 candles from 09:00 to 09:10')
    expect(text).toContain('low 95')
    expect(text).toContain('high 112')
    expect(text).toContain('last close 105')
  })

  it('colours candles by direction', () => {
    const { container } = still(<CandlestickChart candles={candles} />)
    const trends = [...container.querySelectorAll('[data-trend]')].map((n) => n.getAttribute('data-trend'))
    expect(trends).toEqual(['up', 'down', 'up'])
  })

  it('shows the latest candle in the legend, then the one under the keyboard crosshair', () => {
    still(<CandlestickChart candles={candles} formatPrice={(v) => v.toFixed(0)} />)
    expect(screen.getByText('09:10')).toBeInTheDocument()
    const slider = screen.getByRole('slider')
    fireEvent.keyDown(slider, { key: 'ArrowLeft' })
    expect(screen.getByText('09:05')).toBeInTheDocument()
    expect(slider).toHaveAttribute('aria-valuenow', '1')
    expect(slider.getAttribute('aria-valuetext')).toContain('close 102')
    fireEvent.keyDown(slider, { key: 'Home' })
    expect(screen.getByText('09:00')).toBeInTheDocument()
    fireEvent.keyDown(slider, { key: 'Escape' })
    expect(screen.getByText('09:10')).toBeInTheDocument()
  })

  it('reports the active candle id and can be controlled', () => {
    const onActiveIdChange = vi.fn()
    const { rerender } = still(<CandlestickChart candles={candles} activeId="a" onActiveIdChange={onActiveIdChange} />)
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('aria-valuenow', '0')
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(onActiveIdChange).toHaveBeenCalledWith('b')
    // Controlled: stays on 'a' until the parent changes it, and clears when the candle leaves the window.
    expect(slider).toHaveAttribute('aria-valuenow', '0')
    rerender(
      <MotionConfig reducedMotion="always">
        <CandlestickChart candles={candles.slice(1)} activeId="a" onActiveIdChange={onActiveIdChange} />
      </MotionConfig>,
    )
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '1')
  })

  it('draws the last price tag and handles no data', () => {
    const { unmount } = still(<CandlestickChart candles={candles} lastPrice={104.5} />)
    expect(screen.getAllByText('104.5').length).toBeGreaterThan(0)
    unmount()
    still(<CandlestickChart candles={[]} label="Empty" />)
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Empty: no data')
  })
})
