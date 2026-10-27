import type { CoolModeProps } from './cool-mode'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: {
  name: string
  title: string
  description: string
  props: Omit<CoolModeProps, 'children'>
}[] = [
  {
    name: 'confetti',
    title: 'Confetti',
    description: 'A big burst of party-popper emoji flies out on each press.',
    props: { particle: '🎉', size: 24, count: 90, speed: 1.5 },
  },
  {
    name: 'gentle',
    title: 'Gentle',
    description: 'Only a few small circles drift out slowly.',
    props: { size: 8, count: 12, speed: 0.5 },
  },
]
