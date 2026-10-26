import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { ScrambleText } from './scramble-text'

const links = ['Work', 'Writing', 'Contact']

export default function ScrambleTextDemo() {
  const [run, setRun] = useState(0)

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-10 text-center">
      <div key={run} className="flex flex-col items-center gap-4">
        <ScrambleText
          text="// incoming transmission"
          delay={0.1}
          duration={0.8}
          className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground"
        />
        <ScrambleText
          as="h2"
          text="SIGNAL ACQUIRED"
          delay={0.3}
          duration={1.4}
          className="font-mono text-5xl font-semibold tracking-tight sm:text-6xl"
        />
        <ScrambleText
          as="p"
          text="Encrypted end to end. Readable only by you."
          characters="01"
          delay={0.6}
          duration={1.2}
          className="font-mono text-sm text-muted-foreground"
        />
      </div>

      <nav aria-label="Demo links" className="flex flex-wrap justify-center gap-2">
        {links.map((label) => (
          <a
            key={label}
            href="#"
            className="rounded-full border bg-card px-4 py-1.5 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ScrambleText text={label} trigger="hover" duration={0.45} />
          </a>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => setRun((r) => r + 1)}
        className="inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <RotateCcw className="size-3.5" aria-hidden />
        Replay
      </button>
    </div>
  )
}
