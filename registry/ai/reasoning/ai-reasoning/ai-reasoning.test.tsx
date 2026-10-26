import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AIReasoning } from './ai-reasoning'

let reduced = false
vi.mock('motion/react', async (orig) => ({
  ...(await orig<typeof import('motion/react')>()),
  useReducedMotion: () => reduced,
}))

describe('AIReasoning', () => {
  beforeEach(() => {
    reduced = false
    vi.useRealTimers()
  })

  it('opens while streaming and announces Thinking in a live region', () => {
    render(<AIReasoning isStreaming>Step one</AIReasoning>)
    expect(screen.getByRole('button', { name: /Thinking/ })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('Thinking')
    expect(screen.getByText('Step one')).toBeInTheDocument()
  })

  it('reports the duration and keeps a trace that mounted finished open', () => {
    vi.useFakeTimers()
    render(
      <AIReasoning defaultOpen duration={4.2}>
        Done
      </AIReasoning>,
    )
    act(() => void vi.advanceTimersByTime(2000))
    expect(screen.getByRole('status')).toHaveTextContent('Thought for 4.2s')
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('collapses after the stream ends', async () => {
    reduced = true
    const { rerender } = render(<AIReasoning isStreaming>Trace</AIReasoning>)
    rerender(<AIReasoning isStreaming={false}>Trace</AIReasoning>)
    await waitFor(() => expect(screen.queryByText('Trace')).not.toBeInTheDocument(), { timeout: 2000 })
  })

  it('toggles by hand with the keyboard-reachable button', () => {
    reduced = true
    render(<AIReasoning>Hidden at first</AIReasoning>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Hidden at first')).toBeInTheDocument()
  })

  it('drops the shimmer under reduced motion', () => {
    reduced = true
    const { container } = render(<AIReasoning isStreaming>x</AIReasoning>)
    expect(container.querySelector('[style*="ai-reasoning-shimmer"]')).toBeNull()
  })
})
