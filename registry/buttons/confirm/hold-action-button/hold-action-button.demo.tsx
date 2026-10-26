import { useState } from 'react'
import { HoldActionButton } from './hold-action-button'

export default function HoldActionButtonDemo() {
  const [count, setCount] = useState(0)
  return (
    <div className="flex flex-col items-center gap-6">
      <HoldActionButton duration={1.4} holdingLabel="Keep holding..." completeLabel="Deleted" onComplete={() => setCount((n) => n + 1)}>
        Hold to delete
      </HoldActionButton>
      <p className="text-sm text-muted-foreground">
        {count === 0 ? 'Press and hold, or hold Space / Enter.' : `Confirmed ${count} time${count === 1 ? '' : 's'}.`}
      </p>
      <div className="flex items-center gap-4">
        <HoldActionButton duration={0.8} className="h-12 min-w-40 rounded-full">
          Quick hold
        </HoldActionButton>
        <HoldActionButton disabled className="h-12 min-w-40 rounded-full">
          Disabled
        </HoldActionButton>
      </div>
    </div>
  )
}
