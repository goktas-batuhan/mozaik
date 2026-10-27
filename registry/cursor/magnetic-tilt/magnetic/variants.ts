import type { MagneticProps } from './magnetic'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: {
  name: string
  title: string
  description: string
  props: Omit<MagneticProps, 'children'>
}[] = [
  {
    name: 'strong-pull',
    title: 'Strong pull',
    description: 'The element is drawn most of the way to the pointer from far away.',
    props: { strength: 0.8, radius: 160 },
  },
]
