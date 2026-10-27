import { Gauge, Layers, ShieldCheck } from 'lucide-react'
import { TiltCard, type TiltCardProps } from './tilt-card'

const cards = [
  { Icon: Layers, title: 'Depth', body: 'The card leans toward the pointer.' },
  {
    Icon: Gauge,
    title: 'Springy',
    body: 'It settles back the moment you leave.',
  },
  {
    Icon: ShieldCheck,
    title: 'Considerate',
    body: 'Flat on touch screens and under reduced motion.',
  },
]

export default function TiltCardDemo() {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Hover a card</p>
        <h2 className="text-3xl font-semibold tracking-tight">Cards with a little weight</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map(({ Icon, title, body }) => (
          <TiltCard key={title} className="border bg-card p-6">
            <Icon className="size-5 text-primary" aria-hidden />
            <h3 className="mt-8 text-sm font-medium text-card-foreground">{title}</h3>
            <p className="mt-1 text-sm leading-snug text-muted-foreground">{body}</p>
          </TiltCard>
        ))}
      </div>
    </div>
  )
}

export function VariantPreview(props: Omit<TiltCardProps, 'children'>) {
  const { Icon, title, body } = cards[0]
  return (
    <TiltCard className="w-72 border bg-card p-6" {...props}>
      <Icon className="size-5 text-primary" aria-hidden />
      <h3 className="mt-8 text-sm font-medium text-card-foreground">{title}</h3>
      <p className="mt-1 text-sm leading-snug text-muted-foreground">{body}</p>
    </TiltCard>
  )
}
