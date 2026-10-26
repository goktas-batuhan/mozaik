import { fireEvent, render, screen } from '@testing-library/react'
import { DirectionAwareTabs } from './direction-aware-tabs'

const tabs = [
  { id: 'a', label: 'Alpha', content: <p>Alpha body</p> },
  { id: 'b', label: 'Beta', content: <p>Beta body</p> },
]

describe('DirectionAwareTabs', () => {
  it('renders a tablist with the first tab selected', () => {
    render(<DirectionAwareTabs tabs={tabs} />)
    expect(screen.getAllByRole('tab')).toHaveLength(2)
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Alpha body')
  })

  it('switches tab on click and reports it', () => {
    const onValueChange = vi.fn()
    render(<DirectionAwareTabs tabs={tabs} onValueChange={onValueChange} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Beta' }))
    expect(onValueChange).toHaveBeenCalledWith('b')
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true')
  })

  it('moves with the arrow keys', () => {
    render(<DirectionAwareTabs tabs={tabs} />)
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true')
  })
})
