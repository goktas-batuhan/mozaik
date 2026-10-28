import { fireEvent, render, screen } from '@testing-library/react'
import { CoverflowCarousel } from './coverflow-carousel'

const items = ['a', 'b', 'c'].map((id) => ({ id, content: <span>slide-{id}</span> }))

describe('CoverflowCarousel', () => {
  it('is a labelled carousel region', () => {
    render(<CoverflowCarousel items={items} label="Albums" />)
    expect(screen.getByRole('region', { name: 'Albums' })).toHaveAttribute('aria-roledescription', 'carousel')
  })

  it('exposes only the centre slide to assistive tech', () => {
    const { container } = render(<CoverflowCarousel items={items} />)
    const hidden = container.querySelectorAll('[aria-roledescription="slide"][aria-hidden="true"]')
    expect(hidden).toHaveLength(2)
  })

  it('steps with the buttons and the arrow keys, and announces it', () => {
    const onIndexChange = vi.fn()
    render(<CoverflowCarousel items={items} onIndexChange={onIndexChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(onIndexChange).toHaveBeenLastCalledWith(1)
    fireEvent.keyDown(screen.getByRole('region'), { key: 'ArrowRight' })
    expect(onIndexChange).toHaveBeenLastCalledWith(2)
    expect(screen.getByText('Slide 3 of 3')).toBeInTheDocument()
    fireEvent.keyDown(screen.getByRole('region'), { key: 'ArrowLeft' })
    expect(onIndexChange).toHaveBeenLastCalledWith(1)
  })

  it('stops at the ends unless it loops', () => {
    const { rerender } = render(<CoverflowCarousel items={items} />)
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled()
    rerender(<CoverflowCarousel items={items} loop />)
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeEnabled()
    fireEvent.click(screen.getByRole('button', { name: 'Previous slide' }))
    expect(screen.getByText('Slide 3 of 3')).toBeInTheDocument()
  })
})
