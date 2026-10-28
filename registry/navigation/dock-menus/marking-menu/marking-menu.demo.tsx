import { useState } from 'react'
import { MarkingMenu } from './marking-menu'

export default function MarkingMenuDemo() {
  const [last, setLast] = useState<string | null>(null)
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <MarkingMenu onSelect={(item) => setLast(item.label)} />
      <p aria-live="polite" className="text-center text-xs text-muted-foreground">
        {last ? `Went to ${last}` : 'Hold, flick or right-click the surface.'}
      </p>
    </div>
  )
}
