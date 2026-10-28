import { render, screen } from '@testing-library/react'
import { KpiCard } from './kpi-card'

describe('KpiCard', () => {
  it('shows the label and a grouped number with prefix and suffix', () => {
    render(<KpiCard label="Revenue" prefix="$" value={48210} suffix=" USD" />)
    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('$48,210 USD')).toBeInTheDocument()
  })

  it('says the direction of the change in words', () => {
    const { rerender } = render(<KpiCard label="Users" value={10} delta={12.34} />)
    expect(screen.getByText('Up')).toHaveClass('sr-only')
    expect(screen.getByText('12.3%')).toBeInTheDocument()
    rerender(<KpiCard label="Users" value={10} delta={-4} />)
    expect(screen.getByText('Down')).toBeInTheDocument()
    expect(screen.getByText('4%')).toBeInTheDocument()
  })

  it('counts a fall as good when lower is better', () => {
    const { container, rerender } = render(<KpiCard label="Errors" value={3} delta={-10} />)
    expect(container.querySelector('[data-tone]')).toHaveAttribute('data-tone', 'destructive')
    rerender(<KpiCard label="Errors" value={3} delta={-10} lowerIsBetter />)
    expect(container.querySelector('[data-tone]')).toHaveAttribute('data-tone', 'success')
  })

  it('treats zero as unchanged and omits the delta when absent', () => {
    const { container, rerender } = render(<KpiCard label="A" value={1} delta={0} />)
    expect(screen.getByText('Unchanged')).toBeInTheDocument()
    rerender(<KpiCard label="A" value={1} />)
    expect(container.querySelector('[data-tone]')).toBeNull()
  })

  it('draws a sparkline only for a real trend', () => {
    const { rerender } = render(<KpiCard label="Sales" value={1} trend={[1, 2, 3]} />)
    expect(screen.getByRole('img', { name: /Sales trend/ })).toBeInTheDocument()
    rerender(<KpiCard label="Sales" value={1} trend={[1]} />)
    expect(screen.queryByRole('img')).toBeNull()
  })
})
