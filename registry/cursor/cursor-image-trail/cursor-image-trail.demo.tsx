import { Compass, Mountain, Snowflake, Sunrise, Waves } from 'lucide-react'
import { CursorImageTrail } from './cursor-image-trail'

const tones = [
  'from-primary/50 via-primary/15 to-muted',
  'from-muted-foreground/35 via-muted to-card',
  'from-primary/30 via-muted to-secondary',
  'from-foreground/20 via-muted to-card',
  'from-primary/40 via-secondary to-muted',
]
const icons = [Mountain, Snowflake, Sunrise, Waves, Compass]

const items = icons.map((Icon, i) => (
  <div key={i} className={`grid size-full place-items-center border border-border bg-linear-to-br ${tones[i]}`}>
    <Icon className="size-8 text-foreground/50" aria-hidden />
  </div>
))

export default function CursorImageTrailDemo() {
  return (
    <CursorImageTrail
      items={items}
      className="grid h-[380px] w-[760px] max-w-full place-items-center rounded-2xl border bg-card"
    >
      <div className="space-y-3 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Move across the panel</p>
        <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Leave a trail</h2>
      </div>
    </CursorImageTrail>
  )
}
