import type { RingSpinnerProps } from './ring-spinner'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: RingSpinnerProps }[] = [
  { name: 'small', title: 'Small', description: 'A tiny ring with a fine stroke that fits inline next to text.', props: { size: 'sm', label: 'Syncing' } },
  { name: 'large-slow', title: 'Large, slow', description: 'A large thick ring that turns slowly and calmly.', props: { size: 'lg', duration: 1.8, label: 'Loading' } },
]
