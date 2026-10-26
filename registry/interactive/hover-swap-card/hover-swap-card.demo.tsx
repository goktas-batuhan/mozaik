import { HoverSwapCard } from './hover-swap-card'

const Bars = ({ heights, accent }: { heights: number[]; accent?: boolean }) => (
  <div className="flex h-full items-end gap-2 px-6 pb-0">
    {heights.map((h, i) => (
      <div
        key={i}
        style={{ height: `${h}%` }}
        className={`flex-1 rounded-t-md ${accent ? 'bg-linear-to-t from-primary/70 to-primary/20' : 'bg-linear-to-t from-muted-foreground/30 to-muted-foreground/5'}`}
      />
    ))}
  </div>
)

export default function HoverSwapCardDemo() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-5">
      <HoverSwapCard
        badge="Analytics"
        title="Subscriber reports"
        hoverTitle="Subscriber highlights"
        description="Hover to bring the trend into focus."
        media={<Bars heights={[30, 42, 36, 48, 40, 52, 46]} />}
        hoverMedia={<Bars accent heights={[28, 44, 52, 66, 74, 86, 96]} />}
      />
      <HoverSwapCard
        badge="Security"
        title="Quiet by default"
        hoverTitle="Loud when it matters"
        description="Tab to it and the same swap plays."
        media={<Bars heights={[50, 50, 48, 52, 50, 49, 51]} />}
        hoverMedia={<Bars accent heights={[20, 35, 90, 40, 25, 70, 30]} />}
        className="hidden sm:block"
      />
    </div>
  )
}
