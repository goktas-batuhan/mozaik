import type { AnimatedListProps } from './animated-list'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: Omit<AnimatedListProps, 'children'> }[] = [
  {
    name: 'rapid',
    title: 'Rapid feed',
    description: 'Items arrive about three times faster and the feed keeps looping.',
    props: { interval: 0.4, loop: true },
  },
  {
    name: 'play-once',
    title: 'Play once',
    description: 'Items arrive after a short delay and the list stops on the last one instead of looping.',
    props: { interval: 1.1, delay: 0.8, loop: false },
  },
]
