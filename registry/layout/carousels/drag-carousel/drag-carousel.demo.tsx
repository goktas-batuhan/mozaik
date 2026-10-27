import { DragCarousel, type DragCarouselProps } from './drag-carousel'

const slides = [
  ['01', 'Foundations', 'from-primary/40 to-muted'],
  ['02', 'Surfaces', 'from-muted-foreground/30 to-card'],
  ['03', 'Motion', 'from-primary/25 to-secondary'],
  ['04', 'Layouts', 'from-foreground/15 to-muted'],
  ['05', 'Forms', 'from-primary/35 to-card'],
  ['06', 'Feedback', 'from-muted-foreground/25 to-secondary'],
]

export default function DragCarouselDemo() {
  return (
    <div className="w-[760px] max-w-full">
      <DragCarousel label="Component categories" slideWidth="15rem">
        {slides.map(([n, title, tone]) => (
          <div key={n} className={`flex h-64 flex-col justify-between rounded-xl border border-border bg-linear-to-br p-5 ${tone}`}>
            <span className="font-mono text-xs text-muted-foreground">{n}</span>
            <span className="text-2xl font-semibold tracking-tight text-foreground">{title}</span>
          </div>
        ))}
      </DragCarousel>
      <p className="mt-2 text-sm text-muted-foreground">Drag, use the buttons, or focus and press the arrow keys.</p>
    </div>
  )
}

export function VariantPreview(props: Omit<DragCarouselProps, 'children'>) {
  return (
    <div className="w-[760px] max-w-full">
      <DragCarousel label="Component categories" {...props}>
        {slides.map(([n, title, tone]) => (
          <div key={n} className={`flex h-64 flex-col justify-between rounded-xl border border-border bg-linear-to-br p-5 ${tone}`}>
            <span className="font-mono text-xs text-muted-foreground">{n}</span>
            <span className="text-2xl font-semibold tracking-tight text-foreground">{title}</span>
          </div>
        ))}
      </DragCarousel>
    </div>
  )
}
