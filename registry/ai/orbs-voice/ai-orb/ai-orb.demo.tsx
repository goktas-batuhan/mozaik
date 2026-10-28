import { useState } from 'react'
import { AIOrb, type AIOrbState } from './ai-orb'

const STATES: AIOrbState[] = ['idle', 'listening', 'thinking', 'speaking']

export default function AIOrbDemo() {
  const [state, setState] = useState<AIOrbState>('listening')

  return (
    <div className="flex w-[min(92vw,360px)] flex-col items-center gap-6 py-4">
      <AIOrb state={state} size={112} />
      <div role="group" aria-label="Orb state" className="flex flex-wrap justify-center gap-2">
        {STATES.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={state === s}
            onClick={() => setState(s)}
            className="h-8 cursor-pointer rounded-full border border-border bg-background px-3 text-sm text-foreground capitalize focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-pressed:bg-primary aria-pressed:text-primary-foreground"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
