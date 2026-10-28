import { useState } from 'react'
import { CollabToolbar, type IconKey } from './collab-toolbar'

export default function CollabToolbarDemo() {
  const [last, setLast] = useState<IconKey | null>(null)
  return (
    <div className="flex flex-col items-center gap-4">
      <CollabToolbar
        groups={[['phone', 'desktop', 'chrome'], ['chat', 'inbox', 'layers'], 'avatars', ['menu']]}
        avatars={[{ name: 'Ada Lovelace' }, { name: 'Grace Hopper', color: 'var(--primary)' }, { name: 'Linus Torvalds' }]}
        onIconClick={setLast}
      />
      <p aria-live="polite" className="text-xs text-muted-foreground">
        {last ? `Pressed: ${last}` : 'Press a button.'}
      </p>
    </div>
  )
}
