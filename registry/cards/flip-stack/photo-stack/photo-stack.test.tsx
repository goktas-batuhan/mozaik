import { fireEvent, render, screen } from '@testing-library/react'
import { PhotoStack } from './photo-stack'

const items = ['a', 'b', 'c'].map((id) => ({ id, label: `Card ${id}`, content: <span>{id}</span> }))

describe('PhotoStack', () => {
  it('shows the first card as the only focusable button', () => {
    render(<PhotoStack items={items} />)
    expect(screen.getAllByRole('button')).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Card a, next card' })).toHaveAttribute('tabindex', '0')
  })

  it('sends the top card to the back on click', () => {
    const onCycle = vi.fn()
    render(<PhotoStack items={items} onCycle={onCycle} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onCycle).toHaveBeenCalledWith(['b', 'c', 'a'])
    expect(screen.getByRole('button', { name: 'Card b, next card' })).toBeInTheDocument()
  })

  it('cycles from the keyboard with Enter and Space', () => {
    const onCycle = vi.fn()
    render(<PhotoStack items={items} onCycle={onCycle} />)
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' })
    expect(onCycle).toHaveBeenLastCalledWith(['c', 'a', 'b'])
  })

  it('ignores other keys and clicks on cards behind', () => {
    const onCycle = vi.fn()
    render(<PhotoStack items={items} onCycle={onCycle} />)
    fireEvent.keyDown(screen.getByRole('button'), { key: 'a' })
    fireEvent.click(screen.getByText('b'))
    expect(onCycle).not.toHaveBeenCalled()
  })

  it('hides the cards behind from assistive tech', () => {
    const { container } = render(<PhotoStack items={items} />)
    expect(container.querySelectorAll('[aria-hidden="true"][data-position]')).toHaveLength(2)
  })
})
