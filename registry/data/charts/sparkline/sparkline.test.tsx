import { render, screen } from '@testing-library/react'
import { Sparkline } from './sparkline'

describe('Sparkline', () => {
  it('summarizes the series in its accessible name', () => {
    render(<Sparkline data={[3, 9, 5, 1]} label="Visits" />)
    expect(screen.getByRole('img', { name: 'Visits: 4 points, from 3 to 1, low 1, high 9' })).toBeInTheDocument()
  })

  it('handles empty and single-value series', () => {
    const { container, rerender } = render(<Sparkline data={[]} />)
    expect(screen.getByRole('img')).toHaveAccessibleName('Trend: no data')
    expect(container.querySelector('path')).toBeNull()
    rerender(<Sparkline data={[5]} />)
    expect(container.querySelector('circle')).not.toBeNull()
    expect(container.querySelector('path')).toBeNull()
  })

  it('draws a flat series in the middle', () => {
    const { container } = render(<Sparkline data={[2, 2, 2]} height={40} />)
    expect(container.querySelector('circle')).toHaveAttribute('cy', '20')
  })

  it('adds an area and removes the dot when asked', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} area dot={false} />)
    expect(container.querySelectorAll('path')).toHaveLength(2)
    expect(container.querySelector('circle')).toBeNull()
  })

  it('takes its color from the tone', () => {
    render(<Sparkline data={[1, 2]} tone="destructive" />)
    expect(screen.getByRole('img')).toHaveClass('text-destructive')
  })
})
