import { fireEvent, render, screen } from '@testing-library/react'
import { AIPromptInput } from './ai-prompt-input'

describe('AIPromptInput', () => {
  it('keeps its own text when uncontrolled and clears it on send', () => {
    const onSubmit = vi.fn()
    render(<AIPromptInput onSubmit={onSubmit} />)
    const box = screen.getByRole('textbox', { name: 'Message' })
    fireEvent.change(box, { target: { value: '  hello  ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }))
    expect(onSubmit).toHaveBeenCalledWith('hello')
    expect(box).toHaveValue('')
  })

  it('sends on Enter but not on Shift+Enter', () => {
    const onSubmit = vi.fn()
    render(<AIPromptInput defaultValue="hi" onSubmit={onSubmit} />)
    const box = screen.getByRole('textbox')
    fireEvent.keyDown(box, { key: 'Enter', shiftKey: true })
    expect(onSubmit).not.toHaveBeenCalled()
    fireEvent.keyDown(box, { key: 'Enter' })
    expect(onSubmit).toHaveBeenCalledWith('hi')
  })

  it('follows the value prop and reports changes', () => {
    const onChange = vi.fn()
    const { rerender } = render(<AIPromptInput value="one" onChange={onChange} />)
    const box = screen.getByRole('textbox')
    fireEvent.change(box, { target: { value: 'two' } })
    expect(onChange).toHaveBeenCalledWith('two')
    expect(box).toHaveValue('one')
    rerender(<AIPromptInput value="two" onChange={onChange} />)
    expect(box).toHaveValue('two')
  })

  it('disables send when empty', () => {
    render(<AIPromptInput />)
    expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled()
  })

  it('shows a stop button while loading', () => {
    const onStop = vi.fn()
    render(<AIPromptInput loading onStop={onStop} defaultValue="x" />)
    expect(screen.queryByRole('button', { name: 'Send message' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Stop generating' }))
    expect(onStop).toHaveBeenCalledOnce()
  })
})
