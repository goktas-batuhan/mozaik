import { fireEvent, render, screen } from '@testing-library/react'
import { ShuffleGrid } from './shuffle-grid'

const items = ['a', 'b', 'c', 'd'].map((id) => ({ id, content: <span>{id}</span> }))
const order = () => screen.getAllByRole('listitem').map((li) => li.textContent)

describe('ShuffleGrid', () => {
  it('renders every tile in the given order', () => {
    render(<ShuffleGrid items={items} />)
    expect(order()).toEqual(['a', 'b', 'c', 'd'])
  })

  it('shuffles to a different order with the same tiles', () => {
    const onOrderChange = vi.fn()
    render(<ShuffleGrid items={items} onOrderChange={onOrderChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Shuffle' }))
    expect(order()).not.toEqual(['a', 'b', 'c', 'd'])
    expect([...order()].sort()).toEqual(['a', 'b', 'c', 'd'])
    expect(onOrderChange).toHaveBeenCalledTimes(1)
  })

  it('resets to the original order', () => {
    render(<ShuffleGrid items={items} />)
    fireEvent.click(screen.getByRole('button', { name: 'Shuffle' }))
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(order()).toEqual(['a', 'b', 'c', 'd'])
  })

  it('hides the buttons when controls is off', () => {
    render(<ShuffleGrid items={items} controls={false} />)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('uses the requested column count', () => {
    render(<ShuffleGrid items={items} columns={2} />)
    expect(screen.getByRole('list')).toHaveClass('grid-cols-2')
  })
})
