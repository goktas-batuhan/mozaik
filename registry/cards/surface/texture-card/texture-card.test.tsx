import { render, screen } from '@testing-library/react'
import { TextureCard, TextureCardContent, TextureCardTitle, TextureSeparator } from './texture-card'

describe('TextureCard', () => {
  it('renders its children inside the bezel', () => {
    render(
      <TextureCard data-testid="card">
        <TextureCardTitle>Title</TextureCardTitle>
        <TextureCardContent>Body</TextureCardContent>
      </TextureCard>,
    )
    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument()
    expect(screen.getByTestId('card')).toHaveTextContent('Body')
  })

  it('renders the requested element and keeps extra classes', () => {
    render(<TextureCard as="section" aria-label="Plan" className="custom" />)
    const el = screen.getByLabelText('Plan')
    expect(el.tagName).toBe('SECTION')
    expect(el).toHaveClass('custom')
  })

  it('exposes the separator role', () => {
    render(<TextureSeparator />)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })
})
