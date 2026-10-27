import type { DynamicIslandProps } from './dynamic-island'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: Omit<DynamicIslandProps, 'children' | 'compact'> }[] = [
  {
    name: 'incoming-call',
    title: 'Incoming call',
    description: 'The island sits open on a caller card with an avatar and a two-line label.',
    props: { view: 'call' },
  },
  {
    name: 'timer',
    title: 'Timer',
    description: 'The island sits open on a large tabular countdown with a caption below.',
    props: { view: 'timer', duration: 0.5 },
  },
]
