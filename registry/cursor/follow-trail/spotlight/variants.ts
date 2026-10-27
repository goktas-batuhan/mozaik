import type { SpotlightProps } from './spotlight'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: {
  name: string
  title: string
  description: string
  props: Omit<SpotlightProps, 'children'>
}[] = [
  {
    name: 'wide-glow',
    title: 'Wide glow',
    description: 'A huge, brighter glow that washes across the whole card.',
    props: { size: 800, intensity: 0.3 },
  },
  {
    name: 'tight-beam',
    title: 'Tight beam',
    description: 'A small, bright spot with no border highlight.',
    props: { size: 160, intensity: 0.3, border: false },
  },
]
