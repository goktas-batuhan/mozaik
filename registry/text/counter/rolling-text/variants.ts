import type { RollingTextProps } from './rolling-text'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: RollingTextProps }[] = [
  { name: 'on-mount', title: 'On mount', description: 'Rolls the letters once as soon as the text appears.', props: { text: 'Rolling into view', trigger: 'mount', as: 'h2', className: 'text-5xl font-semibold tracking-tight' } },
]
