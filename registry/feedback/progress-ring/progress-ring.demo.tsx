import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import { ProgressRing } from './progress-ring'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


const STEPS = [18, 46, 73, 100]

export default function ProgressRingDemo() {
  const [step, setStep] = useState(0)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => setStep((s) => (s + 1) % STEPS.length), 2600)
    return () => window.clearInterval(id)
  }, [reduced])

  return (
    <div className="flex items-center gap-12">
      <ProgressRing value={STEPS[step]} size={160} strokeWidth={10} label="Upload progress" />
      <div className="flex flex-col gap-4">
        <ProgressRing value={64} size={64} strokeWidth={5} label="Storage used" />
        <ProgressRing value={100} size={64} strokeWidth={5} label="Setup complete">
          <span aria-hidden className="text-lg text-primary">
            ✓
          </span>
        </ProgressRing>
      </div>
    </div>
  )
}
