import type { MorphingTextProps } from './morphing-text'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: MorphingTextProps }[] = [
  { name: 'slow-morph', title: 'Slow morph', description: 'Long, gentle morphs that linger between words.', props: { words: ['Calm', 'Clear', 'Crafted'], interval: 2.5, duration: 1.8, className: 'text-6xl font-bold tracking-tight sm:text-8xl' } },
]
