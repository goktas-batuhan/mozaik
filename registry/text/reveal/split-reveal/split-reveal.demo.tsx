import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { SplitReveal } from './split-reveal'

export default function SplitRevealDemo() {
  const [run, setRun] = useState(0)

  return (
    <div className="flex w-full max-w-3xl flex-col items-start gap-8">
      <div key={run} className="flex flex-col gap-5">
        <SplitReveal
          text="CHAPTER 01 / MOTION"
          split="chars"
          trigger="mount"
          duration={0.6}
          className="font-mono text-xs tracking-[0.3em] text-primary"
        />
        <SplitReveal
          as="h2"
          text="Interfaces that feel considered, down to the very last frame."
          trigger="mount"
          delay={0.15}
          className="text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl"
        />
        <SplitReveal
          text="Every word rises out of its own mask and sharpens as it lands. Split by words for headlines, by letters for labels."
          trigger="mount"
          delay={0.6}
          stagger={0.02}
          blur={4}
          className="max-w-xl text-base leading-relaxed text-muted-foreground"
        />
      </div>

      <button
        type="button"
        onClick={() => setRun((r) => r + 1)}
        className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <RotateCcw className="size-3.5" aria-hidden />
        Replay
      </button>
    </div>
  )
}
