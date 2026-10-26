import { fireEvent, render, screen } from '@testing-library/react'
import { ImageAccordion } from './image-accordion'

const items = [
  { id: 'a', title: 'Alpha', description: 'First', media: <i /> },
  { id: 'b', title: 'Beta', description: 'Second', media: <i /> },
  { id: 'c', title: 'Gamma', media: <i /> },
]

describe('ImageAccordion', () => {
  it('opens the default panel and exposes the rest as buttons', () => {
    render(<ImageAccordion items={items} defaultIndex={1} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'true')
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens a panel on click and reports the index', () => {
    const onIndexChange = vi.fn()
    render(<ImageAccordion items={items} onIndexChange={onIndexChange} />)
    fireEvent.click(screen.getAllByRole('button')[2])
    expect(onIndexChange).toHaveBeenCalledWith(2)
    expect(screen.getAllByRole('button')[2]).toHaveAttribute('aria-expanded', 'true')
  })

  it('moves with the arrow keys', () => {
    render(<ImageAccordion items={items} />)
    fireEvent.keyDown(screen.getAllByRole('button')[0], { key: 'ArrowRight' })
    expect(screen.getAllByRole('button')[1]).toHaveAttribute('aria-expanded', 'true')
  })
})
