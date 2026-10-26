import { render, screen } from '@testing-library/react'
import { AnimatedList } from './animated-list'

const items = ['a', 'b', 'c'].map((k) => <p key={k}>{`item ${k}`}</p>)

describe('AnimatedList', () => {
  it('exposes a list with the first item', () => {
    render(<AnimatedList>{items}</AnimatedList>)
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByText('item a')).toBeInTheDocument()
  })

  it('shows every item at once when disabled', () => {
    render(<AnimatedList disabled>{items}</AnimatedList>)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('puts the newest item on top', () => {
    render(<AnimatedList disabled>{items}</AnimatedList>)
    const texts = screen.getAllByRole('listitem').map((el) => el.textContent)
    expect(texts).toEqual(['item c', 'item b', 'item a'])
  })
})
