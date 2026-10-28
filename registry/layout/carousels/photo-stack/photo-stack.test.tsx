import { fireEvent, render, screen } from '@testing-library/react'
import { PhotoStack } from './photo-stack'

const cards = ['a', 'b', 'c'].map((id) => ({ id, label: `Card ${id}`, content: <span>{id}</span> }))

describe('PhotoStack', () => {
  it('exposes only the top card as a button', () => {
    render(<PhotoStack cards={cards} />)
    expect(screen.getAllByRole('button')).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Card a, show next card' })).toBeInTheDocument()
  })

  it('sends the top card to the back on click', () => {
    const onCycle = vi.fn()
    render(<PhotoStack cards={cards} onCycle={onCycle} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onCycle).toHaveBeenLastCalledWith(['b', 'c', 'a'])
    expect(screen.getByRole('button', { name: 'Card b, show next card' })).toBeInTheDocument()
  })

  it('cycles with Enter and Space', () => {
    const onCycle = vi.fn()
    render(<PhotoStack cards={cards} onCycle={onCycle} />)
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' })
    expect(onCycle).toHaveBeenLastCalledWith(['c', 'a', 'b'])
  })

  it('wraps back to the first order after a full turn', () => {
    const onCycle = vi.fn()
    render(<PhotoStack cards={cards} onCycle={onCycle} />)
    for (let i = 0; i < 3; i++) fireEvent.click(screen.getByRole('button'))
    expect(onCycle).toHaveBeenLastCalledWith(['a', 'b', 'c'])
  })
})
