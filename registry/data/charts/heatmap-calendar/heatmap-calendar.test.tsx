import { fireEvent, render, screen } from '@testing-library/react'
import { HeatmapCalendar } from './heatmap-calendar'

const values = [0, 1, 2, 3, 4, 0, 8, 4, 0, 0, 2, 0, 0, 1]

describe('HeatmapCalendar', () => {
  it('names the grid with the total', () => {
    render(<HeatmapCalendar values={values} unit="commits" label="Commits" />)
    expect(screen.getByRole('group', { name: 'Commits: 25 commits over 14 days' })).toBeInTheDocument()
  })

  it('draws one cell per day, darker for busier days', () => {
    render(<HeatmapCalendar values={values} />)
    const cells = screen.getAllByRole('button')
    expect(cells).toHaveLength(14)
    expect(cells[0]).toHaveAttribute('data-level', '0')
    expect(cells[6]).toHaveAttribute('data-level', '4')
    expect(cells[1]).toHaveAttribute('data-level', '1')
  })

  it('reads a day on hover and returns to the total', () => {
    render(<HeatmapCalendar values={values} unit="commits" />)
    const cell = screen.getByRole('button', { name: 'Day 7: 8 commits' })
    fireEvent.mouseEnter(cell)
    expect(screen.getByText('Day 7: 8 commits', { selector: 'span' })).toBeInTheDocument()
    fireEvent.mouseLeave(cell)
    expect(screen.getByText('25 commits in total')).toBeInTheDocument()
  })

  it('reports the picked day', () => {
    const onSelect = vi.fn()
    render(<HeatmapCalendar values={values} onSelect={onSelect} />)
    fireEvent.click(screen.getAllByRole('button')[4])
    expect(onSelect).toHaveBeenCalledWith(4, 4)
  })
})
