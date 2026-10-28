import { useState } from 'react'
import { ModalDialog } from './modal-dialog'

const button = 'cursor-pointer rounded-full px-5 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

export default function ModalDialogDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`${button} bg-primary text-primary-foreground hover:bg-primary/90`}>
        Delete project
      </button>
      <ModalDialog
        open={open}
        onOpenChange={setOpen}
        role="alertdialog"
        size="sm"
        title="Delete this project?"
        description="This removes the project and its 14 files for everyone. It cannot be undone."
        footer={
          <>
            <button type="button" data-autofocus onClick={() => setOpen(false)} className={`${button} border border-border text-foreground hover:bg-muted`}>
              Cancel
            </button>
            <button type="button" onClick={() => setOpen(false)} className={`${button} bg-destructive text-white hover:bg-destructive/90`}>
              Delete
            </button>
          </>
        }
      />
    </>
  )
}
