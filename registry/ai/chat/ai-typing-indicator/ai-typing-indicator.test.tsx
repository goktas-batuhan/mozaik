import { MotionConfig } from 'motion/react'
import { render, screen } from '@testing-library/react'
import { AITypingIndicator } from './ai-typing-indicator'

describe('AITypingIndicator', () => {
  it('announces who is typing as a status', () => {
    render(<AITypingIndicator name="Ada" />)
    expect(screen.getByRole('status')).toHaveTextContent('Ada is typing')
  })

  it('defaults to the assistant', () => {
    render(<AITypingIndicator />)
    expect(screen.getByRole('status')).toHaveTextContent('Assistant is typing')
  })

  it('draws the requested number of dots, at least one', () => {
    const { container, rerender } = render(<AITypingIndicator dots={5} />)
    expect(container.querySelectorAll('span[aria-hidden="true"]')).toHaveLength(5)
    rerender(<AITypingIndicator dots={0} />)
    expect(container.querySelectorAll('span[aria-hidden="true"]')).toHaveLength(1)
  })

  it('keeps the dots level under reduced motion', () => {
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <AITypingIndicator />
      </MotionConfig>,
    )
    const dot = container.querySelector('span[aria-hidden="true"]') as HTMLElement
    expect(dot.style.transform === '' || dot.style.transform === 'none').toBe(true)
  })
})
