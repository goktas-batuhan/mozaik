import { fireEvent, render, screen } from '@testing-library/react'
import { AIToolCall } from './ai-tool-call'

describe('AIToolCall', () => {
  it('shows the name and the status in words', () => {
    render(<AIToolCall name="search_web" status="running" />)
    expect(screen.getByText('search_web')).toBeInTheDocument()
    expect(screen.getByText('Running')).toHaveClass('sr-only')
  })

  it('stays closed until clicked, then shows arguments and result', async () => {
    render(<AIToolCall name="read_file" status="success" args="a.ts" result="42 lines" />)
    const toggle = screen.getByRole('button')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('42 lines')).toBeNull()
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(await screen.findByText('42 lines')).toBeInTheDocument()
    expect(screen.getByText('a.ts')).toBeInTheDocument()
  })

  it('can start open', () => {
    render(<AIToolCall name="x" args="payload" defaultOpen />)
    expect(screen.getByText('payload')).toBeInTheDocument()
  })

  it('has nothing to open without details', () => {
    render(<AIToolCall name="ping" />)
    const toggle = screen.getByRole('button')
    expect(toggle).toBeDisabled()
    expect(toggle).not.toHaveAttribute('aria-expanded')
  })
})
