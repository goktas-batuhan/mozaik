import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MorphPopover } from './morph-popover'

const openIt = () => fireEvent.click(screen.getByRole('button', { name: 'Feedback' }))

describe('MorphPopover', () => {
  it('starts as a collapsed button', () => {
    render(<MorphPopover />)
    expect(screen.getByRole('button', { name: 'Feedback' })).toHaveAttribute('aria-haspopup', 'dialog')
    expect(screen.queryByRole('textbox')).toBeNull()
  })

  it('opens into a form and focuses the field', () => {
    render(<MorphPopover />)
    openIt()
    expect(screen.getByRole('group', { name: 'Feedback' })).toBeInTheDocument()
    expect(document.activeElement).toBe(screen.getByRole('textbox'))
  })

  it('keeps Send disabled until there is text, then submits it', async () => {
    const onSubmit = vi.fn()
    render(<MorphPopover onSubmit={onSubmit} sentLabel="Sent!" />)
    openIt()
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled()
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '  Love it  ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))
    expect(onSubmit).toHaveBeenCalledWith('Love it')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Sent!' })).toBeInTheDocument())
  })

  it('closes on Escape', async () => {
    render(<MorphPopover />)
    openIt()
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(screen.getByRole('button', { name: 'Feedback' })).toBeInTheDocument())
  })

  it('closes on a click outside', async () => {
    render(<MorphPopover />)
    openIt()
    fireEvent.pointerDown(document.body)
    await waitFor(() => expect(screen.getByRole('button', { name: 'Feedback' })).toBeInTheDocument())
  })
})
