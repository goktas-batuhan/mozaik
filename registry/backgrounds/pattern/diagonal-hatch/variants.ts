import type { DiagonalHatchProps } from './diagonal-hatch'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: DiagonalHatchProps }[] = [
  { name: 'left-lean', title: 'Left lean', description: 'Tight lines leaning left that run to the edges without fading.', props: { angle: 135, spacing: 6, strength: 18, fade: false, className: 'relative h-64 w-[28rem] max-w-full overflow-hidden rounded-xl border bg-background' } },
  { name: 'wide-bold', title: 'Wide and bold', description: 'Widely spaced, heavy lines.', props: { spacing: 28, strength: 30, className: 'relative h-64 w-[28rem] max-w-full overflow-hidden rounded-xl border bg-background' } },
]
