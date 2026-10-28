import { useState } from 'react'
import { DoubleTapButton, type DoubleTapButtonProps } from './double-tap-button'

export default function DoubleTapButtonDemo() {
  const [deleted, setDeleted] = useState(0)
  return (
    <div className="flex flex-col items-center gap-6">
      <DoubleTapButton onConfirm={() => setDeleted((n) => n + 1)}>Delete project</DoubleTapButton>
      <p className="text-sm text-muted-foreground">
        {deleted === 0 ? 'Press once to arm, again to confirm.' : `Confirmed ${deleted} time${deleted === 1 ? '' : 's'}.`}
      </p>
      <DoubleTapButton disabled>Disabled</DoubleTapButton>
    </div>
  )
}

export function VariantPreview(props: Omit<DoubleTapButtonProps, 'children'>) {
  return <DoubleTapButton {...props}>Delete project</DoubleTapButton>
}
