import type { WaveTextProps } from './wave-text'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: WaveTextProps }[] = [
  { name: 'big-wave', title: 'Big wave', description: 'Tall, quick swells that travel across each letter.', props: { text: 'Make some waves', amplitude: 18, duration: 1.1, stagger: 0.1, as: 'h2', className: 'text-6xl font-semibold tracking-tight' } },
]
