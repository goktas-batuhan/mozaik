import { render, screen } from '@testing-library/react'
import { DragCarousel } from './drag-carousel'

describe('DragCarousel', () => {
  it('exposes a labelled carousel with numbered slides', () => {
    render(
      <DragCarousel label="Photos">
        <p>One</p>
        <p>Two</p>
        <p>Three</p>
      </DragCarousel>,
    )
    expect(screen.getByRole('group', { name: 'Photos' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: '2 of 3' })).toHaveTextContent('Two')
  })

  it('hides the buttons when controls is false', () => {
    render(
      <DragCarousel controls={false}>
        <p>One</p>
      </DragCarousel>,
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('disables the buttons when disabled', () => {
    render(
      <DragCarousel disabled>
        <p>One</p>
      </DragCarousel>,
    )
    expect(screen.getByRole('button', { name: 'Next slides' })).toBeDisabled()
  })
})
