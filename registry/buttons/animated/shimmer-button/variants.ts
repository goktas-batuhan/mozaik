import type { ShimmerButtonProps } from './shimmer-button'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: {
  name: string
  title: string
  description: string
  props: Omit<ShimmerButtonProps, 'children'>
}[] = [
  {
    name: 'wide-slow',
    title: 'Wide and slow',
    description: 'A thick band of light that takes eight seconds to circle the button.',
    props: { shimmerSize: 5, duration: 8 },
  },
  {
    name: 'quick-glint',
    title: 'Quick glint',
    description: 'A thin, fast glint that loops every second.',
    props: { shimmerSize: 1, duration: 1 },
  },
]
