import { fireEvent, render, screen } from '@testing-library/react'
import { AIMessage } from './ai-message'

describe('AIMessage', () => {
  it('marks who wrote it and shows the timestamp', () => {
    const { container } = render(<AIMessage from="user" timestamp="09:41">Hello</AIMessage>)
    expect(container.querySelector('[data-slot="ai-message"]')).toHaveAttribute('data-from', 'user')
    expect(screen.getByText('09:41')).toBeInTheDocument()
  })

  it('copies the text and confirms it', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    render(<AIMessage copyText="the answer">Hi</AIMessage>)
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }))
    expect(writeText).toHaveBeenCalledWith('the answer')
    expect(await screen.findByRole('button', { name: 'Copied' })).toBeInTheDocument()
  })

  it('offers feedback on assistant messages only', () => {
    const onVote = vi.fn()
    const { rerender } = render(<AIMessage onVote={onVote}>Hi</AIMessage>)
    fireEvent.click(screen.getByRole('button', { name: 'Good response' }))
    expect(onVote).toHaveBeenCalledWith('up')
    expect(screen.getByRole('button', { name: 'Good response' })).toHaveAttribute('aria-pressed', 'true')
    rerender(<AIMessage from="user" onVote={onVote}>Hi</AIMessage>)
    expect(screen.queryByRole('button', { name: 'Good response' })).toBeNull()
  })

  it('calls onRetry and renders no buttons by default', () => {
    const onRetry = vi.fn()
    const { rerender } = render(<AIMessage>Hi</AIMessage>)
    expect(screen.queryAllByRole('button')).toHaveLength(0)
    rerender(<AIMessage onRetry={onRetry}>Hi</AIMessage>)
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
