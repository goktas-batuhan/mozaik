import { fireEvent, render, screen } from '@testing-library/react'
import { LiquidityHeatmap } from './liquidity-heatmap'

const cells = [
  [0, 50, 100],
  [10, 20, 30],
]
const props = { cells, rowLabels: ['3,420', '3,410'], columnLabels: ['09:00', '09:05', '09:10'], formatValue: (v: number) => String(v) }

describe('LiquidityHeatmap', () => {
  it('renders one gridcell per value with an accessible name', () => {
    render(<LiquidityHeatmap {...props} label="ETH" />)
    expect(screen.getByRole('grid', { name: 'ETH' })).toHaveAttribute('aria-rowcount', '2')
    expect(screen.getAllByRole('gridcell')).toHaveLength(6)
    expect(screen.getByRole('gridcell', { name: '3,420, 09:10: 100' })).toBeInTheDocument()
  })

  it('scales strength against the largest cell', () => {
    const { container } = render(<LiquidityHeatmap {...props} />)
    const strength = (id: string) => (container.querySelector(`[data-cell="${id}"] > span`) as HTMLElement).style.opacity
    expect(strength('0-2')).toBe('1')
    expect(strength('0-1')).toBe('0.5')
    expect(strength('0-0')).toBe('0')
  })

  it('moves focus with the arrow keys and shows the cell in the readout', () => {
    render(<LiquidityHeatmap {...props} />)
    const first = screen.getByRole('gridcell', { name: '3,420, 09:00: 0' })
    first.focus()
    fireEvent.keyDown(first, { key: 'ArrowRight' })
    expect(screen.getByRole('gridcell', { name: '3,420, 09:05: 50' })).toHaveFocus()
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
    expect(screen.getByRole('gridcell', { name: '3,410, 09:05: 20' })).toHaveFocus()
    expect(screen.getByText('3,410 · 09:05 · 20')).toBeInTheDocument()
    fireEvent.keyDown(document.activeElement!, { key: 'End' })
    expect(screen.getByRole('gridcell', { name: '3,410, 09:10: 30' })).toHaveFocus()
  })

  it('keeps a single tab stop and clamps at the edges', () => {
    render(<LiquidityHeatmap {...props} />)
    expect(screen.getAllByRole('gridcell').filter((c) => c.tabIndex === 0)).toHaveLength(1)
    const first = screen.getByRole('gridcell', { name: '3,420, 09:00: 0' })
    first.focus()
    fireEvent.keyDown(first, { key: 'ArrowUp' })
    fireEvent.keyDown(first, { key: 'ArrowLeft' })
    expect(first).toHaveFocus()
  })

  it('marks the current price row and handles no data', () => {
    const { container, unmount } = render(<LiquidityHeatmap {...props} markerRow={1} />)
    expect(container.querySelectorAll('[data-marker]')).toHaveLength(3)
    unmount()
    render(<LiquidityHeatmap cells={[]} rowLabels={[]} columnLabels={[]} label="Empty" />)
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Empty: no data')
  })
})
