import { useState } from 'react'
import { BlurScrim } from './blur-scrim'

export default function BlurScrimDemo() {
  const [locked, setLocked] = useState(false)
  return (
    <div className="relative w-[min(92vw,420px)] overflow-hidden rounded-2xl border border-border bg-card p-6 text-card-foreground">
      <div inert={locked} className="flex flex-col gap-3">
        <h3 className="text-lg leading-6 font-semibold">Quarterly report</h3>
        <p className="text-sm leading-5 text-muted-foreground">Revenue grew 18% over the last quarter, led by the new annual plans and a steady drop in churn.</p>
        <div className="flex gap-2">
          <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">+18% revenue</span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">-2.1% churn</span>
        </div>
        <button
          type="button"
          onClick={() => setLocked(true)}
          className="mt-2 w-fit cursor-pointer rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Lock report
        </button>
      </div>
      <BlurScrim active={locked} onDismiss={() => setLocked(false)}>
        <button
          type="button"
          onClick={() => setLocked(false)}
          className="cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-md hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Unlock
        </button>
      </BlurScrim>
    </div>
  )
}
