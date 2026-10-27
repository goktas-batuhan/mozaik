import type { BlurFadeProps } from './blur-fade'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: BlurFadeProps }[] = [
  { name: 'slide-in', title: 'Slide in', description: 'Slides in from the left over a long distance while it fades.', props: { children: 'Sliding in from the side', direction: 'left', offset: 48, duration: 0.8, className: 'text-4xl font-semibold tracking-tight' } },
  { name: 'heavy-blur', title: 'Heavy blur', description: 'Resolves from a very strong blur with no movement.', props: { children: 'Out of focus, then sharp', blur: 28, offset: 0, duration: 1.4, className: 'text-4xl font-semibold tracking-tight' } },
]
