import { useRef } from 'react'
import { ScrollProgress } from './scroll-progress'

const paragraphs = [
  'Scroll this panel. The bar at the top fills as you move through the text, and empties when you scroll back.',
  'It follows a scroll container you hand it, or the whole page when you hand it nothing. Pass a className to move it to the bottom or to make it thicker.',
  'The bar is purely visual. Screen readers already know where you are on the page, so it is hidden from them.',
  'A spring smooths short jumps. Turn it off with smooth={false} if you want the bar to track the scroll position exactly.',
  'Keep the content going so there is something to scroll through. Nothing here matters beyond the length.',
  'Almost there. A little more text, then the bar closes up on the right edge.',
  'And that is the end of the panel.',
]

export default function ScrollProgressDemo() {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div className="relative h-[22rem] w-[min(34rem,90vw)] overflow-hidden rounded-2xl border border-border bg-card">
      <div className="absolute inset-x-0 top-0 z-10 h-1 bg-muted" />
      <ScrollProgress container={ref} className="absolute z-20 h-1" />
      <div ref={ref} tabIndex={0} aria-label="Scrollable article" className="h-full overflow-y-auto p-8 pt-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring">
        <h3 className="text-2xl font-semibold tracking-tight text-card-foreground">Reading progress</h3>
        {paragraphs.map((p) => (
          <p key={p} className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {p}
          </p>
        ))}
        {paragraphs.map((p) => (
          <p key={`b-${p}`} className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {p}
          </p>
        ))}
      </div>
    </div>
  )
}
