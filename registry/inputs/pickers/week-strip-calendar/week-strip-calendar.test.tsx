import { fireEvent, render, screen } from '@testing-library/react'
import { WeekStripCalendar } from './week-strip-calendar'

// Wednesday, 28 October 2026. The week runs Sunday 25 to Saturday 31.
const wed = new Date(2026, 9, 28)

describe('WeekStripCalendar', () => {
  it('shows the seven days of the week of the selected date', () => {
    render(<WeekStripCalendar defaultValue={wed} />)
    expect(screen.getByText('October 2026')).toBeInTheDocument()
    expect(screen.getByText('Oct 25 – Oct 31')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Wednesday, October 28' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getAllByRole('button', { pressed: false })).toHaveLength(6)
  })

  it('selects a day on click and reports it at local midnight', () => {
    const onChange = vi.fn()
    render(<WeekStripCalendar defaultValue={wed} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Friday, October 30' }))
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 9, 30))
    expect(screen.getByRole('button', { name: 'Friday, October 30' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('moves a week at a time with the arrows', () => {
    render(<WeekStripCalendar defaultValue={wed} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next week' }))
    expect(screen.getByText('Nov 1 – Nov 7')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Previous week' }))
    fireEvent.click(screen.getByRole('button', { name: 'Previous week' }))
    expect(screen.getByText('Oct 18 – Oct 24')).toBeInTheDocument()
  })

  it('is controlled when value is given', () => {
    const { rerender } = render(<WeekStripCalendar value={wed} />)
    fireEvent.click(screen.getByRole('button', { name: 'Thursday, October 29' }))
    expect(screen.getByRole('button', { name: 'Wednesday, October 28' })).toHaveAttribute('aria-pressed', 'true')
    rerender(<WeekStripCalendar value={new Date(2026, 9, 29)} />)
    expect(screen.getByRole('button', { name: 'Thursday, October 29' })).toHaveAttribute('aria-pressed', 'true')
  })
})
