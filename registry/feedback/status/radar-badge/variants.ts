import type { RadarBadgeProps } from './radar-badge'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: RadarBadgeProps }[] = [
  { name: 'scanning', title: 'Scanning', description: 'A fast sweep without rings, in the primary color.', props: { status: 'scanning' } },
  { name: 'alert', title: 'Alert', description: 'A red radar with a quick sweep and rings, for when something needs attention.', props: { status: 'alert', label: '3 signals' } },
]
