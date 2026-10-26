import { fireEvent, render, screen } from '@testing-library/react'
import { ShiftCard } from './shift-card'

describe('ShiftCard', () => {
  it('keeps the bottom content in the DOM for assistive tech', () => {
    render(<ShiftCard topContent="Top" middleContent="Middle" bottomContent="Details" />)
    expect(screen.getByText('Details')).toBeInTheDocument()
    expect(screen.getByText('Middle')).toBeInTheDocument()
  })

  it('shows the reveal content on focus', () => {
    render(<ShiftCard topRevealContent="Revealed" />)
    expect(screen.queryByText('Revealed')).not.toBeInTheDocument()
    fireEvent.focus(screen.getByRole('article'))
    expect(screen.getByText('Revealed')).toBeInTheDocument()
  })

  it('stays closed when disabled', () => {
    render(<ShiftCard disabled topRevealContent="Revealed" />)
    const card = screen.getByRole('article')
    fireEvent.focus(card)
    fireEvent.click(card)
    expect(screen.queryByText('Revealed')).not.toBeInTheDocument()
    expect(card).toHaveAttribute('tabindex', '-1')
  })
})
