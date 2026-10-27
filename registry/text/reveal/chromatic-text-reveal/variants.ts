import type { ChromaticTextRevealProps } from './chromatic-text-reveal'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: ChromaticTextRevealProps }[] = [
  { name: 'play-once', title: 'Play once', description: 'Paints each word in a single time and stops on the last one.', props: { prefix: 'Design that feels', words: ['effortless', 'considered', 'alive'], loop: false, duration: 1.4, className: 'text-5xl font-semibold tracking-tight' } },
]
