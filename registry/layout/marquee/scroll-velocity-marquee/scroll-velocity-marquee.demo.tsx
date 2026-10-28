import { useRef } from 'react'
import { ScrollVelocityMarquee } from './scroll-velocity-marquee'

function Line({ children }: { children: string }) {
  return <span className="px-6 text-4xl font-semibold tracking-tight text-foreground">{children}</span>
}

export default function ScrollVelocityMarqueeDemo() {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div className="w-[min(34rem,90vw)] rounded-2xl border border-border bg-card">
      <div ref={ref} tabIndex={0} aria-label="Scrollable page" className="h-[22rem] overflow-y-auto focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring">
        <p className="p-6 text-sm leading-6 text-muted-foreground">Scroll this panel: the lines speed up and flip with your scroll.</p>
        <ScrollVelocityMarquee container={ref} speed={6} className="py-3">
          <Line>Design · Motion · Craft ·</Line>
        </ScrollVelocityMarquee>
        <ScrollVelocityMarquee container={ref} speed={6} direction={-1} className="py-3 text-muted-foreground">
          <Line>Open source · Composable ·</Line>
        </ScrollVelocityMarquee>
        <div className="h-72" />
      </div>
    </div>
  )
}
