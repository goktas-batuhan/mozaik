import type { WordRotateProps } from './word-rotate'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: WordRotateProps }[] = [
  { name: 'rapid', title: 'Rapid', description: 'Swaps words every second with a snappy transition.', props: { words: ['fast', 'bold', 'quick', 'sharp', 'live'], interval: 1, duration: 0.2, as: 'h2', className: 'text-5xl font-semibold tracking-tight text-primary' } },
]
