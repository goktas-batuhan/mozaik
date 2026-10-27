import type { DotGridProps } from './dot-grid'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: DotGridProps }[] = [
  { name: 'dense-flat', title: 'Dense and flat', description: 'Tight, fine dots across the whole box, with no fade, glow or grain.', props: { gap: 12, dotSize: 1.5, fade: false, glow: false, noise: false, className: 'relative h-64 w-[28rem] max-w-full overflow-hidden rounded-xl border', children: 'Dense grid' } },
  { name: 'big-glow', title: 'Big glow', description: 'Large, sparse dots with a wide cursor glow.', props: { gap: 40, dotSize: 4, glowRadius: 260, className: 'relative h-64 w-[28rem] max-w-full overflow-hidden rounded-xl border', children: 'Move over me' } },
]
