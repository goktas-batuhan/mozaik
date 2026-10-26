import type { ThinkingLoaderProps } from './thinking-loader'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: ThinkingLoaderProps }[] = [
  { name: 'dots', title: 'Dots', description: 'Three dots that brighten in turn.', props: { variant: 'dots', label: 'Thinking' } },
  { name: 'bar', title: 'Bar', description: 'A short bar that slides across a track.', props: { variant: 'bar', label: 'Searching the web' } },
  { name: 'grid', title: 'Grid', description: 'A three-by-three grid that pulses cell by cell.', props: { variant: 'grid', label: 'Reading 12 files' } },
]
