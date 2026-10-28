import { GlowHoverCards, type GlowHoverCardItem, type GlowHoverCardsProps } from './glow-hover-card'

const features = [
  ['Fast', 'Renders in a single pass.'],
  ['Small', 'No dependencies beyond motion.'],
  ['Themeable', 'Reads your design tokens.'],
  ['Accessible', 'Keyboard and screen reader ready.'],
  ['Typed', 'Every prop has a type.'],
  ['Calm', 'Holds still under reduced motion.'],
]

export const items: GlowHoverCardItem[] = features.map(([title, text]) => ({
  id: title,
  content: (
    <>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </>
  ),
}))

export default function GlowHoverCardDemo() {
  return <GlowHoverCards items={items} className="w-full max-w-3xl" />
}

export function VariantPreview(props: Omit<GlowHoverCardsProps, 'items'>) {
  return <GlowHoverCards items={items} className="w-full max-w-3xl" {...props} />
}
