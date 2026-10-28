import { CardFlip, type CardFlipProps } from './card-flip'

const front = (
  <span className="flex h-full flex-col justify-between p-6">
    <span className="text-xs tracking-widest text-muted-foreground uppercase">Mozaik Pass</span>
    <span className="block">
      <span className="block text-2xl font-semibold">Alex Rivera</span>
      <span className="block text-sm text-muted-foreground">Tap to see the details</span>
    </span>
  </span>
)

const back = (
  <span className="flex h-full flex-col justify-between p-6">
    <span className="text-xs tracking-widest uppercase opacity-70">Details</span>
    <span className="block space-y-1 text-sm">
      <span className="block">Member since 2024</span>
      <span className="block">Tier: Collector</span>
      <span className="block">Tap again to flip back</span>
    </span>
  </span>
)

export default function CardFlipDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <CardFlip front={front} back={back} />
      <CardFlip front={front} back={back} axis="x" trigger="hover" className="h-48 w-64" />
    </div>
  )
}

export function VariantPreview(props: Omit<CardFlipProps, 'front' | 'back'>) {
  return <CardFlip front={front} back={back} {...props} />
}
