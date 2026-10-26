import { fireEvent, render, screen } from '@testing-library/react'
import { ThumbnailCarousel } from './thumbnail-carousel'

const items = ['A', 'B', 'C'].map((t) => ({ id: t, title: t, media: <span>{t} slide</span> }))

describe('ThumbnailCarousel', () => {
  it('labels the carousel and marks the active thumbnail', () => {
    render(<ThumbnailCarousel items={items} label="Photos" />)
    expect(screen.getByRole('group', { name: 'Photos' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Show slide 1: A' })).toHaveAttribute('aria-current', 'true')
  })

  it('goes to a slide when its thumbnail is clicked', () => {
    const onIndexChange = vi.fn()
    render(<ThumbnailCarousel items={items} onIndexChange={onIndexChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Show slide 3: C' }))
    expect(onIndexChange).toHaveBeenCalledWith(2)
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeDisabled()
  })

  it('disables the previous button on the first slide', () => {
    render(<ThumbnailCarousel items={items} />)
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled()
  })
})
