import { render, screen } from '@testing-library/react'
import { AIOrb } from './ai-orb'

describe('AIOrb', () => {
  it('says the state as a status', () => {
    const { rerender } = render(<AIOrb />)
    expect(screen.getByRole('status')).toHaveTextContent('Assistant is idle')
    rerender(<AIOrb state="thinking" />)
    expect(screen.getByRole('status')).toHaveTextContent('Assistant is thinking')
  })

  it('exposes the state as a data attribute', () => {
    render(<AIOrb state="speaking" />)
    expect(screen.getByRole('status')).toHaveAttribute('data-state', 'speaking')
  })

  it('is as big as asked', () => {
    render(<AIOrb size={140} />)
    expect(screen.getByRole('status')).toHaveStyle({ width: '140px', height: '140px' })
  })

  it('hides its decoration from screen readers', () => {
    const { container } = render(<AIOrb state="listening" />)
    const visible = container.querySelectorAll('[data-slot="ai-orb"] > span:not(.sr-only)')
    expect(visible.length).toBeGreaterThan(0)
    visible.forEach((el) => expect(el).toHaveAttribute('aria-hidden', 'true'))
  })
})
