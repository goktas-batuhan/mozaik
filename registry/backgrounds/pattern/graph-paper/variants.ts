import type { GraphPaperProps } from './graph-paper'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: GraphPaperProps }[] = [
  { name: 'fine-plain', title: 'Fine and plain', description: 'Small squares with no major lines and no fade.', props: { size: 12, majorEvery: 0, fade: 'none', className: 'relative h-64 w-[28rem] max-w-full overflow-hidden rounded-xl border bg-background' } },
  { name: 'blueprint-fade', title: 'Large fading down', description: 'Large squares with a strong line every four cells, fading out towards the bottom.', props: { size: 40, majorEvery: 4, fade: 'vertical', className: 'relative h-64 w-[28rem] max-w-full overflow-hidden rounded-xl border bg-background' } },
]
