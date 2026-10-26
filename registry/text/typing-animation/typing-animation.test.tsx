import { render, screen } from '@testing-library/react'
import { TypingAnimation } from './typing-animation'

describe('TypingAnimation', () => {
  it('exposes the full text to assistive tech from the start', () => {
    render(<TypingAnimation>Hello world</TypingAnimation>)
    expect(screen.getByText('Hello world', { selector: '.sr-only' })).toBeInTheDocument()
  })

  it('lists every word in the label', () => {
    render(<TypingAnimation words={['one', 'two']} />)
    expect(screen.getByText('one, two', { selector: '.sr-only' })).toBeInTheDocument()
  })

  it('shows the finished text with no cursor when disabled', () => {
    const { container } = render(<TypingAnimation disabled>Hello</TypingAnimation>)
    expect(container.querySelector('[aria-hidden]')?.textContent).toBe('Hello')
  })

  it('starts empty with a cursor before typing begins', () => {
    const { container } = render(<TypingAnimation startOnView={false}>Hello</TypingAnimation>)
    expect(container.querySelector('[aria-hidden]')?.textContent).toBe('|')
  })
})
