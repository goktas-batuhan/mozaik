import { Bell, Mail } from 'lucide-react'
import { useState } from 'react'
import { CountBadge } from './count-badge'

const button =
  'inline-flex h-8 items-center rounded-md border bg-background px-3 text-xs font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

const avatar = 'flex size-10 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground'

export default function CountBadgeDemo() {
  const [count, setCount] = useState(3)

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center gap-8">
        <CountBadge variant="count" count={count} ping>
          <span className={avatar}>
            <Bell aria-hidden className="size-5" />
          </span>
        </CountBadge>
        <CountBadge variant="count" count={128}>
          <span className={avatar}>
            <Mail aria-hidden className="size-5" />
          </span>
        </CountBadge>
        <CountBadge variant="dot">
          <span className={avatar}>AB</span>
        </CountBadge>
      </div>
      <div className="flex items-center gap-6">
        {(['online', 'away', 'busy', 'offline'] as const).map((status) => (
          <CountBadge key={status} variant="status" status={status}>
            <span className={avatar}>{status[0].toUpperCase()}</span>
          </CountBadge>
        ))}
      </div>
      <div className="flex gap-2">
        <button type="button" className={button} onClick={() => setCount((c) => c + 1)}>
          Add
        </button>
        <button type="button" className={button} onClick={() => setCount((c) => Math.max(0, c - 1))}>
          Remove
        </button>
      </div>
    </div>
  )
}
