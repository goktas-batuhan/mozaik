import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { MorphSurface } from './morph-surface'

describe('MorphSurface', () => {
  it('starts collapsed and opens a focused message field from the trigger', () => {
    const onOpen = vi.fn()
    render(<MorphSurface onOpen={onOpen} />)
    expect(screen.queryByRole('textbox')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Feedback' }))
    const field = screen.getByRole('textbox', { name: 'Feedback' })
    expect(field).toHaveFocus()
    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('closes on Escape, calls onClose and returns focus to the trigger', async () => {
    const onClose = vi.fn()
    render(<MorphSurface onClose={onClose} />)
    const trigger = screen.getByRole('button', { name: 'Feedback' })
    fireEvent.click(trigger)
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(trigger).toHaveFocus()
    await waitFor(() => expect(screen.queryByRole('textbox')).toBeNull())
  })

  it('submits the message as form data, then closes and reports success', async () => {
    const onSubmit = vi.fn()
    const onSuccess = vi.fn()
    render(<MorphSurface onSubmit={onSubmit} onSuccess={onSuccess} />)
    fireEvent.click(screen.getByRole('button', { name: 'Feedback' }))
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Love it' } })
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))
    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1))
    expect((onSubmit.mock.calls[0][0] as FormData).get('message')).toBe('Love it')
    await waitFor(() => expect(screen.queryByRole('textbox')).toBeNull())
  })

  it('stays open when onSubmit rejects', async () => {
    const onSuccess = vi.fn()
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    render(<MorphSurface onSubmit={() => Promise.reject(new Error('nope'))} onSuccess={onSuccess} />)
    fireEvent.click(screen.getByRole('button', { name: 'Feedback' }))
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'x' } })
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))
    await waitFor(() => expect(error).toHaveBeenCalled())
    expect(onSuccess).not.toHaveBeenCalled()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    error.mockRestore()
  })

  it('closes when a press starts and ends outside', async () => {
    render(<MorphSurface />)
    fireEvent.click(screen.getByRole('button', { name: 'Feedback' }))
    fireEvent.pointerDown(document.body)
    fireEvent.click(document.body)
    await waitFor(() => expect(screen.queryByRole('textbox')).toBeNull())
  })

  it('can be controlled from outside', () => {
    function Controlled() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <p data-testid="state">{String(open)}</p>
          <MorphSurface isOpen={open} onOpenChange={setOpen} />
        </>
      )
    }
    render(<Controlled />)
    fireEvent.click(screen.getByRole('button', { name: 'Feedback' }))
    expect(screen.getByTestId('state')).toHaveTextContent('true')
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
})
