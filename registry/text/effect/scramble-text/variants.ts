import type { ScrambleTextProps } from './scramble-text'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: ScrambleTextProps }[] = [
  { name: 'hover-decode', title: 'Hover decode', description: 'Scrambles and decodes the text each time you hover it.', props: { text: 'Hover to decode', trigger: 'hover', as: 'h2', className: 'font-mono text-5xl font-semibold tracking-tight' } },
  { name: 'binary', title: 'Binary', description: 'A slow decode through zeros and ones only.', props: { text: 'SIGNAL ACQUIRED', characters: '01', duration: 2.4, as: 'h2', className: 'font-mono text-5xl font-semibold tracking-tight' } },
]
