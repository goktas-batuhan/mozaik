import { fireEvent, render, screen } from '@testing-library/react'
import { TimeMachineStack } from './time-machine-stack'

const items = ['A', 'B', 'C'].map((id) => ({ id, label: `Card ${id}`, content: <span>{id}</span> }))

describe('TimeMachineStack', () => {
  it('puts the first card in front and the rest behind', () => {
    const { container } = render(<TimeMachineStack items={items} />)
    expect(container.querySelector('[data-depth="0"]')).toHaveAttribute('aria-label', 'Card A')
    expect(container.querySelector('[data-depth="2"]')).toHaveAttribute('aria-label', 'Card C')
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('steps back with the Older button and reports the index', () => {
    const onIndexChange = vi.fn()
    const { container } = render(<TimeMachineStack items={items} onIndexChange={onIndexChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Older' }))
    expect(onIndexChange).toHaveBeenCalledWith(1)
    expect(container.querySelector('[data-depth="0"]')).toHaveAttribute('aria-label', 'Card B')
    expect(container.querySelector('[data-depth="-1"]')).toHaveAttribute('aria-label', 'Card A')
  })

  it('disables the buttons at either end', () => {
    render(<TimeMachineStack items={items} defaultIndex={2} />)
    expect(screen.getByRole('button', { name: 'Older' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Newer' })).toBeEnabled()
  })

  it('moves with the arrow keys and stops at the ends', () => {
    render(<TimeMachineStack items={items} />)
    const stack = screen.getByRole('group', { name: 'Card stack' })
    fireEvent.keyDown(stack, { key: 'ArrowUp' })
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
    fireEvent.keyDown(stack, { key: 'ArrowDown' })
    fireEvent.keyDown(stack, { key: 'ArrowDown' })
    fireEvent.keyDown(stack, { key: 'ArrowDown' })
    expect(screen.getByText('3 / 3')).toBeInTheDocument()
  })

  it('is controlled by index', () => {
    const onIndexChange = vi.fn()
    render(<TimeMachineStack items={items} index={1} onIndexChange={onIndexChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Older' }))
    expect(onIndexChange).toHaveBeenCalledWith(2)
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
  })
})
