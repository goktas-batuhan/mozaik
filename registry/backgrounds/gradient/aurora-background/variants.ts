import type { AuroraBackgroundProps } from './aurora-background'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: AuroraBackgroundProps }[] = [
  { name: 'vivid-fast', title: 'Vivid and fast', description: 'A bright aurora sweeping at three times the speed.', props: { intensity: 1, speed: 3, children: 'Northern lights' } },
  { name: 'faint-still', title: 'Faint and still', description: 'A barely-there aurora held perfectly still.', props: { intensity: 0.25, speed: 0, children: 'Quiet sky' } },
]
