import { LightboxGrid, type LightboxItem } from './lightbox-grid'

const tones = ['from-primary/40', 'from-accent', 'from-secondary', 'from-muted', 'from-primary/20', 'from-card']
const names = ['Harbor', 'Canyon', 'Meadow', 'Glacier', 'Lagoon', 'Summit']

const items: LightboxItem[] = names.map((name, i) => ({
  id: name.toLowerCase(),
  label: name,
  thumb: (
    <div className={`flex size-full items-end bg-linear-to-br ${tones[i]} to-card p-2`}>
      <span className="text-xs font-medium text-foreground">{name}</span>
    </div>
  ),
  content: (
    <div className={`flex size-full items-end bg-linear-to-br ${tones[i]} to-card p-6`}>
      <span className="text-2xl font-semibold text-foreground">{name}</span>
    </div>
  ),
}))

export default function LightboxGridDemo() {
  return <LightboxGrid items={items} className="w-[min(92vw,420px)]" />
}
