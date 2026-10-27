import type { TiltCardProps } from './tilt-card'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: {
  name: string
  title: string
  description: string
  props: Omit<TiltCardProps, 'children'>
}[] = [
  {
    name: 'steep',
    title: 'Steep',
    description: 'The card leans up to 28 degrees toward the pointer.',
    props: { max: 28 },
  },
  {
    name: 'no-glare',
    title: 'No glare',
    description: 'The card tilts without the highlight following the pointer.',
    props: { glare: false },
  },
]
