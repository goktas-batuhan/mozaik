import { render, screen, within } from '@testing-library/react'
import { FeaturesComparison } from './features-comparison'

const columns = [
  { id: 'us', name: 'Us', highlight: true },
  { id: 'them', name: 'Them', caption: 'Paid' },
]
const rows = [
  { feature: 'Source', hint: 'Yours to edit', values: { us: true, them: false } },
  { feature: 'Setup', values: { us: '5 min', them: '1 hour' } },
]

describe('FeaturesComparison', () => {
  it('labels the section and exposes a real table', () => {
    render(<FeaturesComparison title="Compare" columns={columns} rows={rows} />)
    expect(screen.getByRole('region', { name: 'Compare' })).toBeInTheDocument()
    expect(screen.getByRole('table', { name: 'Feature comparison' })).toBeInTheDocument()
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['Features', 'Us', 'ThemPaid'])
  })

  it('renders text values as they are', () => {
    render(<FeaturesComparison title="Compare" columns={columns} rows={rows} />)
    const row = screen.getByRole('row', { name: /Setup/ })
    expect(within(row).getByText('5 min')).toBeInTheDocument()
    expect(within(row).getByText('1 hour')).toBeInTheDocument()
  })

  it('announces booleans as included or not included', () => {
    render(<FeaturesComparison title="Compare" columns={columns} rows={rows} />)
    const row = screen.getByRole('row', { name: /Source/ })
    expect(within(row).getByText('Included')).toBeInTheDocument()
    expect(within(row).getByText('Not included')).toBeInTheDocument()
  })

  it('treats a missing value as not included and shades the highlighted column', () => {
    render(<FeaturesComparison title="Compare" columns={columns} rows={[{ feature: 'Gap', values: { us: true } }]} />)
    expect(screen.getByText('Not included')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Us' })).toHaveClass('bg-primary/10')
  })
})
