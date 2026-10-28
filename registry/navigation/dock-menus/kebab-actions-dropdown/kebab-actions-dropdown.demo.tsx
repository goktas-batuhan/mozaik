import { useState } from 'react'
import { KebabActionsDropdown } from './kebab-actions-dropdown'

export default function KebabActionsDropdownDemo() {
  const [last, setLast] = useState<string | null>(null)
  return (
    <div className="flex min-h-64 flex-col items-center gap-4">
      <KebabActionsDropdown onItemClick={(item) => setLast(item.label ?? item.id)} />
      <p aria-live="polite" className="text-xs text-muted-foreground">
        {last ? `Picked: ${last}` : 'Open the menu and pick an action.'}
      </p>
    </div>
  )
}
