import { render, screen } from '@testing-library/react'
import { DonutChart } from './donut-chart'

const data = [
  { label: 'Search', value: 50 },
  { label: 'Direct', value: 30 },
  { label: 'Email', value: 20 },
]

describe('DonutChart', () => {
  it('reads the shares as percentages', () => {
    render(<DonutChart data={data} label="Traffic" />)
    expect(screen.getByRole('img', { name: 'Traffic: Search 50%, Direct 30%, Email 20%' })).toBeInTheDocument()
  })

  it('lists each slice in the legend', () => {
    render(<DonutChart data={data} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByText('30%')).toBeInTheDocument()
  })

  it('shows the total in the hole unless told otherwise', () => {
    const { rerender } = render(<DonutChart data={data} />)
    expect(screen.getByText('100')).toBeInTheDocument()
    rerender(<DonutChart data={data} center="Visits" />)
    expect(screen.getByText('Visits')).toBeInTheDocument()
  })

  it('hides the legend on request and skips empty slices', () => {
    const { container } = render(<DonutChart data={[...data, { label: 'None', value: 0 }]} legend={false} />)
    expect(screen.queryByRole('list')).toBeNull()
    expect(container.querySelectorAll('circle')).toHaveLength(4)
  })

  it('copes with no data', () => {
    render(<DonutChart data={[]} />)
    expect(screen.getByRole('img')).toHaveAccessibleName('Share: no data')
  })
})
