import { useRef } from 'react'
import { ScrollRevealParagraph } from './scroll-reveal-paragraph'

const text =
  'Every word starts faint and lights up as it travels into the reading zone. Scroll this panel slowly and the sentence fills in, one word at a time, then fades back if you scroll up again.'

export default function ScrollRevealParagraphDemo() {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div className="w-[min(34rem,90vw)] rounded-2xl border border-border bg-card">
      <div ref={ref} tabIndex={0} aria-label="Scrollable story" className="h-[22rem] overflow-y-auto p-8 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring">
        <p className="h-40 text-sm leading-6 text-muted-foreground">Scroll down to read.</p>
        <ScrollRevealParagraph container={ref} text={text} className="text-xl leading-8" />
        <div className="h-96" />
      </div>
    </div>
  )
}
