import { fireEvent, render, screen } from '@testing-library/react'
import { HoverImageList } from './hover-image-list'

const items = [
  { id: 'a', title: 'Alpha', meta: '2024', preview: <span>alpha-preview</span> },
  { id: 'b', title: 'Bravo', preview: <span>bravo-preview</span> },
]

describe('HoverImageList', () => {
  it('lists every title as a button', () => {
    render(<HoverImageList items={items} />)
    expect(screen.getAllByRole('button')).toHaveLength(2)
    expect(screen.getByText('2024')).toBeInTheDocument()
  })

  it('shows no preview until a row is active', () => {
    render(<HoverImageList items={items} />)
    expect(screen.queryByText('alpha-preview')).toBeNull()
  })

  it('shows the preview on focus and removes it on blur', () => {
    render(<HoverImageList items={items} />)
    const row = screen.getByRole('button', { name: /Alpha/ })
    fireEvent.focus(row)
    expect(screen.getByText('alpha-preview')).toBeInTheDocument()
    fireEvent.blur(row)
  })

  it('switches previews between rows on pointer enter', () => {
    render(<HoverImageList items={items} />)
    fireEvent.pointerEnter(screen.getByRole('button', { name: /Bravo/ }))
    expect(screen.getByText('bravo-preview')).toBeInTheDocument()
    expect(screen.queryByText('alpha-preview')).toBeNull()
  })

  it('keeps the preview out of the accessibility tree', () => {
    render(<HoverImageList items={items} />)
    fireEvent.focus(screen.getByRole('button', { name: /Alpha/ }))
    expect(screen.getByText('alpha-preview').parentElement).toHaveAttribute('aria-hidden', 'true')
  })
})
