import { useRef } from 'react'
import { ScrollImageReveal } from './scroll-image-reveal'

function Artwork({ label }: { label: string }) {
  return (
    <div className="flex size-full items-end bg-linear-to-br from-primary/40 via-muted to-card p-5">
      <span className="rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-foreground">{label}</span>
    </div>
  )
}

export default function ScrollImageRevealDemo() {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div className="w-[min(34rem,90vw)] rounded-2xl border border-border bg-card">
      <div ref={ref} tabIndex={0} aria-label="Scrollable gallery" className="h-[22rem] overflow-y-auto p-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring">
        <p className="mb-6 text-sm leading-6 text-muted-foreground">Scroll to open each frame.</p>
        <ScrollImageReveal container={ref} mask="wipe" className="h-48">
          <Artwork label="Wipe" />
        </ScrollImageReveal>
        <ScrollImageReveal container={ref} mask="curtain" direction="down" className="mt-10 h-48">
          <Artwork label="Curtain" />
        </ScrollImageReveal>
        <ScrollImageReveal container={ref} mask="circle" className="mt-10 mb-24 h-48">
          <Artwork label="Circle" />
        </ScrollImageReveal>
      </div>
    </div>
  )
}
