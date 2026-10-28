import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { ModalDialog } from './modal-dialog'

function Harness({ role }: { role?: 'dialog' | 'alertdialog' }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <ModalDialog open={open} onOpenChange={setOpen} title="Rename" description="Pick a name." role={role} footer={<button>Save</button>}>
        <input aria-label="Name" />
      </ModalDialog>
    </>
  )
}

describe('ModalDialog', () => {
  it('renders nothing while closed', () => {
    render(<Harness />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('opens as a labelled modal dialog and moves focus inside', () => {
    render(<Harness />)
    fireEvent.click(screen.getByText('Open'))
    const dialog = screen.getByRole('dialog', { name: 'Rename' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleDescription('Pick a name.')
    expect(dialog.contains(document.activeElement)).toBe(true)
  })

  it('closes on Escape and returns focus to the trigger', () => {
    render(<Harness />)
    const trigger = screen.getByText('Open')
    trigger.focus()
    fireEvent.click(trigger)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(document.activeElement).toBe(trigger)
  })

  it('keeps Tab inside the dialog', () => {
    render(<Harness />)
    fireEvent.click(screen.getByText('Open'))
    const close = screen.getByRole('button', { name: 'Close' })
    close.focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Name' }))
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(close)
  })

  it('closes from the backdrop, but an alertdialog ignores it', () => {
    const { unmount } = render(<Harness />)
    fireEvent.click(screen.getByText('Open'))
    fireEvent.click(document.querySelector('[data-slot="backdrop"]') as Element)
    unmount()
    render(<Harness role="alertdialog" />)
    fireEvent.click(screen.getByText('Open'))
    fireEvent.click(document.querySelector('[data-slot="backdrop"]') as Element)
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })
})
