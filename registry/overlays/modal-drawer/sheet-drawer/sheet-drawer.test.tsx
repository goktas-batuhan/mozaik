import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { SheetDrawer, type SheetDrawerSide } from './sheet-drawer'

function Harness({ side }: { side?: SheetDrawerSide }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <SheetDrawer open={open} onOpenChange={setOpen} side={side} title="Settings" description="Tune it.">
        <input aria-label="Nickname" />
      </SheetDrawer>
    </>
  )
}

describe('SheetDrawer', () => {
  it('renders nothing while closed', () => {
    render(<Harness />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('opens as a labelled modal and focuses inside', () => {
    render(<Harness />)
    fireEvent.click(screen.getByText('Open'))
    const dialog = screen.getByRole('dialog', { name: 'Settings' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
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

  it('closes from the backdrop', async () => {
    render(<Harness />)
    fireEvent.click(screen.getByText('Open'))
    fireEvent.click(document.querySelector('[data-slot="backdrop"]') as Element)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('closes from the close button', async () => {
    render(<Harness />)
    fireEvent.click(screen.getByText('Open'))
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('anchors to the chosen edge', () => {
    render(<Harness side="left" />)
    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByRole('dialog')).toHaveClass('left-0')
  })
})
