import { fireEvent, render, screen, within } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { VolumeProfile, type VolumeProfileBin } from './volume-profile'

const still = (ui: React.ReactNode) => render(<MotionConfig reducedMotion="always">{ui}</MotionConfig>)

const data: VolumeProfileBin[] = [
  { id: 'a', priceLow: 100, priceHigh: 110, volume: 10 },
  { id: 'b', priceLow: 110, priceHigh: 120, volume: 50 },
  { id: 'c', priceLow: 120, priceHigh: 130, volume: 30 },
  { id: 'd', priceLow: 130, priceHigh: 140, volume: 5 },
]

describe('VolumeProfile', () => {
  it('finds the point of control and summarises the chart', () => {
    const { container } = still(<VolumeProfile data={data} unit="ETH" label="ETH profile" />)
    expect(container.querySelector('[data-poc]')).toHaveAttribute('data-volume-bin', 'b')
    const text = screen.getByRole('img').getAttribute('aria-label')!
    expect(text).toContain('ETH profile: 4 price levels from 100 to 140')
    expect(text).toContain('95 ETH in total')
    expect(text).toContain('point of control at 115')
    expect(screen.getAllByText('115').length).toBeGreaterThan(0)
  })

  it('grows the value area outward from the POC without exceeding the target', () => {
    const { container } = still(<VolumeProfile data={data} valueArea={0.9} />)
    const inside = [...container.querySelectorAll('[data-value-area]')].map((n) => n.getAttribute('data-volume-bin'))
    expect(inside).toEqual(['b', 'c'])
    expect(screen.getByText('84.2% of volume')).toBeInTheDocument()
  })

  it('hides the value area when switched off', () => {
    const { container } = still(<VolumeProfile data={data} valueArea={false} />)
    expect(container.querySelector('[data-value-area]')).toBeNull()
    expect(screen.queryByText(/Value area/)).toBeNull()
  })

  it('inspects a level from the keyboard and reports it', () => {
    const onActiveChange = vi.fn()
    still(<VolumeProfile data={data} unit="ETH" onActiveChange={onActiveChange} />)
    const slider = screen.getByRole('slider', { name: /inspect price level/ })
    fireEvent.focus(slider)
    expect(onActiveChange).toHaveBeenCalledWith('a')
    fireEvent.change(slider, { target: { value: '2' } })
    expect(onActiveChange).toHaveBeenLastCalledWith('c')
    expect(slider.getAttribute('aria-valuetext')).toContain('120 to 130')
    expect(slider.getAttribute('aria-valuetext')).toContain('31.6% of total volume')
    expect(screen.getByText(/30 ETH · 31\.6%/)).toBeInTheDocument()
  })

  it('exposes the data as a table and rejects overlapping ranges', () => {
    still(<VolumeProfile data={data} label="Levels" />)
    const table = screen.getByRole('table', { name: 'Levels data' })
    expect(within(table).getAllByRole('row')).toHaveLength(5)
    expect(within(table).getByText('Point of control')).toBeInTheDocument()
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() =>
      render(
        <VolumeProfile
          data={[
            { id: 'x', priceLow: 1, priceHigh: 5, volume: 1 },
            { id: 'y', priceLow: 4, priceHigh: 8, volume: 1 },
          ]}
        />,
      ),
    ).toThrow(/must not overlap/)
    spy.mockRestore()
  })
})
