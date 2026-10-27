import type { SplitRevealProps } from './split-reveal'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: SplitRevealProps }[] = [
  { name: 'letters', title: 'Letters', description: 'Reveals the text one letter at a time instead of word by word.', props: { text: 'Every letter lands on its own.', split: 'chars', trigger: 'mount', as: 'h2', className: 'text-5xl font-semibold tracking-tight' } },
  { name: 'sharp-words', title: 'Sharp words', description: 'Words rise out of a mask with no blur at all.', props: { text: 'Clean edges from the very first frame.', blur: 0, trigger: 'mount', as: 'h2', className: 'text-5xl font-semibold tracking-tight' } },
]
