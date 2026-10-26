import { RotateCcw, TriangleAlert } from 'lucide-react'
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import { TxSteps, type TxStep } from './tx-steps'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


const BASE = [
  { label: 'Approve', description: 'Allow the router to spend USDC' },
  { label: 'Sign', description: 'Confirm the swap in your wallet' },
  { label: 'Broadcast', description: 'Sent to the network' },
  { label: 'Confirmed', description: 'Included in block 21,408,117' },
]

const toSteps = (active: number, failed: boolean): TxStep[] =>
  BASE.map((s, i) => ({
    ...s,
    status: i < active ? 'done' : i === active ? (failed ? 'error' : 'active') : 'pending',
    ...(failed && i === active ? { description: 'Rejected in wallet. Try again.' } : {}),
  }))

export default function TxStepsDemo() {
  const reduced = usePrefersReducedMotion()
  // Under reduced motion the demo holds on the second step and waits for clicks.
  const [active, setActive] = useState(1)
  const [failed, setFailed] = useState(false)
  const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>('horizontal')

  useEffect(() => {
    if (reduced || failed) return
    const id = setTimeout(() => setActive((a) => (a >= BASE.length ? 0 : a + 1)), active >= BASE.length ? 2600 : 1700)
    return () => clearTimeout(id)
  }, [active, failed, reduced])

  const steps = toSteps(active, failed)
  const finished = active >= BASE.length

  const button =
    'inline-flex h-8 items-center gap-1.5 rounded-md border bg-background px-3 text-xs font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'

  return (
    <div className="w-[min(92vw,680px)] rounded-2xl border bg-card p-6 text-card-foreground shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Swap 1,250 USDC → 0.36 ETH</p>
          <p className="text-xs text-muted-foreground">
            {failed ? 'Transaction failed' : finished ? 'Swap complete' : `Step ${active + 1} of ${BASE.length}`}
          </p>
        </div>
        <div role="radiogroup" aria-label="Layout" className="inline-flex rounded-md border bg-muted p-0.5 text-xs">
          {(['horizontal', 'vertical'] as const).map((o) => (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={orientation === o}
              onClick={() => setOrientation(o)}
              className="rounded px-2.5 py-1 font-medium capitalize text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-checked:bg-background aria-checked:text-foreground aria-checked:shadow-sm"
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      <TxSteps steps={steps} orientation={orientation} className={orientation === 'vertical' ? 'mx-auto max-w-sm' : undefined} />

      <div className="mt-6 flex flex-wrap gap-2 border-t pt-4">
        <button type="button" className={button} disabled={failed || finished} onClick={() => setActive((a) => a + 1)}>
          Next step
        </button>
        <button type="button" className={button} disabled={failed || finished} onClick={() => setFailed(true)}>
          <TriangleAlert aria-hidden className="size-3.5" />
          Fail current
        </button>
        <button
          type="button"
          className={button}
          onClick={() => {
            setFailed(false)
            setActive(0)
          }}
        >
          <RotateCcw aria-hidden className="size-3.5" />
          Restart
        </button>
      </div>
    </div>
  )
}
