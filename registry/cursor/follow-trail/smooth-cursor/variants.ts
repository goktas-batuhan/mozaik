import type { SmoothCursorProps } from './smooth-cursor'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: {
  name: string
  title: string
  description: string
  props: Omit<SmoothCursorProps, 'children' | 'cursor'>
}[] = [
  {
    name: 'floaty',
    title: 'Floaty',
    description: 'A loose spring makes the cursor drift behind the pointer.',
    props: { stiffness: 120, damping: 20 },
  },
  {
    name: 'snappy',
    title: 'Snappy',
    description: 'A stiff, heavily damped spring keeps the cursor almost glued to the pointer.',
    props: { stiffness: 900, damping: 60 },
  },
]
