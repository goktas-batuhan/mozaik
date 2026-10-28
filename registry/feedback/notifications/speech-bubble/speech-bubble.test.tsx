import { render, screen } from '@testing-library/react'
import { SpeechBubble } from './speech-bubble'

describe('SpeechBubble', () => {
  it('renders the message as text', () => {
    render(<SpeechBubble>Hello there</SpeechBubble>)
    expect(screen.getByText('Hello there')).toBeInTheDocument()
  })

  it('shows the caret by default and hides it on request', () => {
    const { container, rerender } = render(<SpeechBubble>Hi</SpeechBubble>)
    expect(container.querySelector('[data-slot="speech-bubble-cursor"]')).toBeInTheDocument()
    rerender(<SpeechBubble showCursor={false}>Hi</SpeechBubble>)
    expect(container.querySelector('[data-slot="speech-bubble-cursor"]')).toBeNull()
  })

  it('keeps the tail and the caret out of the accessibility tree', () => {
    const { container } = render(<SpeechBubble>Hi</SpeechBubble>)
    expect(container.querySelector('[data-slot="speech-bubble-tail"]')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('[data-slot="speech-bubble-cursor"]')).toHaveAttribute('aria-hidden', 'true')
  })

  it('passes className to the wrapper', () => {
    const { container } = render(<SpeechBubble className="custom">Hi</SpeechBubble>)
    expect(container.querySelector('[data-slot="speech-bubble"]')).toHaveClass('custom')
  })
})
