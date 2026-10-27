import type { ProgressRingProps } from './progress-ring'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: ProgressRingProps }[] = [
  { name: 'thin-large', title: 'Thin, large', description: 'A large ring with a hairline stroke and the percentage in the middle.', props: { value: 72, size: 176, strokeWidth: 4, label: 'Upload progress' } },
  { name: 'compact', title: 'Compact', description: 'A small bold ring with no number, for dense layouts.', props: { value: 64, size: 56, strokeWidth: 7, showValue: false, label: 'Storage used' } },
]
