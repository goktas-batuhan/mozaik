import { useState } from 'react'
import { StepProgress } from './step-progress'

const STEPS = ['Account', 'Profile', 'Payment', 'Review']

export default function StepProgressDemo() {
  const [current, setCurrent] = useState(2)
  return (
    <div className="flex w-[min(94vw,460px)] flex-col gap-6">
      <StepProgress steps={STEPS} current={current} partial={0.5} label="Checkout progress" />
      <div className="flex gap-2">
        <button type="button" onClick={() => setCurrent((c) => Math.max(0, c - 1))} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-card-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">
          Back
        </button>
        <button type="button" onClick={() => setCurrent((c) => Math.min(STEPS.length, c + 1))} className="rounded-full bg-primary px-4 py-1.5 text-sm text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">
          Next
        </button>
      </div>
    </div>
  )
}
