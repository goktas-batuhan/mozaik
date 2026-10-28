import { useRef } from 'react'
import { type ParallaxLayer, ParallaxLayers } from './parallax-layers'

const layers: ParallaxLayer[] = [
  { id: 'sky', depth: 0.1, content: <div className="absolute -inset-24 bg-linear-to-b from-primary/25 to-background" /> },
  { id: 'far', depth: 0.3, blur: 2, opacity: 0.6, content: <div className="absolute -inset-x-10 bottom-16 h-28 rounded-[50%] bg-muted" /> },
  { id: 'mid', depth: 0.6, content: <div className="absolute -inset-x-10 bottom-4 h-28 rounded-[50%] bg-muted-foreground/30" /> },
  { id: 'near', depth: 1, content: <div className="absolute -inset-x-10 -bottom-12 h-32 rounded-[50%] bg-foreground/80" /> },
]

export default function ParallaxLayersDemo() {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div className="w-[min(34rem,90vw)] rounded-2xl border border-border bg-card">
      <div ref={ref} tabIndex={0} aria-label="Scrollable scene" className="h-[22rem] overflow-y-auto p-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring">
        <p className="mb-6 text-sm leading-6 text-muted-foreground">Scroll: each layer drifts at its own pace.</p>
        <ParallaxLayers container={ref} layers={layers} range={36} className="h-56 rounded-xl border border-border" />
        <div className="h-72" />
      </div>
    </div>
  )
}
