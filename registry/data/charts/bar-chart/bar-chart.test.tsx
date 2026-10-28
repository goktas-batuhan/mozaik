import { fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { BarChart } from './bar-chart'

const data = [
  { label: 'A', value: 10 },
  { label: 'B', value: 40 },
  { label: 'C', value: 20 },
]

describe('BarChart', () => {
  it('lists every value in its accessible name', () => {
    render(<BarChart data={data} label="Sales" />)
    expect(screen.getByRole('img', { name: 'Sales: A 10, B 40, C 20' })).toBeInTheDocument()
  })

  it('scales bars to the largest value', () => {
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <BarChart data={data} />
      </MotionConfig>,
    )
    const bars = Array.from(container.querySelectorAll<HTMLElement>('[data-slot="bar-chart"] .rounded-t-md'))
    expect(bars).toHaveLength(3)
    expect(bars[1]).toHaveStyle({ height: '100%' })
    expect(bars[0]).toHaveStyle({ height: '25%' })
  })

  it('shows a value on hover only when showValues is off', () => {
    const { container } = render(<BarChart data={data} />)
    const values = () => Array.from(container.querySelectorAll('.tabular-nums')).filter((el) => !el.classList.contains('invisible'))
    expect(values()).toHaveLength(0)
    fireEvent.mouseEnter(container.querySelectorAll('.min-w-0.flex-1')[1])
    expect(values().map((el) => el.textContent)).toEqual(['40'])
  })

  it('shows all values with showValues and uses a custom format', () => {
    const { container } = render(<BarChart data={data} showValues format={(v) => `$${v}`} />)
    const shown = Array.from(container.querySelectorAll('.tabular-nums')).filter((el) => !el.classList.contains('invisible'))
    expect(shown.map((el) => el.textContent)).toEqual(['$10', '$40', '$20'])
  })

  it('copes with no data', () => {
    render(<BarChart data={[]} />)
    expect(screen.getByRole('img')).toHaveAccessibleName('Bar chart: no data')
  })
})
