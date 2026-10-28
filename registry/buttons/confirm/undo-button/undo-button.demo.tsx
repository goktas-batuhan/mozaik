import { useState } from 'react'
import { UndoButton, type UndoButtonProps } from './undo-button'

export default function UndoButtonDemo() {
  const [log, setLog] = useState('Nothing archived yet.')
  return (
    <div className="flex flex-col items-center gap-6">
      <UndoButton
        duration={5000}
        resetAfter={null}
        onAction={() => setLog('Archived. Undo is open for 5 seconds.')}
        onCommit={() => setLog('Committed: the archive is final.')}
        onUndo={() => setLog('Undone. Nothing was archived.')}
      />
      <p className="text-sm text-muted-foreground">{log}</p>
    </div>
  )
}

export function VariantPreview(props: UndoButtonProps) {
  return <UndoButton {...props} />
}
