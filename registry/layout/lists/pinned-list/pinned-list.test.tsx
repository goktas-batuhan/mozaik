import { fireEvent, render, screen } from '@testing-library/react'
import { PinnedList } from './pinned-list'

const items = [
  { id: 'a', title: 'Alpha' },
  { id: 'b', title: 'Bravo' },
  { id: 'c', title: 'Charlie' },
]
const order = () => screen.getAllByRole('listitem').map((li) => li.textContent)

describe('PinnedList', () => {
  it('lists the rows in the given order', () => {
    render(<PinnedList items={items} />)
    expect(order()).toEqual(['Alpha', 'Bravo', 'Charlie'])
  })

  it('moves a pinned row to the top and back', () => {
    render(<PinnedList items={items} />)
    fireEvent.click(screen.getByRole('button', { name: 'Pin Charlie' }))
    expect(order()[0]).toBe('Charlie')
    fireEvent.click(screen.getByRole('button', { name: 'Unpin Charlie' }))
    expect(order()[2]).toBe('Charlie')
  })

  it('reports the pinned ids', () => {
    const onPinnedChange = vi.fn()
    render(<PinnedList items={items} onPinnedChange={onPinnedChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Pin Bravo' }))
    expect(onPinnedChange).toHaveBeenLastCalledWith(['b'])
  })

  it('stops pinning at maxPinned', () => {
    render(<PinnedList items={items} maxPinned={1} defaultPinned={['a']} />)
    expect(screen.getByRole('button', { name: 'Pin Bravo' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Unpin Alpha' })).toHaveAttribute('aria-pressed', 'true')
  })
})
