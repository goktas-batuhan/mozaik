import { render, screen } from '@testing-library/react'
import { RollingText } from './rolling-text'

describe('RollingText', () => {
  it('exposes the full text to assistive tech', () => {
    render(<RollingText text="Hello" />)
    expect(screen.getByText('Hello', { selector: '.sr-only' })).toBeInTheDocument()
  })

  it('renders plain text when disabled', () => {
    const { container } = render(<RollingText text="Hello" disabled />)
    expect(container.textContent).toBe('Hello')
    expect(container.querySelectorAll('[aria-hidden]')).toHaveLength(0)
  })

  it('renders the requested element', () => {
    render(<RollingText as="h2" text="Title" />)
    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument()
  })
})
