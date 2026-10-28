import { ShuffleGrid, type ShuffleGridItem } from './shuffle-grid'

const tones = ['bg-primary/30', 'bg-accent', 'bg-secondary', 'bg-muted', 'bg-primary/15', 'bg-card']

const items: ShuffleGridItem[] = tones.map((tone, i) => ({
  id: `tile-${i + 1}`,
  content: (
    <div className={`flex h-24 items-center justify-center rounded-xl border border-border text-lg font-semibold text-foreground ${tone}`}>{i + 1}</div>
  ),
}))

export default function ShuffleGridDemo() {
  return <ShuffleGrid items={items} className="w-[min(92vw,420px)]" />
}
