import { useRef } from 'react'
import { SvgDrawOnScroll } from './svg-draw-on-scroll'

const paths = ['M10 80 C 30 10, 50 10, 50 50', 'M50 50 C 50 90, 70 90, 90 20', 'M20 90 L 80 90']

export default function SvgDrawOnScrollDemo() {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div className="w-[min(34rem,90vw)] rounded-2xl border border-border bg-card">
      <div ref={ref} tabIndex={0} aria-label="Scrollable page" className="h-[22rem] overflow-y-auto p-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring">
        <p className="mb-6 text-sm leading-6 text-muted-foreground">Scroll: the line draws itself.</p>
        <SvgDrawOnScroll container={ref} paths={paths} className="mx-auto h-56 w-56" />
        <div className="h-72" />
      </div>
    </div>
  )
}
