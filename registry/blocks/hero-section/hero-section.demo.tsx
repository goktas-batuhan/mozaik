import { ArrowRight } from 'lucide-react'
import { HeroSection } from './hero-section'

// Mosaic tiles for the mock window: opacity steps of the primary token.
const tiles = [
  'bg-primary', 'bg-primary/40', 'bg-muted', 'bg-primary/15', 'bg-primary/70', 'bg-muted', 'bg-primary/25', 'bg-primary/55',
  'bg-muted', 'bg-primary/80', 'bg-primary/20', 'bg-primary/45', 'bg-muted', 'bg-primary/30', 'bg-primary', 'bg-primary/10',
  'bg-primary/50', 'bg-muted', 'bg-primary/65', 'bg-primary/15', 'bg-primary/35', 'bg-primary/90', 'bg-muted', 'bg-primary/40',
]

function ProductWindow() {
  return (
    <div aria-hidden className="relative">
      <div className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-primary/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-foreground/5">
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="ml-3 h-2 w-28 rounded-full bg-muted" />
        </div>
        <div className="grid grid-cols-[5.5rem_1fr] gap-4 p-4">
          <div className="space-y-2.5 pt-1">
            <span className="block h-2 w-14 rounded-full bg-foreground/70" />
            <span className="block h-2 w-16 rounded-full bg-muted" />
            <span className="block h-2 w-12 rounded-full bg-muted" />
            <span className="block h-2 w-[3.75rem] rounded-full bg-primary/60" />
            <span className="block h-2 w-10 rounded-full bg-muted" />
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-8 gap-1.5">
              {tiles.map((c, i) => (
                <span key={i} className={`aspect-square rounded-[4px] ${c}`} />
              ))}
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 font-mono text-[11px] text-muted-foreground">
              <span>
                <span className="text-primary">$</span> npm install motion
              </span>
              <span className="hidden text-foreground/60 @sm:inline">done</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HeroSectionDemo() {
  return (
    <div className="w-full max-w-5xl">
      <HeroSection
        align="left"
        eyebrow="New · v1.0 is live"
        title={
          <>
            Components that <span className="text-primary">fit together</span>
          </>
        }
        description="Mozaik is a growing set of React components in one design language. Add them with one command and own every line."
        primaryAction={{
          label: (
            <>
              Get started <ArrowRight className="size-4" aria-hidden />
            </>
          ),
          href: '#',
        }}
        secondaryAction={{ label: 'Browse components', href: '#' }}
        media={<ProductWindow />}
      />
    </div>
  )
}
